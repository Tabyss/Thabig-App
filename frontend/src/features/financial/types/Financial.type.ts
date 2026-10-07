export interface FinancialBalanceProps {
    balance: string;
    lastUpdated: string;
    onAddFunds: () => void;
}

export interface ChartCategoryItem {
    name: string;
    count: number;
    total: number;
    color: string;
    percentage: number;
}

export interface FinancialStatsProps {
    spendingLastMonth: string;
    spendingChange: string;
    savingsLastMonth: string;
    savingsProgress: string;
}

export interface TransactionFormData {
    id?: string;
    title: string;
    amount: number;
    currency?: string;
    category: string;
    account?: string;
    note?: string | null;
    is_recurring?: boolean;
    transaction_date: string;
    type: "IN" | "OUT";
}

export interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: TransactionFormData) => void;
    onDelete?: (id: string) => void;
    initialData?: TransactionFormData | null; 
}