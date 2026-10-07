from pydantic import BaseModel
from datetime import date
from typing import Optional


class InvestmentCreate(BaseModel):
    title: str
    ticker: Optional[str] = None
    amount_shares: float
    buy_price: float
    transaction_date: date


class InvestmentSell(BaseModel):
    sell_price: float


class InvestmentOut(InvestmentCreate):
    id: str
    total_capital: float
    status: str

    class Config:
        from_attributes = True
