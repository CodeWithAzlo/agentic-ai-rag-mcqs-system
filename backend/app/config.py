from dotenv import load_dotenv
import os

load_dotenv()

"""
Settings class to manage configuration using environment variables.
load_dotenv() is called to load variables from a .env file.
"""


class Settings:
    MONGO_URI = os.getenv("MONGO_URI")
    DB_NAME = os.getenv("DB_NAME")
    JWT_SECRET = os.getenv("JWT_SECRET")
    JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
    OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
    ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")
    ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")


settings = Settings()
