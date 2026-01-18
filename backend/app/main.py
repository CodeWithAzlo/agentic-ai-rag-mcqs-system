from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from app.routes import (
    auth_routes,
    admin_routes,
    user_routes,
    user_dashboard_routes,
    admin_dashboard_routes,
)
from app.database import users_collection
from app.config import settings
from app.utils.jwt import hash_password
from app.utils.roles import ADMIN


@asynccontextmanager
async def lifespan(app: FastAPI):
    admin = await users_collection.find_one({"email": settings.ADMIN_EMAIL})
    if not admin:
        await users_collection.insert_one(
            {
                "email": settings.ADMIN_EMAIL,
                "password": hash_password(settings.ADMIN_PASSWORD),
                "role": ADMIN,
            }
        )
        print("Admin user created")
    else:
        print("Admin user already exists")

    yield


app = FastAPI(title="AI Quiz System", lifespan=lifespan)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# ----------------- CORS -----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- ROUTES -----------------
app.include_router(auth_routes.router)
app.include_router(admin_routes.router)
app.include_router(user_routes.router)
app.include_router(user_dashboard_routes.router)
app.include_router(admin_dashboard_routes.router)
