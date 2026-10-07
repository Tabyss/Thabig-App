from sqlalchemy.orm import Session
from typing import Optional
from app.domains.users.domain.repository import UserRepositoryInterface
from app.domains.users.infrastructure.models import UserModel

class UserRepositoryImpl(UserRepositoryInterface):
    def __init__(self, db: Session):
        self.db = db

    def create_user(self, username: str, email: str, hashed_password: str) -> UserModel:
        db_user = UserModel(username=username, email=email, hashed_password=hashed_password)
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def get_by_email(self, email: str) -> Optional[UserModel]:
        return self.db.query(UserModel).filter(UserModel.email == email).first()