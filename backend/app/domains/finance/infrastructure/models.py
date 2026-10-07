import enum
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Integer,
    Boolean,
    Date,
    DateTime,
    Numeric,
    Enum,
    ForeignKey,
    Text,
)
from sqlalchemy.orm import relationship
from app.core.database import Base


class AccountType(str, enum.Enum):
    CASH = "CASH"
    BANK = "BANK"
    EWALLET = "EWALLET"
    CREDIT_CARD = "CREDIT_CARD"
    INVESTMENT = "INVESTMENT"


class TransactionType(str, enum.Enum):
    IN = "IN"
    OUT = "OUT"
    TRANSFER = "TRANSFER"


class TransactionStatus(str, enum.Enum):
    COMPLETED = "COMPLETED"
    PENDING = "PENDING"
    CANCELLED = "CANCELLED"


class CategoryType(str, enum.Enum):
    IN = "IN"
    OUT = "OUT"


class RecurringFrequency(str, enum.Enum):
    DAILY = "DAILY"
    WEEKLY = "WEEKLY"
    MONTHLY = "MONTHLY"
    YEARLY = "YEARLY"


class AccountModel(Base):
    __tablename__ = "accounts"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    name = Column(String, index=True, nullable=False)

    type = Column(Enum(AccountType), nullable=False)

    balance = Column(Numeric(15, 2), default=0.00, nullable=False)
    currency = Column(String, default="IDR", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    transactions = relationship(
        "TransactionModel",
        foreign_keys="[TransactionModel.account_id]",
        back_populates="account",
    )


class TransactionModel(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)

    account_id = Column(String, ForeignKey("accounts.id"), index=True, nullable=False)
    to_account_id = Column(String, ForeignKey("accounts.id"), index=True, nullable=True)

    title = Column(String, index=True, nullable=False)
    type = Column(Enum(TransactionType), index=True, nullable=False)

    amount = Column(Numeric(15, 2), nullable=False)
    currency = Column(String, default="IDR", nullable=False)

    category_id = Column(String, ForeignKey("categories.id"), index=True, nullable=True)

    note = Column(Text, nullable=True)
    is_recurring = Column(Boolean, default=False, nullable=False)

    transaction_date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    account = relationship("AccountModel", foreign_keys=[account_id])
    to_account = relationship("AccountModel", foreign_keys=[to_account_id])


class CategoryModel(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    name = Column(String, index=True, nullable=False)

    type = Column(Enum(CategoryType), nullable=False)

    icon = Column(String, nullable=True)
    color = Column(String, nullable=True)

    parent_id = Column(String, ForeignKey("categories.id"), nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    sub_categories = relationship("CategoryModel", backref="parent", remote_side=[id])


class RecurringRuleModel(Base):
    __tablename__ = "recurring_rules"

    id = Column(String, primary_key=True, index=True)

    transaction_id = Column(
        String,
        ForeignKey("transactions.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )

    frequency = Column(Enum(RecurringFrequency), nullable=False)

    next_execution_date = Column(Date, nullable=False)

    end_date = Column(Date, nullable=True)

    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    transaction_template = relationship("TransactionModel")
