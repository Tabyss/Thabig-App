from sqlalchemy.orm import Session
from sqlalchemy import extract
from typing import List
from app.domains.highlight.domain.entities import (
    HighlightEntity,
    HighlightSummaryEntity,
)
from app.domains.highlight.domain.repository import HighlightRepository
from .models import HighlightModel


class HighlightRepositoryImpl(HighlightRepository):
    def __init__(self, db_session: Session):
        self.db = db_session

    def create(self, highlight: HighlightEntity) -> HighlightEntity:
        db_highlight = HighlightModel(
            id=highlight.id, date=highlight.date, highlight=highlight.highlight, user_id=highlight.user_id
        )
        self.db.add(db_highlight)
        self.db.commit()
        self.db.refresh(db_highlight)
        return highlight

    def get_by_year(self, user_id: str, year: int) -> List[HighlightSummaryEntity]:
        query = self.db.query(HighlightModel.date, HighlightModel.highlight).filter(
            HighlightModel.user_id == user_id
        )

        if year:
            query = query.filter(extract("year", HighlightModel.date) == year)

        db_highlights = query.all()

        return [
            HighlightSummaryEntity(date=row.date, has_highlight=bool(row.highlight))
            for row in db_highlights
        ]

    def get_by_month(
        self, user_id: str, year: int, month: int
    ) -> List[HighlightEntity]:

        db_highlights = (
            self.db.query(HighlightModel)
            .filter(
                HighlightModel.user_id == user_id,
                extract("year", HighlightModel.date) == year,
                extract("month", HighlightModel.date) == month,
            )
            .all()
        )

        return [
            HighlightEntity(
                id=db_item.id,
                user_id=db_item.user_id,
                date=db_item.date,
                highlight=db_item.highlight,
            )
            for db_item in db_highlights
        ]
    def update(self, highlight: HighlightEntity) -> bool:
        db_highlight = (
            self.db.query(HighlightModel)
            .filter(HighlightModel.id == highlight.id, HighlightModel.user_id == highlight.user_id)
            .first()
        )

        if not db_highlight:
            return False

        db_highlight.date = highlight.date
        db_highlight.highlight = highlight.highlight

        self.db.commit()
        return True