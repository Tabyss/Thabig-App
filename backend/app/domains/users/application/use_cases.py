from fastapi import HTTPException, status
from app.domains.users.domain.repository import UserRepositoryInterface
from app.domains.users.infrastructure.security import hash_password, verify_password, create_access_token

class RegisterUserUseCase:
    def __init__(self, repository: UserRepositoryInterface):
        self.repository = repository

    def execute(self, username: str, email: str, password: str):
        # Cek apakah email sudah terdaftar
        existing_user = self.repository.get_by_email(email)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email sudah terdaftar.")
        
        hashed = hash_password(password)
        user = self.repository.create_user(username, email, hashed)
        return {"message": "Registrasi berhasil", "user_id": user.id}

class LoginUserUseCase:
    def __init__(self, repository: UserRepositoryInterface):
        self.repository = repository

    def execute(self, email: str, password: str):
        user = self.repository.get_by_email(email)
        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email atau password salah",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Buat token JWT
        access_token = create_access_token(data={"sub": user.email, "id": user.id})
        return {"access_token": access_token, "token_type": "bearer"}