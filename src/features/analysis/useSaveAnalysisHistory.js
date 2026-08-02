// src/features/analysis/useSaveAnalysisHistory.js
//
// Hook ini menerima { results, patches, recommendations, userId, token }
// sekaligus dalam satu object saat mutate/mutateAsync dipanggil dari
// komponen - `results`/`patches`/`recommendations` dipasok dari
// useCurrentAnalysis() (baca cache ['currentAnalysis']) di Results.jsx,
// bukan dari AnalysisContext.
//
// PERBAIKAN: sebelumnya file ini asal-comot `import { uploadImageToSupabase }
// from '../../lib/supabaseUpload'` — padahal file lib itu TIDAK PERNAH ADA
// di project ini. Fungsi aslinya didefinisikan INLINE di dalam
// AnalysisContext.js (yang sekarang dihapus). Jadi fungsinya dipindah ke
// sini secara utuh (copy-paste dari AnalysisContext lama), tanpa import
// dari lib fiktif manapun.

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { historyAPI } from '../../services/api';
import { createClient } from '@supabase/supabase-js';

// Dipindah apa adanya dari AnalysisContext.js lama.
async function uploadImageToSupabase(base64String, userId, token) {
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
}

async function saveAnalysisHistory({ results, patches, recommendations, userId, token }) {
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
            const heatmapPatchUrl = await uploadImageToSupabase(
                results.gradcam_heatmaps?.[p.region] || null,
                userId,
                token
            );
            return {
                region: p.region,
                predicted_class: p.predicted_class,
                confidence: p.confidence,
                image_url: patchUrl,
                heatmap_image_url: heatmapPatchUrl,
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
        recommended_ingredients: recommendations?.ingredients || recommendations || [],
    };

    const response = await historyAPI.save(analysisData);
    return response.data;
}

export function useSaveAnalysisHistory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: saveAnalysisHistory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['history'] });
        },
    });
}