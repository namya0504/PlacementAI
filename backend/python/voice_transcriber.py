"""
PlacementAI Voice Transcription & Speech Analytics Engine
Uses Google Speech Recognition (free tier) with audio chunking and speech analytics.
Includes an isolated SpeechRecognitionAdapter for swappable cloud backends.
"""

import os
import sys
sys.path.insert(0, os.path.dirname(__file__))
import json
import time
import argparse
from typing import Dict, Any, List, Optional
from speech_analyzer import (
    analyze_transcript_text,
    analyze_audio_waveform,
    calculate_speech_confidence
)

# Optional SpeechRecognition import with graceful handling
try:
    import speech_recognition as sr
    HAS_SR = True
except ImportError:
    HAS_SR = False

# Optional pydub import with graceful handling
try:
    from pydub import AudioSegment
    from pydub.silence import split_on_silence
    HAS_PYDUB = True
except ImportError:
    HAS_PYDUB = False


class SpeechRecognitionAdapter:
    """
    Isolated adapter pattern for Speech-to-Text backends.
    Allows easy swapping between free Google Recognizer, Google Cloud Speech, Whisper, or Vosk.
    """
    def __init__(self, language: str = "en-IN"):
        self.language = language

    def transcribe_chunk(self, audio_data: sr.AudioData, max_retries: int = 2) -> Dict[str, Any]:
        """
        Transcribes an AudioData instance with retry logic.
        """
        if not HAS_SR:
            return {"text": "", "confidence": 0.0, "error": "SpeechRecognition library not installed"}

        recognizer = sr.Recognizer()
        recognizer.energy_threshold = 300
        recognizer.dynamic_energy_threshold = True

        for attempt in range(max_retries + 1):
            try:
                # show_all=True returns dict with alternatives and confidence
                result = recognizer.recognize_google(
                    audio_data,
                    language=self.language,
                    show_all=True
                )

                if not result or not isinstance(result, dict):
                    return {"text": "", "confidence": 0.0, "error": "No speech detected"}

                alternatives = result.get("alternative", [])
                if not alternatives:
                    return {"text": "", "confidence": 0.0, "error": "No transcription alternatives found"}

                top_hit = alternatives[0]
                transcript = top_hit.get("transcript", "").strip()
                confidence = float(top_hit.get("confidence", 0.85))

                return {
                    "text": transcript,
                    "confidence": confidence,
                    "error": None
                }

            except sr.UnknownValueError:
                return {"text": "", "confidence": 0.0, "error": "UnknownValueError: speech unintelligible or silent"}
            except sr.RequestError as e:
                if attempt < max_retries:
                    time.sleep(0.5 * (attempt + 1))
                    continue
                return {"text": "", "confidence": 0.0, "error": f"Google Speech API network error: {str(e)}"}
            except Exception as e:
                return {"text": "", "confidence": 0.0, "error": f"Transcription error: {str(e)}"}

        return {"text": "", "confidence": 0.0, "error": "Max retries reached"}


def convert_to_16k_mono_wav(input_path: str, output_wav_path: str) -> bool:
    """
    Converts any input audio (webm, ogg, mp4, wav) to 16kHz mono WAV using pydub.
    """
    if not os.path.exists(input_path):
        return False

    if HAS_PYDUB:
        try:
            sound = AudioSegment.from_file(input_path)
            sound = sound.set_frame_rate(16000).set_channels(1)
            sound.export(output_wav_path, format="wav")
            return True
        except Exception as e:
            # If pydub fails (e.g. ffmpeg not found for webm), copy or write raw if wav
            pass

    # If already a WAV file, copy directly
    if input_path.lower().endswith(".wav"):
        try:
            import shutil
            shutil.copyfile(input_path, output_wav_path)
            return True
        except Exception:
            return False

    return False


