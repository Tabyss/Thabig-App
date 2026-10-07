from fastapi import APIRouter, Depends, Query
from datetime import date
from typing import Optional, List
from sqlalchemy.orm import Session

from app.domains.users.infrastructure.security import get_current_user
from app.core.database import get_db

from app.domains.finance.api.schemas import (
    AccountCreate,
    AccountUpdate,
    AccountResponse,
    CategoryCreate,
    CategoryResponse,
    CategorySummaryResponse,
    TransactionCreate,
    TransactionUpdate,
    TransactionType,
    TransactionResponse,
    TransactionSummaryResponse,
    TransactionSummaryDayItem
)
from app.domains.finance.infrastructure.repository_impl import (
    AccountRepositoryImpl,
    CategoryRepositoryImpl,
    TransactionRepositoryImpl,
)
from app.domains.finance.application.use_cases import (
    AccountService,
    CategoryService,
    TransactionService,
)

router = APIRouter(prefix="/api/finance", tags=["Finance"])

# ==========================
# DEPENDENCIES INJECTION
# ==========================
def get_account_service(db: Session = Depends(get_db)) -> AccountService:
    repo = AccountRepositoryImpl(db)
    return AccountService(repo)


def get_category_service(db: Session = Depends(get_db)) -> CategoryService:
    repo = CategoryRepositoryImpl(db)
    return CategoryService(repo)


def get_transaction_service(db: Session = Depends(get_db)) -> TransactionService:
    tx_repo = TransactionRepositoryImpl(db)
    acc_repo = AccountRepositoryImpl(db)
    return TransactionService(tx_repo, acc_repo)


# ==========================
# ENDPOINTS ACCOUNT
# ==========================
@router.post("/accounts", response_model=AccountResponse, status_code=201)
def create_account(
    data: AccountCreate,
    current_user: dict = Depends(get_current_user),
    service: AccountService = Depends(get_account_service),
):
    return service.create_account(current_user["id"], data)

@router.patch("/accounts/{account_id}", response_model=AccountResponse)
def update_account(
    account_id: str,
    data: AccountUpdate,
    current_user: dict = Depends(get_current_user),
    service: AccountService = Depends(get_account_service),
):
    return service.update_account(account_id, current_user["id"], data)

@router.delete("/accounts/{account_id}")
def delete_account(
    account_id: str,
    current_user: dict = Depends(get_current_user),
    service: AccountService = Depends(get_account_service)
):
    return service.delete_account(account_id, current_user["id"])

@router.get("/accounts", response_model=List[AccountResponse])
def get_user_accounts(
    current_user: dict = Depends(get_current_user),
    service: AccountService = Depends(get_account_service),
):
    return service.get_user_accounts(current_user["id"])


# ==========================
# ENDPOINTS CATEGORY
# ==========================
@router.post("/categories", response_model=CategoryResponse, status_code=201)
def create_category(
    data: CategoryCreate,
    current_user: dict = Depends(get_current_user),
    service: CategoryService = Depends(get_category_service),
):
    return service.create_category(current_user["id"], data)

@router.patch("/categories/{category_id}", response_model=CategoryResponse)
def update_account(
    category_id: str,
    data: AccountUpdate,
    current_user: dict = Depends(get_current_user),
    service: AccountService = Depends(get_account_service),
):
    return service.update_account(category_id, current_user["id"], data)

@router.delete("/categories/{category_id}")
def delete_category(
    category_id: str,
    current_user: dict = Depends(get_current_user),
    service: CategoryService = Depends(get_category_service)
):
    return service.delete_category(category_id, current_user["id"])

@router.get("/categories", response_model=List[CategoryResponse])
def get_user_category(
    current_user: dict = Depends(get_current_user),
    service: CategoryService = Depends(get_category_service),
):
    return service.get_user_category(current_user["id"])


# ==========================
# ENDPOINTS TRANSACTION
# ==========================
@router.post("/transactions", response_model=TransactionResponse, status_code=201)
def create_transaction(
    data: TransactionCreate,
    current_user: dict = Depends(get_current_user),
    service: TransactionService = Depends(get_transaction_service),
):
    return service.create_transaction(current_user["id"], data)


@router.patch("/transactions/{transaction_id}", response_model=TransactionResponse)
def update_transaction(
    transaction_id: str,
    data: TransactionUpdate,
    current_user: dict = Depends(get_current_user),
    service: TransactionService = Depends(get_transaction_service),
):
    return service.update_transaction(transaction_id, current_user["id"], data)

@router.delete("/transactions/{transaction_id}")
def delete_transaction(
    transaction_id: str,
    current_user: dict = Depends(get_current_user),
    service: TransactionService = Depends(get_transaction_service)
):
    return service.delete_transaction(transaction_id, current_user["id"])


@router.get("/transactions/all", response_model=List[TransactionResponse])
def get_transactions(
    user_id: int,
    start_date: date = Query(...),
    end_date: date = Query(...),
    category_id: Optional[str] = Query(None),
    type: Optional[TransactionType] = Query(None),
    service: TransactionService = Depends(get_transaction_service),
):
    return service.get_transactions_all(
        user_id, start_date, end_date, category_id, type
    )


@router.get("/transactions/summary", response_model=TransactionSummaryResponse)
def get_transaction_summary(
    user_id: int,
    start_date: date = Query(...),
    end_date: Optional[date] = Query(
        None, description="Isi jika ingin rentang waktu (Range)"
    ),
    category_id: Optional[str] = Query(
        None, description="ID Kategori untuk spesifik pencarian"
    ),
    service: TransactionService = Depends(get_transaction_service),
):
    return service.get_transaction_summary(user_id, start_date, end_date, category_id)


@router.get(
    "/transactions/summary/by-category", response_model=CategorySummaryResponse
)
def get_summary_by_all_categories(
    user_id: int,
    start_date: date = Query(...),
    end_date: Optional[date] = Query(None),
    service: TransactionService = Depends(get_transaction_service),
):
    return service.get_transaction_summary_by_all_categories(
        user_id, start_date, end_date
    )
    
@router.get(
    "/transactions/summary/by-day", response_model=List[TransactionSummaryDayItem]
)
def get_transaction_summary_by_day(
    user_id: int,
    start_date: date = Query(...),
    end_date: Optional[date] = Query(None),
    service: TransactionService = Depends(get_transaction_service),
):
    return service.get_transaction_summary_by_day(
        user_id, start_date, end_date
    )
