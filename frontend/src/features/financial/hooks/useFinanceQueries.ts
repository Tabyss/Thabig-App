import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../shared/api/axios";

// Import types
import type {
    AccountCreate,
    AccountUpdate,
    CategoryCreate,
    TransactionCreate,
    TransactionUpdate,
    TransactionType,
} from "../types/useFinanceQueries.types";

// ==========================================
// ACCOUNTS HOOKS
// ==========================================

const BASE_URL = "/api/finance"

export const useGetAccounts = () => {
    return useQuery({
        queryKey: ["accounts"],
        queryFn: async () => {
            const { data } = await api.get(`${BASE_URL}/accounts`);
            return data;
        },
    });
};

export const useCreateAccount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: AccountCreate) => {
            const { data } = await api.post(`${BASE_URL}/accounts`, payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
        },
    });
};

export const useUpdateAccount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            accountId,
            payload,
        }: {
            accountId: string;
            payload: AccountUpdate;
        }) => {
            const { data } = await api.patch(
                `${BASE_URL}/accounts/${accountId}`,
                payload,
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
        },
    });
};

export const useDeleteAccount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (accountId: string) => {
            const { data } = await api.delete(
                `${BASE_URL}/accounts/${accountId}`,
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
        },
    });
};

// ==========================================
// CATEGORIES HOOKS
// ==========================================

export const useGetCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const { data } = await api.get(`${BASE_URL}/categories`);
            return data;
        },
    });
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: CategoryCreate) => {
            const { data } = await api.post(`${BASE_URL}/categories`, payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["summary-by-category"] });
        },
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            categoryId,
            payload,
        }: {
            categoryId: string;
            payload: AccountUpdate;
        }) => {
            const { data } = await api.patch(
                `${BASE_URL}/categories/${categoryId}`,
                payload,
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["summary-by-category"] });
        },
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (categoryId: string) => {
            const { data } = await api.delete(
                `${BASE_URL}/categories/${categoryId}`,
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
};

// ==========================================
// TRANSACTIONS HOOKS
// ==========================================

export const useCreateTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: TransactionCreate) => {
            const { data } = await api.post(
                `${BASE_URL}/transactions`,
                payload,
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
        },
    });
};

export const useUpdateTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            transactionId,
            payload,
        }: {
            transactionId: string;
            payload: TransactionUpdate;
        }) => {
            const { data } = await api.patch(
                `${BASE_URL}/transactions/${transactionId}`,
                payload,
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
        },
    });
};

export const useDeleteTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (transactionId: string) => {
            const { data } = await api.delete(
                `${BASE_URL}/transactions/${transactionId}`,
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
        },
    });
};

// ==========================================
// TRANSACTIONS FETCH & SUMMARY HOOKS
// ==========================================

interface GetTransactionsParams {
    user_id: number;
    start_date: string;
    end_date: string;
    category_id?: string;
    type?: TransactionType;
}

interface GetSummaryParams {
    user_id: number;
    start_date: string;
    end_date?: string;
    category_id?: string;
}

interface GetSummaryByCategoryParams {
    user_id: number;
    start_date: string;
    end_date?: string;
}

export const useGetTransactions = (params: GetTransactionsParams) => {
    return useQuery({
        queryKey: ["transactions", params],
        queryFn: async () => {
            const { data } = await api.get(`${BASE_URL}/transactions/all`, {
                params,
            });
            return data;
        },
        enabled: !!params.user_id && !!params.start_date && !!params.end_date,
    });
};

export const useGetTransactionSummary = (params: GetSummaryParams) => {
    return useQuery({
        queryKey: ["transaction-summary", params],
        queryFn: async () => {
            const { data } = await api.get(
                `${BASE_URL}/transactions/summary`,
                { params },
            );
            return data;
        },
        enabled: !!params.user_id && !!params.start_date,
    });
};

export const useGetSummaryByCategory = (params: GetSummaryByCategoryParams) => {
    return useQuery({
        queryKey: ["summary-by-category", params],
        queryFn: async () => {
            const { data } = await api.get(
                `${BASE_URL}/transactions/summary/by-category`,
                { params },
            );
            return data;
        },
        enabled: !!params.user_id && !!params.start_date,
    });
};

export const useGetSummaryByDay = (params: GetSummaryByCategoryParams) => {
    return useQuery({
        queryKey: ["summary-by-day", params],
        queryFn: async () => {
            const { data } = await api.get(
                `${BASE_URL}/transactions/summary/by-day`,
                { params },
            );
            return data;
        },
        enabled: !!params.user_id && !!params.start_date,
    });
};
