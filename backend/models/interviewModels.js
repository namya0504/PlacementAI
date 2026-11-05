/**
 * PlacementAI Interview Data Models & Validation Schemas
 * Type definitions and sanitization structures for multi-round interviews.
 */

export const ROUND_TYPES = {
  1: {
    number: 1,
    name: 'Behavioral & Core Introduction',
    shortName: 'Behavioral',
    goal: 'Past experience, teamwork, handling failure/conflict, communication, and motivations (STAR method).'
  },
  2: {
    number: 2,
    name: 'Technical & Architecture Deep-Dive',
    shortName: 'Technical',
    goal: 'Role-specific technologies, project architecture, trade-offs, debugging, and code design reasoning.'
  },
  3: {
    number: 3,
    name: 'Situational & Team Dynamics',
    shortName: 'Situational',
    goal: 'Hypothetical workplace scenarios, dealing with tight deadlines, production bugs, and stakeholder ambiguity.'
  },
  4: {
    number: 4,
    name: 'Leadership & Culture Fit',
    shortName: 'Leadership',
    goal: 'Ownership mindset, mentoring, decision-making under pressure, and long-term career vision.'
  }
};

export const SESSION_STATES = {
  SETUP: 'SETUP',
  ROUND_ACTIVE: 'ROUND_ACTIVE',
  ROUND_WRAPUP: 'ROUND_WRAPUP',
  ROUND_TRANSITION: 'ROUND_TRANSITION',
  EVALUATING: 'EVALUATING',
  REPORT: 'REPORT',
  ABANDONED: 'ABANDONED'
};

export const TIMING_CONFIG = {
  ROUND_MIN_TIME_SEC: 180,    // 3 minutes minimum per round
  ROUND_MAX_TIME_SEC: 420,    // 7 minutes maximum per round
  MAX_QUESTIONS_PER_ROUND: 10,
  MIN_QUESTIONS_PER_ROUND: 4,
  GRACE_PERIOD_SEC: 30,       // 30s grace period when timer expires mid-answer
  TRANSITION_COUNTDOWN_SEC: 5 // 5s auto-countdown on round transition
};

/**
 * Creates a blank new Interview Session document.
 */
export function createNewSession({
  sessionId,
  userId,
  targetRole,
  experienceLevel = 'Fresher',
  keySkills = [],
  jobDescription = '',
  candidateProfile = null,
  repoInsights = null,
  micEnabled = true
}) {
  const now = new Date().toISOString();
  return {
    sessionId,
    userId,
    targetRole: targetRole || 'Software Engineer',
    experienceLevel,
    keySkills: Array.isArray(keySkills) ? keySkills : [],
    jobDescription: jobDescription || '',
    candidateProfile: candidateProfile || null,
    repoInsights: repoInsights || null,
    micEnabled: Boolean(micEnabled),
    status: SESSION_STATES.ROUND_ACTIVE,
    currentRound: 1,
    currentQuestionIndex: 0,
    roundStartedAt: Date.now(),
    roundTimeLimitSec: TIMING_CONFIG.ROUND_MAX_TIME_SEC,
    overallStartedAt: now,
    completedAt: null,
    roundsData: {
      1: { questions: [], cleared: false, startedAt: now, finishedAt: null },
      2: { questions: [], cleared: false, startedAt: null, finishedAt: null },
      3: { questions: [], cleared: false, startedAt: null, finishedAt: null },
      4: { questions: [], cleared: false, startedAt: null, finishedAt: null }
    },
    chatMessages: [], // Unified chat stream for UI
    finalReport: null,
    updatedAt: now
  };
}
