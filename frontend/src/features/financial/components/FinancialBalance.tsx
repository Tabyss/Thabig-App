import { useState } from "react";
import {
    PiEyeBold,
    PiEyeClosedBold,
    PiPlusBold,
    PiCaretRightBold,
    PiCaretLeftBold,
    PiPencilSimpleBold,
    PiTrashBold,
} from "react-icons/pi";
import { Text } from "../../../components/Text";
import { AccountFormModal, DeleteAccountModal } from "./AccountModals";

export interface AccountResponse {
    id: string;
    name: string;
    type: "CASH" | "BANK" | "EWALLET" | "CREDIT_CARD" | "INVESTMENT";
    currency: string;
    balance: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface FinancialBalanceProps {
    accounts: AccountResponse[];
    onAddAccount?: () => void;
    onAddFunds?: () => void;
    isLoading?: boolean;
}

const FinancialBalance = ({
    accounts = [],
    onAddAccount,
    onAddFunds,
    isLoading = false,
}: FinancialBalanceProps) => {
    const [isVisible, setIsVisible] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] =
        useState<AccountResponse | null>(null);

    const toggleVisibility = () => {
        setIsVisible((prev) => !prev);
    };

    const formatCurrency = (amount: string | number, currency = "IDR") => {
        const numeric =
            typeof amount === "string" ? parseFloat(amount) : amount;
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency,
            minimumFractionDigits: 0,
        }).format(numeric || 0);
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const totalCards = accounts.length + 1;

    const handleNext = () => {
        if (activeIndex < totalCards - 1) {
            setActiveIndex((prev) => prev + 1);
        }
    };

    const handlePrev = () => {
        if (activeIndex > 0) {
            setActiveIndex((prev) => prev - 1);
        }
    };

    const handleOpenAddModal = () => {
        setSelectedAccount(null);
        setIsFormModalOpen(true);
        if (onAddAccount) onAddAccount();
    };

    const handleOpenEditModal = (acc: AccountResponse) => {
        setSelectedAccount(acc);
        setIsFormModalOpen(true);
    };

    const handleOpenDeleteModal = (acc: AccountResponse) => {
        setSelectedAccount(acc);
        setIsDeleteModalOpen(true);
    };

    return (
        <>
            <div className="flex flex-col gap-3 mb-6">
                <div className="flex justify-end items-center px-1 gap-2">
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={handlePrev}
                            disabled={activeIndex === 0}
                            className="p-1 rounded-md text-charcoal-800 disabled:opacity-30 hover:bg-tangerine-100 transition"
                        >
                            <PiCaretLeftBold className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-medium text-tangerine-400">
                            {activeIndex + 1} / {totalCards}
                        </span>
                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={activeIndex === totalCards - 1}
                            className="p-1 rounded-md text-charcoal-800 disabled:opacity-30 hover:bg-tangerine-100 transition"
                        >
                            <PiCaretRightBold className="w-4 h-4" />
                        </button>
                    </div>
                    <button
                        onClick={toggleVisibility}
                        type="button"
                        className="bg-tangerine-500 text-tangerine-50 hover:opacity-80 transition-opacity p-2 rounded-lg focus:outline-none"
                        aria-label={
                            isVisible ? "Sembunyikan Saldo" : "Tampilkan Saldo"
                        }
                    >
                        {isVisible ? (
                            <PiEyeBold className="w-5 h-5" />
                        ) : (
                            <PiEyeClosedBold className="w-5 h-5" />
                        )}
                    </button>
                </div>

                <div className="relative w-full h-65">
                    {accounts.map((acc, index) => {
                        const offset = index - activeIndex;
                        const isPassed = offset < 0;

                        return (
                            <div
                                key={acc.id}
                                style={{
                                    transform: isPassed
                                        ? `translateY(-20px) scale(${1 - Math.abs(offset) * 0.05})`
                                        : `translateY(${offset * 12}px) scale(${1 - offset * 0.04})`,
                                    opacity: isPassed ? 0 : 1 - offset * 0.15,
                                    zIndex: totalCards - index,
                                }}
                                className={`absolute inset-0 p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 shadow-md ${
                                    index === activeIndex
                                        ? "bg-tangerine-50 border-tangerine-200 cursor-auto pointer-events-auto"
                                        : "bg-tangerine-100/70 border-tangerine-200 pointer-events-none"
                                }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <Text
                                            as="h2"
                                            variant="h4"
                                            className="text-charcoal-800 font-bold mt-1"
                                        >
                                            {acc.name}
                                        </Text>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {index === activeIndex && (
                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenEditModal(
                                                            acc,
                                                        );
                                                    }}
                                                    className="p-1 rounded-lg text-charcoal-600 hover:bg-tangerine-200 transition cursor-pointer"
                                                    title="Edit Account"
                                                >
                                                    <PiPencilSimpleBold className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenDeleteModal(
                                                            acc,
                                                        );
                                                    }}
                                                    className="p-1 rounded-lg text-red-600 hover:bg-red-100 transition cursor-pointer"
                                                    title="Delete Account"
                                                >
                                                    <PiTrashBold className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-tangerine-200 text-tangerine-700 uppercase">
                                            {acc.type}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <Text
                                        as="p"
                                        variant="sm"
                                        className="text-tangerine-400"
                                    >
                                        {acc.currency}
                                    </Text>

                                    <Text
                                        as="h1"
                                        variant="h2"
                                        className="text-charcoal-800 font-bold"
                                    >
                                        {isLoading ? (
                                            <span className="animate-pulse">
                                                Loading...
                                            </span>
                                        ) : isVisible ? (
                                            formatCurrency(
                                                acc.balance,
                                                acc.currency,
                                            )
                                        ) : (
                                            "••••••••"
                                        )}
                                    </Text>
                                    <Text
                                        as="p"
                                        variant="xs"
                                        className="text-tangerine-300 mt-1"
                                    >
                                        Last updated:{" "}
                                        {formatDate(acc.updated_at)}
                                    </Text>
                                </div>

                                {index === activeIndex && onAddFunds && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onAddFunds();
                                        }}
                                        type="button"
                                        className="w-full mt-2 inline-flex justify-center items-center gap-2 bg-tangerine-500 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow transition transform active:scale-95 hover:bg-tangerine-600 cursor-pointer"
                                    >
                                        Add Funds
                                    </button>
                                )}
                            </div>
                        );
                    })}

                    {(() => {
                        const addAccountIndex = accounts.length;
                        const offset = addAccountIndex - activeIndex;
                        const isPassed = offset < 0;

                        return (
                            <div
                                onClick={handleOpenAddModal}
                                style={{
                                    transform: isPassed
                                        ? `translateY(-20px) scale(${1 - Math.abs(offset) * 0.05})`
                                        : `translateY(${offset * 12}px) scale(${1 - offset * 0.04})`,
                                    opacity: isPassed ? 0 : 1 - offset * 0.15,
                                    zIndex: 1,
                                }}
                                className={`absolute inset-0 p-5 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-tangerine-300 bg-tangerine-50/50 hover:bg-tangerine-100/50 transition-all duration-300 shadow-sm group ${
                                    addAccountIndex === activeIndex
                                        ? "cursor-pointer pointer-events-auto"
                                        : "pointer-events-none"
                                }`}
                            >
                                <div className="p-3 rounded-full bg-tangerine-500 text-white group-hover:scale-110 transition-transform">
                                    <PiPlusBold className="w-6 h-6" />
                                </div>
                                <Text
                                    as="p"
                                    variant="p"
                                    className="text-tangerine-600 font-semibold mt-2"
                                >
                                    Add New Account
                                </Text>
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* Render Modals */}
            <AccountFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                accountToEdit={selectedAccount}
            />

            <DeleteAccountModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                account={selectedAccount}
            />
        </>
    );
};

export default FinancialBalance;
