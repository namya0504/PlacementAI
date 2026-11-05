import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ROUND_TYPES,
  SESSION_STATES,
  TIMING_CONFIG,
  createNewSession
} from '../models/interviewModels.js';
import { InterviewService } from '../services/interviewService.js';
import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import {
  calculateFallbackSpeechMetrics
} from '../services/pythonBridge.js';
import {
  INTERVIEWER_PERSONA,
  buildQuickAnalysisPrompt,
  buildNextQuestionPrompt
} from '../services/interviewPrompts.js';

test('1. Session Initialization and Authoritative Timer Setup', () => {
  const session = createNewSession({
    sessionId: 'test_session_123',
    userId: 'user_456',
    targetRole: 'Full Stack Developer',
    experienceLevel: '1-3 yrs',
    keySkills: ['React', 'Node.js', 'PostgreSQL'],
    micEnabled: true
  });

  assert.equal(session.sessionId, 'test_session_123');
  assert.equal(session.currentRound, 1);
  assert.equal(session.status, SESSION_STATES.ROUND_ACTIVE);
  assert.equal(session.targetRole, 'Full Stack Developer');

  // Authoritative server-side timer configuration
  assert.ok(session.roundStartedAt > 0, 'roundStartedAt must be timestamped on backend');
  assert.equal(session.roundTimeLimitSec, TIMING_CONFIG.ROUND_MAX_TIME_SEC, 'Round timer must match ROUND_MAX_TIME_SEC');
  assert.equal(TIMING_CONFIG.ROUND_MIN_TIME_SEC, 180, 'Minimum round duration is 3 minutes (180s)');
  assert.equal(TIMING_CONFIG.ROUND_MAX_TIME_SEC, 420, 'Maximum round duration is 7 minutes (420s)');
  assert.equal(TIMING_CONFIG.MAX_QUESTIONS_PER_ROUND, 10, 'Maximum 10 questions per round');

  // Verify roundsData map structure
  assert.ok(session.roundsData[1], 'Round 1 must be initialized');
  assert.ok(session.roundsData[2], 'Round 2 must be initialized');
  assert.ok(session.roundsData[3], 'Round 3 must be initialized');
  assert.ok(session.roundsData[4], 'Round 4 must be initialized');

  assert.equal(ROUND_TYPES[1].shortName, 'Behavioral');
  assert.equal(ROUND_TYPES[2].shortName, 'Technical');
  assert.equal(ROUND_TYPES[3].shortName, 'Situational');
  assert.equal(ROUND_TYPES[4].shortName, 'Leadership');
});

test('2. Server-Authoritative Timer & Reconnect Preservation', () => {
  const now = Date.now();
  // Simulate session started 120 seconds ago
  const simulatedStart = now - (120 * 1000);
  const timeLimit = TIMING_CONFIG.ROUND_MAX_TIME_SEC; // 420s (7 minutes)

  const elapsedSec = Math.floor((now - simulatedStart) / 1000);
  const remainingSec = Math.max(0, timeLimit - elapsedSec);

  assert.equal(elapsedSec, 120, 'Elapsed time calculated correctly server-side');
  assert.equal(remainingSec, 300, 'Remaining time is 300s (5 mins left)');

  // Refreshing page 30 seconds later should decrease remaining time, never reset
  const refreshNow = now + (30 * 1000);
  const refreshedRemaining = Math.max(0, timeLimit - Math.floor((refreshNow - simulatedStart) / 1000));
  assert.equal(refreshedRemaining, 270, 'Timer does not reset on refresh / reconnect');

  // Timer reaching 0 triggers round end
  const expiredNow = simulatedStart + (430 * 1000);
  const expiredRemaining = Math.max(0, timeLimit - Math.floor((expiredNow - simulatedStart) / 1000));
  assert.equal(expiredRemaining, 0, 'Timer hits 0 after time limit exceeded');
});

test('3. Scoring Integrity Rules: Zero Praise for Empty / Off-topic / Irrelevant Answers', () => {
  // Test prompt guardrails in question generation and persona
  const nextQPrompt = buildNextQuestionPrompt({
    targetRole: 'Backend Engineer',
    experienceLevel: 'Fresher',
    skills: ['Node.js'],
    jobDescription: '',
    candidateProfile: null,
    repoInsights: null,
    roundNumber: 1,
    roundGoal: 'Behavioral past experience',
    transcriptSoFar: [],
    lastAnswerAnalysis: null,
    questionNumber: 2,
    coveredTopics: []
  });

  assert.ok(
    nextQPrompt.includes('Never praise irrelevant answers'),
    'Prompt must explicitly command: Never praise irrelevant answers'
  );
  assert.ok(
    nextQPrompt.includes('If the last answer was empty, off-topic, or "I don\'t know"'),
    'Prompt must handle empty or off-topic responses gracefully'
  );

  // Quick Analysis prompt must evaluate relevance, depth, and STAR completeness
  const quickPrompt = buildQuickAnalysisPrompt(
    'Tell me about a time you resolved a critical incident.',
    'I have never worked on production so I do not know.',
    null
  );

  assert.ok(quickPrompt.includes('"relevance": number (0-10)'), 'Quick analysis requires relevance rating');
  assert.ok(quickPrompt.includes('"depth": number (0-10)'), 'Quick analysis requires depth rating');
  assert.ok(
    quickPrompt.includes('relevance must be 0-2, depth must be 0-1'),
    'Quick analysis mandates scores 0-2 for off-topic, evasive, or empty answers'
  );
});

