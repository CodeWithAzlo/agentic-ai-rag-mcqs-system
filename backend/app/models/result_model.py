def result_helper(result):
    return {
        "id": str(result["_id"]),
        "email": result["email"],
        "subject": result["subject"],
        "score": result["score"],
        "total": result["total"],
    }
