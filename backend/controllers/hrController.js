import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { GrokService } from '../services/grokService.js';
import { getStudentContext } from '../services/studentContext.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { calculatePlacementReadiness } from '../utils/scoring.js';
import { InterviewService } from '../services/interviewService.js';
import { PythonBridge } from '../services/pythonBridge.js';
import { TextExtractorService } from '../services/textExtractorService.js';
import { SocialProfileService } from '../services/socialProfileService.js';
import {
  buildResumeIngestionPrompt,
  buildGitHubInsightsPrompt
} from '../services/interviewPrompts.js';

const ROUND_PASS_THRESHOLD = 60; // avg score >= 60 to clear a round
const ROUND_MIN_ANSWERS = 2;     // must answer at least 2 questions to be eligible for clearance

/**
 * Compute per-round progress for a user from their hr_interviews records.
 * Returns { [round]: { answered, totalScore, avgScore, cleared } }
 */
async function getRoundProgress(userId) {
  const allInterviews = await FirestoreHelper.queryCollection('hr_interviews', 'userId', userId);
  const roundMap = {};
  for (const iv of allInterviews) {
    const r = iv.round || 1;
    if (!roundMap[r]) roundMap[r] = { answered: 0, totalScore: 0, avgScore: 0, cleared: false };
    roundMap[r].answered++;
    roundMap[r].totalScore += iv.score || 0;
  }
  for (const r of Object.keys(roundMap)) {
    const rm = roundMap[r];
    rm.avgScore = rm.answered > 0 ? Math.round(rm.totalScore / rm.answered) : 0;
    rm.cleared = rm.answered >= ROUND_MIN_ANSWERS && rm.avgScore >= ROUND_PASS_THRESHOLD;
  }
  return roundMap;
}

// ══════════════════════════════════════════════════════════════════════════════
// 1. MULTI-ROUND CHAT INTERVIEW SESSION CONTROLLERS (New Upgrade)
// ══════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/hr/session/start
 * Starts a new multi-round interview session.
 */
