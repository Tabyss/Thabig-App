import React, { useState, useEffect } from "react";
import { PiXBold, PiTrashBold } from "react-icons/pi";
import {
    useCreateAccount,
    useUpdateAccount,
    type AccountUpdate,
    type AccountCreate,
    useDeleteAccount,
} from "../hooks/useFinanceQueries";
import type { AccountResponse } from "./FinancialBalance";

type AccountType = "CASH" | "BANK" | "EWALLET" | "CREDIT_CARD" | "INVESTMENT";

const ACCOUNT_TYPES: AccountType[] = [
    "CASH",
    "BANK",
    "EWALLET",
    "CREDIT_CARD",
    "INVESTMENT",
];

interface AccountFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    accountToEdit?: AccountResponse | null;
}

export const AccountFormModal: React.FC<AccountFormModalProps> = ({
    isOpen,
    onClose,
    accountToEdit,
}) => {
    const isEdit = Boolean(accountToEdit);
    const createMutation = useCreateAccount();
    const updateMutation = useUpdateAccount();

    const [formData, setFormData] = useState<{
        name: string;
        type: AccountType;
        currency: string;
        balance: string | number;
    }>({
        name: "",
        type: "BANK",
        currency: "IDR",
        balance: 0,
    });

    useEffect(() => {
        if (accountToEdit) {
            setFormData({
                name: accountToEdit.name,
                type: accountToEdit.type,
                currency: accountToEdit.currency || "IDR",
                balance: accountToEdit.balance || 0,
            });
        } else {
            setFormData({
                name: "",
                type: "BANK",
                currency: "IDR",
                balance: 0,
            });
        }
    }, [accountToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit && accountToEdit) {
            const payload: AccountUpdate = {
                name: formData.name,
                type: formData.type,
                currency: formData.currency,
                balance: Number(formData.balance),
            };

            updateMutation.mutate(
                { accountId: accountToEdit.id, payload },
                { onSuccess: onClose },
            );
        } else {
            const payload: AccountCreate = {
                name: formData.name,
                type: formData.type,
                currency: formData.currency,
                balance: Number(formData.balance),
            };

            createMutation.mutate(payload, { onSuccess: onClose });
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-charcoal-400 hover:text-charcoal-800 p-1 rounded-lg"
                >
                    <PiXBold className="w-5 h-5" />
                </button>

                <h3 className="text-xl font-bold text-charcoal-800 mb-4">
                    {isEdit ? "Edit Account" : "Add New Account"}
                </h3>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-charcoal-600 mb-1">
                            Account Name
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g., BCA Main Account"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-tangerine-500 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-charcoal-600 mb-1">
                            Account Type
                        </label>
                        <select
                            value={formData.type}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    type: e.target.value as AccountType,
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-tangerine-500 text-sm bg-white"
                        >
                            {ACCOUNT_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-1">
                            <label className="block text-xs font-semibold text-charcoal-600 mb-1">
                                Currency
                            </label>
                            <input
                                type="text"
                                value={formData.currency}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        currency: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-tangerine-500 text-sm"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-semibold text-charcoal-600 mb-1">
                                {isEdit ? "New Balance" : "Initial Balance"}
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.balance}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        balance: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-tangerine-500 text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl border border-gray-200 text-charcoal-600 text-sm font-semibold hover:bg-gray-50 transition"
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
                                  ? "Update Account"
                                  : "Create Account"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    account: AccountResponse | null;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
    isOpen,
    onClose,
    account,
}) => {
    const deleteMutation = useDeleteAccount();

    if (!isOpen || !account) return null;

    const handleDelete = () => {
        deleteMutation.mutate(account.id, {
            onSuccess: onClose,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200 text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
                    <PiTrashBold className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-charcoal-800">
                    Delete Account
                </h3>
                <p className="text-sm text-charcoal-500 mt-2 mb-6">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-charcoal-800">
                        "{account.name}"
                    </span>
                    ? This action cannot be undone.
                </p>

                <div className="flex justify-center gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full py-2 rounded-xl border border-gray-200 text-charcoal-600 text-sm font-semibold hover:bg-gray-50 transition"
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
