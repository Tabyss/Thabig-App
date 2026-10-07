import React from "react";
import type { Investment } from "../types/Investment.type";

interface Props {
    investments: Investment[];
    onSimulateSell: (asset: Investment) => void;
}

export const ActiveAssetList: React.FC<Props> = ({
    investments,
    onSimulateSell,
}) => {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Aset Aktif</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {investments.map((asset) => (
                    <div
                        key={asset.id}
                        className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col justify-between gap-4"
                    >
                        <div>
                            <h3 className="text-lg font-bold">
                                {asset.title}{" "}
                                {asset.ticker && `(${asset.ticker})`}
                            </h3>
                            <p className="text-sm text-gray-500">
                                Dibeli: {asset.transaction_date}
                            </p>
                            <div className="text-gray-600 mt-3 space-y-1 text-sm">
                                <p>
                                    Unit/Lot:{" "}
                                    <span className="font-medium text-gray-800">
                                        {asset.amount_shares}
                                    </span>
                                </p>
                                <p>
                                    Harga Beli:{" "}
                                    <span className="font-medium text-gray-800">
                                        Rp {asset.buy_price.toLocaleString()}
                                    </span>
                                </p>
                                <p className="text-base mt-2">
                                    Modal:{" "}
                                    <span className="font-semibold text-gray-900">
                                        Rp{" "}
                                        {asset.total_capital.toLocaleString()}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => onSimulateSell(asset)}
                            className="w-full bg-blue-50 text-blue-700 py-2.5 rounded-lg font-medium hover:bg-blue-100 transition"
                        >
                            Simulasi / Jual
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
