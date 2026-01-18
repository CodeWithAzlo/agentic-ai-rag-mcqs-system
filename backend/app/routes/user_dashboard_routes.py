from fastapi import APIRouter, Depends
from app.database import result_collection
from app.utils.jwt import get_current_user

router = APIRouter(prefix="/user", tags=["UserDashboard"])

"""
GET /dashboard endpoint,
to get all quizzes attempted by the logged-in user,user dashbboard...
with subject, scores, etc...
"""


@router.get("/dashboard")
async def user_dashboard(user=Depends(get_current_user)):
    """
    Return all quizzes attempted by the logged-in user with scores, grades, and attempt date
    """
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

    return {"total_attempts": len(results), "attempts": results}
