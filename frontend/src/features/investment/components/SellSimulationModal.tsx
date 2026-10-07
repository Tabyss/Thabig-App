import React, { useState } from "react";
import type { Investment } from "../types/Investment.type";
import { useSellInvestment } from "../hooks/useInvestmentQueries";

interface Props {
    asset: Investment;
    onClose: () => void;
}

export const SellSimulationModal: React.FC<Props> = ({ asset, onClose }) => {
    const { mutate, isPending } = useSellInvestment();
    const [marketPrice, setMarketPrice] = useState<number | "">("");

    const calculatePL = () => {
        if (marketPrice === "") return { totalValue: 0, rp: 0, percentage: 0 };

        const totalValue = asset.amount_shares * Number(marketPrice);
        const rp = totalValue - asset.total_capital;
        const percentage =
            asset.total_capital > 0 ? (rp / asset.total_capital) * 100 : 0;

        return { totalValue, rp, percentage };
    };

    const pl = calculatePL();
    const isProfit = pl.rp >= 0;

    const handleConfirmSell = () => {
        if (marketPrice === "") return;
        mutate(
            { id: asset.id, sellPrice: Number(marketPrice) },
            {
                onSuccess: () => onClose(),
            },
        );
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-8 rounded-2xl max-w-xl w-full space-y-5 shadow-xl">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold">
                        Simulasi Penjualan: {asset.title}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                </div>

                <p className="text-gray-600">
                    Masukkan harga pasar saat ini untuk menghitung proyeksi
                    untung/rugi.
                </p>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Harga Jual Saat Ini (Rp)
                    </label>
                    <input
                        type="number"
                        required
                        min={0}
                        value={marketPrice}
                        onChange={(e) =>
                            setMarketPrice(
                                e.target.value === ""
                                    ? ""
                                    : Number(e.target.value),
                            )
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-lg p-3 text-lg font-semibold focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Masukkan harga pasar..."
                    />
                </div>

                <div className="bg-gray-50 p-5 rounded-xl space-y-3 border">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Nilai Jual:</span>
                        <span className="text-lg font-semibold">
                            Rp {pl.totalValue.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-3">
                        <span className="text-gray-600 font-medium">
                            Proyeksi Profit / Loss:
                        </span>
                        <span
                            className={`text-2xl font-bold ${isProfit ? "text-emerald-500" : "text-rose-500"}`}
                        >
                            {isProfit ? "+" : ""}Rp {pl.rp.toLocaleString()} (
                            {pl.percentage.toFixed(2)}%)
                        </span>
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
                        type="button"
                        onClick={handleConfirmSell}
                        disabled={isPending || marketPrice === ""}
                        className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
                    >
                        {isPending
                            ? "Memproses..."
                            : "Konfirmasi Penjualan (SOLD)"}
                    </button>
                </div>
            </div>
        </div>
    );
};
