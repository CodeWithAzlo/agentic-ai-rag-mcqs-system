from bson import ObjectId


# MongoDB helper function (keep this for creating quiz documents in mongo db object)
def quiz_helper(quiz) -> dict:
    return {"id": str(quiz["_id"]), "subject": quiz["subject"], "mcqs": quiz["mcqs"]}


# Optional: You can also define a Python class (not ODM Object Document Mapper?)
class Quiz:
    def __init__(self, subject: str, mcqs: list[str] = None):
        self.subject = subject
        self.mcqs = mcqs or []
