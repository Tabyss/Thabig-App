import { create } from "zustand";

export interface FinanceState {
  year: number;
  month: number;
  setYear: (year: number) => void;
  setMonth: (month: number) => void;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  setYear: (year) => set({ year }),
  setMonth: (month) => set({ month }),
}));