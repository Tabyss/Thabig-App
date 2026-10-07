import React, { useMemo } from "react";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    type TooltipItem,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useFinanceStore } from "../stores/financial.store";
import {
    useGetSummaryByCategory,
} from "../hooks/useFinanceQueries"; // Sesuaikan import API terbaru
import type { ChartCategoryItem } from "../types/Financial.type";
import { Text } from "../../../components/Text";
import type { CategoryItemResponse } from "../types/useFinanceQueries.types";

ChartJS.register(ArcElement, Tooltip, Legend);

const CHART_COLORS: string[] = [
    "#6366f1",
    "#10b981",
    "#f59e0b",
    "#f43f5e",
    "#8b5cf6",
    "#0ea5e9",
    "#ec4899",
    "#14b8a6",
];

const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(amount);
};

const FinancialSpendingChart: React.FC = () => {
    const { year, month, setYear, setMonth } = useFinanceStore();

    const user_id = 1
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${String(month).padStart(2, "0")}-${lastDay}`;

    const { data, isLoading } = useGetSummaryByCategory({
        user_id,
        start_date: startDate,
        end_date: endDate,
    });



    const selectedDateValue = `${year}-${String(month).padStart(2, "0")}`;

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!value) return;

        const [selectedYear, selectedMonth] = value.split("-").map(Number);
        if (setYear) setYear(selectedYear);
        if (setMonth) setMonth(selectedMonth);
    };

    const { categories, totalValueFormatted } = useMemo(() => {
        if (!data || data.categories.length === 0)
            return {
                categories: [] as ChartCategoryItem[],
                totalValueFormatted: "Rp 0",
            };

        const totalValue = data.grand_total_amount || 0;

        const mappedCategories: ChartCategoryItem[] = data?.categories.map(
            (item: CategoryItemResponse, idx: number) => ({
                name: item.category_name,
                count: item.total_count,
                total: item.total_amount,
                color: CHART_COLORS[idx % CHART_COLORS.length],
                percentage:
                    totalValue > 0
                        ? Math.round((item.total_amount / totalValue) * 100)
                        : 0,
            }),
        );

        mappedCategories.sort((a, b) => b.total - a.total);

        return {
            categories: mappedCategories,
            totalValueFormatted: formatRupiah(totalValue),
        };
    }, [data]);

    const chartData = {
        labels: categories.map((cat) => cat.name),
        datasets: [
            {
                data: categories.map((cat) => cat.percentage),
                backgroundColor: categories.map((cat) => cat.color),
                borderColor: "#EFF3F6",
                borderWidth: 2,
                cutout: "75%",
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: "#131B20",
                titleColor: "#f1f5f9",
                bodyColor: "#cbd5e1",
                padding: 12,
                borderColor: "#EFF3F6",
                borderWidth: 1,
                callbacks: {
                    label: function (context: TooltipItem<"doughnut">) {
                        const index = context.dataIndex;
                        const cat = categories[index];
                        return ` ${cat.name}: ${formatRupiah(cat.total)} (${cat.percentage}%)`;
                    },
                },
            },
        },
    };

    return (
        <div className="mb-6">
            <div className="py-1 px-3 bg-charcoal-50 rounded-2xl mb-4 flex items-center justify-between">
                <Text as="h4" variant="pBold" className="text-charcoal-800">
                    Spending by Category
                </Text>

                <input
                    type="month"
                    value={selectedDateValue}
                    onChange={handleDateChange}
                    className="text-charcoal-800 text-base font-bold rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-steel-500 cursor-pointer"
                />
            </div>

            <div className="w-full bg-charcoal-50 rounded-2xl p-6 flex flex-col justify-between h-max">
                {isLoading ? (
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 my-2 animate-pulse">
                        <div className="w-48 h-48 sm:w-56 sm:h-56 shrink-0 rounded-full bg-slate-800"></div>
                        <div className="w-full space-y-3 md:border-l md:border-slate-800/80 md:pl-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="h-5 bg-slate-800 rounded w-full"
                                ></div>
                            ))}
                        </div>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 sm:h-56 text-slate-400">
                        <Text as="h4" variant="h4" color="muted">
                            Tidak ada transaksi bulan ini
                        </Text>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-between gap-2 my-2">
                        <div className="relative w-48 h-48 sm:w-56 sm:h-56 shrink-0 flex items-center justify-center">
                            <Doughnut data={chartData} options={chartOptions} />

                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2">
                                <span className="text-base sm:text-lg font-black text-charcoal-900 truncate max-w-40">
                                    {totalValueFormatted}
                                </span>
                                <Text
                                    as="p"
                                    variant="xs"
                                    className="text-charcoal-300 mt-0.5"
                                >
                                    Total Amount
                                </Text>
                            </div>
                        </div>

                        <div className="w-full flex flex-col space-y-3 md:pl-6 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                            <Text
                                as="p"
                                variant="pBold"
                                className="mb-3 pb-2 sticky top-0 text-charcoal-900 bg-charcoal-50"
                            >
                                Breakdown
                            </Text>
                            {categories.map((cat, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-2.5 overflow-hidden">
                                        <span
                                            className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                                            style={{
                                                backgroundColor: cat.color,
                                            }}
                                        ></span>
                                        <Text
                                            as="p"
                                            variant="sm"
                                            className="text-charcoal-500"
                                        >
                                            {cat.name}
                                        </Text>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <Text
                                            as="p"
                                            variant="sm"
                                            className="text-charcoal-700"
                                        >
                                            {formatRupiah(cat.total)}
                                        </Text>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FinancialSpendingChart;