import uuid
from app.domains.investment.domain.entities import InvestmentEntity
from app.domains.investment.domain.repository import InvestmentRepository
from app.domains.investment.api.schemas import InvestmentCreate


class InvestmentUseCase:
    def __init__(self, repository: InvestmentRepository):
        self.repository = repository

    def buy_investment(self, user_id: int, data: InvestmentCreate) -> InvestmentEntity:
        total_capital = data.amount_shares * data.buy_price

        entity = InvestmentEntity(
            id=str(uuid.uuid4()),
            user_id=user_id,
            title=data.title,
            ticker=data.ticker,
            amount_shares=data.amount_shares,
            buy_price=data.buy_price,
            total_capital=total_capital,
            transaction_date=data.transaction_date,
            status="ACTIVE",
        )
        return self.repository.create(entity)

    def get_portfolio(self, user_id: int):
        return self.repository.get_active_by_user(user_id)

    def sell_investment(self, investment_id: str, user_id: int, sell_price: float):
        investment = self.repository.find_by_id(investment_id, user_id)
        if not investment:
            raise ValueError("Investment not found or already sold")

        total_sell_value = investment.amount_shares * sell_price
        self.repository.update_status_and_create_return(investment, total_sell_value)
        return total_sell_value
