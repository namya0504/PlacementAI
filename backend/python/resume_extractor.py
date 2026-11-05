"""
PlacementAI Resume Document Extractor
Extracts raw text from PDF and DOCX files using pdfplumber, PyPDF2, and python-docx.
Supports fallback OCR via pytesseract when available.
"""

import os
import sys
import json
import argparse
from typing import Dict, Any

def extract_text_from_pdf(file_path: str) -> Dict[str, Any]:
    text = ""
    errors = []

    # 1. Try pdfplumber
    try:
        import pdfplumber
        with pdfplumber.open(file_path) as pdf:
            pages_text = []
            for p in pdf.pages:
                extracted = p.extract_text()
                if extracted:
                    pages_text.append(extracted)
            if pages_text:
                text = "\n\n".join(pages_text).strip()
    except ImportError:
        errors.append("pdfplumber not installed")
    except Exception as e:
        errors.append(f"pdfplumber extraction failed: {str(e)}")

    # 2. Fallback to PyPDF2
    if not text:
        try:
            import PyPDF2
            with open(file_path, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                pages_text = [p.extract_text() or "" for p in reader.pages]
                candidate = "\n\n".join(pages_text).strip()
                if candidate:
                    text = candidate
        except ImportError:
            errors.append("PyPDF2 not installed")
        except Exception as e:
            errors.append(f"PyPDF2 extraction failed: {str(e)}")

    # 3. Fallback to OCR (pytesseract) for scanned PDF
    if not text:
        try:
            import pytesseract
            from PIL import Image
            import pdf2image
            images = pdf2image.convert_from_path(file_path)
            ocr_text = []
            for img in images:
                ocr_text.append(pytesseract.image_to_string(img))
            candidate = "\n\n".join(ocr_text).strip()
            if candidate:
                text = candidate
        except Exception as ocr_err:
            errors.append(f"OCR unavailable or failed: {str(ocr_err)}")

    return {
        "text": text,
        "is_scanned": bool(not text and errors),
        "errors": errors if not text else None
    }


def extract_text_from_docx(file_path: str) -> Dict[str, Any]:
    text = ""
    errors = []
    try:
        import docx
        doc = docx.Document(file_path)
        paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
        for table in doc.tables:
            for row in table.rows:
                row_text = " | ".join(cell.text.strip() for cell in row.cells if cell.text.strip())
                if row_text:
                    paragraphs.append(row_text)
        text = "\n".join(paragraphs).strip()
    except ImportError:
        errors.append("python-docx not installed")
    except Exception as e:
        errors.append(f"DOCX extraction failed: {str(e)}")

    return {
        "text": text,
        "is_scanned": False,
        "errors": errors if not text else None
    }


def extract_resume_text(file_path: str) -> Dict[str, Any]:
    if not os.path.exists(file_path):
        return {"text": "", "error": f"File does not exist: {file_path}"}

    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".pdf":
        return extract_text_from_pdf(file_path)
    elif ext in [".docx", ".doc"]:
        return extract_text_from_docx(file_path)
    elif ext in [".txt", ".md"]:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return {"text": f.read().strip(), "errors": None}
    else:
        return {"text": "", "error": f"Unsupported file extension: {ext}"}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Resume Text Extractor")
    parser.add_argument("file_path", help="Path to resume file (PDF or DOCX)")
    args = parser.parse_args()

    res = extract_resume_text(args.file_path)
    print(json.dumps(res, indent=2))
