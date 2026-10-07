import React from "react";
import { InvestmentHeader } from "../../features/investment/components/InvestmentHeader";
import { ActiveAssetList } from "../../features/investment/components/ActiveAssetList";
import { AddInvestmentModal } from "../../features/investment/components/AddInvestmentModal";
import { InvestmentSummary } from "../../features/investment/components/InvestmentSummary";
import { SellSimulationModal } from "../../features/investment/components/SellSimulationModal";
import { useInvestmentDashboard } from "../../features/investment/hooks/useInvestment";

export const Investment: React.FC = () => {
    const {
        portfolio,
        isLoading,
        isError,
        isAddModalOpen,
        selectedAssetForSell,
        handleOpenAddModal,
        handleCloseAddModal,
        handleOpenSellSimulation,
        handleCloseSellSimulation,
    } = useInvestmentDashboard();

    if (isLoading) return <div>Loading portfolio...</div>;
    if (isError) return <div>Error loading portfolio.</div>;

    return (
        <div className="bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 antialiased min-h-screen">
            <InvestmentHeader onAddInvestment={handleOpenAddModal} />

            <InvestmentSummary portfolio={portfolio} />

            <ActiveAssetList
                investments={portfolio?.active_investments || []}
                onSimulateSell={handleOpenSellSimulation}
            />

            <AddInvestmentModal
                isOpen={isAddModalOpen}
                onClose={handleCloseAddModal}
            />

            {selectedAssetForSell && (
                <SellSimulationModal
                    asset={selectedAssetForSell}
                    onClose={handleCloseSellSimulation}
                />
            )}
        </div>
    );
};
