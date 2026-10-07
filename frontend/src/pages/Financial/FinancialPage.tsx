import FinancialBalance from "../../features/financial/components/FinancialBalance";
import FinancialDailyTransaction from "../../features/financial/components/FinancialDailyTransaction";
import FinancialSpendingChart from "../../features/financial/components/FinancialSpendingChart";
import FinancialStats from "../../features/financial/components/FinancialStats";
import FinancialTransactionHistory from "../../features/financial/components/FinancialTransactionHistory";
import { useGetAccounts } from "../../features/financial/hooks/useFinanceQueries";
import { useFinancial } from "../../features/financial/hooks/useFinancial";

function Financial() {
    const {
        summaryData,
        handleTransactionClick,
        formatRupiah,
        handleAddFunds,
    } = useFinancial();

    const { data: accounts, isLoading: isAccountsLoading } = useGetAccounts();

    return (
        <div className="md:grid md:grid-cols-20 gap-4">
            <div className="w-full h-full flex flex-col md:col-span-6 gap-6">
                <FinancialBalance
                    accounts={accounts}
                    onAddAccount={() => console.log("Open Add Account Modal")}
                    onAddFunds={handleAddFunds}
                    isLoading={isAccountsLoading}
                />
                <FinancialSpendingChart />
            </div>
            <div className=" flex flex-col gap-6 col-span-14">
                <div className="flex flex-col md:flex-row gap-4">
                    <FinancialDailyTransaction />

                    <FinancialStats
                        spendingLastMonth={formatRupiah(
                            summaryData?.spending_last_month,
                        )}
                        savingsLastMonth={formatRupiah(
                            summaryData?.saving_last_month,
                        )}
                        spendingChange="Bulan ini"
                        savingsProgress="Bulan ini"
                    />
                </div>
                <FinancialTransactionHistory
                    onTransactionClick={handleTransactionClick}
                />
            </div>
            <div className="mx-auto space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className=" h-full lg:col-span-6 space-y-6 flex flex-col">
                        {/* <FinancialHeader /> */}

                        <div className="flex flex-col sm:flex-row lg:flex-col gap-6 justify-between">
                            <div className="w-full"></div>
                        </div>
                    </div>

                    <div className="lg:col-span-6"></div>
                </div>
            </div>
        </div>
    );
}

export default Financial;
