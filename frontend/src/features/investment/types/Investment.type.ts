export interface Investment {
    id: string;
    user_id: number;
    title: string;
    ticker?: string;
    amount_shares: number;
    buy_price: number;
    total_capital: number;
    transaction_date: string;
    status: "ACTIVE" | "SOLD";
}

export type InvestmentCreate = Omit<
    Investment,
    "id" | "user_id" | "total_capital" | "status"
>;

export interface InvestmentPortfolio {
    active_investments: Investment[];
    total_portfolio_value_est: number;
    total_capital: number;
    total_pl_rp: number;
    total_pl_percentage: number;
}
