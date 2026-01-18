import requests
import json
from app.config import settings

"""
Optional this also i create but this model is paid,
integration with Gemini API to generate MCQs
using Gemini Pro model via Google Generative AI API
"""

GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-pro:generateContent"
)


def generate_mcqs(text: str, subject: str) -> list:
    prompt = f"""
Generate EXACTLY 10 multiple-choice questions from the content below.

STRICT RULES:
- Return ONLY valid JSON
- No markdown
- No explanation
- No extra text
- Each question must have 4 options
- correct_answer must exactly match one option

JSON FORMAT:
[
  {{
    "question": "string",
    "options": ["A", "B", "C", "D"],
    "correct_answer": "A"
  }}
]

Subject: {subject}

Content:
{text}
"""

    payload = {"contents": [{"parts": [{"text": prompt}]}]}

    response = requests.post(
        f"{GEMINI_URL}?key={settings.GEMINI_API_KEY}",
        json=payload,
        timeout=60,
    )

    if response.status_code != 200:
        raise Exception(f"Gemini API Error {response.status_code}: {response.text}")

    data = response.json()

    raw_text = data["candidates"][0]["content"]["parts"][0]["text"]

    try:
        return json.loads(raw_text)
    except json.JSONDecodeError:
        raise Exception("Gemini returned invalid JSON:\n" + raw_text)
