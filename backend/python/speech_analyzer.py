"""
PlacementAI Speech & Delivery Confidence Analyzer
Computes speech rate, pauses, fillers, pitch/energy dynamics, and composite speech confidence.
"""

import re
import math
import wave
from typing import Dict, Any, List, Tuple

# Common English filler words & phrases
FILLER_WORDS = [
    "um", "uh", "er", "ah", "like", "you know", "basically", "actually",
    "literally", "sort of", "kind of", "i mean", "so yeah", "right"
]

def analyze_transcript_text(text: str, duration_sec: float = 0.0) -> Dict[str, Any]:
    """
    Analyzes transcript text for pace, filler words, repetition, and false starts.
    """
    if not text or not text.strip():
        return {
            "word_count": 0,
            "words_per_minute": 0.0,
            "filler_count": 0,
            "filler_rate_pct": 0.0,
            "top_fillers": [],
            "repeated_words_count": 0,
            "false_starts_count": 0
        }

    clean_text = text.strip()
    words = re.findall(r"\b[A-Za-z0-9'-]+\b", clean_text.lower())
    total_words = len(words)

    # 1. Words per minute (WPM)
    effective_duration_min = (duration_sec / 60.0) if duration_sec > 0 else (total_words / 130.0)
    wpm = round(total_words / effective_duration_min, 1) if effective_duration_min > 0 else 0.0

    # 2. Filler word detection
    lower_text = clean_text.lower()
    filler_counts: Dict[str, int] = {}
    total_fillers = 0

    for filler in FILLER_WORDS:
        # Match whole phrase or word boundary
        pattern = r"\b" + re.escape(filler) + r"\b"
        matches = len(re.findall(pattern, lower_text))
        if matches > 0:
            filler_counts[filler] = matches
            total_fillers += matches

    top_fillers = sorted(
        [{"filler": k, "count": v} for k, v in filler_counts.items()],
        key=lambda x: x["count"],
        reverse=True
    )[:5]

    filler_rate_pct = round((total_fillers / max(1, total_words)) * 100, 1)

    # 3. Repeated consecutive words (e.g. "I I think", "the the")
    repeated_words_count = 0
    for i in range(len(words) - 1):
        if words[i] == words[i + 1] and len(words[i]) > 1:
            repeated_words_count += 1

    # 4. False starts / abandoned sentences (dashes or trailing ellipses)
    false_starts_count = len(re.findall(r"\b\w+\s*--|\b\w+\s*\.\.\.", clean_text))

    return {
        "word_count": total_words,
        "words_per_minute": wpm,
        "filler_count": total_fillers,
        "filler_rate_pct": filler_rate_pct,
        "top_fillers": top_fillers,
        "repeated_words_count": repeated_words_count,
        "false_starts_count": false_starts_count
    }


def analyze_audio_waveform(wav_path: str) -> Dict[str, Any]:
    """
    Parses a 16kHz mono WAV file using pure Python wave module to compute:
    - duration, speaking time vs silence time
    - pause counts (>1.5s) and longest pause
    - volume/energy variation
    """
    try:
        with wave.open(wav_path, 'rb') as wf:
            channels = wf.getnchannels()
            sample_width = wf.getsampwidth()
            framerate = wf.getframerate()
            n_frames = wf.getnframes()
            
            if n_frames == 0 or framerate == 0:
                return _default_audio_metrics(0.0)

            duration = n_frames / float(framerate)
            raw_data = wf.readframes(n_frames)

        # Convert 16-bit PCM frames to numeric samples
        import struct
        total_samples = len(raw_data) // sample_width
        fmt = f"<{total_samples}h" if sample_width == 2 else None

        if not fmt:
            return _default_audio_metrics(duration)

        samples = struct.unpack(fmt, raw_data)
        if channels > 1:
            # Downmix stereo to mono
            samples = [samples[i] for i in range(0, len(samples), channels)]

        # Chunk into 50ms frames for energy & silence tracking
        frame_size = int(framerate * 0.05)
        num_chunks = len(samples) // frame_size

        if num_chunks == 0:
            return _default_audio_metrics(duration)

        energies = []
        silence_threshold = 400.0  # RMS threshold for silence
        chunk_is_speech = []

        for i in range(num_chunks):
            chunk = samples[i * frame_size:(i + 1) * frame_size]
            sum_sq = sum(s * s for s in chunk)
            rms = math.sqrt(sum_sq / len(chunk))
            energies.append(rms)
            chunk_is_speech.append(rms > silence_threshold)

        # Pause detection
        chunk_duration = 0.05
        pauses = []
        current_silence_dur = 0.0

        for is_speech in chunk_is_speech:
            if not is_speech:
                current_silence_dur += chunk_duration
            else:
                if current_silence_dur >= 1.5:
                    pauses.append(current_silence_dur)
                current_silence_dur = 0.0

        if current_silence_dur >= 1.5:
            pauses.append(current_silence_dur)

        total_silence = sum(chunk_duration for is_speech in chunk_is_speech if not is_speech)
        speaking_time = max(0.0, duration - total_silence)
        longest_pause = max(pauses) if pauses else 0.0

        # Energy & pitch variation proxy
        mean_energy = sum(energies) / len(energies)
        variance = sum((e - mean_energy) ** 2 for e in energies) / len(energies)
        energy_std = math.sqrt(variance)
        energy_variation = min(1.0, energy_std / (mean_energy + 1e-5))

        return {
            "total_duration_sec": round(duration, 2),
            "speaking_time_sec": round(speaking_time, 2),
            "silence_time_sec": round(total_silence, 2),
            "pauses_count_gt_1_5s": len(pauses),
            "longest_pause_sec": round(longest_pause, 2),
            "energy_variation": round(energy_variation, 2),
            "pitch_variation": "Expressive" if energy_variation > 0.45 else ("Moderate" if energy_variation > 0.25 else "Monotone")
        }

    except Exception as e:
        return _default_audio_metrics(0.0, str(e))


