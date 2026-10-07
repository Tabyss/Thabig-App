from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import jwt
from passlib.context import CryptContext
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Muat variabel dari file .env
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "fallback_secret_key_jika_env_kosong")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # Token berlaku 24 jam

# Konfigurasi enkripsi password
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security_scheme = HTTPBearer()

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security_scheme)):
    token = credentials.credentials
    try:
        # Dekode token menggunakan SECRET_KEY dari .env
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email: str = payload.get("sub")
        user_id: int = payload.get("id")
        
        if user_email is None or user_id is None:
            raise HTTPException(status_code=401, detail="Token autentikasi tidak valid")
            
        return {"id": user_id, "email": user_email}
    
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token kedaluwarsa atau tidak valid",
            headers={"WWW-Authenticate": "Bearer"},
        )