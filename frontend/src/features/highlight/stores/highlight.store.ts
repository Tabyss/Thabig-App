import { create } from 'zustand';
import type { HighlightMonthItem, HighlightStoreState } from '../types/Highlight.type';

export const useHighlightStore = create<HighlightStoreState>((set) => ({
  selectedYear: new Date().getFullYear(),
  selectedMonth: new Date().getMonth() + 1, // 1 - 12
  isModalOpen: false,
  editData: null,

  setSelectedYear: (year) => set({ selectedYear: year }),
  setSelectedMonth: (month) => set({ selectedMonth: month }),

  openModal: (data?: HighlightMonthItem) => set({ isModalOpen: true, editData: data ?? null }),
  closeModal: () => set({ isModalOpen: false, editData: null }),
}));