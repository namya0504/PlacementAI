import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { GrokService } from '../services/grokService.js';
import { getStudentContext } from '../services/studentContext.js';
import { sendSuccess } from '../utils/responseHandler.js';
import { calculatePlacementReadiness } from '../utils/scoring.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Fetch all dashboard metrics concurrently in one round-trip
    const [
      readinessDoc,
      userResumes,
      userTests,
      userInterviews,
      userAts,
      activities,
      downloads
    ] = await Promise.all([
      FirestoreHelper.getDoc('placement_readiness', 'readiness_' + userId),
      FirestoreHelper.queryCollection('resumes', 'userId', userId).catch(() => []),
      FirestoreHelper.queryCollection('mock_tests', 'userId', userId).catch(() => []),
      FirestoreHelper.queryCollection('hr_interviews', 'userId', userId).catch(() => []),
      FirestoreHelper.queryCollection('ats_results', 'userId', userId).catch(() => []),
      FirestoreHelper.queryCollection('activities', 'userId', userId).catch(() => []),
      FirestoreHelper.queryCollection('download_history', 'userId', userId).catch(() => [])
    ]);

    let readiness = readinessDoc || {
      resumeScore: 0,
      atsScore: 0,
      aptitudeScore: 0,
      technicalScore: 0,
      hrScore: 0,
      resumesCreated: 0,
      testsCompleted: 0,
      certificatesEarned: 0,
      mockInterviews: 0,
      streakDays: 1
    };

    const actualResumesCount = Array.isArray(userResumes) ? userResumes.length : 0;
    const actualTestsCount = Array.isArray(userTests) ? userTests.filter(t => t.status === 'completed' || t.submittedAt).length : 0;
    const actualInterviewsCount = Array.isArray(userInterviews) ? userInterviews.filter(i => i.status === 'completed' || i.cleared !== undefined).length : 0;

    readiness.resumesCreated = Math.max(readiness.resumesCreated || 0, actualResumesCount);
    readiness.resumesCount = readiness.resumesCreated;
    readiness.testsCompleted = Math.max(readiness.testsCompleted || 0, actualTestsCount);
    readiness.mockInterviews = Math.max(readiness.mockInterviews || 0, actualInterviewsCount);

    if ((!readiness.atsScore || readiness.atsScore === 0) && Array.isArray(userAts) && userAts.length > 0) {
      const validScores = userAts
        .map(a => a.overallScore ?? a.report?.overallScore ?? a.score ?? 0)
        .filter(s => s > 0);
      if (validScores.length > 0) {
        readiness.atsScore = Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length);
      }
    }

    readiness.overallReadiness = calculatePlacementReadiness(readiness);
    // Persist asynchronously in background so response returns without blocking
    FirestoreHelper.setDoc('placement_readiness', 'readiness_' + userId, readiness, true).catch(() => {});

    const sortedActivities = Array.isArray(activities) ? activities : [];
    sortedActivities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const recentActivities = sortedActivities.slice(0, 5).map(a => ({
      title: a.activityType,
      score: a.description,
      time: a.createdAt
    }));

    const sortedDownloads = Array.isArray(downloads) ? downloads : [];

    return sendSuccess(res, {
      stats: readiness,
      recentActivities,
      recentDownloads: sortedDownloads.slice(-5)
    }, 'Dashboard statistics retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Generates personalized AI placement recommendations and action plan based on actual student progress.
 */
export const getAIRecommendations = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const forceRefresh = req.query.refresh === 'true';

    // Check if recent recommendations exist in Firestore (cached for 1 hour unless refresh requested)
    const cached = await FirestoreHelper.getDoc('ai_recommendations', `rec_${userId}`);
    const isFresh = cached && cached.generatedAt && (Date.now() - new Date(cached.generatedAt).getTime() < 3600000);

    if (isFresh && !forceRefresh) {
      return sendSuccess(res, cached.recommendations, 'Personalized recommendations retrieved (cached)');
    }

    const studentContext = await getStudentContext(userId);
    const recommendations = await GrokService.generatePersonalizedRecommendations(studentContext);

    // Cache the recommendations
    await FirestoreHelper.setDoc('ai_recommendations', `rec_${userId}`, {
      userId,
      recommendations,
      generatedAt: new Date().toISOString()
    });

    return sendSuccess(res, recommendations, 'Personalized recommendations generated');
  } catch (err) {
    next(err);
  }
};
