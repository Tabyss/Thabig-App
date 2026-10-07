import React, { useState } from "react";
import { PiXBold } from "react-icons/pi";
import { useCreateCategory } from "../hooks/useFinanceQueries";
import type { CategoryCreate, CategoryType } from "../types/useFinanceQueries.types";

interface CategoryFormModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
    isOpen,
    onClose,
}) => {
    const createMutation = useCreateCategory();
    
    const [formData, setFormData] = useState({
        name: "",
        type: "OUT" as CategoryType,
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const payload: CategoryCreate = {
            name: formData.name,
            type: formData.type,
            // Opsional (Bisa dikembangkan jika ingin input icon/color)
            icon: null,
            color: null,
            parent_id: null,
        };

        createMutation.mutate(payload, {
            onSuccess: () => {
                // Reset form setelah berhasil
                setFormData({ name: "", type: "OUT" });
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-charcoal-900 border border-charcoal-700 rounded-2xl w-full max-w-sm p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-charcoal-400 hover:text-white p-1 rounded-lg transition"
                >
                    <PiXBold className="w-5 h-5" />
                </button>

                <h3 className="text-xl font-bold text-white mb-4">
                    Add New Category
                </h3>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-charcoal-300 mb-1">
                            Type
                        </label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as CategoryType })}
                            className="w-full px-3 py-2 border border-charcoal-700 bg-charcoal-800 text-white rounded-xl focus:outline-none focus:border-tangerine-500 text-sm"
                        >
                            <option value="OUT">Expense (Out)</option>
                            <option value="IN">Income (In)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-charcoal-300 mb-1">
                            Category Name
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g., Food, Salary, Transport"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                            disabled={createMutation.isPending}
                            className="px-4 py-2 rounded-xl bg-tangerine-500 text-white text-sm font-semibold hover:bg-tangerine-600 transition disabled:opacity-50"
                        >
                            {createMutation.isPending ? "Saving..." : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};