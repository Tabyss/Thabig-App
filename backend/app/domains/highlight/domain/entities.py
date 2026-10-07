import datetime
from dataclasses import dataclass, field
import uuid

@dataclass(frozen=True)
class HighlightEntity:
    user_id: int  
    date: datetime.date
    highlight: str
    id: str = field(default_factory=lambda: str(uuid.uuid4()))


@dataclass(frozen=True)
class HighlightSummaryEntity:
    date: datetime.date
    has_highlight: bool