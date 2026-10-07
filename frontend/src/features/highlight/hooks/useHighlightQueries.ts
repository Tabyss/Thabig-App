import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../shared/api/axios"; // Sesuaikan path import api jika berbeda
import type { HighlightPayload, HighlightYearItem, HighlightMonthItem } from "../types/Highlight.type";

const base = "/highlights";

export const useGetYearHighlights = (year: number) => {
    return useQuery<HighlightYearItem[]>({
        queryKey: ["HighlightYear", year],
        queryFn: async () => {
            const { data } = await api.get<HighlightYearItem[]>(`${base}/year/${year}`);
            return data;
        },
        staleTime: 2 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
};

export const useGetMonthHighlights = (year: number, month: number) => {
    return useQuery<HighlightMonthItem[]>({
        queryKey: ["HighlightMonth", year, month],
        queryFn: async () => {
            const { data } = await api.get<HighlightMonthItem[]>(`${base}/month/${year}/${month}`);
            return data;
        },
        staleTime: 2 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
};

export const useCreateHighlight = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (newHighlight: HighlightPayload) => {
            const { data } = await api.post(`${base}/`, newHighlight);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["HighlightYear"] });
            queryClient.invalidateQueries({ queryKey: ["HighlightMonth"] });
        },
    });
};

export const useUpdateHighlight = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ id, payload }: { id: string; payload: HighlightPayload }) => {
            const { data } = await api.put(`${base}/${id}`, payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["HighlightYear"] });
            queryClient.invalidateQueries({ queryKey: ["HighlightMonth"] });
        },
    });
};