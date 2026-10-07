import React, { useState, useEffect } from "react";
import { useHighlightStore } from "../stores/highlight.store";
import {
    useCreateHighlight,
    useUpdateHighlight,
} from "../hooks/useHighlightQueries";

export const HighlightFormModal = () => {
    const createMutation = useCreateHighlight();
    const updateMutation = useUpdateHighlight();
    const { isModalOpen, closeModal, editData } = useHighlightStore();

    const [date, setDate] = useState("");
    const [highlight, setHighlight] = useState("");

    useEffect(() => {
        if (editData) {
            setDate(editData.date);
            setHighlight(editData.highlight);
        } else {
            setDate("");
            setHighlight("");
        }
    }, [editData, isModalOpen]);

    if (!isModalOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { date, highlight };

        if (editData) {
            updateMutation.mutate(
                { id: editData.id, payload },
                {
                    onSuccess: () => closeModal(),
                },
            );
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => closeModal(),
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
                <h2 className="mb-4 text-xl font-bold">
                    {editData ? "Edit Highlight" : "Create Highlight"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Date
                        </label>
                        <input
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Highlight
                        </label>
                        <textarea
                            required
                            rows={3}
                            value={highlight}
                            onChange={(e) => setHighlight(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="What happened on this day?"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={
                                createMutation.isPending ||
                                updateMutation.isPending
                            }
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {createMutation.isPending ||
                            updateMutation.isPending
                                ? "Saving..."
                                : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
