import { useMemo } from "react";
import { useHighlightStore } from "../stores/highlight.store";
import { useGetYearHighlights } from "../hooks/useHighlightQueries";

export const HighlightHeatmap = () => {
    const { selectedYear, setSelectedYear } = useHighlightStore();
    const { data, isLoading } = useGetYearHighlights(selectedYear);

    const daysInYear = useMemo(() => {
        const isLeapYear =
            (selectedYear % 4 === 0 && selectedYear % 100 !== 0) ||
            selectedYear % 400 === 0;
        return isLeapYear ? 366 : 365;
    }, [selectedYear]);

    const heatmapMap = useMemo(() => {
        const map = new Map<string, boolean>();
        if (data) {
            data.forEach((item) => map.set(item.date, item.has_highlight));
        }
        return map;
    }, [data]);

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                    Activity Heatmap ({selectedYear})
                </h2>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setSelectedYear(selectedYear - 1)}
                        className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                    >
                        &lt;
                    </button>
                    <button
                        onClick={() => setSelectedYear(selectedYear + 1)}
                        className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                    >
                        &gt;
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="h-32 flex items-center justify-center text-gray-400 animate-pulse">
                    Loading heatmap...
                </div>
            ) : (
                <div className="overflow-x-auto">
                    {/* Grid setup mirip dengan GitHub (7 baris/rows untuk hari dalam seminggu) */}
                    <div className="grid grid-rows-7 grid-flow-col gap-1 w-max">
                        {Array.from({ length: daysInYear }).map((_, index) => {
                            // Menghitung tanggal simulasi secara berurutan untuk mencocokkan dengan API map
                            const dateObj = new Date(
                                selectedYear,
                                0,
                                index + 1,
                            );
                            const dateString = dateObj
                                .toISOString()
                                .split("T")[0];
                            const isActive = heatmapMap.get(dateString);

                            return (
                                <div
                                    key={index}
                                    title={dateString}
                                    className={`w-3 h-3 rounded-sm ${isActive ? "bg-green-500" : "bg-gray-200"}`}
                                />
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
