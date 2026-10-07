import React, { useState } from "react";
import type { InvestmentCreate } from "../types/Investment.type";
import { useBuyInvestment } from "../hooks/useInvestmentQueries";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const AddInvestmentModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const { mutate, isPending } = useBuyInvestment();
    const [formData, setFormData] = useState<InvestmentCreate>({
        title: "",
        ticker: "",
        amount_shares: 0,
        buy_price: 0,
        transaction_date: new Date().toISOString().split("T")[0],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate(formData, {
            onSuccess: () => {
                onClose();
                setFormData({
                    title: "",
                    ticker: "",
                    amount_shares: 0,
                    buy_price: 0,
                    transaction_date: new Date().toISOString().split("T")[0],
                });
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl max-w-xl w-full space-y-5 shadow-xl"
            >
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold">
                        Tambah Investasi Baru
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Nama Aset (Contoh: Saham BBCA)
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    title: e.target.value,
                                })
                            }
                            className="mt-1 block w-full border rounded-lg p-2.5"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Ticker (Optional)
                        </label>
                        <input
                            type="text"
                            value={formData.ticker}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    ticker: e.target.value,
                                })
                            }
                            className="mt-1 block w-full border rounded-lg p-2.5"
                            placeholder="BBCA"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Tanggal Transaksi
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
                            className="mt-1 block w-full border rounded-lg p-2.5"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Jumlah Unit / Lembar
                        </label>
                        <input
                            type="number"
                            required
                            min={0}
                            value={formData.amount_shares}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    amount_shares: Number(e.target.value),
                                })
                            }
                            className="mt-1 block w-full border rounded-lg p-2.5"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Harga Beli per Unit (Rp)
                        </label>
                        <input
                            type="number"
                            required
                            min={0}
                            value={formData.buy_price}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    buy_price: Number(e.target.value),
                                })
                            }
                            className="mt-1 block w-full border rounded-lg p-2.5"
                        />
                    </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 bg-gray-100 text-gray-800 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
                    >
                        {isPending ? "Menyimpan..." : "Simpan Investasi"}
                    </button>
                </div>
            </form>
        </div>
    );
};
