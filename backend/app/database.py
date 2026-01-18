from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

'''
Database connection and collection definitions using Motor (asynchronous MongoDB driver).
'''

client = AsyncIOMotorClient(settings.MONGO_URI)
db = client[settings.DB_NAME]

users_collection = db.users
quiz_collection = db.quizzes
result_collection = db.results
