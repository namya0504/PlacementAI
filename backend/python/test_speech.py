"""
Unit tests for Speech Analyzer metrics and confidence formula
Run with: python -m unittest backend/python/test_speech.py
"""

import os
import sys
sys.path.insert(0, os.path.dirname(__file__))
import unittest
from speech_analyzer import (
    analyze_transcript_text,
    calculate_speech_confidence
)

class TestSpeechAnalyzer(unittest.TestCase):
    def test_transcript_wpm_and_fillers(self):
        text = "Um I basically implemented the REST API using like Express and Node. You know, it was very scalable."
        res = analyze_transcript_text(text, duration_sec=10.0)
        
        self.assertGreater(res["word_count"], 10)
        self.assertGreater(res["filler_count"], 0)
        self.assertGreater(res["filler_rate_pct"], 0)
        self.assertTrue(any(f["filler"] == "um" for f in res["top_fillers"]))
        self.assertGreater(res["words_per_minute"], 50.0)

    def test_empty_transcript(self):
        res = analyze_transcript_text("", duration_sec=0.0)
        self.assertEqual(res["word_count"], 0)
        self.assertEqual(res["filler_count"], 0)
        self.assertEqual(res["words_per_minute"], 0.0)

    def test_speech_confidence_ideal(self):
        # 140 WPM (ideal), 1.0% fillers, 0 pauses, latency 1.5s, confidence 0.95
        score, components = calculate_speech_confidence(
            wpm=140.0,
            filler_rate_pct=1.0,
            pauses_count=0,
            longest_pause_sec=0.0,
            energy_variation=0.55,
            google_confidence=0.95,
            response_latency_sec=1.5
        )
        self.assertGreaterEqual(score, 8.5)
        self.assertLessEqual(score, 10.0)
        self.assertEqual(components["pace_score"], 10.0)
        self.assertEqual(components["filler_score"], 10.0)

    def test_speech_confidence_poor_delivery(self):
        # 50 WPM (sluggish), 15% fillers, 5 long pauses, latency 7s
        score, components = calculate_speech_confidence(
            wpm=50.0,
            filler_rate_pct=15.0,
            pauses_count=5,
            longest_pause_sec=6.0,
            energy_variation=0.1,
            google_confidence=0.6,
            response_latency_sec=7.0
        )
        self.assertLess(score, 5.0)

if __name__ == "__main__":
    unittest.main()
