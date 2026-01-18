from pydantic import BaseModel
from typing import Dict


class SubmitQuizSchema(BaseModel):
    quiz_id: str
    answers: Dict[str, str]
