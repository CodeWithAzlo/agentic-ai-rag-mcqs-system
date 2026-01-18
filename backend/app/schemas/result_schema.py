from pydantic import BaseModel


class ResultSchema(BaseModel):
    subject: str
    score: int
    total: int
