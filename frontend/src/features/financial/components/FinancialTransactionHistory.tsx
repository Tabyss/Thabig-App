import React, { useState, useMemo } from "react";
import { useFinanceStore } from "../stores/financial.store";
import {
    useGetTransactions,
    useGetSummaryByCategory,
} from "../hooks/useFinanceQueries";
import { Text } from "../../../components/Text";
import { PiPlusBold, PiPencilSimpleBold, PiTrashBold } from "react-icons/pi";
import {
    TransactionFormModal,
    DeleteTransactionModal,
} from "./TransactionModal";
import { CategoryFormModal } from "./CategoryModal";
import type {
    TransactionResponse,
    TransactionType,
} from "../types/useFinanceQueries.types";

const colorClasses = [
    { bg: "bg-wheat-500", border: "border-wheat-500" },
    { bg: "bg-charcoal-500", border: "border-charcoal-500" },
    { bg: "bg-palm-500", border: "border-palm-500" },
    { bg: "bg-tangerine-500", border: "border-tangerine-500" },
    { bg: "bg-steel-500", border: "border-steel-500" },
];

const formatCurrency = (amount: number, type: "IN" | "OUT") => {
    const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(amount);

    return type === "IN" ? `+${formatted}` : `-${formatted}`;
};

const getIconProps = (type: "IN" | "OUT") => {
    if (type === "IN") {
        return {
            iconBg: "bg-palm-800/60",
            iconColor: "text-palm-200",
            iconSvg: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            ),
        };
    }
    return {
        iconBg: "bg-tangerine-800/60",
        iconColor: "text-tangerine-200",
        iconSvg: (
            <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
            </svg>
        ),
    };
};

interface FinancialTransactionHistoryProps {
    onTransactionClick?: (tx: TransactionResponse) => void;
}

const FinancialTransactionHistory: React.FC<
    FinancialTransactionHistoryProps
