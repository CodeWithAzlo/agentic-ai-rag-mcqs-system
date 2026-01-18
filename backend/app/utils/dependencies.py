from fastapi import Depends, HTTPException
from app.utils.jwt import get_current_user
from app.utils.roles import ADMIN, USER

"""
Dependency functions for role-based access control.
FOR ADMIN AND USER ONLY
"""


def admin_only(user=Depends(get_current_user)):
    if user["role"] != ADMIN:
        raise HTTPException(status_code=403, detail="Admin access only")
    return user


def user_only(user=Depends(get_current_user)):
    if user["role"] != USER:
        raise HTTPException(status_code=403, detail="User access only")
    return user
