import React from "react";
import type { InvestmentPortfolio } from "../types/Investment.type";

interface Props {
    portfolio?: InvestmentPortfolio;
}

export const InvestmentSummary: React.FC<Props> = ({ portfolio }) => {
    if (!portfolio) return null;

    const isTotalProfit = portfolio.total_pl_rp >= 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-2">
                <p className="text-sm text-gray-500 font-medium">
                    Total Nilai Portofolio (Est.)
                </p>
                <p className="text-3xl font-bold">
                    Rp {portfolio.total_portfolio_value_est?.toLocaleString()}
                </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-2">
                <p className="text-sm text-gray-500 font-medium">Total Modal</p>
                <p className="text-3xl font-bold text-gray-700">
                    Rp {portfolio.total_capital?.toLocaleString()}
                </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-2">
                <p className="text-sm text-gray-500 font-medium">Total P/L</p>
                <p
                    className={`text-3xl font-bold ${isTotalProfit ? "text-emerald-500" : "text-rose-500"}`}
                >
                    {isTotalProfit ? "+" : ""}Rp{" "}
                    {portfolio.total_pl_rp?.toLocaleString()}
                    <span className="text-xl ml-2">
                        ({portfolio.total_pl_percentage?.toFixed(2)}%)
                    </span>
                </p>
            </div>
        </div>
    );
};
