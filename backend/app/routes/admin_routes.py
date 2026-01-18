from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from app.services.text_extractor import extract_text
from app.services.deepseek_service import generate_mcqs
from app.database import quiz_collection
from app.utils.dependencies import admin_only
import os

router = APIRouter(prefix="/admin", tags=["Admin"])

"""
POST /upload endpoint,
to upload a file and generate MCQs for a quiz (ADMIN CREDENTIALS ONLY)
"""
@router.post("/upload", dependencies=[Depends(admin_only)])
async def upload_quiz(subject: str = Form(...), file: UploadFile = File(...)):
    os.makedirs("uploads", exist_ok=True)

    # Extract text from file
    text = await extract_text(file)

    if not text.strip():
        raise HTTPException(status_code=400, detail="No text extracted from file")

    # generate_mcqs is SYNC (no await here main mistake happen here noted bug)
    mcqs = generate_mcqs(text, subject)

    if not isinstance(mcqs, list) or len(mcqs) != 10:
        raise HTTPException(status_code=500, detail="Invalid MCQs generated")

    result = await quiz_collection.insert_one({"subject": subject, "mcqs": mcqs})

    return {
        "message": "Quiz created successfully",
        "quiz_id": str(result.inserted_id),
        "total_mcqs": len(mcqs),
    }
