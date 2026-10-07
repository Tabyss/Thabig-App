import React, { useState, useEffect } from "react";
import { PiXBold, PiTrashBold } from "react-icons/pi";
import {
    useCreateTransaction,
    useUpdateTransaction,
    useDeleteTransaction,
    useGetCategories,
    useGetAccounts,
} from "../hooks/useFinanceQueries";
import type {
    TransactionResponse,
    TransactionType,
    TransactionUpdate,
    TransactionCreate,
} from "../types/useFinanceQueries.types";

interface TransactionFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    transactionToEdit?: TransactionResponse | null;
}

export const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
    isOpen,
    onClose,
    transactionToEdit,
}) => {
    const isEdit = Boolean(transactionToEdit);
    const createMutation = useCreateTransaction();
    const updateMutation = useUpdateTransaction();

    const { data: categoriesData } = useGetCategories();
    const { data: accountsData } = useGetAccounts();

    const categories = Array.isArray(categoriesData)
        ? categoriesData
        : categoriesData?.data || [];
    const accounts = Array.isArray(accountsData)
        ? accountsData
        : accountsData?.data || [];

    const [formData, setFormData] = useState({
        title: "",
        type: "OUT" as TransactionType,
        amount: "",
        category_id: "",
        account_id: "",
        to_account_id: "",
        note: "",
        transaction_date: new Date().toISOString().split("T")[0],
    });

    useEffect(() => {
        if (transactionToEdit) {
            setFormData({
                title: transactionToEdit.title,
                type: (transactionToEdit.type === "IN"
                    ? "IN"
                    : transactionToEdit.type === "OUT"
                      ? "OUT"
                      : transactionToEdit.type) as TransactionType,
                amount: transactionToEdit.amount.toString(),
                category_id: transactionToEdit.category_id || "",
                account_id: transactionToEdit.account_id || "",
                to_account_id: transactionToEdit.to_account_id || "",
                transaction_date:
                    transactionToEdit.transaction_date.split("T")[0],
                note: transactionToEdit.note || "",
            });
        } else {
            setFormData({
                title: "",
                type: "OUT",
                amount: "",
                category_id: "",
                account_id: accounts.length > 0 ? accounts[0].id : "",
                to_account_id: "",
                transaction_date: new Date().toISOString().split("T")[0],
                note: "",
            });
        }
    }, [transactionToEdit, isOpen, accounts.length]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const finalToAccountId =
            formData.type === "TRANSFER" ? formData.to_account_id : null;

        if (isEdit && transactionToEdit) {
            const payload: TransactionUpdate = {
                title: formData.title,
                type: formData.type,
                amount: Number(formData.amount),
                category_id: formData.category_id || null,
                account_id: formData.account_id || null,
                to_account_id: finalToAccountId,
                transaction_date: formData.transaction_date,
                note: formData.note
            };

            updateMutation.mutate(
                { transactionId: transactionToEdit.id, payload },
                { onSuccess: onClose },
            );
        } else {
            const payload: TransactionCreate = {
                title: formData.title,
                type: formData.type,
                amount: Number(formData.amount),
                category_id: formData.category_id || null,
                account_id: formData.account_id,
                to_account_id: finalToAccountId,
                transaction_date: formData.transaction_date,
                note: formData.note
            };

            createMutation.mutate(payload, { onSuccess: onClose });
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-charcoal-900 border border-charcoal-700 rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-charcoal-400 hover:text-white p-1 rounded-lg"
                >
                    <PiXBold className="w-5 h-5" />
                </button>

                <h3 className="text-xl font-bold text-white mb-4">
                    {isEdit ? "Edit Transaction" : "Add Transaction"}
                </h3>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-charcoal-300 mb-1">
                                Type
                            </label>
                            <select
                                value={formData.type}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        type: e.target.value as TransactionType,
                                        to_account_id:
                                            e.target.value !== "TRANSFER"
                                                ? ""
                                                : formData.to_account_id,
                                    })
                                }
                                className="w-full px-3 py-2 border border-charcoal-700 bg-charcoal-800 text-white rounded-xl focus:outline-none focus:border-tangerine-500 text-sm"
                            >
                                <option value="OUT">Expense</option>
                                <option value="IN">Income</option>
                                <option value="TRANSFER">Transfer</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-charcoal-300 mb-1">
                                Date
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.transaction_date}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        transaction_date: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 border border-charcoal-700 bg-charcoal-800 text-white rounded-xl focus:outline-none focus:border-tangerine-500 text-sm scheme-dark"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-charcoal-300 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g., Groceries, Salary, Transfer to BCA"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    title: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 border border-charcoal-700 bg-charcoal-800 text-white rounded-xl focus:outline-none focus:border-tangerine-500 text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div
                            className={
                                formData.type === "TRANSFER"
                                    ? "col-span-1"
                                    : "col-span-2"
                            }
                        >
                            <label className="block text-xs font-semibold text-charcoal-300 mb-1">
                                Account Source
                            </label>
                            <select
                                required
                                value={formData.account_id}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        account_id: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 border border-charcoal-700 bg-charcoal-800 text-white rounded-xl focus:outline-none focus:border-tangerine-500 text-sm"
                            >
                                <option value="" disabled>
                                    Select Account
                                </option>
                                {accounts.map((acc: any) => (
                                    <option key={acc.id} value={acc.id}>
                                        {acc.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {formData.type === "TRANSFER" && (
                            <div className="col-span-1">
                                <label className="block text-xs font-semibold text-charcoal-300 mb-1">
                                    Destination Account
                                </label>
                                <select
                                    required
                                    value={formData.to_account_id}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            to_account_id: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-charcoal-700 bg-charcoal-800 text-white rounded-xl focus:outline-none focus:border-tangerine-500 text-sm"
                                >
                                    <option value="" disabled>
                                        Select Destination
                                    </option>
                                    {accounts.map((acc: any) => (
                                        <option
                                            key={acc.id}
                                            value={acc.id}
                                            disabled={
                                                acc.id === formData.account_id
                                            }
                                        >
                                            {acc.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-charcoal-300 mb-1">
                                Amount (IDR)
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                placeholder="0"
                                value={formData.amount}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        amount: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 border border-charcoal-700 bg-charcoal-800 text-white rounded-xl focus:outline-none focus:border-tangerine-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-charcoal-300 mb-1">
                                Category
                            </label>
                            <select
                                value={formData.category_id}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        category_id: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 border border-charcoal-700 bg-charcoal-800 text-white rounded-xl focus:outline-none focus:border-tangerine-500 text-sm"
                            >
                                <option value="">No Category</option>
                                {categories.map((cat: any) => (
                                    <option
                                        key={cat.id || cat.category}
                                        value={cat.id || cat.category}
                                    >
                                        {cat.name || cat.category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-charcoal-300 mb-1">
                            Note
                        </label>
                        <input
                            value={formData.note}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    note: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 border border-charcoal-700 bg-charcoal-800 text-white rounded-xl focus:outline-none focus:border-tangerine-500 text-sm"
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl border border-charcoal-700 text-charcoal-300 text-sm font-semibold hover:bg-charcoal-800 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 rounded-xl bg-tangerine-500 text-white text-sm font-semibold hover:bg-tangerine-600 transition disabled:opacity-50"
                        >
                            {isLoading
                                ? "Saving..."
                                : isEdit
                                  ? "Update"
                                  : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// -------------------------------------------------------------
// 2. MODAL DELETE CONFIRMATION
// -------------------------------------------------------------
interface DeleteTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: TransactionResponse | null;
}

export const DeleteTransactionModal: React.FC<DeleteTransactionModalProps> = ({
    isOpen,
    onClose,
    transaction,
}) => {
    const deleteMutation = useDeleteTransaction();

    if (!isOpen || !transaction) return null;

    const handleDelete = () => {
        deleteMutation.mutate(transaction.id, {
            onSuccess: onClose,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-charcoal-900 border border-charcoal-700 rounded-2xl w-full max-w-sm p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200 text-center">
                <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mx-auto mb-3">
                    <PiTrashBold className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">
                    Delete Transaction
                </h3>
                <p className="text-sm text-charcoal-400 mt-2 mb-6">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-white">
                        "{transaction.title}"
                    </span>
                    ? This action cannot be undone.
                </p>

                <div className="flex justify-center gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full py-2 rounded-xl border border-charcoal-700 text-charcoal-300 text-sm font-semibold hover:bg-charcoal-800 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                        className="w-full py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50"
                    >
                        {deleteMutation.isPending ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
};
