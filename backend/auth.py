"""
Authentication helpers - password hashing and JWT token generation
"""

from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt
import os

# Password hashing context - using argon2 instead of bcrypt (better compatibility)
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# JWT settings
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 30  # Long-lived for mobile app offline


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plaintext password against bcrypt hash"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash password with bcrypt"""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    """Create JWT access token"""
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt
