import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../shared/api/axios";
import type { InvestmentPortfolio, InvestmentCreate } from "../types/Investment.type";

const base = "/investments";

export const useGetPortfolio = () => {
    return useQuery<InvestmentPortfolio>({
        queryKey: ["InvestmentPortfolio"],
        queryFn: async () => {
            const { data } = await api.get<InvestmentPortfolio>(`${base}/`);
            return data;
        },
        staleTime: 2 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
};

export const useBuyInvestment = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (newInvestment: InvestmentCreate) => {
            const { data } = await api.post(`${base}/`, newInvestment);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["InvestmentPortfolio"] });
            queryClient.invalidateQueries({ queryKey: ["Transactions"] });
            queryClient.invalidateQueries({ queryKey: ["transactionsTotal"] });
            queryClient.invalidateQueries({ queryKey: ["Summary"] });
            queryClient.invalidateQueries({ queryKey: ["CategoryCount"] });
        },
    });
};

export const useSellInvestment = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ id, sellPrice }: { id: string; sellPrice: number }) => {
            const { data } = await api.post(`${base}/${id}/sell`, { sell_price: sellPrice });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["InvestmentPortfolio"] });
            queryClient.invalidateQueries({ queryKey: ["Transactions"] });
            queryClient.invalidateQueries({ queryKey: ["transactionsTotal"] });
            queryClient.invalidateQueries({ queryKey: ["Summary"] });
            queryClient.invalidateQueries({ queryKey: ["CategoryCount"] });
        },
    });
};