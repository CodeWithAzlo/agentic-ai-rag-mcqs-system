from fastapi import APIRouter, HTTPException, Depends
from app.schemas.auth_schema import SignupSchema, LoginSchema
from app.database import users_collection
from app.utils.jwt import hash_password, verify_password, create_token, get_current_user
from app.utils.dependencies import user_only
from app.utils.roles import USER

router = APIRouter(prefix="/auth", tags=["Auth"])

'''
Post /signup register endpoint,
to create new user
'''
@router.post("/signup")
async def signup(data: SignupSchema):
    if await users_collection.find_one({"email": data.email}):
        raise HTTPException(400, "User already exists")

    await users_collection.insert_one(
        {
            "name": data.name,
            "email": data.email,
            "password": hash_password(data.password),
            "role": USER,
        }
    )

    return {"message": "Signup successful"}

'''
post /login login endpoint,
to authenticate user and return JWT token
'''
@router.post("/login")
async def login(data: LoginSchema):
    user = await users_collection.find_one({"email": data.email})
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(401, "Invalid credentials")

    token = create_token({"email": user["email"], "role": user["role"]})
    return {"token": token, "role": user["role"]}

'''
GET /me endpoint,
to get current logged-in user information
'''
@router.get("/me", dependencies=[Depends(user_only)])
async def get_current_user_info(user=Depends(get_current_user)):
    return {"name": user.get("name"), "email": user["email"]}
