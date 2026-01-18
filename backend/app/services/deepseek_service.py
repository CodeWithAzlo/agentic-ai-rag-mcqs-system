import requests
import json
import re
from app.config import settings

API_URL = "https://openrouter.ai/api/v1/chat/completions"

"""
generate_mcqs function, service
here i give an prompt to LLM to generate 10 MCQs from given text and subject
Integration with LLM via OpenRouter API,admin upload pdf and text extract and send to LLM
"""


def generate_mcqs(text: str, subject: str) -> list:
    prompt = f"""
Generate EXACTLY 10 multiple choice questions.

STRICT RULES:
- Output ONLY valid JSON
- No markdown
- No explanation
- Each question has 4 options
- correct_answer must match one option exactly

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

    headers = {
        "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost",
        "X-Title": "AI Quiz Generator",
    }

    payload = {
        "model": "meta-llama/llama-3-8b-instruct",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.3,
        "max_tokens": 1200,
    }

    response = requests.post(API_URL, headers=headers, json=payload, timeout=60)

    if response.status_code != 200:
        raise Exception(f"OpenRouter Error: {response.text}")

    content = response.json()["choices"][0]["message"]["content"]

    # --- CLEAN AND EXTRACT JSON ONLY ---
    match = re.search(r"\[.*\]", content, re.DOTALL)
    if not match:
        raise Exception("AI returned invalid JSON:\n" + content)

    json_str = match.group(0)

    try:
        mcqs = json.loads(json_str)
    except json.JSONDecodeError as e:
        raise Exception(f"AI returned malformed JSON: {e}\n{content}")

    # Validate result
    if not isinstance(mcqs, list) or len(mcqs) != 10:
        raise Exception("Generated MCQs are invalid or incomplete:\n" + str(mcqs))

    return mcqs
