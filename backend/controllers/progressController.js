import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { GrokService } from '../services/grokService.js';
import { getStudentContext } from '../services/studentContext.js';
import { sendSuccess } from '../utils/responseHandler.js';

/**
 * GET /api/progress/combined?period=24h|week|month|all
 * Returns all activity history across aptitude, HR, technical, and ATS, filtered by period.
 */
export const getCombinedProgress = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const period = req.query.period || 'all';

    // Compute cutoff timestamp
    const now = Date.now();
    let cutoff = null;
    if (period === '24h') cutoff = now - 24 * 60 * 60 * 1000;
    else if (period === 'week') cutoff = now - 7 * 24 * 60 * 60 * 1000;
    else if (period === 'month') cutoff = now - 30 * 24 * 60 * 60 * 1000;

    const isInPeriod = (dateStr) => {
      if (!cutoff) return true;
      const t = new Date(dateStr).getTime();
      return !isNaN(t) && t >= cutoff;
    };

    // Fetch all data in parallel
    const [aptitudeTests, hrInterviews, techSubmissions, atsHistory] = await Promise.all([
      FirestoreHelper.queryCollection('mock_tests', 'userId', userId),
      FirestoreHelper.queryCollection('hr_interviews', 'userId', userId),
      FirestoreHelper.queryCollection('technical_practice', 'userId', userId),
      FirestoreHelper.queryCollection('ats_results', 'userId', userId).catch(() => [])
    ]);

    // Enrich tech submissions with question titles
    const techQuestions = await FirestoreHelper.queryCollection('technical_questions');
    const qMap = {};
    techQuestions.forEach(q => { qMap[q.questionId || q.id] = q; });

    // Filter and shape each module
    const aptitude = aptitudeTests
      .filter(t => isInPeriod(t.completedAt))
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .map(t => ({
        module: 'aptitude',
        id: t.testId,
        title: `${t.category || 'Aptitude'} Test`,
        score: t.accuracy ?? t.score ?? 0,
        passed: t.passed,
        meta: { category: t.category, stage: t.stage, totalQuestions: t.totalQuestions, weakestTopic: t.weakestTopic },
        completedAt: t.completedAt
      }));

    const hr = hrInterviews
      .filter(iv => isInPeriod(iv.completedAt))
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .map(iv => ({
        module: 'hr',
        id: iv.interviewId,
        title: `HR Round ${iv.round}: ${(iv.questionTitle || 'Interview Question').slice(0, 60)}`,
        score: iv.score ?? 0,
        passed: (iv.score ?? 0) >= 60,
        meta: { round: iv.round, feedback: iv.feedback, scores: iv.evaluateScores || {} },
        completedAt: iv.completedAt
      }));

    const technical = techSubmissions
      .filter(s => isInPeriod(s.completedAt))
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .map(s => {
        const q = qMap[s.questionId] || {};
        return {
          module: 'technical',
          id: s.submissionId,
          title: q.title || 'Coding Challenge',
          score: s.score ?? 0,
          passed: s.status === 'Passed' || s.isCorrect === true,
          meta: { language: s.language, type: s.code ? 'code' : 'mcq', status: s.status, passCount: s.passCount, totalTests: s.totalTests },
          completedAt: s.completedAt
        };
      });

    const ats = atsHistory
      .filter(a => isInPeriod(a.analyzedAt || a.createdAt))
      .sort((a, b) => new Date(b.analyzedAt || b.createdAt) - new Date(a.analyzedAt || a.createdAt))
      .map(a => ({
        module: 'ats',
        id: a.id || a.analysisId,
        title: `ATS Analysis${a.jobTitle ? ` — ${a.jobTitle}` : ''}`,
        score: a.score ?? a.atsScore ?? 0,
        passed: (a.score ?? a.atsScore ?? 0) >= 60,
        meta: { suggestions: a.suggestions?.length || 0 },
        completedAt: a.analyzedAt || a.createdAt
      }));

    // Combined timeline sorted by date
    const timeline = [...aptitude, ...hr, ...technical, ...ats]
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

    // Summary stats per module (for the selected period)
    const summarize = (items) => {
      if (items.length === 0) return { count: 0, avgScore: 0, bestScore: 0, passRate: 0 };
      const scores = items.map(i => i.score);
      return {
        count: items.length,
        avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
        bestScore: Math.max(...scores),
        passRate: Math.round((items.filter(i => i.passed).length / items.length) * 100)
      };
    };

    const summary = {
      aptitude: summarize(aptitude),
      hr: summarize(hr),
      technical: summarize(technical),
      ats: summarize(ats),
      total: timeline.length
    };

    return sendSuccess(res, {
      period,
      timeline,
      byModule: { aptitude, hr, technical, ats },
      summary
    }, 'Combined progress retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/progress/insights?period=24h|week|month|all
 * Returns AI-generated insights based on the user's cross-module performance.
 * Results are cached for 30 minutes per period to avoid repeated AI calls.
 */
export const getProgressInsights = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const period = req.query.period || 'week';
    const forceRefresh = req.query.refresh === 'true';

    const cacheKey = `insights_${userId}_${period}`;
    const cached = await FirestoreHelper.getDoc('progress_insights_cache', cacheKey);
    const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
    if (!forceRefresh && cached && cached.generatedAt && (Date.now() - new Date(cached.generatedAt).getTime() < CACHE_TTL_MS)) {
      return sendSuccess(res, cached.insights, 'Progress insights retrieved (cached)');
    }

    // Compute summary from actual data (reuse combined progress logic)
    const now = Date.now();
    let cutoff = null;
    if (period === '24h') cutoff = now - 24 * 60 * 60 * 1000;
    else if (period === 'week') cutoff = now - 7 * 24 * 60 * 60 * 1000;
    else if (period === 'month') cutoff = now - 30 * 24 * 60 * 60 * 1000;

    const isInPeriod = (dateStr) => {
      if (!cutoff) return true;
      const t = new Date(dateStr).getTime();
      return !isNaN(t) && t >= cutoff;
    };

    const [aptTests, hrInterviews, techSubmissions, atsHistory] = await Promise.all([
      FirestoreHelper.queryCollection('mock_tests', 'userId', userId),
      FirestoreHelper.queryCollection('hr_interviews', 'userId', userId),
      FirestoreHelper.queryCollection('technical_practice', 'userId', userId),
      FirestoreHelper.queryCollection('ats_results', 'userId', userId).catch(() => [])
    ]);

    const summarize = (items, dateField = 'completedAt') => {
      const filtered = items.filter(i => isInPeriod(i[dateField] || i.analyzedAt || i.createdAt));
      if (filtered.length === 0) return { count: 0, avgScore: 0, bestScore: 0, passRate: 0 };
      const scores = filtered.map(i => i.accuracy ?? i.score ?? i.atsScore ?? 0);
      const passed = filtered.filter(i => i.passed === true || (i.score ?? 0) >= 60 || i.status === 'Passed' || i.isCorrect === true).length;
      return {
        count: filtered.length,
        avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
        bestScore: Math.max(...scores),
        passRate: Math.round((passed / filtered.length) * 100)
      };
    };

    const aptSummary = summarize(aptTests);
    const hrSummary = summarize(hrInterviews);
    const techSummary = summarize(techSubmissions);
    const atsSummary = summarize(atsHistory.map(a => ({ ...a, completedAt: a.analyzedAt || a.createdAt })));
    const totalActivities = aptSummary.count + hrSummary.count + techSummary.count + atsSummary.count;

    if (totalActivities === 0) {
      const emptyInsights = {
        overallVerdict: 'No activity recorded in this period. Start practicing to get personalized AI insights!',
        topStrength: null,
        criticalFocus: 'Begin with the Aptitude module to establish a baseline score.',
        weeklyGoal: 'Complete at least one aptitude test and one HR interview question this week.',
        insights: [
          { type: 'info', text: 'No data available for this period. Switch to "All Time" or start practicing.' }
        ],
        nextActions: [
          { module: 'Aptitude', action: 'Take your first aptitude test to get scored', priority: 'high' },
          { module: 'HR Interview', action: 'Answer 2 HR questions to start building your interview profile', priority: 'high' }
        ]
      };
      return sendSuccess(res, emptyInsights, 'No activity in period');
    }

    const studentContext = await getStudentContext(userId);
    const insights = await GrokService.generateProgressInsights({
      aptitude: aptSummary,
      hr: hrSummary,
      technical: techSummary,
      ats: atsSummary,
      totalActivities,
      period,
      targetRole: studentContext?.targetRole || ''
    });

    // Cache the result
    await FirestoreHelper.setDoc('progress_insights_cache', cacheKey, {
      insights,
      generatedAt: new Date().toISOString(),
      userId
    });

    return sendSuccess(res, insights, 'AI progress insights generated');
  } catch (err) {
    next(err);
  }
};
