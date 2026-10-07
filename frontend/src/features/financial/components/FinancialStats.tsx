import { Text } from "../../../components/Text";
import type { FinancialStatsProps } from "../types/Financial.type";

const FinancialStats: React.FC<FinancialStatsProps> = ({
    spendingLastMonth,
    savingsLastMonth,
}) => {
    return (
        <div className="min-w-90 grid grid-cols-1 gap-4 ">
            <div className="bg-charcoal-50 rounded-2xl p-4 gap-1 flex flex-col justify-between">
                <Text as="p" variant="xs" className="text-charcoal-800">
                    Spending Last Month
                </Text>
                <div className="flex items-end justify-between">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 ">
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                        </svg>
                    </div>
                    <Text as="h3" variant="h3" className="text-charcoal-800">
                        {spendingLastMonth}
                    </Text>
                </div>
            </div>

            <div className="bg-charcoal-50 rounded-2xl p-4 gap-1 flex flex-col justify-between">
                <Text as="p" variant="xs" className="text-charcoal-800">
                    Savings Last Month
                </Text>
                <div className="flex items-end justify-between">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <Text as="h3" variant="h3" className="text-charcoal-800">
                        {savingsLastMonth}
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default FinancialStats;
