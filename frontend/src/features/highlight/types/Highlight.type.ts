export interface HighlightPayload {
  highlight: string;
  date: string; // YYYY-MM-DD
}

export interface HighlightYearItem {
  date: string;
  has_highlight: boolean;
}

export interface HighlightMonthItem {
  id: string;
  date: string;
  highlight: string;
}

export interface HighlightStoreState {
  selectedYear: number;
  selectedMonth: number;
  isModalOpen: boolean;
  editData: HighlightMonthItem | null;
  
  setSelectedYear: (year: number) => void;
  setSelectedMonth: (month: number) => void;
  openModal: (data?: HighlightMonthItem) => void;
  closeModal: () => void;
}