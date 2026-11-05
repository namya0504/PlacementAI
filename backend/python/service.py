"""
PlacementAI Voice & Resume Processing Microservice (FastAPI)
Run with: uvicorn backend.python.service:app --port 5001 --reload
"""

import os
import sys
sys.path.insert(0, os.path.dirname(__file__))
import tempfile
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from voice_transcriber import transcribe_and_analyze
from resume_extractor import extract_resume_text

app = FastAPI(title="PlacementAI Voice & Document Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "PlacementAI Python Voice & Document Service"}

@app.post("/transcribe")
async def transcribe_endpoint(
    audio: UploadFile = File(...),
    language: str = Form("en-IN"),
    latency: float = Form(1.5),
    session_id: str = Form(None),
    question_id: str = Form(None)
):
    suffix = os.path.splitext(audio.filename or "recording.webm")[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp_path = tmp.name
        content = await audio.read()
        tmp.write(content)

    try:
        result = transcribe_and_analyze(
            audio_path=tmp_path,
            language=language,
            response_latency_sec=latency
        )
        return {
            "success": True,
            "session_id": session_id,
            "question_id": question_id,
            "data": result
        }
    finally:
        if os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except Exception:
                pass

@app.post("/parse-resume")
async def parse_resume_endpoint(resume: UploadFile = File(...)):
    suffix = os.path.splitext(resume.filename or "resume.pdf")[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp_path = tmp.name
        content = await resume.read()
        tmp.write(content)

    try:
        result = extract_resume_text(tmp_path)
        return {
            "success": True,
            "filename": resume.filename,
            "data": result
        }
    finally:
        if os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except Exception:
                pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5001)
