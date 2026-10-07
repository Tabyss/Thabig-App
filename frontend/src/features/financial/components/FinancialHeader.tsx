import React from "react";
import { format } from "date-fns";
import { useFinanceStore } from "../stores/financial.store";
import { Text } from "../../../components/Text";

const FinancialHeader = () => {
    const { month, setMonth, year, setYear } = useFinanceStore();

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value) {
            const [selectedYear, selectedMonth] = value.split("-");
            setYear(parseInt(selectedYear, 10));
            setMonth(parseInt(selectedMonth, 10));
        }
    };

    const currentDate = new Date(year, month - 1);

    const displayDate = format(currentDate, "MMMM yyyy");

    const inputValue = format(currentDate, "yyyy-MM");

    return (
        <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
                <Text as="h2" variant="h2" color="default">
                    Financial Management
                </Text>
            </div>
            <div className="flex w-full sm:w-max items-center gap-3">
                <div className="relative w-full sm:w-max overflow-hidden flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 text-slate-300 px-4 py-2 rounded-xl text-sm font-medium border border-slate-700/60 shadow-sm cursor-pointer transition">
                    <Text as="p" variant="sm" color="default">
                        {displayDate}
                    </Text>
                </div>
                <div className="relative overflow-hidden flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 text-slate-300 px-4 py-2 rounded-xl text-sm font-medium border border-slate-700/60 shadow-sm cursor-pointer transition">
                    <input
                        type="month"
                        value={inputValue}
                        onChange={handleDateChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        title="Pilih Bulan & Tahun"
                    />
                    <svg
                        className="w-4 h-4 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                </div>
            </div>
        </header>
    );
};

export default FinancialHeader;
