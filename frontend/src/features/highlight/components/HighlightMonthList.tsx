import { useGetMonthHighlights } from "../hooks/useHighlightQueries";
import { useHighlightStore } from "../stores/highlight.store";

export const HighlightMonthList = () => {
    const { selectedYear, selectedMonth, setSelectedMonth, openModal } =
        useHighlightStore();
    const { data: monthHighlights, isLoading } = useGetMonthHighlights(
        selectedYear,
        selectedMonth,
    );

    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    return (
        <div className="space-y-4">
            {/* Month Selector */}
            <div className="flex flex-wrap gap-2 mb-4">
                {months.map((month, idx) => (
                    <button
                        key={month}
                        onClick={() => setSelectedMonth(idx + 1)}
                        className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                            selectedMonth === idx + 1
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                        {month}
                    </button>
                ))}
            </div>

            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    Highlights for {months[selectedMonth - 1]} {selectedYear}
                </h3>
                <button
                    onClick={() => openModal()}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                    + Add Highlight
                </button>
            </div>

            {isLoading ? (
                <div className="text-gray-500 animate-pulse">
                    Loading cards...
                </div>
            ) : monthHighlights?.length === 0 ? (
                <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    No highlights for this month.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {monthHighlights?.map((item) => (
                        <div
                            key={item.id}
                            className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                    {item.date}
                                </span>
                                <button
                                    onClick={() => openModal(item)}
                                    className="text-xs text-gray-500 hover:text-blue-600 underline"
                                >
                                    Edit
                                </button>
                            </div>
                            <p className="text-gray-700 text-sm">
                                {item.highlight}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
