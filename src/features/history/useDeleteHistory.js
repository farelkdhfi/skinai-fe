import { useMutation, useQueryClient } from "@tanstack/react-query";
import { historyAPI } from "../../services/api";

async function deleteHistory(id) {
    const response = await historyAPI.delete(id);
    return response.data;
}

export function useDeleteHistory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteHistory,
        onSuccess: () => {
            // Invalidate SEMUA query yang key-nya diawali ['history']
            // (baik list dengan berbagai limit/offset, maupun detail per-id)
            queryClient.invalidateQueries({ queryKey: ['history'] });
        },
    });
}