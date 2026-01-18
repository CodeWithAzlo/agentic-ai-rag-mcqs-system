from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId

from app.database import quiz_collection, result_collection
from app.utils.dependencies import user_only
from app.utils.jwt import get_current_user
from app.schemas.submit_schema import SubmitQuizSchema
from datetime import datetime

router = APIRouter(prefix="/user", tags=["User"])


# ---------------------------
# Get all quizzes (subjects)
# ---------------------------
@router.get("/quizzes", dependencies=[Depends(user_only)])
async def get_quizzes():
    quizzes = []
    async for q in quiz_collection.find():
        quizzes.append(
            {
                "id": str(q["_id"]),
                "subject": q.get("subject", "Unknown"),
            }
        )
    return quizzes


@router.get("/attempted/{quiz_id}", dependencies=[Depends(user_only)])
async def has_attempted(
    quiz_id: str,
    user=Depends(get_current_user),
):
    quiz = await quiz_collection.find_one({"_id": ObjectId(quiz_id)})
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    attempt = await result_collection.find_one(
        {
            "email": user["email"],
            "subject": quiz["subject"],
        }
    )

    return {"attempted": bool(attempt)}


# ---------------------------
# Get quiz by ID (MCQs)
# ---------------------------
@router.get("/quiz/{quiz_id}", dependencies=[Depends(get_current_user)])
async def get_quiz(quiz_id: str):
    quiz = await quiz_collection.find_one({"_id": ObjectId(quiz_id)})
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    return {
        "id": str(quiz["_id"]),
        "subject": quiz["subject"],
        "mcqs": quiz["mcqs"],
    }


# ---------------------------
# Submit quiz (AUTO MARKING + ATTEMPT LOCK)
# ---------------------------
@router.post("/submit", dependencies=[Depends(user_only)])
async def submit_quiz(
    data: SubmitQuizSchema,
    user=Depends(get_current_user),
):
    quiz = await quiz_collection.find_one({"_id": ObjectId(data.quiz_id)})
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    # BLOCK MULTIPLE ATTEMPTS (DB LEVEL)
    existing_attempt = await result_collection.find_one(
        {
            "email": user["email"],
            "subject": quiz["subject"],
        }
    )

    if existing_attempt:
        raise HTTPException(
            status_code=400,
            detail="You have already attempted this quiz",
        )

    mcqs = quiz["mcqs"]

    score = 0
    total = len(mcqs)

    # A/B/C/D ==> option text mapping
    option_index_map = {
        "A": 0,
        "B": 1,
        "C": 2,
        "D": 3,
    }

    for mcq in mcqs:
        question = mcq["question"]
        correct = mcq["correct_answer"]
        user_answer = data.answers.get(question)

        if not user_answer:
            continue

        # Converingt correct_answer to actual option text if needed
        if correct in option_index_map:
            index = option_index_map[correct]
            if index < len(mcq["options"]):
                correct_text = mcq["options"][index]
            else:
                continue
        else:
            correct_text = correct

        if user_answer.strip() == correct_text.strip():
            score += 1

    percentage = (score / total) * 100 if total else 0

    if percentage >= 80:
        grade = "A"
    elif percentage >= 60:
        grade = "B"
    elif percentage >= 40:
        grade = "C"
    else:
        grade = "Fail"

    # SAVE RESULT IN DB...WHEN QUIZ SUBMIT button clicked or hit or push or req res is send many options comes here in mind
    await result_collection.insert_one(
        {
            "email": user["email"],
            "subject": quiz["subject"],
            "score": score,
            "total": total,
            "percentage": percentage,
            "grade": grade,
            "attempted_on": datetime.now(),
        }
    )

    return {
        "subject": quiz["subject"],
        "score": score,
        "total": total,
        "percentage": percentage,
        "grade": grade,
    }
