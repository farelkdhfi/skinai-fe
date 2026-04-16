import { createContext, useContext, useState, useCallback } from 'react';
import { analyzeAPI, historyAPI } from '../services/api';
import { createClient } from "@supabase/supabase-js";

const AnalysisContext = createContext(null);

export function AnalysisProvider({ children }) {
    const [results, setResults] = useState(null);
    const [patches, setPatches] = useState({});
    const [recommendations, setRecommendations] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState(null);

    const analyze = useCallback(async (images, fullImage = null, bboxes = null) => {
        setIsAnalyzing(true);
        setError(null);

        setPatches(fullImage ? { ...images, full_image: fullImage } : images);

        try {

            const payload = {
                images: images,
                full_face_image: fullImage,
                bounding_boxes: bboxes && Object.keys(bboxes).length > 0 ? bboxes : null
            };

            const response = await analyzeAPI.analyze(payload);
            setResults(response.data);

            // Get recommendations
            if (response.data.final_result?.class) {
                try {
                    const recResponse = await analyzeAPI.recommend(response.data.final_result.class);

                    setRecommendations(recResponse.data);
                } catch {
                    console.warn('Failed to get recommendations');
                }
            }

            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Analysis failed';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setIsAnalyzing(false);
        }
    }, []);

    const uploadImageToSupabase = async (base64String, userId, token) => {
        if (!base64String) return null;
        try {
            const supabase = createClient(
                import.meta.env.VITE_SUPABASE_URL,
                import.meta.env.VITE_SUPABASE_ANON_KEY,
                {
                    global: {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                }
            );

            const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            let blob;
            let contentType = 'image/jpeg';
            let ext = 'jpg';

            if (matches) {
                contentType = matches[1];
                ext = contentType.split('/')[1];
                const byteString = atob(matches[2]);
                const byteArray = new Uint8Array(byteString.length);
                for (let i = 0; i < byteString.length; i++) {
                    byteArray[i] = byteString.charCodeAt(i);
                }
                blob = new Blob([byteArray], { type: contentType });
            } else {
                const byteString = atob(base64String);
                const byteArray = new Uint8Array(byteString.length);
                for (let i = 0; i < byteString.length; i++) {
                    byteArray[i] = byteString.charCodeAt(i);
                }
                blob = new Blob([byteArray], { type: contentType });
            }

            const filename = `${crypto.randomUUID()}.${ext}`;
            const filePath = `${userId}/${filename}`;

            const { error } = await supabase.storage
                .from('analysis-images')
                .upload(filePath, blob, { contentType, upsert: false });

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('analysis-images')
                .getPublicUrl(filePath);

            return publicUrl;
        } catch (err) {
            console.error('Upload gagal:', err);
            return null;
        }
    };

    const saveToHistory = useCallback(async (userId, token) => {
        if (!results) return;

        // Upload semua gambar dulu dari browser langsung ke Supabase
        const mainImageUrl = await uploadImageToSupabase(
            patches['full_image'] || patches['camera_capture'] || null,
            userId,
            token
        );
        const heatmapUrl = await uploadImageToSupabase(
            results.cfcm_image || null,
            userId,
            token
        );

        const patchesWithUrls = await Promise.all(
            (results.predictions || []).map(async (p) => {
                const patchUrl = await uploadImageToSupabase(patches[p.region] || null, userId, token);
                const heatmapPatchUrl = await uploadImageToSupabase(results.gradcam_heatmaps?.[p.region] || null, userId, token);
                return {
                    region: p.region,
                    predicted_class: p.predicted_class,
                    confidence: p.confidence,
                    image_url: patchUrl,
                    heatmap_image_url: heatmapPatchUrl
                };
            })
        );

        const analysisData = {
            skin_condition: results.final_result?.class,
            confidence_score: results.final_result?.confidence,
            patches_analyzed: results.predictions?.length,
            voting_method: results.final_result?.voting_method,
            patches: patchesWithUrls,
            image_url: mainImageUrl,
            heatmap_image_url: heatmapUrl,
            recommended_ingredients: recommendations?.ingredients || recommendations || []
        };

        try {
            await historyAPI.save(analysisData);
            return true;
        } catch {
            return false;
        }
    }, [results, patches, recommendations]);

    const reset = useCallback(() => {
        setResults(null);
        setPatches({});
        setRecommendations(null);
        setError(null);
    }, []);

    const value = {
        results,
        patches,
        recommendations,
        isAnalyzing,
        error,
        analyze,
        saveToHistory,
        reset,
    };

    return (
        <AnalysisContext.Provider value={value}>
            {children}
        </AnalysisContext.Provider>
    );
}

export function useAnalysis() {
    const context = useContext(AnalysisContext);
    if (!context) {
        throw new Error('useAnalysis must be used within AnalysisProvider');
    }
    return context;
}
