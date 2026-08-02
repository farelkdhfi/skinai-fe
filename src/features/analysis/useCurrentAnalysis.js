// src/features/analysis/useCurrentAnalysis.js
//
// BARU - pengganti `useAnalysis()` dari AnalysisContext (yang sudah dihapus).
//
// Dulu Results.jsx baca `results`, `patches`, `recommendations` dari
// AnalysisContext (useState di provider, hidup selama sesi browser).
//
// Sekarang datanya dibaca dari QueryClient cache di key ['currentAnalysis'],
// yang diisi oleh useAnalyzeSkin() saat mutasi analisis sukses (lihat
// useAnalyzeSkin.js). Pakai useQuery dengan queryFn dummy + enabled: false
// supaya:
// - TIDAK melakukan fetch apapun (murni baca cache yang sudah ada)
// - TETAP reaktif: kalau cache di-update (misal recommendations menyusul
//   async setelah analyze selesai), komponen yang pakai hook ini otomatis
//   re-render dengan data terbaru — persis seperti Context re-render lama.
//
// Kalau belum ada analisis sama sekali di cache (misal user buka /results
// langsung tanpa lewat /analyze dulu), `data` bernilai undefined, sama
// seperti `results` bernilai null di AnalysisContext dulu.

import { useQuery, useQueryClient } from '@tanstack/react-query';

export function useCurrentAnalysis() {
    const queryClient = useQueryClient();

    const { data } = useQuery({
        queryKey: ['currentAnalysis'],
        // queryFn tidak pernah benar-benar jalan karena enabled: false,
        // tapi tetap wajib diisi supaya TanStack Query tidak warning/error.
        queryFn: () => queryClient.getQueryData(['currentAnalysis']) ?? null,
        enabled: false,
        // Ambil initialData dari cache saat mount pertama kali, biar gak
        // undefined sebelum ada trigger refetch/update manapun.
        initialData: () => queryClient.getQueryData(['currentAnalysis']),
    });

    const reset = () => {
        queryClient.removeQueries({ queryKey: ['currentAnalysis'] });
    };

    return {
        results: data?.results ?? null,
        patches: data?.patches ?? {},
        recommendations: data?.recommendations ?? null,
        reset,
    };
}