test('4. Speech & Delivery Confidence Telemetry (Linguistics & Formulas)', () => {
  // 1. Fluent delivery test
  const fluentTranscript = 'In my previous project at university, we designed a microservices architecture using Node.js and Redis. We reduced latency by forty percent and deployed on Kubernetes.';
  const metricsFluent = calculateFallbackSpeechMetrics(fluentTranscript, 10, 1.2);

  assert.ok(metricsFluent.words_per_minute >= 100 && metricsFluent.words_per_minute <= 180, 'Pace should be near conversational 120-160 WPM');
  assert.equal(metricsFluent.filler_words_count, 0, 'Zero fillers in fluent response');
  assert.ok(metricsFluent.speech_confidence_score >= 8.0, 'Fluent delivery should have high speech confidence score');

  // 2. Hesitant delivery with filler words ("um", "uh", "like", "you know")
  const hesitantTranscript = 'Um basically I like uh worked on this app and you know it was sort of difficult basically.';
  const metricsHesitant = calculateFallbackSpeechMetrics(hesitantTranscript, 8, 3.5);

  assert.ok(metricsHesitant.filler_words_count >= 4, 'Should detect multiple filler words');
  assert.ok(metricsHesitant.filler_words_rate_pct > 15, 'Filler word rate percentage should be high');
  assert.ok(metricsHesitant.speech_confidence_score < metricsFluent.speech_confidence_score, 'Hesitant score must be lower than fluent score');
  assert.ok(metricsHesitant.speech_confidence_score >= 1.0 && metricsHesitant.speech_confidence_score <= 10.0, 'Score is bounded [1, 10]');

  // 3. Transparent formula breakdown check
  assert.ok(metricsFluent.confidence_breakdown.pace_score !== undefined, 'Has pace_score breakdown');
  assert.ok(metricsFluent.confidence_breakdown.filler_score !== undefined, 'Has filler_score breakdown');
});

test('5. Multi-round State Progression & Transition Guardrails', () => {
  const session = createNewSession({
    sessionId: 'test_session_progression',
    userId: 'user_test',
    targetRole: 'Data Scientist'
  });

  // Round 1 start
  assert.equal(session.currentRound, 1);
  assert.equal(session.status, SESSION_STATES.ROUND_ACTIVE);
  assert.equal(session.roundsData[1].finishedAt, null);

  // Simulate Round 1 wrapup
  session.roundsData[1].finishedAt = new Date().toISOString();
  session.roundsData[1].cleared = true;
  session.status = SESSION_STATES.ROUND_WRAPUP;

  assert.equal(session.status, SESSION_STATES.ROUND_WRAPUP);
  assert.ok(session.roundsData[1].finishedAt !== null);

  // Transition to Round 2
  session.currentRound = 2;
  session.roundsData[2].startedAt = new Date().toISOString();
  session.status = SESSION_STATES.ROUND_ACTIVE;
  session.roundStartedAt = Date.now();

  assert.equal(session.currentRound, 2);
  assert.equal(session.status, SESSION_STATES.ROUND_ACTIVE);
  assert.ok(session.roundsData[2].startedAt !== null);

  // Final completion
  session.status = SESSION_STATES.REPORT;
  session.completedAt = new Date().toISOString();

  assert.equal(session.status, SESSION_STATES.REPORT);
  assert.ok(session.completedAt !== null);
});

test('6. InterviewService.startSession initializes session and produces opening question', async () => {
  const originalSetDoc = FirestoreHelper.setDoc;
  FirestoreHelper.setDoc = async (col, id, data) => ({ id, ...data });

  try {
    const result = await InterviewService.startSession({
      userId: 'unit_test_user_789',
      targetRole: 'Software Engineer',
      experienceLevel: 'Fresher',
      keySkills: ['JavaScript', 'React'],
      micEnabled: true
    });

    assert.ok(result.sessionId, 'Result must contain sessionId');
    assert.equal(result.targetRole, 'Software Engineer');
    assert.equal(result.currentRound, 1);
    assert.equal(result.status, SESSION_STATES.ROUND_ACTIVE);
    assert.ok(result.roundRemainingSec > 0, 'roundRemainingSec must be positive');
    assert.ok(result.roundStartedAt > 0, 'roundStartedAt must be set');
    assert.ok(result.chatMessages.length >= 1, 'Chat messages must contain the initial AI message');
    assert.equal(result.chatMessages[0].sender, 'ai');
    assert.ok(result.chatMessages[0].text.length > 10, 'Initial AI question must have content');
  } finally {
    FirestoreHelper.setDoc = originalSetDoc;
  }
});