def _default_audio_metrics(duration: float, error: str = "") -> Dict[str, Any]:
    return {
        "total_duration_sec": round(duration, 2),
        "speaking_time_sec": round(duration * 0.8, 2),
        "silence_time_sec": round(duration * 0.2, 2),
        "pauses_count_gt_1_5s": 0,
        "longest_pause_sec": 0.0,
        "energy_variation": 0.5,
        "pitch_variation": "Moderate",
        "error": error
    }


def calculate_speech_confidence(
    wpm: float,
    filler_rate_pct: float,
    pauses_count: int,
    longest_pause_sec: float,
    energy_variation: float,
    google_confidence: float = 0.85,
    response_latency_sec: float = 1.5
) -> Tuple[float, Dict[str, float]]:
    """
    Computes a transparent weighted Speech Confidence Score (0.0 to 10.0).

    Weighted formula breakdown:
    -------------------------------------------------------------
    1. Pace Score (20% weight):
       Ideal speaking pace in interviews is 120 - 160 WPM.
       Penalized if rushed (>180 WPM) or sluggish (<100 WPM).
    2. Filler Control Score (20% weight):
       <2% fillers = 10.0, 2-4% = 8.0, 4-7% = 6.0, >7% = proportional penalty.
    3. Pause & Flow Score (15% weight):
       Zero long pauses (>1.5s) = 10.0; each awkward pause subtracts 2.0 pts.
       Longest pause > 4.0s receives additional deduction.
    4. Response Latency Score (10% weight):
       Starts speaking within 1.0 - 3.0s = 10.0. Latency > 6.0s drops score.
    5. Expressiveness & Dynamics (15% weight):
       Moderate-to-high dynamic range (0.35 - 0.70) indicates confidence.
       Flat/monotone (<0.20) penalized.
    6. Recognition Confidence (20% weight):
       Confidence returned from speech-to-text acoustic model (0.0 - 1.0 scaled to 10).
    -------------------------------------------------------------
    """
    # 1. Pace Score (0 - 10)
    if 120 <= wpm <= 160:
        pace_score = 10.0
    elif 100 <= wpm < 120:
        pace_score = 8.5
    elif 160 < wpm <= 180:
        pace_score = 8.5
    elif 80 <= wpm < 100:
        pace_score = 6.5
    elif 180 < wpm <= 210:
        pace_score = 6.0
    elif wpm > 0:
        pace_score = 4.0
    else:
        pace_score = 2.0

    # 2. Filler Score (0 - 10)
    if filler_rate_pct <= 1.5:
        filler_score = 10.0
    elif filler_rate_pct <= 3.5:
        filler_score = 8.5
    elif filler_rate_pct <= 6.0:
        filler_score = 6.5
    elif filler_rate_pct <= 9.0:
        filler_score = 4.5
    else:
        filler_score = max(1.0, 10.0 - filler_rate_pct)

    # 3. Pause & Flow Score (0 - 10)
    pause_deduction = pauses_count * 2.0
    if longest_pause_sec > 4.0:
        pause_deduction += 1.5
    flow_score = max(2.0, min(10.0, 10.0 - pause_deduction))

    # 4. Response Latency Score (0 - 10)
    if response_latency_sec <= 2.5:
        latency_score = 10.0
    elif response_latency_sec <= 4.0:
        latency_score = 8.5
    elif response_latency_sec <= 6.0:
        latency_score = 6.5
    else:
        latency_score = max(3.0, 10.0 - (response_latency_sec - 4.0) * 1.5)

    # 5. Dynamics & Expressiveness (0 - 10)
    if 0.35 <= energy_variation <= 0.75:
        dynamics_score = 10.0
    elif energy_variation > 0.75:
        dynamics_score = 8.5
    elif energy_variation >= 0.20:
        dynamics_score = 7.0
    else:
        dynamics_score = 4.5

    # 6. Recognition Confidence (0 - 10)
    recog_score = min(10.0, max(2.0, (google_confidence or 0.85) * 10.0))

    # Transparent Weights
    w_pace = 0.20
    w_filler = 0.20
    w_flow = 0.15
    w_latency = 0.10
    w_dynamics = 0.15
    w_recog = 0.20

    composite = (
        (pace_score * w_pace) +
        (filler_score * w_filler) +
        (flow_score * w_flow) +
        (latency_score * w_latency) +
        (dynamics_score * w_dynamics) +
        (recog_score * w_recog)
    )

    final_score = round(max(0.0, min(10.0, composite)), 1)

    component_scores = {
        "pace_score": round(pace_score, 1),
        "filler_score": round(filler_score, 1),
        "flow_score": round(flow_score, 1),
        "latency_score": round(latency_score, 1),
        "dynamics_score": round(dynamics_score, 1),
        "recognition_score": round(recog_score, 1)
    }

    return final_score, component_scores
