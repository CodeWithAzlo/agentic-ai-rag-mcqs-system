from fastapi import APIRouter, Depends, HTTPException
from app.database import users_collection, result_collection
from app.utils.dependencies import admin_only

router = APIRouter(prefix="/admin/dashboard", tags=["AdminDashboard"])

"""
GET /users endpoint,
to get all users with their quiz attempt statistics
"""


@router.get("/users", dependencies=[Depends(admin_only)])
async def get_all_users():
    users = []

    async for user in users_collection.find({"role": {"$ne": "ADMIN"}}):
        results = []
        async for r in result_collection.find({"email": user["email"]}):
            results.append(
                {
                    "subject": r["subject"],
                    "score": r["score"],
                    "total": r["total"],
                    "percentage": r.get("percentage", 0),
                    "grade": r.get("grade", "N/A"),
                    "attempted_on": r.get("attempted_on"),
                }
            )

        users.append(
            {
                "id": str(user["_id"]),
                "name": user.get("name"),
                "email": user["email"],
                "total_attempts": len(results),
                "results": results,
            }
        )

    return {"total_users": len(users), "users": users}


"""
GET /users/{user_id} endpoint,
to get detailed information of a specific user along with their quiz attempts
"""


@router.get("/users/{user_id}", dependencies=[Depends(admin_only)])
async def get_user_detail(user_id: str):
    from bson import ObjectId

    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(404, "User not found")

    results = []
    async for r in result_collection.find({"email": user["email"]}):
        results.append(
            {
                "subject": r["subject"],
                "score": r["score"],
                "total": r["total"],
                "percentage": r.get("percentage", 0),
                "grade": r.get("grade", "N/A"),
                "attempted_on": r.get("attempted_on"),
            }
        )

    return {
        "id": str(user["_id"]),
        "name": user.get("name"),
        "email": user["email"],
        "total_attempts": len(results),
        "results": results,
    }


"""
DELETE /users/{user_id} endpoint,
to delete a user and all their quiz results also deleted when object user delete
"""


@router.delete("/users/{user_id}", dependencies=[Depends(admin_only)])
async def delete_user(user_id: str):
    from bson import ObjectId

    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(404, "User not found")

    # delete results first
    await result_collection.delete_many({"email": user["email"]})

    # delete user
    await users_collection.delete_one({"_id": ObjectId(user_id)})

    return {"message": "User and related results deleted successfully"}


@router.get("/stats/overall", dependencies=[Depends(admin_only)])
async def overall_statistics():
    total_attempts = 0
    total_score = 0
    total_possible = 0
    passed = 0

    async for r in result_collection.find():
        total_attempts += 1
        total_score += r["score"]
        total_possible += r["total"]

        percentage = r.get("percentage", 0)
        if percentage >= 40:
            passed += 1

    avg_percentage = (total_score / total_possible) * 100 if total_possible else 0
    pass_rate = (passed / total_attempts) * 100 if total_attempts else 0

    return {
        "total_attempts": total_attempts,
        "average_percentage": round(avg_percentage, 2),
        "pass_rate": round(pass_rate, 2),
    }


"""
GET /stats/top-performers endpoint,
to get top performers based on average quiz scores
"""


@router.get("/stats/top-performers", dependencies=[Depends(admin_only)])
async def top_performers(limit: int = 5):
    user_stats = {}

    async for r in result_collection.find():
        email = r["email"]
        user_stats.setdefault(email, {"total": 0, "count": 0})
        user_stats[email]["total"] += r.get("percentage", 0)
        user_stats[email]["count"] += 1

    leaderboard = []

    for email, data in user_stats.items():
        avg = data["total"] / data["count"]
        user = await users_collection.find_one({"email": email})

        if user:
            leaderboard.append(
                {
                    "name": user.get("name"),
                    "email": email,
                    "average_percentage": round(avg, 2),
                    "attempts": data["count"],
                }
            )

    leaderboard.sort(key=lambda x: x["average_percentage"], reverse=True)

    return {"top_performers": leaderboard[:limit]}


"""
GET /stats/subjects endpoint,
to get subject-wise quiz performance analytics
"""


@router.get("/stats/subjects", dependencies=[Depends(admin_only)])
async def subject_wise_analytics():
    subjects = {}

    async for r in result_collection.find():
        subject = r["subject"]
        subjects.setdefault(subject, {"score": 0, "total": 0, "count": 0})

        subjects[subject]["score"] += r["score"]
        subjects[subject]["total"] += r["total"]
        subjects[subject]["count"] += 1

    analytics = []

    for subject, data in subjects.items():
        avg_percentage = (data["score"] / data["total"]) * 100 if data["total"] else 0

        analytics.append(
            {
                "subject": subject,
                "total_attempts": data["count"],
                "average_percentage": round(avg_percentage, 2),
            }
        )

    return {"subjects": analytics}
