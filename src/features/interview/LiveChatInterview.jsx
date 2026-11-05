import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Clock,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Radio,
  FileCheck2
} from 'lucide-react';
import { API } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const ROUND_NAMES = {
  1: 'Behavioral & Core Introduction',
  2: 'Technical & Architecture Deep-Dive',
  3: 'Situational & Team Dynamics',
  4: 'Leadership & Culture Fit'
};

export default function LiveChatInterview({
  sessionState,
  onSessionUpdated,
  onEndInterview,
  onTransitionRound
}) {
  const toast = useToast();

  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingLevel, setRecordingLevel] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  // Live interim transcript shown while speaking
  const [liveTranscript, setLiveTranscript] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingStartTimeRef = useRef(null);
  const audioContextRef = useRef(null);
  const animFrameRef = useRef(null);
  // Web Speech API recognition ref (primary path)
  const recognitionRef = useRef(null);
  const wsaTranscriptRef = useRef(''); // accumulates interim + final segments
  // Brave blocks Google's WSA backend servers (gives 'network' error even though
  // the SpeechRecognition API exists). Detect it synchronously via userAgent
  // fallback (navigator.brave is async); mark WSA as unsupported so we skip
  // straight to MediaRecorder.
  const isBrave = useRef(
    typeof window !== 'undefined' && (
      // navigator.brave exists on Brave (may be async Promise but property is present)
      'brave' in navigator ||
      // userAgent contains 'Brave' on some versions
      /brave/i.test(navigator.userAgent) ||
      // Brave sets a specific product string in some versions
      (navigator.userAgentData?.brands || []).some(b => /brave/i.test(b.brand))
    )
  );
  const wsaSupportedRef = useRef(
    typeof window !== 'undefined' &&
    !isBrave.current &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  );
  const braveNoticeShownRef = useRef(false);

  // Authoritative Round countdown timer
  const [remainingSec, setRemainingSec] = useState(sessionState?.roundRemainingSec || 240);
  const timerIntervalRef = useRef(null);

  // 5-second countdown on round transition
  const [transitionCountdown, setTransitionCountdown] = useState(5);
  const transitionTimerRef = useRef(null);

  const messagesEndRef = useRef(null);
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const currentUtteranceRef = useRef(null);
  const voicesLoadedRef = useRef(false);

  // Auto-scroll chat to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Cleanup voice recognition and audio meter on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch { /* ok */ }
        recognitionRef.current = null;
      }
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close().catch(() => {});
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [sessionState?.chatMessages, isAiThinking]);

  // Sync server timer
  useEffect(() => {
    if (sessionState?.roundRemainingSec !== undefined) {
      setRemainingSec(sessionState.roundRemainingSec);
    }
  }, [sessionState?.roundRemainingSec]);

  // Local second-by-second countdown ticking
  useEffect(() => {
    if (sessionState?.status === 'ROUND_ACTIVE') {
      timerIntervalRef.current = setInterval(() => {
        setRemainingSec(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [sessionState?.status]);

  // Round transition 5s countdown
  useEffect(() => {
    if (sessionState?.status === 'ROUND_WRAPUP') {
      setTransitionCountdown(5);
      transitionTimerRef.current = setInterval(() => {
        setTransitionCountdown(prev => {
          if (prev <= 1) {
            clearInterval(transitionTimerRef.current);
            onTransitionRound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(transitionTimerRef.current);
    }
    return () => clearInterval(transitionTimerRef.current);
  }, [sessionState?.status]);

  // Pre-load voices so TTS works on first message (browsers populate async)
  useEffect(() => {
    if (!synthRef.current) return;
    const loadVoices = () => { voicesLoadedRef.current = true; };
    if (synthRef.current.getVoices().length > 0) {
      voicesLoadedRef.current = true;
    } else {
      synthRef.current.addEventListener('voiceschanged', loadVoices);
    }
    return () => synthRef.current?.removeEventListener?.('voiceschanged', loadVoices);
  }, []);

  // Browser TTS Sarah Vance
  const speakText = useCallback((text) => {
    if (!synthRef.current || isMuted || !text) return;

    try {
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1.0;

      // Pick best natural English female voice
      const voices = synthRef.current.getVoices();
      const preferredVoice = voices.find(v =>
        v.lang.startsWith('en') &&
        (v.name.includes('Samantha') || v.name.includes('Google UK English Female') ||
         v.name.includes('Microsoft Zira') || v.name.includes('Female') || v.name.includes('Karen'))
      ) || voices.find(v => v.lang.startsWith('en-')) || voices.find(v => v.lang.startsWith('en'));

      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onstart = () => setIsAiSpeaking(true);
      utterance.onend = () => setIsAiSpeaking(false);
      utterance.onerror = (e) => {
        // 'interrupted' fires when we cancel intentionally — don't treat as error
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          setIsAiSpeaking(false);
        }
      };

      currentUtteranceRef.current = utterance;
      synthRef.current.speak(utterance);
    } catch {
      setIsAiSpeaking(false);
    }
  }, [isMuted]);

  // Read newest AI message with browser speech synthesis
  useEffect(() => {
    const messages = sessionState?.chatMessages || [];
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.sender === 'ai' && !isMuted) {
      speakText(lastMsg.text);
    }
  }, [sessionState?.chatMessages?.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const cancelSpeech = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsAiSpeaking(false);
    }
  };

  // Toggle Mute
  const handleToggleMute = () => {
    if (!isMuted) {
      cancelSpeech();
    }
    setIsMuted(!isMuted);
  };

  // ═════════════════════════════════════════════════════════════════════════════
  // VOICE RECORDING — Dual mode:
  //   PRIMARY:  Web Speech API (browser-native, real-time, zero latency)
  //   FALLBACK: MediaRecorder → backend audio upload (when WSA unavailable)
  // ═════════════════════════════════════════════════════════════════════════════

  /** Start audio level visualiser on an existing stream */
  const startAudioLevelMeter = (stream) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      audioCtx.createMediaStreamSource(stream).connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) sum += data[i];
        setRecordingLevel(Math.min(100, Math.round((sum / data.length / 128) * 100)));
        animFrameRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch { /* non-critical */ }
  };

  const stopAudioLevelMeter = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setRecordingLevel(0);
    if (audioContextRef.current?.state !== 'closed') {
      audioContextRef.current?.close().catch(() => {});
    }
  };

  // ── PATH A: Web Speech API (Chrome / Edge / Safari) ──────────────────────────
  const startWebSpeechRecognition = async () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return false; // signal: not supported

    // Acquire mic for the level meter even in WSA mode
    let levelStream = null;
    try {
      levelStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordingStartTimeRef.current = Date.now();
      startAudioLevelMeter(levelStream);
      mediaRecorderRef.current = { _stream: levelStream, type: 'wsa' };
    } catch (err) {
      console.warn('Mic access for level meter:', err.message);
    }

    wsaTranscriptRef.current = '';
    setLiveTranscript('');

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-IN';
    rec.maxAlternatives = 1;

    // Flag: set true when onerror fires a fatal error that needs fallback
    let fatalError = false;

    rec.onresult = (event) => {
      let interim = '';
      let finalPart = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalPart += t + ' ';
        } else {
          interim += t;
        }
      }
      if (finalPart) wsaTranscriptRef.current += finalPart;
      setLiveTranscript(interim);
      setInputText((wsaTranscriptRef.current + interim).trim());
    };

    rec.onerror = (e) => {
      // These are expected / non-fatal: user stopped, or paused
      if (e.error === 'aborted' || e.error === 'no-speech') return;

      console.warn('[WSA] error:', e.error);
      fatalError = true;

      if (e.error === 'not-allowed') {
        // User denied mic permission — can't fall back
        setIsRecording(false);
        stopAudioLevelMeter();
        if (levelStream) levelStream.getTracks().forEach(t => t.stop());
        recognitionRef.current = null;
        toast.error('Microphone access denied. Please allow mic permission and try again.');
      }
      // 'network': Google's WSA backend unreachable (HTTP/no-HTTPS/region block)
      // 'service-not-allowed': WSA disabled on this origin
      // → onend will fire next; we handle fallback there
    };

    rec.onend = () => {
      setLiveTranscript('');
      recognitionRef.current = null;

      // Clean up level meter and stream
      stopAudioLevelMeter();
      if (mediaRecorderRef.current?._stream) {
        mediaRecorderRef.current._stream.getTracks().forEach(t => t.stop());
        mediaRecorderRef.current = null;
      }

      const finalText = wsaTranscriptRef.current.trim();

      if (fatalError && finalText.length === 0) {
        // WSA failed with no transcript — silently switch to MediaRecorder upload
        console.warn('[WSA] Fatal error with no transcript, falling back to MediaRecorder.');
        setIsRecording(false);
        wsaSupportedRef.current = false; // disable WSA for this session
        // Restart using the fallback path
        startMediaRecorderFallback();
        return;
      }

      if (finalText.length > 0) {
        setInputText(finalText);
        const durationSec = recordingStartTimeRef.current
          ? (Date.now() - recordingStartTimeRef.current) / 1000
          : 10;
        const words = finalText.split(/\s+/).length;
        const wpm = Math.round((words / Math.max(durationSec, 1)) * 60);
        window.__lastSpeechMetrics = {
          words_per_minute: wpm,
          word_count: words,
          total_duration_sec: Math.round(durationSec),
          speech_confidence_score: 8.5,
          filler_words_rate_pct: 0,
          disclaimer: 'Metrics from Web Speech API.'
        };
        setIsRecording(false);
        toast.success('Voice captured! Review and press Send.');
      }
      // If empty but no fatal error: user stopped before speaking — no toast needed
      setIsRecording(false);
    };

    recognitionRef.current = rec;
    try {
      rec.start();
      setIsRecording(true);
      return true;
    } catch (err) {
      console.warn('[WSA] start error:', err.message);
      recognitionRef.current = null;
      return false;
    }
  };

  // ── PATH B: MediaRecorder → backend upload (Firefox, older Safari) ───────────
  const startMediaRecorderFallback = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      recordingStartTimeRef.current = Date.now();
      startAudioLevelMeter(stream);

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : (MediaRecorder.isTypeSupported('audio/ogg') ? 'audio/ogg' : 'audio/webm');

      const recorder = new MediaRecorder(stream, { mimeType });
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        stopAudioLevelMeter();
        stream.getTracks().forEach(t => t.stop());

        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const latencySec = recordingStartTimeRef.current
          ? Math.max(0.5, (Date.now() - recordingStartTimeRef.current) / 1000 - 2.0)
          : 1.5;
        await uploadAndTranscribe(audioBlob, latencySec);
      };

      recorder.start(500);
      recorder._stream = stream;
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      console.warn('Mic start error:', err.message);
      toast.error('Could not access microphone. Please type your answer below.');
    }
  };

  const uploadAndTranscribe = async (audioBlob, latencySec) => {
    setIsTranscribing(true);
    const ext = audioBlob.type.includes('ogg') ? 'ogg' : (audioBlob.type.includes('mp4') ? 'm4a' : 'webm');
    const formData = new FormData();
    formData.append('audio', audioBlob, `recording.${ext}`);
    formData.append('latency', String(latencySec));
    formData.append('sessionId', sessionState.sessionId || '');

    try {
      const res = await API.transcribeInterviewVoice(formData);
      const transcript = (res?.transcript || '').trim();
      if (transcript.length > 0) {
        setInputText(prev => (prev.trim() ? `${prev.trim()} ${transcript}` : transcript));
        window.__lastSpeechMetrics = res.speech_metrics || null;
        toast.success('Voice captured! Review and press Send.');
      } else if (res?.errors?.length) {
        // Backend service not running — don't block the interview
        // Place a placeholder in the input so user knows they can type
        toast.info('Voice service offline. Type your answer below — it works just as well.');
      } else {
        // Upload succeeded but no speech was detected in audio
        toast.warning('Mic picked up silence. Speak clearly and tap Stop.');
      }
    } catch (err) {
      // Network error / 5xx — never block the interview
      console.warn('Upload transcription error:', err.message);
      toast.info('Voice transcription unavailable. Just type your answer below.');
    } finally {
      setIsTranscribing(false);
    }
  };

  // ── Unified start / stop ──────────────────────────────────────────────────────
  const startRecording = async () => {
    cancelSpeech();
    wsaTranscriptRef.current = '';
    setLiveTranscript('');
    setInputText('');
    window.__lastSpeechMetrics = null;

    // Show a one-time notice for Brave users about mic transcription
    if (isBrave.current && !braveNoticeShownRef.current) {
      braveNoticeShownRef.current = true;
      toast.info(
        'Brave detected: voice will be recorded and transcribed via server. ' +
        'If it fails, type your answer — your score is the same either way.'
      );
    }

    if (wsaSupportedRef.current) {
      const started = await startWebSpeechRecognition();
      if (started) return;
      // WSA constructor failed synchronously — fall through immediately
    }
    await startMediaRecorderFallback();
  };

  const stopRecording = () => {
    setLiveTranscript('');

    // Stop Web Speech API if that was the active mode
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* already stopped */ }
      // Don't null recognitionRef here — onend handler does it and flushes transcript
      return;
    }

    // Stop MediaRecorder fallback
    setIsRecording(false);
    try {
      if (mediaRecorderRef.current &&
          typeof mediaRecorderRef.current.state === 'string' &&
          mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    } catch { /* already stopped */ }
  };

  // ═════════════════════════════════════════════════════════════════════════════
  // SUBMIT CANDIDATE ANSWER
  // ═════════════════════════════════════════════════════════════════════════════
  const handleSendAnswer = async (e) => {
    if (e) e.preventDefault();
    const answer = inputText.trim();
    if (!answer || isSubmitting || isAiThinking) return;

    cancelSpeech();
    setIsSubmitting(true);
    setIsAiThinking(true);
    setInputText('');

    const speechMetrics = window.__lastSpeechMetrics || null;
    const isVoiceAnswer = Boolean(speechMetrics);
    window.__lastSpeechMetrics = null;

    try {
      const updated = await API.submitInterviewAnswer(sessionState.sessionId, {
        userResponse: answer,
        isVoice: isVoiceAnswer,
        speechMetrics,
        latencySec: speechMetrics?.response_latency_sec || 1.5
      });
      const newSession = updated?.session || (updated?.sessionId ? updated : null) || updated;
      onSessionUpdated(newSession);
    } catch (err) {
      console.error('Answer submission error:', err.message);
      toast.error(err.message || 'Failed to submit answer. Please try again.');
      setInputText(answer); // restore input
    } finally {
      setIsSubmitting(false);
      setIsAiThinking(false);
    }
  };

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const currentRoundNum = sessionState?.currentRound || 1;
  const currentRoundName = ROUND_NAMES[currentRoundNum] || 'Behavioral';
  const chatMessages = sessionState?.chatMessages || [];
  const currentQNum = (sessionState?.roundsData?.[currentRoundNum]?.questions?.length) || 1;

  // Compute status line for chat header
  const statusLabel = isAiSpeaking
    ? 'Sarah is speaking...'
    : isRecording
    ? 'Listening to your voice...'
    : isAiThinking
    ? 'Sarah is thinking...'
    : 'Waiting for your answer';

  // Overall interview progress % (4 rounds total)
  const overallProgressPct = Math.min(
    100,
    Math.round(((currentRoundNum - 1) * 25) + ((currentQNum / 8) * 25))
  );

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
      
      {/* Centered Single Chat Card (Max 900px) */}
      <div className="w-full bg-white rounded-3xl border border-[#EAEBF4] shadow-sm flex flex-col h-[750px] relative overflow-hidden">
        
        {/* Thin Overall Interview Progress Bar at very top */}
        <div className="h-1.5 w-full bg-slate-100 relative">
          <div
            className="h-full bg-gradient-to-r from-[#7C3AED] via-purple-500 to-indigo-600 transition-all duration-500"
            style={{ width: `${overallProgressPct}%` }}
          />
        </div>

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* CHAT HEADER                                                           */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        <div className="px-5 py-4 bg-white border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            {/* Sarah Vance Avatar with live status dot */}
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-extrabold text-sm shadow-xs">
                SV
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                  isAiSpeaking
                    ? 'bg-purple-500 animate-pulse'
                    : isRecording
                    ? 'bg-rose-500 animate-pulse'
                    : isAiThinking
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-emerald-500'
                }`}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 font-outfit">Sarah Vance</h3>
                <span className="text-[10px] font-semibold text-[#7C3AED] bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                  Senior Placement Partner
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                {isRecording && <Radio className="w-3 h-3 text-rose-500 animate-pulse" />}
                <span>{statusLabel}</span>
              </p>
            </div>
          </div>

          {/* Right Header Controls: Round, Question, Countdown, Mute, End */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-extrabold text-slate-800">
                Round {currentRoundNum}: {currentRoundName.split(' ')[0]}
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                Question {currentQNum} of 10
              </span>
            </div>

            {/* Per-Round Countdown Timer */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
              remainingSec <= 60
                ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTimer(remainingSec)}</span>
            </div>

            {/* Mute Voice Toggle */}
            <button
              type="button"
              onClick={handleToggleMute}
              className={`p-2 rounded-xl border text-xs transition ${
                isMuted
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title={isMuted ? 'Unmute Sarah\'s voice' : 'Mute voice'}
              aria-label={isMuted ? 'Unmute Sarah\'s voice' : 'Mute voice'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#7C3AED]" />}
            </button>

            {/* End Interview / Close Button */}
            <button
              type="button"
              onClick={() => setShowExitConfirm(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              title="End interview early"
              aria-label="End interview early"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* MESSAGE STREAM (Single Card, AI left, User right)                    */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        <div
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FBFBFE]"
          aria-live="polite"
        >
          {chatMessages.map((msg, idx) => {
            const isAi = msg.sender === 'ai';
            return (
              <div
                key={msg.id || idx}
                className={`flex gap-2.5 w-full ${isAi ? 'justify-start' : 'justify-end'}`}
              >
                {/* AI Avatar — left side only */}
                {isAi && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs mt-0.5">
                    SV
                  </div>
                )}

                <div className={`flex flex-col gap-1 max-w-[80%] ${isAi ? 'items-start' : 'items-end'}`}>
                  {/* Message Bubble */}
                  <div
                    className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isAi
                        ? 'bg-white text-slate-800 border border-slate-200/70 rounded-tl-sm'
                        : 'bg-[#7C3AED] text-white rounded-tr-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>

                  {/* Metadata Row: origin tag, voice badge, replay */}
                  <div className={`flex items-center gap-1.5 text-[10px] text-slate-400 px-1`}>
                    {msg.originTag && isAi && (
                      <span className="font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                        {msg.originTag}
                      </span>
                    )}
                    {msg.isVoice && !isAi && (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                        <Mic className="w-2.5 h-2.5" />
                        Voice
                      </span>
                    )}
                    {isAi && (
                      <button
                        type="button"
                        onClick={() => speakText(msg.text)}
                        className="text-slate-300 hover:text-purple-500 transition p-0.5 rounded"
                        title="Replay Sarah's voice"
                        aria-label="Replay voice"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* AI Typing Indicator */}
          {isAiThinking && (
            <div className="flex gap-2.5 items-start">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                SV
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white border border-slate-200/70 rounded-tl-sm flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* ROUND TRANSITION CARD (When round completes)                         */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        {sessionState?.status === 'ROUND_WRAPUP' && (
          <div className="absolute inset-x-4 bottom-20 z-20 bg-white rounded-2xl border-2 border-purple-300 shadow-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-extrabold text-slate-900 font-outfit">
                  Round {currentRoundNum} Complete!
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Next: <strong className="text-purple-700">Round {currentRoundNum + 1}: {ROUND_NAMES[currentRoundNum + 1] || 'Final Evaluation'}</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500">
                Starting in <span className="text-[#7C3AED] text-sm font-mono font-extrabold">{transitionCountdown}s</span>
              </span>
              <button
                type="button"
                onClick={onTransitionRound}
                className="px-5 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* STICKY BOTTOM INPUT BAR                                               */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        <div className="p-4 bg-white border-t border-slate-100 space-y-2">
          
          {/* Active Voice Recording Banner — shows live interim transcript */}
          {isRecording && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-2 min-w-0">
                  {/* Animated audio level bars */}
                  <div className="flex items-end gap-0.5 h-5 shrink-0">
                    {[0.4, 0.7, 1.0, 0.7, 0.5, 0.9, 0.6].map((h, i) => (
                      <span
                        key={i}
                        className="w-1 rounded-sm bg-rose-500 origin-bottom"
                        style={{
                          height: `${Math.max(20, Math.min(100, recordingLevel * h))}%`,
                          animation: `pulse ${0.4 + i * 0.1}s ease-in-out infinite alternate`,
                          opacity: recordingLevel > 5 ? 1 : 0.4
                        }}
                      />
                    ))}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-rose-700">
                      Listening… speak naturally
                    </div>
                    {liveTranscript && (
                      <div className="text-[11px] text-rose-600/80 italic truncate max-w-[260px]">
                        "{liveTranscript}"
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={stopRecording}
                  className="ml-2 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] transition shrink-0"
                >
                  Stop & Use
                </button>
              </div>
              {/* Audio level progress bar */}
              <div className="h-0.5 w-full bg-rose-200">
                <div
                  className="h-full bg-rose-500 transition-all duration-75"
                  style={{ width: `${recordingLevel}%` }}
                />
              </div>
            </div>
          )}

          {isTranscribing && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-100 text-[#7C3AED] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-ping shrink-0" />
              <span>Processing voice…</span>
            </div>
          )}

          <form onSubmit={handleSendAnswer} className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder={isRecording ? "Speak now — transcript appears here in real time…" : "Type your answer or tap the mic to speak…"}
                disabled={isSubmitting || isAiThinking || sessionState?.status === 'ROUND_WRAPUP'}
                className={`w-full pl-4 pr-12 py-3.5 rounded-2xl border text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent bg-slate-50/50 transition ${
                  isRecording ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200'
                }`}
              />

              {/* Mic Toggle Button inside Input */}
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isSubmitting || isAiThinking || isTranscribing || sessionState?.status === 'ROUND_WRAPUP'}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition ${
                  isRecording
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                    : isTranscribing
                    ? 'bg-purple-100 text-[#7C3AED]'
                    : 'text-slate-400 hover:text-[#7C3AED] hover:bg-purple-50'
                }`}
                title={isRecording ? 'Stop recording' : 'Start voice answer'}
                aria-label={isRecording ? 'Stop recording' : 'Start voice answer'}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>

            {/* Circular Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isSubmitting || isAiThinking || sessionState?.status === 'ROUND_WRAPUP'}
              className="w-12 h-12 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              title="Send answer (Enter)"
              aria-label="Send answer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Small Hint Under Input */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#7C3AED]" />
              {isRecording
                ? <span className="text-rose-500 font-semibold">Listening… speak naturally, then tap Stop.</span>
                : isTranscribing
                ? <span className="text-purple-600 font-semibold">Transcribing your voice…</span>
                : <span>Tip: Use STAR — Situation, Task, Action, Result.</span>
              }
            </span>
            <span className="hidden sm:inline text-slate-300">{isRecording ? '' : 'Enter to send'}</span>
          </div>
        </div>

      </div>

      {/* Exit Early Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center gap-3 text-amber-600">
              <AlertCircle className="w-6 h-6" />
              <h4 className="text-base font-bold text-slate-900 font-outfit">End Interview Early?</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sarah will generate your comprehensive evaluation report based on the answers you have provided so far.
            </p>
            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Continue Interview
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirm(false);
                  onEndInterview();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
              >
                End & Get Report
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
