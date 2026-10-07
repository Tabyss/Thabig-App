from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from typing import List

from .schemas import (
    HighlightCreate,
    HighlightUpdate,
    HighlightResponse,
    HighlightSummaryResponse,
)
from ..infrastructure.repository_impl import HighlightRepositoryImpl
from ..application.use_cases import (
    CreateHighlightUseCase,
    GetHighlightsByYearUseCase,
    GetHighlightsByMonthUseCase,
    UpdateHighlightUseCase,
)
from app.core.database import get_db
from app.domains.users.infrastructure.security import get_current_user

router = APIRouter(prefix="/highlights", tags=["Highlights"])


@router.post("/", response_model=HighlightResponse)
def create_highlight(
    request: HighlightCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    repo = HighlightRepositoryImpl(db)
    use_case = CreateHighlightUseCase(repo)

    return use_case.execute(
        user_id=current_user["id"], highlight_text=request.highlight, date=request.date
    )


@router.get("/year/{year}", response_model=List[HighlightSummaryResponse])
def get_highlights_by_year(
    year: int = Path(..., description="Tahun yang ingin dicari, contoh: 2026"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    repo = HighlightRepositoryImpl(db)
    use_case = GetHighlightsByYearUseCase(repo)
    return use_case.execute(user_id=current_user["id"], year=year)


@router.get("/month/{year}/{month}", response_model=List[HighlightResponse])
def get_highlights_by_month(
    year: int = Path(...),
    month: int = Path(..., ge=1, le=12),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    repo = HighlightRepositoryImpl(db)
    use_case = GetHighlightsByMonthUseCase(repo)
    return use_case.execute(user_id=current_user["id"], year=year, month=month)


@router.put("/{highlight_id}")
def update_highlight(
    highlight_id: str,
    request: HighlightUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    repo = HighlightRepositoryImpl(db)
    use_case = UpdateHighlightUseCase(repo)

    is_success = use_case.execute(
        highlight_id=highlight_id,
        user_id=current_user["id"],
        highlight_text=request.highlight,
        date=request.date,
    )

    if not is_success:
        raise HTTPException(
            status_code=404,
            detail="Highlight tidak ditemukan atau Anda tidak memiliki akses",
        )

    return {"message": "Highlight berhasil diupdate"}
