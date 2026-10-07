import React from "react";

interface Props {
    onAddInvestment: () => void;
}

export const InvestmentHeader: React.FC<Props> = ({ onAddInvestment }) => {
    return (
        <div className="flex items-center justify-between gap-4 border-b pb-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Portofolio Investasi
                </h1>
                <p className="text-gray-600 mt-1">
                    Kelola dan pantau kinerja aset investasi Anda.
                </p>
            </div>
            <button
                onClick={onAddInvestment}
                className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition flex items-center gap-2"
            >
                <span>+</span> Tambah Investasi
            </button>
        </div>
    );
};
