from pydantic import BaseModel, Field
from typing import Optional, List
from decimal import Decimal
from datetime import date, datetime
from app.domains.finance.infrastructure.models import (
    AccountType,
    TransactionType,
    CategoryType,
)


# ==========================
# ACCOUNT
# ==========================
class AccountBase(BaseModel):
    name: str
    type: AccountType
    currency: str = "IDR"


class AccountCreate(AccountBase):
    balance: Decimal = Field(default=0)


class AccountUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[AccountType] = None
    currency: Optional[str] = None
    balance: Optional[Decimal] = Field(default=None)


class AccountResponse(AccountBase):
    id: str
    balance: Decimal
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # Penting: agar Pydantic bisa membaca object SQLAlchemy


# ==========================
# CATEGORY
# ==========================
class CategoryCreate(BaseModel):
    name: str
    type: CategoryType
    icon: Optional[str] = None
    color: Optional[str] = None
    parent_id: Optional[str] = None


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[CategoryType] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    parent_id: Optional[str] = None


class CategoryResponse(CategoryCreate):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


class CategorySummaryItem(BaseModel):
    category_id: str
    category_name: str
    category_color: Optional[str]
    total_count: int
    total_amount: float 

    class Config:
        from_attributes = True

class CategorySummaryResponse(BaseModel):
    categories: List[CategorySummaryItem]
    grand_total_count: int
    grand_total_amount: float


# ==========================
# TRANSACTION
# ==========================
class TransactionCreate(BaseModel):
    account_id: str
    to_account_id: Optional[str] = None
    type: TransactionType
    amount: Decimal = Field(gt=0, description="Amount must be greater than 0")
    currency: str = "IDR"
    category_id: Optional[str] = None
    title: str
    note: Optional[str] = None
    transaction_date: date
    is_recurring: bool = False


class TransactionUpdate(BaseModel):
    account_id: Optional[str] = None
    to_account_id: Optional[str] = None
    type: Optional[TransactionType] = None
    amount: Optional[Decimal] = Field(None, gt=0)
    currency: Optional[str] = None
    category_id: Optional[str] = None
    title: Optional[str] = None
    note: Optional[str] = None
    transaction_date: Optional[date] = None
    is_recurring: Optional[bool] = None


class AccountSummaryResponse(BaseModel):
    id: str
    name: str
    type: AccountType


class TransactionResponse(BaseModel):
    id: str
    user_id: int
    account_id: str
    to_account_id: Optional[str] = None
    type: TransactionType
    amount: Decimal
    currency: str
    category_id: Optional[str]
    title: str
    note: Optional[str]
    transaction_date: date
    is_recurring: bool
    created_at: datetime

    account: AccountSummaryResponse

    class Config:
        from_attributes = True


class TransactionSummaryResponse(BaseModel):
    total_count: int
    total_amount: Decimal

    class Config:
        from_attributes = True

class TransactionSummaryDayItem(BaseModel):
    date: date
    total_amount: Decimal
    total_transactions: int

    class Config:
        from_attributes = True
        
class TransactionSummaryDayResponse(BaseModel):
    message: str = "Success"
    data: List[TransactionSummaryDayItem]