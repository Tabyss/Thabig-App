export type AccountType =
    | "CASH"
    | "BANK"
    | "EWALLET"
    | "CREDIT_CARD"
    | "INVESTMENT";
export type CategoryType = "IN" | "OUT";
export type TransactionType = "IN" | "OUT" | "TRANSFER";

// ==========================================
// ACCOUNTS TYPES
// ==========================================
export interface AccountCreate {
    name: string;
    type: AccountType;
    currency?: string;
    balance?: number | string;
}

export interface AccountUpdate {
    name?: string | null;
    type?: AccountType | null;
    currency?: string | null;
    balance?: number | string | null;
}

export interface AccountResponse {
    id: string;
    name: string;
    type: AccountType;
    currency: string;
    balance: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface AccountSummaryResponse {
    id: string;
    name: string;
    type: AccountType;

}

// ==========================================
// CATEGORIES TYPES
// ==========================================
export interface CategoryCreate {
    name: string;
    type: CategoryType;
    icon?: string | null;
    color?: string | null;
    parent_id?: string | null;
}

export interface CategoryItemResponse {
    category_id: string;
    category_name: string;
    category_color: string;
    total_count: number;
    total_amount: number;
}

export interface CategoryCountResponse {
    category: CategoryItemResponse[];
    totalCategory: number;
    totalValue: number;
}

// ==========================================
// TRANSACTIONS TYPES
// ==========================================
export interface TransactionCreate {
    account_id: string;
    to_account_id?: string | null;
    type: TransactionType;
    amount: number | string;
    currency?: string;
    category_id?: string | null;
    title: string;
    note?: string | null;
    transaction_date: string;
    is_recurring?: boolean;
}

export interface TransactionUpdate {
    account_id?: string | null;
    to_account_id?: string | null;
    type?: TransactionType | null;
    amount?: number | string | null;
    currency?: string | null;
    category_id?: string | null;
    title?: string | null;
    note?: string | null;
    transaction_date?: string | null;
    is_recurring?: boolean | null;
}

export interface TransactionResponse {
    account: AccountSummaryResponse
    id: string;
    title: string;
    amount: number;
    category_id: string;
    account_id: string;
    to_account_id: string;
    transaction_date: string;
    note: string;
    type: "IN" | "OUT";
}
