// src/features/analysis/useAnalyzeSkin.js
//
// PERUBAHAN: dulu hasil analisis (results/patches/recommendations) disimpan
// di AnalysisContext (useState di provider). Sekarang AnalysisProvider
// dihapus total, jadi state itu dipindah ke QueryClient cache dengan key
// ['currentAnalysis'] via queryClient.setQueryData().
//
// Kenapa begini (bukan cuma andalkan mutation.data)?
// - mutation.data dari useMutation TIDAK reaktif lintas komponen. Kalau
//   Analyze.jsx sudah pindah halaman (navigate ke Results), komponen mutation
//   itu ter-unmount dan datanya ilang.
// - queryClient.setQueryData() nulis ke cache TanStack Query global, jadi
//   bisa dibaca ulang di komponen manapun (misal Results.jsx) pakai
//   useQuery(['currentAnalysis']) tanpa perlu lewat router state / props.
// - Behavior-nya jadi sama persis kayak AnalysisContext dulu: data hidup
//   selama sesi browser (QueryClient hidup di memori), ilang kalau di-refresh.
//
// Juga MENGEMBALIKAN logic yang sempat hilang waktu Analyze.jsx dimigrasi:
// pemanggilan analyzeAPI.recommend() otomatis setelah analyze() sukses
// (persis seperti di AnalysisContext.analyze() versi lama).

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { analyzeAPI } from '../../services/api';

async function analyzeSkin({ images, fullImage = null, bboxes = null, aggregationMethod = 'racwv' }) {
    const payload = {
        images: images,
        full_face_image: fullImage,
        bounding_boxes: bboxes && Object.keys(bboxes).length > 0 ? bboxes : null,
        aggregation_method: aggregationMethod,
    };

    const response = await analyzeAPI.analyze(payload);
    return response.data;
}

export function useAnalyzeSkin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: analyzeSkin,
        onSuccess: async (data, variables) => {
            // Susun ulang object `patches` persis seperti AnalysisContext lama:
            // { ...images, full_image: fullImage } kalau fullImage ada.
            const { images, fullImage } = variables;
            const patches = fullImage ? { ...images, full_image: fullImage } : images;

            // Simpan results + patches ke cache dulu, recommendations menyusul async
            queryClient.setQueryData(['currentAnalysis'], {
                results: data,
                patches,
                recommendations: null,
            });

            // Ambil rekomendasi ingredient otomatis kalau ada final_result.class
            // (perilaku ini ada di AnalysisContext lama tapi sempat hilang di
            // versi Analyze.jsx yang sudah dimigrasi)
            if (data.final_result?.class) {
                try {
                    const recResponse = await analyzeAPI.recommend(data.final_result.class);
                    queryClient.setQueryData(['currentAnalysis'], (old) => ({
                        ...(old ?? { results: data, patches }),
                        recommendations: recResponse.data,
                    }));
                } catch {
                    console.warn('Failed to get recommendations');
                }
            }
        },
    });
}