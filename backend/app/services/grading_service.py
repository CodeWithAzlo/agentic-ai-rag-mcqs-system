def calculate_result(mcqs, user_answers):
    score = 0

    for mcq in mcqs:
        q = mcq["question"]
        if user_answers.get(q) == mcq["correct_answer"]:
            score += 1

    total = len(mcqs)

    percentage = (score / total) * 100

    if percentage >= 80:
        grade = "A"
    elif percentage >= 60:
        grade = "B"
    elif percentage >= 40:
        grade = "C"
    else:
        grade = "Fail"

    return score, total, grade
