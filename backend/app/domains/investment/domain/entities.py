from dataclasses import dataclass
from datetime import date
from typing import Optional


@dataclass
class InvestmentEntity:
    id: str
    user_id: int
    title: str
    amount_shares: float
    buy_price: float
    total_capital: float
    transaction_date: date
    status: str
    ticker: Optional[str] = None
