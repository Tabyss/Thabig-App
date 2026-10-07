import uuid
import datetime
from typing import List
from ..domain.entities import HighlightEntity, HighlightSummaryEntity
from ..domain.repository import HighlightRepository


class CreateHighlightUseCase:
    def __init__(self, repository: HighlightRepository):
        self.repository = repository

    def execute(
        self, user_id: int, highlight_text: str, date: datetime.date = None
    ) -> HighlightEntity:
        new_highlight = HighlightEntity(
            id=str(uuid.uuid4()),
            user_id=user_id,
            date=date or datetime.date.today(),
            highlight=highlight_text,
        )
        return self.repository.create(new_highlight)


class GetHighlightsByYearUseCase:
    def __init__(self, repository: HighlightRepository):
        self.repository = repository

    def execute(self, user_id: str, year: int) -> List[HighlightSummaryEntity]:
        return self.repository.get_by_year(user_id=user_id, year=year)


class GetHighlightsByMonthUseCase:
    def __init__(self, repository: HighlightRepository):
        self.repository = repository

    def execute(self, user_id: str, year: int, month: int) -> List[HighlightEntity]:
        return self.repository.get_by_month(user_id=user_id, year=year, month=month)


class UpdateHighlightUseCase:
    def __init__(self, repository: HighlightRepository):
        self.repository = repository

    def execute(
        self, highlight_id: str, user_id: str, highlight_text: str, date: datetime.date
    ) -> bool:
        updated_entity = HighlightEntity(
            id=highlight_id, user_id=user_id, date=date, highlight=highlight_text
        )
        return self.repository.update(updated_entity)
