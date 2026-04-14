/**
 * Analysis Context
 * Global state for current analysis
 */

import { createContext, useContext, useState, useCallback } from 'react';
import { analyzeAPI, historyAPI } from '../services/api';

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

        // Store images in state, including full_image if provided (for history saving)
        // usage in ResultsPage relies on keys matching results.predictions, so extras here are safe
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

    const saveToHistory = useCallback(async () => {
        if (!results) return;

        const analysisData = {
            skin_condition: results.final_result?.class,
            confidence_score: results.final_result?.confidence,
            patches_analyzed: results.predictions?.length,
            voting_method: results.final_result?.voting_method,
            patches: results.predictions?.map(p => ({
                region: p.region,
                predicted_class: p.predicted_class,
                confidence: p.confidence,
                image: patches[p.region] || null,
                heatmap_image: results.gradcam_heatmaps?.[p.region] || null
            })),
            image: patches['full_image'] || patches['camera_capture'] || null, // Fallback if full_image was passed differently
            heatmap_image: results.cfcm_image || results.gradcam_heatmaps?.['full_image'] || null,
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
