import { useState } from "react";
import { useGetPortfolio } from "./useInvestmentQueries";
import type { Investment as InvestmentType } from "../types/Investment.type";

export const useInvestmentDashboard = () => {
    const { data: portfolio, isLoading, isError } = useGetPortfolio();
    
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedAssetForSell, setSelectedAssetForSell] = useState<InvestmentType | null>(null);

    const handleOpenAddModal = () => setIsAddModalOpen(true);
    const handleCloseAddModal = () => setIsAddModalOpen(false);

    const handleOpenSellSimulation = (asset: InvestmentType) => setSelectedAssetForSell(asset);
    const handleCloseSellSimulation = () => setSelectedAssetForSell(null);

    return {
        portfolio,
        isLoading,
        isError,
        isAddModalOpen,
        selectedAssetForSell,
        handleOpenAddModal,
        handleCloseAddModal,
        handleOpenSellSimulation,
        handleCloseSellSimulation,
    };
};