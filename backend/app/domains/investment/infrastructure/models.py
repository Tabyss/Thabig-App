import uuid
from sqlalchemy import Column, String, Float, Integer, Date
from app.domains.finance.infrastructure.models import Base


class InvestmentModel(Base):
    __tablename__ = "investments"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(Integer, index=True, nullable=False)
    title = Column(String, nullable=False)
    ticker = Column(String, nullable=True)
    amount_shares = Column(Float, nullable=False)
    buy_price = Column(Float, nullable=False)
    total_capital = Column(Float, nullable=False)
    transaction_date = Column(Date, nullable=False)
    status = Column(String, default="ACTIVE")