export const startInterviewSession = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const {
      targetRole,
      experienceLevel = 'Fresher',
      keySkills = [],
      jobDescription = '',
      candidateProfile = null,
      repoInsights = null,
      micEnabled = true
    } = req.body;

    if (!targetRole || !String(targetRole).trim()) {
      return sendError(res, 'Target role is required to start the interview.', 400);
    }

    const sessionState = await InterviewService.startSession({
      userId,
      targetRole: String(targetRole).trim(),
      experienceLevel,
      keySkills,
      jobDescription,
      candidateProfile,
      repoInsights,
      micEnabled
    });

    return sendSuccess(res, { session: sessionState, ...sessionState }, 'Interview session initialized successfully.', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/hr/session/:sessionId/state
 * Retrieves authoritative server session state, including remaining timer.
 */
export const getInterviewSessionState = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { sessionId } = req.params;
    const state = await InterviewService.getSessionState(sessionId, userId);
    return sendSuccess(res, { session: state, ...state }, 'Session state retrieved.');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/hr/session/:sessionId/answer
 * Submits user response (voice or typed), evaluates quick metrics, returns next question or wrapup.
 */
export const submitInterviewAnswer = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { sessionId } = req.params;
    const { userResponse, isVoice = false, speechMetrics = null, latencySec = 1.5 } = req.body;

    const state = await InterviewService.submitAnswer(sessionId, userId, {
      userResponse,
      isVoice,
      speechMetrics,
      latencySec
    });

    return sendSuccess(res, { session: state, ...state }, 'Answer recorded.');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/hr/session/:sessionId/transition
 * Transitions from round wrap-up to the next round.
 */
export const transitionInterviewRound = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { sessionId } = req.params;
    const state = await InterviewService.transitionRound(sessionId, userId);
    return sendSuccess(res, { session: state, ...state }, 'Transitioned to next round.');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/hr/session/:sessionId/end
 * Concludes interview early or upon completion, generates comprehensive final report.
 */
export const endInterviewSession = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { sessionId } = req.params;
    const state = await InterviewService.endSession(sessionId, userId);
    const finalReport = state.finalReport || {};
    return sendSuccess(res, { report: finalReport, session: state, ...state }, 'Interview concluded and report generated.');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/hr/session/:sessionId/report
 * Returns the final report for a session.
 */
export const getInterviewReport = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { sessionId } = req.params;
    const session = await FirestoreHelper.getDoc('hr_interview_sessions', sessionId);
    if (!session || session.userId !== userId) {
      return sendError(res, 'Session report not found.', 404);
    }
    const report = session.finalReport || {};
    return sendSuccess(res, { report, ...report }, 'Report retrieved.');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/hr/voice/transcribe
 * Multipart voice upload -> Python transcription + speech delivery analytics.
 */
export const transcribeInterviewVoice = async (req, res, next) => {
  try {
    if (!req.file || !req.file.buffer) {
      return sendError(res, 'No audio file provided.', 400);
    }

    const { language = 'en-IN', latency = 1.5, sessionId = null, questionId = null } = req.body;
    const result = await PythonBridge.transcribeAudio(
      req.file.buffer,
      req.file.originalname || 'recording.webm',
      {
        language,
        latency: Number(latency) || 1.5,
        sessionId,
        questionId
      }
    );

    return sendSuccess(res, result, 'Voice audio processed successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * Heuristically extracts technical projects and stacks directly from resume text
 * when LLM extraction returns empty or is bypassed.
 */
function extractProjectsFromText(text) {
  if (!text || typeof text !== 'string') return [];
  const projects = [];

  const projectSectionMatch = text.match(
    /(?:^|\n)\s*(?:[#*=-]*\s*)?(?:Academic Projects|Personal Projects|Key Projects|Project Work|Selected Projects|Projects|Major Projects|Mini Projects|Technical Projects|Notable Projects)(?:[\s:*=-]*\n)([\s\S]*?)(?=(?:\n\s*(?:[#*=-]*\s*)?(?:Technical Skills|Skills|Education|Experience|Work Experience|Employment|Certifications|Achievements|Activities|Strengths|Honors|Languages|Declaration|Interests)[\s:*=-]*\n)|$)/i
  );

  const sectionText = projectSectionMatch ? projectSectionMatch[1].trim() : text;
  const lines = sectionText.split('\n').map(l => l.trim()).filter(Boolean);
  let currentProject = null;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const stripped = rawLine.replace(/^[•●*–-]\s*/, '').replace(/^[0-9]+[.)]\s*/, '').replace(/\*+/g, '').trim();
    if (!stripped || stripped.length < 3) continue;

    // Check if this line looks like a project header
    const hasDelimiter = /^[A-Za-z0-9][^|—–:(\n]{2,45}\s*(?:[|—–:]|\([A-Za-z0-9\s,./+#-]+\))\s*/.test(stripped);
    const isShortHeader = stripped.length <= 50 && (i + 1 < lines.length) && /^[•●*–-]/.test(lines[i + 1]);
    const isNumbered = /^[0-9]+[.)]\s+/.test(rawLine);

    if (hasDelimiter || isShortHeader || isNumbered) {
      if (currentProject && currentProject.name) {
        projects.push(currentProject);
      }
      let title = stripped;
      let tech = [];

      // Extract tech from parentheses e.g. 'Project (React, Node.js)'
      const parenMatch = stripped.match(/^(.*?)\s*\(([^)]+)\)\s*(?::(.*))?$/);
      if (parenMatch) {
        title = parenMatch[1].trim();
        tech = parenMatch[2].split(/[,•·|/]/).map(t => t.trim()).filter(t => t.length > 1 && !/live|github|http/i.test(t));
      } else {
        const parts = stripped.split(/[|—–:]/).map(p => p.trim());
        title = parts[0];
        if (parts.length > 1 && parts[1].length < 60) {
          tech = parts[1].split(/[,•·|/]/).map(t => t.trim()).filter(t => t.length > 1 && !/live|github|http/i.test(t));
        }
      }

      currentProject = {
        name: title.replace(/^[#*=-]+\s*/, '').slice(0, 50).trim(),
        description: '',
        tech,
        role: 'Developer',
        outcomes: []
      };
    } else if (currentProject) {
      const cleanLine = rawLine.replace(/^[•●*–-]\s*/, '').trim();
      if (!/^(github|live|link|http)/i.test(cleanLine)) {
        currentProject.description = currentProject.description
          ? `${currentProject.description} ${cleanLine}`
          : cleanLine;
      }
    }
  }

  if (currentProject && currentProject.name) {
    projects.push(currentProject);
  }

  return projects
    .filter(p => p.name.length >= 3 && !/^(projects|skills|education|experience|summary|certifications)$/i.test(p.name))
    .slice(0, 6);
}

/**
 * POST /api/hr/resume/parse
 * Multipart resume upload -> Text extraction -> structured candidate profile.
 */
export const parseInterviewResume = async (req, res, next) => {
  try {
    if (!req.file || !req.file.buffer) {
      return sendError(res, 'No resume file uploaded.', 400);
    }

    const userId = req.user?.userId;
    const isNewUpload = req.body?.isNewUpload === 'true' || req.query?.isNewUpload === 'true';

    // 1. Text extraction: Try Node.js TextExtractorService (pdf-parse / mammoth) first, fallback to Python
    let rawText = '';
    try {
      rawText = await TextExtractorService.extractTextFromFile(req.file.buffer, req.file.mimetype || req.file.originalname);
    } catch (e) {
      console.warn('[parseInterviewResume] TextExtractorService notice:', e.message);
    }

    if (!rawText || rawText.trim().length < 20) {
      try {
        rawText = await PythonBridge.extractResumeText(req.file.buffer, req.file.originalname);
      } catch (e) {
        console.warn('[parseInterviewResume] PythonBridge notice:', e.message);
      }
    }

    // Fallback: ONLY when auto-loading on file for the user profile, NEVER when uploading a new file!
    if ((!rawText || rawText.trim().length < 20) && !isNewUpload && userId) {
      const userResumes = await FirestoreHelper.queryCollection('resumes', 'userId', userId).catch(() => []);
      const match = userResumes.find(r => r.parsedText && r.parsedText.trim().length > 30);
      if (match) {
        rawText = match.parsedText;
        console.log(`[parseInterviewResume] Auto-load reusing stored parsedText (${rawText.length} chars)`);
      }
    }

    if (!rawText || rawText.trim().length < 20) {
      return sendError(
        res,
        `Could not extract readable text from "${req.file.originalname}". Please verify the file is not an image-only scan and contains selectable text.`,
        400
      );
    }

    // 2. Structured parse via GrokService
    let profile = null;
    try {
      const prompt = buildResumeIngestionPrompt(rawText);
      profile = await GrokService.generateJSON(prompt, { featureType: 'profileExtraction' });
    } catch (parseErr) {
      console.warn('[parseInterviewResume] Full parse failed, trying simplified prompt:', parseErr.message);
      const simplePrompt = `You are a resume parser. Extract ALL technical projects, skills, education, and experience from this resume into JSON.
CRITICAL: Do NOT leave "projects" empty if any projects, websites, apps, or practical works are mentioned!
Schema:
{
  "name": string or null,
  "summary": string or null,
  "skills": { "languages": [string], "frameworks": [string], "tools": [string], "soft": [string] },
  "projects": [ { "name": string, "description": string, "tech": [string], "role": string } ],
  "experience": [ { "company": string, "title": string, "duration": string } ],
  "claims_to_verify": [string]
}
Resume Text:
${rawText.slice(0, 7000)}
Return JSON only.`;
      try {
        profile = await GrokService.generateJSON(simplePrompt, { featureType: 'profileExtraction' });
      } catch (fallbackErr) {
        console.warn('[parseInterviewResume] Simplified parse also failed:', fallbackErr.message);
        profile = {
          name: null,
          summary: '',
          skills: { languages: [], frameworks: [], tools: [], soft: [] },
          projects: [],
          experience: [],
          claims_to_verify: [],
          interview_probes: [],
          _fallback: true
        };
      }
    }

    // 3. Heuristic project extraction from raw text if LLM extracted 0 projects from this uploaded resume
    if (!Array.isArray(profile.projects) || profile.projects.length === 0) {
      const heuristicProjects = extractProjectsFromText(rawText);
      if (heuristicProjects.length > 0) {
        profile.projects = heuristicProjects;
        console.log(`[parseInterviewResume] Extracted ${heuristicProjects.length} projects via heuristic text scanner`);
      }
    }

    // Check if project entries were classified into experience
    if ((!profile.projects || profile.projects.length === 0) && Array.isArray(profile.experience)) {
      const projectLikeExp = profile.experience.filter(e =>
        /project|app|portal|system|clone|website|dashboard/i.test(e.company || e.title || '')
      );
      if (projectLikeExp.length > 0) {
        profile.projects = projectLikeExp.map(e => ({
          name: e.title || e.company || 'Project',
          description: Array.isArray(e.responsibilities) ? e.responsibilities.join(' ') : (e.duration || ''),
          tech: Array.isArray(e.tech) ? e.tech : [],
          role: e.title || 'Developer',
          outcomes: []
        }));
      }
    }

    // 4. Fallback to profile database projects ONLY for auto-load, NEVER when candidate uploads a custom resume
    if (!isNewUpload && userId && (!Array.isArray(profile.projects) || profile.projects.length === 0)) {
      const savedProjects = await FirestoreHelper.queryCollection('projects', 'userId', userId).catch(() => []);
      if (savedProjects.length > 0) {
        profile.projects = savedProjects.map(p => ({
          name: p.title || p.name || 'Project',
          description: p.description || '',
          tech: typeof p.tech === 'string' ? p.tech.split(',').map(t => t.trim()) : (Array.isArray(p.tech) ? p.tech : []),
          role: p.role || 'Developer',
          outcomes: []
        }));
      }
    }

    // 5. Generate claims_to_verify dynamically based on THIS resume's detected projects
    if (!Array.isArray(profile.claims_to_verify) || profile.claims_to_verify.length === 0) {
      const claims = [];
      if (Array.isArray(profile.projects) && profile.projects.length > 0) {
        profile.projects.forEach(p => {
          if (p.name) {
            claims.push(`Architectural design, component hierarchy, and workflows in ${p.name}`);
            if (p.tech && p.tech.length > 0) {
              const stackStr = Array.isArray(p.tech) ? p.tech.slice(0, 3).join(', ') : String(p.tech);
              claims.push(`Implementation trade-offs and error handling using ${stackStr}`);
            }
          }
        });
      }
      if (Array.isArray(profile.experience) && profile.experience.length > 0) {
        profile.experience.forEach(e => {
          if (e.company || e.title) {
            claims.push(`Engineering responsibilities and deliverables at ${e.company || e.title}`);
          }
        });
      }
      profile.claims_to_verify = claims.slice(0, 4);
    }

    return sendSuccess(res, {
      filename: req.file.originalname,
      candidateProfile: profile,
      previewText: rawText.slice(0, 300)
    }, 'Resume parsed successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/hr/github/inspect
 * Ingests candidate public GitHub portfolio and produces interview insights.
 */
export const inspectCandidateGitHub = async (req, res, next) => {
  try {
    const { username, url } = req.body;
    const input = username || url;
    if (!input) {
      return sendError(res, 'GitHub username or profile URL is required.', 400);
    }

    const ghData = await SocialProfileService.fetchGitHubData(input);
    if (!ghData) {
      return sendError(res, `Could not find public GitHub profile for "${input}".`, 404);
    }

    const reposList = (ghData.repositories && ghData.repositories.length > 0)
      ? ghData.repositories
      : (ghData.featuredProjects || []);

    // Generate repo insights via LLM
    let repoInsights = [];
    if (reposList.length > 0) {
      const prompt = buildGitHubInsightsPrompt(reposList);
      repoInsights = await GrokService.generateJSON(prompt).catch(() => []);
    }

    return sendSuccess(res, {
      profile: {
        username: ghData.username,
        name: ghData.name,
        avatarUrl: ghData.avatarUrl,
        bio: ghData.bio,
        publicRepos: ghData.publicReposCount || ghData.publicRepos || 0
      },
      repositories: reposList,
      repoInsights: Array.isArray(repoInsights) ? repoInsights : []
    }, 'GitHub profile inspected.');
  } catch (err) {
    next(err);
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// 2. LEGACY COMPATIBILITY CONTROLLERS (Single-question mode & history)
// ══════════════════════════════════════════════════════════════════════════════

export const getHRQuestions = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const round = req.query.round ? Number(req.query.round) : 1;
    const forceGenerate = req.query.generate === 'true';

    if (round > 1) {
      const progress = await getRoundProgress(userId);
      const prevRound = round - 1;
      const prevStatus = progress[prevRound];
      if (!prevStatus || !prevStatus.cleared) {
        return sendError(res, `Round ${prevRound} must be cleared first. Answer at least ${ROUND_MIN_ANSWERS} questions with an average score of ${ROUND_PASS_THRESHOLD}% or above.`, 403);
      }
    }

    const studentContext = await getStudentContext(userId);
    const profile = await FirestoreHelper.getDoc('profiles', 'prof_' + userId) || {};
    const userDoc = await FirestoreHelper.getDoc('users', userId) || {};
    const resumes = await FirestoreHelper.queryCollection('resumes', 'userId', userId);
    const latestResume = resumes[resumes.length - 1] || {};

    const effectiveRole = req.query.role || profile.targetRole || profile.role || userDoc.targetRole || userDoc.role || studentContext.targetRole || latestResume.role || '';

    let questions = [];

    if (!forceGenerate) {
      const userQuestions = await FirestoreHelper.queryCollection('hr_questions', 'userId', userId);
      const matching = userQuestions.filter(q => 
        q.round === round &&
        (!effectiveRole || !q.targetRole || q.targetRole.toLowerCase() === effectiveRole.toLowerCase())
      );
      if (matching.length >= 2) {
        questions = matching.slice(0, 4);
      }
    }

    if (questions.length === 0 || forceGenerate) {
      const userContext = {
        role: effectiveRole,
        skills: profile.skills || latestResume.skills || studentContext.skills || ['Problem Solving'],
        projects: profile.projects || latestResume.projects || [{ title: 'Academic Project' }],
        interests: profile.interests || ['Technology']
      };

      questions = await GrokService.generateHRQuestions(userContext, studentContext, round, []);

      for (const q of questions) {
        const questionDoc = {
          ...q,
          userId,
          targetRole: effectiveRole,
          round,
          createdAt: new Date().toISOString()
        };
        await FirestoreHelper.setDoc('hr_questions', q.id, questionDoc);
      }
    }

    return sendSuccess(res, { round, questions }, `Round ${round} questions fetched`);
  } catch (err) {
    next(err);
  }
};

export const evaluateHRAnswer = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { questionId, questionTitle, userResponse, round = 1 } = req.body;

    if (!userResponse || userResponse.trim().length === 0) {
      return sendError(res, 'Answer cannot be empty', 400);
    }

    const studentContext = await getStudentContext(userId);
    const evaluation = await GrokService.evaluateHRAnswer(questionTitle || 'HR Question', userResponse, studentContext);

    const interviewId = 'hr_int_' + userId + '_' + Date.now();
    const interviewData = {
      interviewId,
      userId,
      round,
      questionId,
      questionTitle,
      userResponse,
      score: evaluation.overallScore,
      evaluateScores: evaluation.scores,
      feedback: evaluation.feedback,
      completedAt: new Date().toISOString()
    };

    await FirestoreHelper.setDoc('hr_interviews', interviewId, interviewData);

    const progress = await getRoundProgress(userId);
    const roundStatus = progress[round] || { answered: 0, avgScore: 0, cleared: false };

    const readiness = await FirestoreHelper.getDoc('placement_readiness', 'readiness_' + userId) || {};
    const mockInterviews = (readiness.mockInterviews || 0) + 1;
    const prevHr = typeof readiness.hrScore === 'number' ? readiness.hrScore : null;
    const newHrScore = prevHr !== null
      ? Math.round((prevHr * (mockInterviews - 1) + evaluation.overallScore) / mockInterviews)
      : evaluation.overallScore;

    const updatedStats = { ...readiness, hrScore: newHrScore, mockInterviews };
    updatedStats.overallReadiness = calculatePlacementReadiness(updatedStats);
    await FirestoreHelper.setDoc('placement_readiness', 'readiness_' + userId, updatedStats);

    return sendSuccess(res, {
      interviewId,
      evaluation,
      roundStatus,
      updatedStats
    }, 'HR answer evaluated successfully');
  } catch (err) {
    next(err);
  }
};

export const getHRHistory = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const [allInterviews, allSessions] = await Promise.all([
      FirestoreHelper.queryCollection('hr_interviews', 'userId', userId),
      FirestoreHelper.queryCollection('hr_interview_sessions', 'userId', userId)
    ]);

    allInterviews.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
    allSessions.sort((a, b) => new Date(b.overallStartedAt || 0) - new Date(a.overallStartedAt || 0));

    // Group individual answers by round
    const byRound = {};
    for (const iv of allInterviews) {
      const r = iv.round || 1;
      if (!byRound[r]) byRound[r] = [];
      byRound[r].push({
        interviewId: iv.interviewId,
        round: r,
        questionTitle: iv.questionTitle,
        userResponse: iv.userResponse,
        score: iv.score,
        scores: iv.evaluateScores || {},
        feedback: iv.feedback,
        completedAt: iv.completedAt
      });
    }

    const progress = await getRoundProgress(userId);

    // Formatted multi-round sessions
    const sessions = allSessions.map(s => ({
      sessionId: s.sessionId,
      targetRole: s.targetRole,
      experienceLevel: s.experienceLevel,
      status: s.status,
      overallScore: s.finalReport?.overallScore || null,
      verdict: s.finalReport?.verdict || null,
      startedAt: s.overallStartedAt,
      completedAt: s.completedAt
    }));

    return sendSuccess(res, { byRound, progress, sessions }, 'HR interview history retrieved');
  } catch (err) {
    next(err);
  }
};

export const getHRProgress = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const progress = await getRoundProgress(userId);
    return sendSuccess(res, { progress, passThreshold: ROUND_PASS_THRESHOLD, minAnswers: ROUND_MIN_ANSWERS }, 'HR round progress retrieved');
  } catch (err) {
    next(err);
  }
};
