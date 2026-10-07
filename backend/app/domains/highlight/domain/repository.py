from abc import ABC, abstractmethod
from typing import Optional, List
from .entities import HighlightEntity, HighlightSummaryEntity


class HighlightRepository(ABC):
    @abstractmethod
    def create(self, highlight: HighlightEntity) -> HighlightEntity:
        pass

    @abstractmethod
    def get_by_year(self, user_id: str, year: int) -> List[HighlightSummaryEntity]:
        pass

    @abstractmethod
    def get_by_month(
        self, highlight_id: str, user_id: str
    ) -> Optional[HighlightEntity]:
        pass

    @abstractmethod
    def update(self, highlight: HighlightEntity) -> HighlightEntity:
        pass
