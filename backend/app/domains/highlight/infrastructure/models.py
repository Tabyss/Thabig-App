import datetime
from sqlalchemy import Column, String, Float, Date, Integer
from app.core.database import Base

class HighlightModel(Base):
    __tablename__ = "highlight"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    date = Column(Date, index=True, nullable=False, default=datetime.date.today)
    highlight = Column(String, nullable=False)