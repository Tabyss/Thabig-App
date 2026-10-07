from abc import ABC, abstractmethod
from app.domains.users.infrastructure.models import UserModel
from typing import Optional

class UserRepositoryInterface(ABC):
    @abstractmethod
    def create_user(self, username: str, email: str, hashed_password: str) -> UserModel:
        pass

    @abstractmethod
    def get_by_email(self, email: str) -> Optional[UserModel]:
        pass