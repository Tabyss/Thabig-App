from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .schemas import InvestmentCreate, InvestmentOut, InvestmentSell
from app.domains.investment.infrastructure.repository_impl import InvestmentRepositoryImpl
from app.domains.investment.application.use_cases import InvestmentUseCase
from app.core.database import get_db
from app.domains.users.infrastructure.security import get_current_user

router = APIRouter(prefix="/investments", tags=["Investments"])


def get_investment_use_case(db: Session = Depends(get_db)):
    repo = InvestmentRepositoryImpl(db)
    return InvestmentUseCase(repo)


@router.post("/", response_model=InvestmentOut)
def buy_investment(
    data: InvestmentCreate,
    use_case: InvestmentUseCase = Depends(get_investment_use_case),
    current_user: dict = Depends(get_current_user),
):
    # Retrieve the user ID from the dictionary. 
    # Note: If your JWT payload uses "sub" instead of "id", change this to current_user.get("sub")
    user_id = current_user.get("id") 
    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not found in token")
        
    return use_case.buy_investment(user_id=user_id, data=data)


@router.get("/", response_model=List[InvestmentOut])
def list_active_investments(
    use_case: InvestmentUseCase = Depends(get_investment_use_case),
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not found in token")
        
    return use_case.get_portfolio(user_id=user_id)


@router.post("/{investment_id}/sell")
def sell_investment(
    investment_id: str,
    data: InvestmentSell,
    use_case: InvestmentUseCase = Depends(get_investment_use_case),
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not found in token")
        
    try:
        total_return = use_case.sell_investment(
            investment_id=investment_id,
            user_id=user_id,
            sell_price=data.sell_price,
        )
        return {"message": "Investment sold successfully", "total_return": total_return}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))