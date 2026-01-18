def user_helper(user):
    return {
        "id": str(user["_id"]),
        "name": user.get("name"),
        "email": user["email"],
        "role": user["role"],
    }
