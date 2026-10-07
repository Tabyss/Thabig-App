from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.domains.users.api.schemas import UserRegisterRequest, UserLoginRequest, TokenResponse
from app.domains.users.infrastructure.repository_impl import UserRepositoryImpl
from app.domains.users.application.use_cases import RegisterUserUseCase, LoginUserUseCase

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register")
def register(request: UserRegisterRequest, db: Session = Depends(get_db)):
    repo = UserRepositoryImpl(db)
    use_case = RegisterUserUseCase(repo)
    return use_case.execute(request.username, request.email, request.password)

@router.post("/login", response_model=TokenResponse)
def login(request: UserLoginRequest, db: Session = Depends(get_db)):
    repo = UserRepositoryImpl(db)
    use_case = LoginUserUseCase(repo)
    return use_case.execute(request.email, request.password)