def transcribe_and_analyze(
    audio_path: str,
    language: str = "en-IN",
    response_latency_sec: float = 1.5
) -> Dict[str, Any]:
    """
    Full pipeline:
    1. Standardizes audio to 16kHz mono WAV
    2. Splits long audio (>50s) into silence-bounded chunks
    3. Transcribes each chunk via SpeechRecognitionAdapter
    4. Computes comprehensive speech delivery metrics
    """
    temp_wav = audio_path + "_16k.wav"
    converted = convert_to_16k_mono_wav(audio_path, temp_wav)
    target_path = temp_wav if converted else audio_path

    waveform_metrics = analyze_audio_waveform(target_path)
    total_duration = waveform_metrics.get("total_duration_sec", 0.0)

    adapter = SpeechRecognitionAdapter(language=language)
    transcripts: List[str] = []
    confidences: List[float] = []
    errors: List[str] = []

    if HAS_SR and os.path.exists(target_path):
        try:
            # Check if audio should be split (>50s)
            chunks_to_process = []
            if HAS_PYDUB and total_duration > 50.0:
                try:
                    seg = AudioSegment.from_wav(target_path)
                    raw_chunks = split_on_silence(
                        seg,
                        min_silence_len=700,
                        silence_thresh=-36,
                        keep_silence=200
                    )
                    # Merge very small chunks so each is ~10-40s
                    cur_seg = None
                    for ch in raw_chunks:
                        if cur_seg is None:
                            cur_seg = ch
                        elif (cur_seg.duration_seconds + ch.duration_seconds) < 40.0:
                            cur_seg += ch
                        else:
                            chunks_to_process.append(cur_seg)
                            cur_seg = ch
                    if cur_seg:
                        chunks_to_process.append(cur_seg)
                except Exception:
                    chunks_to_process = []

            # If no pydub chunking, process whole file
            if not chunks_to_process:
                recognizer = sr.Recognizer()
                with sr.AudioFile(target_path) as source:
                    audio_data = recognizer.record(source)
                res = adapter.transcribe_chunk(audio_data)
                if res["text"]:
                    transcripts.append(res["text"])
                    confidences.append(res["confidence"])
                elif res.get("error"):
                    errors.append(res["error"])
            else:
                recognizer = sr.Recognizer()
                for idx, ch_seg in enumerate(chunks_to_process):
                    ch_temp = f"{target_path}_chunk_{idx}.wav"
                    try:
                        ch_seg.export(ch_temp, format="wav")
                        with sr.AudioFile(ch_temp) as source:
                            audio_data = recognizer.record(source)
                        res = adapter.transcribe_chunk(audio_data)
                        if res["text"]:
                            transcripts.append(res["text"])
                            confidences.append(res["confidence"])
                        elif res.get("error"):
                            errors.append(res["error"])
                    finally:
                        if os.path.exists(ch_temp):
                            try:
                                os.remove(ch_temp)
                            except Exception:
                                pass

        except Exception as e:
            errors.append(f"Audio transcription failed: {str(e)}")
    else:
        if not HAS_SR:
            errors.append("SpeechRecognition is not installed. Please run: pip install -r backend/python/requirements.txt")

    # Clean up temporary conversion file
    if os.path.exists(temp_wav):
        try:
            os.remove(temp_wav)
        except Exception:
            pass

    final_transcript = " ".join(transcripts).strip()
    avg_confidence = (sum(confidences) / len(confidences)) if confidences else 0.85

    # Transcript linguistics analysis
    text_metrics = analyze_transcript_text(final_transcript, total_duration)

    # Composite Speech Confidence Score
    confidence_score, component_scores = calculate_speech_confidence(
        wpm=text_metrics["words_per_minute"],
        filler_rate_pct=text_metrics["filler_rate_pct"],
        pauses_count=waveform_metrics.get("pauses_count_gt_1_5s", 0),
        longest_pause_sec=waveform_metrics.get("longest_pause_sec", 0.0),
        energy_variation=waveform_metrics.get("energy_variation", 0.5),
        google_confidence=avg_confidence,
        response_latency_sec=response_latency_sec
    )

    speech_metrics = {
        "words_per_minute": text_metrics["words_per_minute"],
        "word_count": text_metrics["word_count"],
        "speaking_time_sec": waveform_metrics.get("speaking_time_sec", 0.0),
        "silence_time_sec": waveform_metrics.get("silence_time_sec", 0.0),
        "total_duration_sec": total_duration,
        "pauses_count_gt_1_5s": waveform_metrics.get("pauses_count_gt_1_5s", 0),
        "longest_pause_sec": waveform_metrics.get("longest_pause_sec", 0.0),
        "response_latency_sec": response_latency_sec,
        "filler_words_count": text_metrics["filler_count"],
        "filler_words_rate_pct": text_metrics["filler_rate_pct"],
        "top_fillers": text_metrics["top_fillers"],
        "repeated_words_count": text_metrics["repeated_words_count"],
        "false_starts_count": text_metrics["false_starts_count"],
        "pitch_variation": waveform_metrics.get("pitch_variation", "Moderate"),
        "energy_variation": waveform_metrics.get("energy_variation", 0.5),
        "speech_confidence_score": confidence_score,
        "confidence_breakdown": component_scores,
        "disclaimer": "Speech confidence score is an estimate based on pace, pauses, filler words, and vocal dynamics, not emotional truth detection."
    }

    return {
        "transcript": final_transcript,
        "google_confidence": round(avg_confidence, 2),
        "speech_metrics": speech_metrics,
        "errors": errors if errors else None
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="PlacementAI Voice Transcriber")
    parser.add_argument("audio_path", help="Path to input audio file")
    parser.add_argument("--language", default="en-IN", help="Speech recognition language code")
    parser.add_argument("--latency", type=float, default=1.5, help="Response latency in seconds")
    args = parser.parse_args()

    result = transcribe_and_analyze(
        args.audio_path,
        language=args.language,
        response_latency_sec=args.latency
    )

    print(json.dumps(result, indent=2))
