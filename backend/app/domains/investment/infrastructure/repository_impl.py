import uuid
from sqlalchemy.orm import Session
from datetime import date
from app.domains.investment.domain.repository import InvestmentRepository
from app.domains.investment.domain.entities import InvestmentEntity
from .models import InvestmentModel
from app.domains.finance.infrastructure.models import (
    ExpenseModel,
)


class InvestmentRepositoryImpl(InvestmentRepository):
    def __init__(self, db: Session):
        self.db = db

    def create(self, investment: InvestmentEntity) -> InvestmentEntity:
        db_investment = InvestmentModel(
            id=investment.id,
            user_id=investment.user_id,
            title=investment.title,
            ticker=investment.ticker,
            amount_shares=investment.amount_shares,
            buy_price=investment.buy_price,
            total_capital=investment.total_capital,
            transaction_date=investment.transaction_date,
            status=investment.status,
        )
        self.db.add(db_investment)

        new_expense = ExpenseModel(
            id=str(uuid.uuid4()),
            user_id=investment.user_id,
            type="EXPENSE",
            currency="IDR",
            category="Investasi",
            amount=investment.total_capital,
            title=f"Investasi: {investment.title}",
            transaction_date=investment.transaction_date,
        )
        self.db.add(new_expense)

        self.db.commit()
        return investment

    def get_active_by_user(self, user_id: int) -> list[InvestmentEntity]:
        models = (
            self.db.query(InvestmentModel)
            .filter(
                InvestmentModel.user_id == user_id, InvestmentModel.status == "ACTIVE"
            )
            .all()
        )
        return models

    def find_by_id(self, investment_id: str, user_id: int) -> InvestmentEntity:
        return (
            self.db.query(InvestmentModel)
            .filter(
                InvestmentModel.id == investment_id,
                InvestmentModel.user_id == user_id,
                InvestmentModel.status == "ACTIVE",
            )
            .first()
        )

    def update_status_and_create_return(
        self, investment_model, total_sell_value: float
    ) -> None:
        investment_model.status = "SOLD"

        new_income = ExpenseModel(
            id=str(uuid.uuid4()),
            user_id=investment_model.user_id,
            type="INCOME",
            currency="IDR",
            category="Return Investasi",
            amount=total_sell_value,
            title=f"Jual Aset: {investment_model.title}",
            transaction_date=date.today(),
        )
        self.db.add(new_income)
        self.db.commit()
