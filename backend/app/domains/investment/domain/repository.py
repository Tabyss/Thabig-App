from abc import ABC, abstractmethod
from typing import List
from .entities import InvestmentEntity


class InvestmentRepository(ABC):
    @abstractmethod
    def create(self, investment: InvestmentEntity) -> InvestmentEntity:
        pass

    @abstractmethod
    def get_active_by_user(self, user_id: int) -> List[InvestmentEntity]:
        pass

    @abstractmethod
    def find_by_id(self, investment_id: str, user_id: int) -> InvestmentEntity:
        pass

    @abstractmethod
    def update_status_and_create_return(
        self, investment: InvestmentEntity, total_sell_value: float
    ) -> None:
        pass
