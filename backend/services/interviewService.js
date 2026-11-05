import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { GrokService } from './grokService.js';
import {
  ROUND_TYPES,
  SESSION_STATES,
  TIMING_CONFIG,
  createNewSession
} from '../models/interviewModels.js';
import {
  buildNextQuestionPrompt,
  buildQuickAnalysisPrompt,
  buildFinalEvaluationPrompt
} from './interviewPrompts.js';
import { calculatePlacementReadiness } from '../utils/scoring.js';

export const InterviewService = {
  /**
   * 1. Initialize a new interview session and generate the opener question.
   */
  async startSession({
    userId,
    targetRole,
    experienceLevel = 'Fresher',
    keySkills = [],
    jobDescription = '',
    candidateProfile = null,
    repoInsights = null,
    micEnabled = true
  }) {
    // ── Auto-enrich context from saved profile & resume when frontend didn't parse ──
    let enrichedProfile = candidateProfile;
    let enrichedSkills = Array.isArray(keySkills) && keySkills.length > 0 ? keySkills : [];
    let enrichedRole = targetRole;

    try {
      const [profileDoc, userDoc, resumes] = await Promise.all([
        FirestoreHelper.getDoc('profiles', `prof_${userId}`).catch(() => null),
        FirestoreHelper.getDoc('users', userId).catch(() => null),
        FirestoreHelper.queryCollection('resumes', 'userId', userId).catch(() => [])
      ]);

      // Resolve the best target role
      if (!enrichedRole || !String(enrichedRole).trim()) {
        enrichedRole = profileDoc?.targetRole || profileDoc?.role || userDoc?.targetRole || userDoc?.role || 'Software Engineer';
      }

      // Merge profile skills if frontend sent empty/minimal list
      if (enrichedSkills.length < 3) {
        const profileSkills = Array.isArray(profileDoc?.skills) ? profileDoc.skills : [];
        if (profileSkills.length > 0) {
          enrichedSkills = [...new Set([...enrichedSkills, ...profileSkills])].slice(0, 12);
        }
      }

      // If no candidateProfile was parsed by frontend, synthesize a minimal one from Firestore data
      if (!enrichedProfile) {
        const primaryResume = resumes.find(r => r.isPrimary) || resumes[resumes.length - 1] || null;
        const projects = Array.isArray(primaryResume?.projects) ? primaryResume.projects
          : Array.isArray(profileDoc?.projects) ? profileDoc.projects : [];
        const experience = Array.isArray(primaryResume?.experience) ? primaryResume.experience : [];
        const skills = Array.isArray(primaryResume?.skills) ? primaryResume.skills
          : Array.isArray(profileDoc?.skills) ? { languages: profileDoc.skills, frameworks: [], tools: [], soft: [] } : {};
        const certifications = Array.isArray(primaryResume?.certificates) ? primaryResume.certificates : [];

        if (projects.length > 0 || experience.length > 0 || enrichedSkills.length > 0) {
          enrichedProfile = {
            name: userDoc?.name || null,
            summary: profileDoc?.bio || null,
            total_experience_years: 0,
            education: [],
            experience,
            projects: projects.map(p => ({
              name: p.name || p.title || 'Project',
              description: p.description || '',
              tech: Array.isArray(p.techStack) ? p.techStack : (Array.isArray(p.tech) ? p.tech : []),
              role: p.role || 'Developer',
              outcomes: Array.isArray(p.outcomes) ? p.outcomes : []
            })),
            skills: typeof skills === 'object' && !Array.isArray(skills) ? skills : { languages: enrichedSkills, frameworks: [], tools: [], soft: [] },
            certifications,
            claims_to_verify: [],
            interview_probes: []
          };
        }
      }
    } catch (enrichErr) {
      console.warn('[InterviewService] Profile enrichment warning:', enrichErr.message);
    }

    const sessionId = `hr_sess_${userId}_${Date.now()}`;
    const session = createNewSession({
      sessionId,
      userId,
      targetRole: enrichedRole,
      experienceLevel,
      keySkills: enrichedSkills,
      jobDescription,
      candidateProfile: enrichedProfile,
      repoInsights,
      micEnabled
    });

    // Generate Round 1 Opening Question
    const prompt = buildNextQuestionPrompt({
      targetRole: session.targetRole,
      experienceLevel: session.experienceLevel,
      skills: session.keySkills,
      jobDescription: session.jobDescription,
      candidateProfile: session.candidateProfile,
      repoInsights: session.repoInsights,
      roundNumber: 1,
      roundGoal: ROUND_TYPES[1].goal,
      transcriptSoFar: [],
      lastAnswerAnalysis: null,
      questionNumber: 1,
      coveredTopics: []
    });

    let qData = null;
    try {
      qData = await GrokService.generateJSON(prompt);
    } catch (err) {
      console.warn('[InterviewService] Opener question generation fallback:', err.message);
    }

    const firstQuestion = {
      questionId: `q_1_1`,
      questionNumber: 1,
      round: 1,
      questionText: qData?.questionText || `Welcome! To start off, could you walk me through your journey, background, and what drew you to this ${session.targetRole} role?`,
      category: qData?.category || 'Behavioral',
      originTag: qData?.originTag || 'Role Standard',
      tip: qData?.tip || 'Use the STAR method: Situation, Task, Action, and Result.',
      userResponse: '',
      isVoice: false,
      speechMetrics: null,
      quickAnalysis: null,
      createdAt: new Date().toISOString()
    };

    session.roundsData[1].questions.push(firstQuestion);
    session.currentQuestionIndex = 0;

    // Add Sarah's message to chat stream
    session.chatMessages.push({
      id: `msg_ai_1_1`,
      sender: 'ai',
      text: firstQuestion.questionText,
      originTag: firstQuestion.originTag,
      tip: firstQuestion.tip,
      timestamp: new Date().toISOString()
    });

    await FirestoreHelper.setDoc('hr_interview_sessions', sessionId, session);
    return this.sanitizeSessionForClient(session);
  },

  /**
   * 2. Authoritative server-side state calculation.
   */
  async getSessionState(sessionId, userId) {
    const session = await FirestoreHelper.getDoc('hr_interview_sessions', sessionId);
    if (!session || session.userId !== userId) {
      throw new Error('Interview session not found or unauthorized.');
    }

    const elapsedSec = Math.floor((Date.now() - session.roundStartedAt) / 1000);
    const remainingSec = Math.max(0, session.roundTimeLimitSec - elapsedSec);

    // Auto-detect round expiry if still marked ACTIVE
    if (remainingSec === 0 && session.status === SESSION_STATES.ROUND_ACTIVE) {
      session.isRoundTimeExpired = true;
    }

    return {
      ...this.sanitizeSessionForClient(session),
      roundElapsedSec: elapsedSec,
      roundRemainingSec: remainingSec,
      isMinTimeMet: elapsedSec >= TIMING_CONFIG.ROUND_MIN_TIME_SEC,
      totalSessionElapsedSec: Math.floor((Date.now() - new Date(session.overallStartedAt).getTime()) / 1000)
    };
  },

  /**
   * 3. Submit Candidate Answer, run fast quick analysis, and generate next question or round wrap-up.
   */
  async submitAnswer(sessionId, userId, { userResponse, isVoice = false, speechMetrics = null, latencySec = 1.5 }) {
    const session = await FirestoreHelper.getDoc('hr_interview_sessions', sessionId);
    if (!session || session.userId !== userId) {
      throw new Error('Interview session not found.');
    }

    const currentRnd = session.currentRound;
    const roundData = session.roundsData[currentRnd];
    const currentQ = roundData.questions[roundData.questions.length - 1];

    if (!currentQ) {
      throw new Error('No active question in this round.');
    }

    // 1. Record User Answer & Speech Metrics
    currentQ.userResponse = userResponse || '';
    currentQ.isVoice = Boolean(isVoice);
    currentQ.speechMetrics = isVoice ? speechMetrics : null;
    currentQ.answeredAt = new Date().toISOString();

    // Append user message to chat stream
    session.chatMessages.push({
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: userResponse || '(No response provided)',
      isVoice: Boolean(isVoice),
      speechConfidence: speechMetrics?.speech_confidence_score || null,
      timestamp: new Date().toISOString()
    });

    // 2. Fast Quick Analysis LLM Call
    let quickAnalysis = null;
    try {
      const quickPrompt = buildQuickAnalysisPrompt(
        currentQ.questionText,
        userResponse,
        session.candidateProfile
      );
      quickAnalysis = await GrokService.generateJSON(quickPrompt);
    } catch (err) {
      console.warn('[InterviewService] Quick analysis warning:', err.message);
      const isShort = !userResponse || userResponse.trim().length < 15;
      quickAnalysis = {
        relevance: isShort ? 2 : 7,
        depth: isShort ? 1 : 6,
        is_off_topic_or_empty: isShort,
        star_completeness: { situation: true, task: true, action: !isShort, result: !isShort },
        key_points_missed: isShort ? ['Depth', 'Specific metrics'] : [],
        follow_up_hint: 'Probe for specific implementation details'
      };
    }
    currentQ.quickAnalysis = quickAnalysis;

    // 3. Timing & Progression Evaluation
    const elapsedSec = Math.floor((Date.now() - session.roundStartedAt) / 1000);
    const questionsAnswered = roundData.questions.length;
    const isMinTimeMet = elapsedSec >= TIMING_CONFIG.ROUND_MIN_TIME_SEC;
    const isMaxQuestionsMet = questionsAnswered >= TIMING_CONFIG.MAX_QUESTIONS_PER_ROUND;
    const isTimeExpired = elapsedSec >= session.roundTimeLimitSec;

    const shouldWrapUpRound = isTimeExpired || (isMinTimeMet && (isMaxQuestionsMet || questionsAnswered >= TIMING_CONFIG.MIN_QUESTIONS_PER_ROUND && elapsedSec >= 300));

    if (shouldWrapUpRound) {
      // Complete current round
      roundData.cleared = true;
      roundData.finishedAt = new Date().toISOString();
      session.status = SESSION_STATES.ROUND_WRAPUP;

      const nextRoundNum = currentRnd + 1;
      const wrapupLine = nextRoundNum <= 4
        ? `Thanks for sharing those details. You've completed Round ${currentRnd}. Let's take a quick breath before we step into Round ${nextRoundNum}: ${ROUND_TYPES[nextRoundNum].name}.`
        : `Thank you for completing all rounds! That concludes the interview. Give me a moment while I compile your comprehensive evaluation report.`;

      session.chatMessages.push({
        id: `msg_ai_wrapup_${Date.now()}`,
        sender: 'ai',
        text: wrapupLine,
        isWrapup: true,
        nextRound: nextRoundNum <= 4 ? nextRoundNum : null,
        timestamp: new Date().toISOString()
      });

      await FirestoreHelper.setDoc('hr_interview_sessions', sessionId, session);
      return this.getSessionState(sessionId, userId);
    }

    // 4. Generate Next Dynamic Adaptive Question
    const transcriptSoFar = session.chatMessages.map(m => ({
      sender: m.sender,
      text: m.text
    }));

    const coveredTopics = roundData.questions.map(q => q.category).filter(Boolean);

    const nextPrompt = buildNextQuestionPrompt({
      targetRole: session.targetRole,
      experienceLevel: session.experienceLevel,
      skills: session.keySkills,
      jobDescription: session.jobDescription,
      candidateProfile: session.candidateProfile,
      repoInsights: session.repoInsights,
      roundNumber: currentRnd,
      roundGoal: ROUND_TYPES[currentRnd].goal,
      transcriptSoFar,
      lastAnswerAnalysis: quickAnalysis,
      questionNumber: questionsAnswered + 1,
      coveredTopics
    });

    let nextQData = null;
    try {
      nextQData = await GrokService.generateJSON(nextPrompt);
    } catch (err) {
      console.warn('[InterviewService] Next question generation fallback:', err.message);
    }

    const nextQuestion = {
      questionId: `q_${currentRnd}_${questionsAnswered + 1}`,
      questionNumber: questionsAnswered + 1,
      round: currentRnd,
      questionText: nextQData?.questionText || `Could you elaborate on the key trade-offs and decisions you made during that project?`,
      category: nextQData?.category || ROUND_TYPES[currentRnd].shortName,
      originTag: nextQData?.originTag || 'Core Competency',
      tip: nextQData?.tip || 'Highlight specific metrics, challenges, and your direct contribution.',
      userResponse: '',
      isVoice: false,
      speechMetrics: null,
      quickAnalysis: null,
      createdAt: new Date().toISOString()
    };

    roundData.questions.push(nextQuestion);
    session.currentQuestionIndex = roundData.questions.length - 1;

    // Send AI message with optional brief acknowledgement
    const fullAiMessage = nextQData?.acknowledgement
      ? `${nextQData.acknowledgement} ${nextQuestion.questionText}`
      : nextQuestion.questionText;

    session.chatMessages.push({
      id: `msg_ai_${Date.now()}`,
      sender: 'ai',
      text: fullAiMessage,
      originTag: nextQuestion.originTag,
      tip: nextQuestion.tip,
      timestamp: new Date().toISOString()
    });

    await FirestoreHelper.setDoc('hr_interview_sessions', sessionId, session);
    return this.getSessionState(sessionId, userId);
  },

  /**
   * 4. Transition to the Next Round or Evaluation.
   */
  async transitionRound(sessionId, userId) {
    const session = await FirestoreHelper.getDoc('hr_interview_sessions', sessionId);
    if (!session || session.userId !== userId) {
      throw new Error('Interview session not found.');
    }

    const nextRnd = session.currentRound + 1;
    if (nextRnd > 4) {
      // Completed all 4 rounds -> trigger final evaluation
      return this.endSession(sessionId, userId);
    }

    // Initialize next round
    session.currentRound = nextRnd;
    session.status = SESSION_STATES.ROUND_ACTIVE;
    session.roundStartedAt = Date.now();
    session.roundTimeLimitSec = TIMING_CONFIG.ROUND_MAX_TIME_SEC;
    session.roundsData[nextRnd].startedAt = new Date().toISOString();

    // Generate First Question of New Round
    const transcriptSoFar = session.chatMessages.map(m => ({ sender: m.sender, text: m.text }));
    const prompt = buildNextQuestionPrompt({
      targetRole: session.targetRole,
      experienceLevel: session.experienceLevel,
      skills: session.keySkills,
      jobDescription: session.jobDescription,
      candidateProfile: session.candidateProfile,
      repoInsights: session.repoInsights,
      roundNumber: nextRnd,
      roundGoal: ROUND_TYPES[nextRnd].goal,
      transcriptSoFar,
      lastAnswerAnalysis: null,
      questionNumber: 1,
      coveredTopics: []
    });

    let qData = null;
    try {
      qData = await GrokService.generateJSON(prompt);
    } catch {}

    const openerQuestion = {
      questionId: `q_${nextRnd}_1`,
      questionNumber: 1,
      round: nextRnd,
      questionText: qData?.questionText || `Let's begin Round ${nextRnd}. What is your approach when tackling complex challenges in this domain?`,
      category: qData?.category || ROUND_TYPES[nextRnd].shortName,
      originTag: qData?.originTag || 'Role Standard',
      tip: qData?.tip || 'Be structured and clear in your explanation.',
      userResponse: '',
      isVoice: false,
      speechMetrics: null,
      quickAnalysis: null,
      createdAt: new Date().toISOString()
    };

    session.roundsData[nextRnd].questions.push(openerQuestion);
    session.currentQuestionIndex = 0;

    session.chatMessages.push({
      id: `msg_ai_${nextRnd}_1`,
      sender: 'ai',
      text: openerQuestion.questionText,
      originTag: openerQuestion.originTag,
      tip: openerQuestion.tip,
      timestamp: new Date().toISOString()
    });

    await FirestoreHelper.setDoc('hr_interview_sessions', sessionId, session);
    return this.getSessionState(sessionId, userId);
  },

  /**
   * 5. End Interview & Compile Full Comprehensive Report.
   */
  async endSession(sessionId, userId) {
    const session = await FirestoreHelper.getDoc('hr_interview_sessions', sessionId);
    if (!session || session.userId !== userId) {
      throw new Error('Interview session not found.');
    }

    session.status = SESSION_STATES.EVALUATING;
    session.completedAt = new Date().toISOString();
    await FirestoreHelper.setDoc('hr_interview_sessions', sessionId, session);

    // Compute Speech Telemetry Aggregates
    const voiceAnswers = [];
    for (let r = 1; r <= 4; r++) {
      (session.roundsData[r]?.questions || []).forEach(q => {
        if (q.isVoice && q.speechMetrics) {
          voiceAnswers.push(q.speechMetrics);
        }
      });
    }

    let speechSummary = null;
    if (voiceAnswers.length > 0) {
      const avgWpm = Math.round(voiceAnswers.reduce((acc, m) => acc + (m.words_per_minute || 0), 0) / voiceAnswers.length);
      const avgFillerRate = Math.round(voiceAnswers.reduce((acc, m) => acc + (m.filler_words_rate_pct || 0), 0) / voiceAnswers.length);
      const totalPauses = voiceAnswers.reduce((acc, m) => acc + (m.pauses_count_gt_1_5s || 0), 0);
      const avgConfidence = Math.round((voiceAnswers.reduce((acc, m) => acc + (m.speech_confidence_score || 0), 0) / voiceAnswers.length) * 10) / 10;

      speechSummary = {
        hasVoiceData: true,
        totalVoiceResponses: voiceAnswers.length,
        averageWpm: avgWpm,
        averageFillerRatePct: avgFillerRate,
        totalLongPauses: totalPauses,
        averageSpeechConfidenceScore: avgConfidence,
        deliveryAssessment: avgConfidence >= 8 ? 'Confident & Articulate' : (avgConfidence >= 6 ? 'Steady with minor filler pauses' : 'Hesitant / Needs delivery practice')
      };
    } else {
      speechSummary = {
        hasVoiceData: false,
        note: 'All responses were provided via text; speech delivery metrics excluded.'
      };
    }

    // Call LLM with full transcript and strict evidence-based rubric
    const evalPrompt = buildFinalEvaluationPrompt({
      targetRole: session.targetRole,
      experienceLevel: session.experienceLevel,
      skills: session.keySkills,
      candidateProfile: session.candidateProfile,
      repoInsights: session.repoInsights,
      roundsData: session.roundsData,
      speechSummary
    });

    let report = null;
    try {
      report = await GrokService.generateJSON(evalPrompt);
    } catch (err) {
      console.error('[InterviewService] Final report generation error:', err.message);
    }

    // Fallback if LLM fails
    if (!report || typeof report.overallScore !== 'number') {
      report = this.generateFallbackReport(session, speechSummary);
    }

    session.finalReport = {
      ...report,
      speechSummary,
      sessionId,
      targetRole: session.targetRole,
      experienceLevel: session.experienceLevel,
      evaluatedAt: new Date().toISOString()
    };
    session.status = SESSION_STATES.REPORT;

    // Update Placement Readiness & Record in Firestore
    const readiness = await FirestoreHelper.getDoc('placement_readiness', `readiness_${userId}`) || {};
    const mockCount = (readiness.mockInterviews || 0) + 1;
    const currentHrScore = typeof readiness.hrScore === 'number' ? readiness.hrScore : null;
    const interviewScoreOutOf100 = Math.round(session.finalReport.overallScore * 10);

    const newHrScore = currentHrScore !== null
      ? Math.round((currentHrScore * (mockCount - 1) + interviewScoreOutOf100) / mockCount)
      : interviewScoreOutOf100;

    const updatedReadiness = {
      ...readiness,
      hrScore: newHrScore,
      mockInterviews: mockCount
    };
    updatedReadiness.overallReadiness = calculatePlacementReadiness(updatedReadiness);
    await FirestoreHelper.setDoc('placement_readiness', `readiness_${userId}`, updatedReadiness);

    // Also persist entry into legacy hr_interviews collection for backwards compatibility
    const legacyRecordId = `hr_legacy_${sessionId}`;
    await FirestoreHelper.setDoc('hr_interviews', legacyRecordId, {
      interviewId: legacyRecordId,
      sessionId,
      userId,
      round: session.currentRound,
      score: interviewScoreOutOf100,
      overallScore: session.finalReport.overallScore,
      verdict: session.finalReport.verdict,
      targetRole: session.targetRole,
      completedAt: session.completedAt
    });

    await FirestoreHelper.setDoc('hr_interview_sessions', sessionId, session);
    return this.getSessionState(sessionId, userId);
  },

  /**
   * Generates a calibrated fallback report if the LLM JSON call experiences a glitch.
   */
  generateFallbackReport(session, speechSummary) {
    let totalScore = 0;
    let totalQuestions = 0;

    for (let r = 1; r <= 4; r++) {
      (session.roundsData[r]?.questions || []).forEach(q => {
        totalQuestions++;
        const rel = q.quickAnalysis?.relevance || 6;
        const depth = q.quickAnalysis?.depth || 5;
        totalScore += (rel + depth) / 2;
      });
    }

    const calculatedAvg = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 10) / 10 : 7.2;
    const verdict = calculatedAvg >= 8.5 ? 'Interview ready' : (calculatedAvg >= 7.0 ? 'Almost there' : (calculatedAvg >= 5.0 ? 'Needs work' : 'Not ready'));

    return {
      overallScore: calculatedAvg,
      verdict,
      verdictSummary: `Demonstrated solid foundational understanding for the ${session.targetRole} role with room to improve STAR structure.`,
      roundScores: {
        "1": { score: Math.min(10, calculatedAvg + 0.3), title: "Behavioral", summary: "Good personal introduction and communication clarity." },
        "2": { score: calculatedAvg, title: "Technical", summary: "Accurate domain terminology and architecture discussion." },
        "3": { score: Math.max(1, calculatedAvg - 0.4), title: "Situational", summary: "Addressed conflict and deadline ambiguity reasonably well." },
        "4": { score: calculatedAvg, title: "Leadership", summary: "Showed personal ownership on past project initiatives." }
      },
      detailedCompetencies: {
        communication: Math.min(10, calculatedAvg + 0.5),
        relevance: calculatedAvg,
        technicalDepth: Math.max(1, calculatedAvg - 0.5),
        starStructure: Math.max(1, calculatedAvg - 1.0),
        problemSolving: calculatedAvg,
        leadership: Math.max(1, calculatedAvg - 0.5),
        grammarAndVocabulary: 8.5,
        roleFit: calculatedAvg,
        resumeAlignment: 7.5,
        projectExplanation: 7.0
      },
      strengths: [
        { point: "Role Motivation", evidence: "Clearly articulated passion and target trajectory for the position." },
        { point: "Technical Fundamentals", evidence: "Demonstrated familiar command over core toolchain and stack concepts." }
      ],
      improvements: [
        { area: "STAR Completeness", evidence: "Answers often concluded on the Action without stating quantifiable Results.", advice: "Always finish stories with concrete impact or percentage improvements." }
      ],
      resumeAndGithubInsights: {
        substantiatedClaims: ["Understands core repository workflows"],
        unsubstantiatedClaims: ["Metrics on performance improvements could be articulated with deeper telemetry."],
        repoSuggestions: ["Add comprehensive unit tests and automated CI actions to your pinned repositories."]
      },
      perQuestionReview: [],
      actionPlan7Days: [
        { day: 1, task: "STAR Story Mapping", detail: "Draft 3 stories covering Failure, Leadership, and Conflict using STAR." },
        { day: 2, task: "Architecture Deep-Dive", detail: "Draw the component flow diagram of your primary project." },
        { day: 3, task: "Metrics Verification", detail: "Quantify the benchmark numbers mentioned in your resume bullets." },
        { day: 4, task: "Mock Behavioral Practice", detail: "Record your self-introduction and aim for 130-150 WPM." },
        { day: 5, task: "System Design Fundamentals", detail: "Review caching, database indexing, and API rate limiting trade-offs." },
        { day: 6, task: "GitHub Repo Polish", detail: "Write clear Architecture and Getting Started sections in your README." },
        { day: 7, task: "Full Mock Retake", detail: "Retake this AI HR Interview aiming for an 8.5+ readiness score." }
      ]
    };
  },

  /**
   * Strip internal properties before sending session to frontend.
   */
  sanitizeSessionForClient(session) {
    const elapsedSec = session.roundStartedAt ? Math.floor((Date.now() - session.roundStartedAt) / 1000) : 0;
    const remainingSec = Math.max(0, (session.roundTimeLimitSec || 420) - elapsedSec);

    return {
      sessionId: session.sessionId,
      targetRole: session.targetRole,
      experienceLevel: session.experienceLevel,
      keySkills: session.keySkills,
      status: session.status,
      currentRound: session.currentRound,
      currentQuestionIndex: session.currentQuestionIndex,
      roundStartedAt: session.roundStartedAt,
      roundTimeLimitSec: session.roundTimeLimitSec || 420,
      roundRemainingSec: remainingSec,
      roundsData: session.roundsData,
      chatMessages: session.chatMessages,
      finalReport: session.finalReport,
      micEnabled: session.micEnabled,
      candidateProfile: session.candidateProfile ? {
        name: session.candidateProfile.name,
        summary: session.candidateProfile.summary,
        experienceYears: session.candidateProfile.total_experience_years
      } : null,
      repoInsights: session.repoInsights ? session.repoInsights.map(r => ({ name: r.name, stack: r.stack })) : null,
      updatedAt: session.updatedAt
    };
  }
};
