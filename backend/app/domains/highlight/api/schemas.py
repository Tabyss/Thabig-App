from pydantic import BaseModel
import datetime
from typing import Optional

# Request Schemas
class HighlightCreate(BaseModel):
    highlight: str
    date: Optional[datetime.date] = None

class HighlightUpdate(BaseModel):
    highlight: str
    date: datetime.date

# Response Schemas
class HighlightResponse(BaseModel):
    id: str
    date: datetime.date
    highlight: str

    class Config:
        from_attributes = True

class HighlightSummaryResponse(BaseModel):
    date: datetime.date
    has_highlight: bool

    class Config:
        from_attributes = True