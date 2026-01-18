from fastapi import UploadFile
from PyPDF2 import PdfReader
from docx import Document
from PIL import Image
import os


async def extract_text(file: UploadFile):
    # Saving temp file
    path = f"uploads/{file.filename}"
    content = await file.read()  # Reading the file content
    if not content:
        return ""  # Handling empty files gracefully

    with open(path, "wb") as f:
        f.write(content)

    if file.filename.endswith(".pdf"):
        from PyPDF2 import PdfReader

        reader = PdfReader(path)
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text
        return text
    elif file.filename.endswith(".docx"):
        from docx import Document

        doc = Document(path)
        return "\n".join([p.text for p in doc.paragraphs])
    elif file.filename.endswith((".png", ".jpg", ".jpeg")):
        from PIL import Image
        import pytesseract

        img = Image.open(path)
        return pytesseract.image_to_string(img)
    else:
        return ""
