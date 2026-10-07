import { useState, useMemo } from "react";
import { useAuthStore } from "../../../shared/stores/user.store";
import { useGetSummaryByDay } from "../hooks/useFinanceQueries";

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(amount);
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const getDateRange = (filter: "week" | "month" | "year") => {
    const end = new Date();
    const start = new Date();

    if (filter === "week") {
        start.setDate(end.getDate() - 7);
    } else if (filter === "month") {
        start.setMonth(end.getMonth() - 1);
    } else if (filter === "year") {
        start.setFullYear(end.getFullYear() - 1);
    }

    const formatDateString = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    return {
        start_date: formatDateString(start),
        end_date: formatDateString(end),
    };
};

const FinancialDailyTransaction = () => {
    const [activeFilter, setActiveFilter] = useState<"week" | "month" | "year">(
        "week",
    );
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const user = useAuthStore((state: any) => state.user);
    const userId = user?.id || 1;

    const { start_date, end_date } = useMemo(
        () => getDateRange(activeFilter),
        [activeFilter],
    );

    const { data: apiData = [], isLoading } = useGetSummaryByDay({
        user_id: userId,
        start_date: start_date,
        end_date: end_date,
    });

    const allDates = useMemo(() => {
        const dates = [];
        let currentDate = new Date(start_date);
        const lastDate = new Date(end_date);

        while (currentDate <= lastDate) {
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, "0");
            const day = String(currentDate.getDate()).padStart(2, "0");
            dates.push(`${year}-${month}-${day}`);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    }, [start_date, end_date]);

    const chartData = useMemo(() => {
        return allDates.map((dateStr) => {
            const foundData = apiData.find((d: any) => d.date === dateStr);
            return {
                date: dateStr,
                total_amount: foundData ? Number(foundData.total_amount) : 0,
                total_transactions: foundData
                    ? Number(
                          foundData.total_transactions ||
                              foundData.count_transaction ||
                              0,
                      )
                    : 0,
            };
        });
    }, [allDates, apiData]);

    const maxTransaction = Math.max(
        ...chartData.map((d: any) => d.total_transactions),
        1,
    );

    const points = chartData.map((d: any, index: number) => {
        const x =
            chartData.length > 1 ? (index / (chartData.length - 1)) * 100 : 50;
        const y = 90 - (d.total_transactions / maxTransaction) * 80;
        return { ...d, x, y };
    });

    const linePath =
        points.length > 0
            ? points
                  .map(
                      (p: any, i: number) =>
                          `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`,
                  )
                  .join(" ")
            : "";

    const areaPath = points.length > 0 ? `${linePath} L 100 100 L 0 100 Z` : "";
    const hoveredPoint = hoveredIndex !== null ? points[hoveredIndex] : null;

    return (
        <div className="bg-charcoal-900 rounded-2xl p-4 md:p-5 flex flex-col gap-4 w-full relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                    <h3 className="text-charcoal-100 font-bold text-base">
                        Daily Transactions
                    </h3>
                </div>

                <div className="flex items-center gap-2 bg-charcoal-800/50 p-1 rounded-lg w-max">
                    {(["week", "month", "year"] as const).map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-1.5 rounded-md text-xs font-semibold capitalize transition-all ${
                                activeFilter === filter
                                    ? "bg-charcoal-700 text-white shadow-sm"
                                    : "text-charcoal-400 hover:text-charcoal-200"
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Menampilkan Status Loading / Chart */}
            {isLoading ? (
                <div className="w-full h-32 mt-4 flex items-center justify-center text-charcoal-400 text-sm">
                    Memuat data...
                </div>
            ) : (
                <div className="w-full h-32 mt-4 relative group">
                    <svg
                        className="absolute inset-0 w-full h-full overflow-visible"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                    >
                        <defs>
                            <linearGradient
                                id="chartGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="#10b981"
                                    stopOpacity="0.4"
                                />
                                <stop
                                    offset="100%"
                                    stopColor="#10b981"
                                    stopOpacity="0"
                                />
                            </linearGradient>
                        </defs>

                        <path d={areaPath} fill="url(#chartGradient)" />

                        {/* Garis utama */}
                        <path
                            d={linePath}
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>

                    {/* Garis Vertikal Penanda Saat Hover */}
                    {hoveredPoint && (
                        <div
                            className="absolute top-0 bottom-0 border-l border-dashed border-charcoal-600 pointer-events-none"
                            style={{ left: `${hoveredPoint.x}%` }}
                        />
                    )}

                    {/* Titik (Dot) Saat Hover */}
                    {hoveredPoint && (
                        <div
                            className="absolute w-3 h-3 bg-palm-500 rounded-full border-2 border-charcoal-900 pointer-events-none shadow-sm transition-all transform -translate-x-1/2 -translate-y-1/2"
                            style={{
                                left: `${hoveredPoint.x}%`,
                                top: `${hoveredPoint.y}%`,
                            }}
                        />
                    )}

                    {/* Overlay Kolom Interaktif (Invisible) */}
                    <div className="absolute inset-0 flex w-full h-full">
                        {points.map((_, index) => (
                            <div
                                key={index}
                                className="flex-1 h-full cursor-crosshair z-10"
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            />
                        ))}
                    </div>

                    {/* Tooltip Content */}
                    {hoveredPoint && (
                        <div
                            className="absolute bottom-full mb-3 pointer-events-none z-20"
                            style={{
                                left:
                                    hoveredPoint.x < 10
                                        ? "0%"
                                        : hoveredPoint.x > 90
                                          ? "auto"
                                          : `${hoveredPoint.x}%`,
                                right: hoveredPoint.x > 90 ? "0%" : "auto",
                                transform:
                                    hoveredPoint.x > 10 && hoveredPoint.x < 90
                                        ? "translateX(-50%)"
                                        : "none",
                            }}
                        >
                            <div className="bg-charcoal-800 border border-charcoal-700 p-3 rounded-xl shadow-lg w-max min-w-32.5">
                                <p className="text-charcoal-300 text-[10px] font-medium mb-1">
                                    {formatDate(hoveredPoint.date)}
                                </p>
                                {/* Update: Karena grafik menunjukkan jumlah transaksi, posisi diletakkan paling atas & di-bold */}
                                <p className="text-palm-300 font-bold text-sm">
                                    {hoveredPoint.total_transactions} Transaksi
                                </p>
                                <p className="text-charcoal-400 text-[11px] mt-1">
                                    {formatCurrency(hoveredPoint.total_amount)}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FinancialDailyTransaction;