> = ({ onTransactionClick }) => {
    const { year, month } = useFinanceStore();
    const user_id = 1;

    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${String(month).padStart(2, "0")}-${lastDay}`;

    const [activeType, setActiveType] = useState<TransactionType | "">("");
    const [activeCategory, setActiveCategory] = useState<string>("");

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [selectedTx, setSelectedTx] = useState<TransactionResponse | null>(
        null,
    );

    const { data: rawTransactions, isLoading: isTransactionsLoading } =
        useGetTransactions({
            user_id,
            start_date: startDate,
            end_date: endDate,
            category_id: activeCategory || undefined,
            type: activeType || undefined,
        });
    const transactions: TransactionResponse[] =
        rawTransactions?.data || rawTransactions || [];

    const { data: rawCategoriesData } = useGetSummaryByCategory({
        user_id,
        start_date: startDate,
        end_date: endDate,
    });

    const typeFilters: { label: string; value: TransactionType }[] = [
        { label: "Income", value: "IN" },
        { label: "Expense", value: "OUT" },
        { label: "Transfer", value: "TRANSFER" },
    ];

    const groupedTransactions = useMemo(() => {
        if (!transactions.length) return [];
        const groups: Record<string, TransactionResponse[]> = {};
        transactions.forEach((tx) => {
            if (!groups[tx.transaction_date]) groups[tx.transaction_date] = [];
            groups[tx.transaction_date].push(tx);
        });

        return Object.keys(groups)
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
            .map((dateString) => {
                const dateObj = new Date(dateString);
                const today = new Date().toISOString().split("T")[0];
                const yesterday = new Date(Date.now() - 86400000)
                    .toISOString()
                    .split("T")[0];

                let label = "";
                if (dateString.split("T")[0] === today) label = "TODAY";
                else if (dateString.split("T")[0] === yesterday)
                    label = "YESTERDAY";
                else
                    label = dateObj
                        .toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                        })
                        .toUpperCase();

                return {
                    date: dateString,
                    label,
                    formattedDate: dateObj.toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                    }),
                    items: groups[dateString],
                };
            });
    }, [transactions]);

    const handleTypeClick = (value: TransactionType) => {
        setActiveType((prev) => (prev === value ? "" : value));
    };

    const handleCategoryClick = (cat: string) => {
        setActiveCategory((prev) => (prev === cat ? "" : cat));
    };

    const handleAddTx = () => {
        setSelectedTx(null);
        setIsFormModalOpen(true);
    };

    const handleEditTx = (tx: TransactionResponse) => {
        setSelectedTx(tx);
        setIsFormModalOpen(true);
    };

    const handleDeleteTx = (tx: TransactionResponse) => {
        setSelectedTx(tx);
        setIsDeleteModalOpen(true);
    };

    return (
        <>
            <div className="flex flex-col h-full min-h-[60vh] md:min-h-125 max-h-[90vh]">
                {/* KONTENER HEADER & FILTER TIPE */}
                <div className="px-3 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0 rounded-2xl bg-charcoal-900">
                    <div className="flex items-center justify-between w-full md:w-auto gap-3">
                        <Text
                            as="h4"
                            variant="pBold"
                            className="text-charcoal-100"
                        >
                            Transaction History
                        </Text>
                        <button
                            onClick={handleAddTx}
                            className="p-1.5 bg-tangerine-500 hover:bg-tangerine-600 text-white rounded-lg transition shrink-0"
                            title="Add Transaction"
                        >
                            <PiPlusBold className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto scrollbar-none pb-1 md:pb-0">
                        {typeFilters.map((filter) => {
                            const isActive = activeType === filter.value;
                            return (
                                <button
                                    key={filter.value}
                                    onClick={() =>
                                        handleTypeClick(filter.value)
                                    }
                                    className={`px-4 py-1.5 border border-charcoal-100 rounded-full text-xs font-bold transition whitespace-nowrap ${
                                        isActive
                                            ? "bg-charcoal-900 text-charcoal-100"
                                            : "bg-charcoal-100 text-charcoal-900 hover:bg-charcoal-700 hover:text-charcoal-200"
                                    }`}
                                >
                                    {filter.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* KONTENER FILTER KATEGORI */}
                <div className="flex h-max my-2 items-center gap-2 overflow-x-auto scrollbar-none pr-2 relative">
                    <div className="flex items-center gap-1 shrink-0">
                        {rawCategoriesData?.categories?.map(
                            (item: any, index: number) => {
                                const isActive =
                                    activeCategory === item.category_id;
                                const theme =
                                    colorClasses[index % colorClasses.length];

                                return (
                                    <button
                                        key={item.category_id}
                                        onClick={() =>
                                            handleCategoryClick(
                                                item.category_id,
                                            )
                                        }
                                        className={`px-3 py-1 rounded-full text-[11px] font-semibold transition whitespace-nowrap ${
                                            isActive
                                                ? `bg-transparent text-slate-900 border ${theme.border} hover:text-slate-200`
                                                : `${theme.bg} text-white shadow-md border${theme.border}`
                                        }`}
                                    >
                                        {item.category_name} ({item.total_count}
                                        )
                                    </button>
                                );
                            },
                        )}
                        <button
                            type="button"
                            onClick={() => setIsCategoryModalOpen(true)}
                            className="flex items-center justify-center shrink-0 w-7 h-7 rounded-full border border-charcoal-700 hover:bg-charcoal-200 text-charcoal-700 transition shadow-sm ml-auto sticky right-0 z-10 bg-white/10 backdrop-blur-sm"
                            title="Add New Category"
                        >
                            <PiPlusBold className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {/* LIST TRANSAKSI */}
                <div className="flex flex-col gap-1 flex-1 h-[50vh] md:h-112.5 p-3 md:p-4 bg-charcoal-900 rounded-2xl overflow-y-auto custom-scrollbar">
                    {isTransactionsLoading ? (
                        <div className="text-center py-12 text-slate-500 animate-pulse">
                            Memuat data transaksi...
                        </div>
                    ) : groupedTransactions.length > 0 ? (
                        groupedTransactions.map((group) => (
                            <div key={group.date}>
                                <div className="flex items-center sticky -top-3 md:-top-4 justify-between text-xs font-bold text-charcoal-600 bg-charcoal-900 tracking-wider py-2 md:py-3 z-10">
                                    <span>{group.label}</span>
                                </div>
                                <div className="space-y-2 md:space-y-3">
                                    {group.items.map((tx) => {
                                        const { iconBg, iconColor, iconSvg } =
                                            getIconProps(tx.type);

                                        return (
                                            <div
                                                key={tx.id}
                                                onClick={() =>
                                                    onTransactionClick?.(tx)
                                                }
                                                className="flex flex-wrap sm:flex-nowrap items-center justify-between p-3 md:p-3.5 rounded-xl bg-charcoal-100/5 hover:bg-charcoal-700 transition group cursor-pointer gap-2 md:gap-4"
                                            >
                                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                                    <div
                                                        className={`w-9 h-9 md:w-10 md:h-10 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}
                                                    >
                                                        {iconSvg}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h4 className="text-sm font-semibold text-charcoal-200 group-hover:text-white transition truncate">
                                                            {tx.title}
                                                        </h4>
                                                        <p className="text-[11px] md:text-xs text-charcoal-400 mt-0.5 truncate">
                                                            {tx.note}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-end gap-2 md:gap-4 shrink-0 ml-auto">
                                                    <div className="flex flex-col md:flex-row items-end md:items-center gap-1 md:gap-4">
                                                        <span className="text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded-full bg-tangerine-200 text-tangerine-700 uppercase">
                                                            {tx.account.name}
                                                        </span>
                                                        <span
                                                            className={`md:w-28 text-sm font-bold text-right ${
                                                                tx.type === "IN"
                                                                    ? "text-palm-300"
                                                                    : "text-tangerine-300"
                                                            }`}
                                                        >
                                                            {formatCurrency(
                                                                tx.amount,
                                                                tx.type,
                                                            )}
                                                        </span>
                                                    </div>

                                                    {/* Action Buttons (Selalu tampil di mobile, hover di desktop) */}
                                                    <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEditTx(
                                                                    tx,
                                                                );
                                                            }}
                                                            className="p-1.5 rounded-lg text-charcoal-400 hover:text-white hover:bg-charcoal-600 transition"
                                                        >
                                                            <PiPencilSimpleBold className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteTx(
                                                                    tx,
                                                                );
                                                            }}
                                                            className="p-1.5 rounded-lg text-red-500 hover:text-white hover:bg-red-500/20 transition"
                                                        >
                                                            <PiTrashBold className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-slate-500 text-sm">
                            Tidak ada transaksi ditemukan untuk filter ini.
                        </div>
                    )}
                </div>
            </div>

            {/* RENDER MODALS */}
            <TransactionFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                transactionToEdit={selectedTx}
            />

            <DeleteTransactionModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                transaction={selectedTx}
            />

            <CategoryFormModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
            />
        </>
    );
};

export default FinancialTransactionHistory;
