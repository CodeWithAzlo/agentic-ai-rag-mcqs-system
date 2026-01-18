from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from app.config import settings
from app.database import (
    users_collection,
)

security = HTTPBearer()

from passlib.context import CryptContext
from datetime import datetime, timedelta

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Hash password function, saving plain password is not secure
def hash_password(password: str):
    return pwd_context.hash(password)


# Verify password function
def verify_password(password, hashed):
    return pwd_context.verify(password, hashed)


"""
token creation function
create_token Function FOR AUTHENTICATION
"""


def create_token(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.now() + timedelta(hours=12)
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


# ------------------------------
#  get_current_user Function FOR AUTHENTICATION
# ------------------------------
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials
    try:
        # Decode JWT token
        payload = jwt.decode(
            token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM]
        )
        email = payload.get("email")
        role = payload.get("role")

        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")

        # Fetch full user from the database
        user = await users_collection.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        # Return the fields needed in frontend
        return {
            "email": user["email"],
            "role": user["role"],
            "name": user.get("name"),  # now name will show correctly
        }

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
