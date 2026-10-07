import { useState } from "react";
import { useFinanceStore } from "../stores/financial.store";
import {
    useGetAccounts,
    useCreateTransaction,
    useDeleteTransaction,
    useUpdateTransaction,
    useGetTransactionSummary, // Gunakan hook summary terbaru
} from "../hooks/useFinanceQueries"; // Sesuaikan path jika berbeda
import type { TransactionFormData } from "../types/Financial.type";
import type {
    AccountResponse,
    TransactionResponse,
    TransactionCreate,
    TransactionUpdate,
} from "../types/useFinanceQueries.types";

export const useFinancial = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] =
        useState<TransactionFormData | null>(null);

    // Ambil user_id dari store (default ke 1 jika tidak ada)
    const { year, month } = useFinanceStore();

    const user_id = 1;

    // Kalkulasi start_date dan end_date untuk API baru
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${String(month).padStart(2, "0")}-${lastDay}`;

    // Fetch daftar akun/account
    const { data: rawAccounts, isLoading: isAccountsLoading } =
        useGetAccounts();
    // Ekstrak array dari response axios jika terbungkus '.data'
    const accounts: AccountResponse[] = Array.isArray(rawAccounts)
        ? rawAccounts
        : rawAccounts?.data || [];

    // Fetch Summary menggunakan parameter baru
    const { data: rawSummary, isLoading: isSummaryLoading } =
        useGetTransactionSummary({
            user_id,
            start_date: startDate,
            end_date: endDate,
        });
    const summaryData = rawSummary?.data || rawSummary;

    const { mutate: createTx } = useCreateTransaction();
    const { mutate: updateTx } = useUpdateTransaction();
    const { mutate: deleteTx } = useDeleteTransaction();

    // 1. Hitung total balance dari seluruh akun aktif
    const totalBalance = accounts.reduce(
        (acc: number, item: AccountResponse) => {
            return acc + Number(item.balance || 0);
        },
        0,
    );

    // 2. Cari tanggal updated_at paling terbaru dari daftar akun
    const latestAccountUpdate = accounts.reduce(
        (latest: string | null, item: AccountResponse) => {
            if (!item.updated_at) return latest;
            if (!latest) return item.updated_at;
            return new Date(item.updated_at) > new Date(latest)
                ? item.updated_at
                : latest;
        },
        null,
    );

    // Format tanggal ke Bahasa Indonesia (contoh: 5 Okt 2026, 14.04)
    const formattedLastUpdated = latestAccountUpdate
        ? new Date(latestAccountUpdate).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
          })
        : "-";

    const handleAddFunds = () => {
        setSelectedTransaction(null);
        setIsModalOpen(true);
    };

    const handleTransactionClick = (tx: TransactionResponse) => {
        setSelectedTransaction({
            id: tx.id,
            title: tx.title,
            amount: tx.amount,
            category: tx.category,
            transaction_date: tx.transaction_date,
            type: tx.type,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (formData: TransactionFormData | any) => {
        if (formData.id) {
            // Sesuaikan payload dengan interface TransactionUpdate
            const payload: TransactionUpdate = {
                title: formData.title,
                type: formData.type,
                amount: Number(formData.amount),
                category_id: formData.category_id || null,
                account_id: formData.account_id || null,
                transaction_date: formData.transaction_date,
            };

            // Hook update yang baru butuh { transactionId, payload }
            updateTx(
                { transactionId: formData.id, payload },
                {
                    onSuccess: () => setIsModalOpen(false),
                },
            );
        } else {
            // Sesuaikan payload dengan interface TransactionCreate
            const payload: TransactionCreate = {
                title: formData.title,
                type: formData.type,
                amount: Number(formData.amount),
                category_id: formData.category_id || null,
                account_id: formData.account_id,
                transaction_date: formData.transaction_date,
            };

            createTx(payload, {
                onSuccess: () => setIsModalOpen(false),
            });
        }
    };

    const handleDelete = (id: string) => {
        if (
            window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?")
        ) {
            deleteTx(id, {
                onSuccess: () => setIsModalOpen(false),
            });
        }
    };

    const formatRupiah = (amount: number = 0) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return {
        isModalOpen,
        setIsModalOpen,
        selectedTransaction,
        summaryData,
        isSummaryLoading,
        totalBalance, // Data total balance
        formattedTotalBalance: formatRupiah(totalBalance), // Format Rp
        lastUpdated: formattedLastUpdated, // Teks tanggal pembaruan terakhir
        isAccountsLoading, // State loading akun
        handleAddFunds,
        handleTransactionClick,
        handleSubmit,
        handleDelete,
        formatRupiah,
    };
};
