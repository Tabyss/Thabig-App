import { create } from 'zustand';
import type { Investment } from '../types/Investment.type';

interface InvestmentState {
  isAddModalOpen: boolean;
  selectedAssetForSell: Investment | null;
  openAddModal: () => void;
  closeAddModal: () => void;
  openSellModal: (asset: Investment) => void;
  closeSellModal: () => void;
}

export const useInvestmentStore = create<InvestmentState>((set) => ({
  isAddModalOpen: false,
  selectedAssetForSell: null,
  openAddModal: () => set({ isAddModalOpen: true }),
  closeAddModal: () => set({ isAddModalOpen: false }),
  openSellModal: (asset) => set({ selectedAssetForSell: asset }),
  closeSellModal: () => set({ selectedAssetForSell: null }),
}));