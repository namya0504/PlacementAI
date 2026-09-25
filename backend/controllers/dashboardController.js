import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { GrokService } from '../services/grokService.js';
import { getStudentContext } from '../services/studentContext.js';
import { sendSuccess } from '../utils/responseHandler.js';
import { calculatePlacementReadiness } from '../utils/scoring.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    let readiness = await FirestoreHelper.getDoc('placement_readiness', 'readiness_' + userId);
    if (!readiness) {
      readiness = {
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
      readiness.overallReadiness = 0;
      await FirestoreHelper.setDoc('placement_readiness', 'readiness_' + userId, readiness);
    } else {
      readiness.overallReadiness = calculatePlacementReadiness(readiness);
    }

    const activities = await FirestoreHelper.queryCollection('activities', 'userId', userId);
    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const recentActivities = activities.slice(0, 5).map(a => ({
      title: a.activityType,
      score: a.description,
      time: a.createdAt
    }));

    const downloads = await FirestoreHelper.queryCollection('download_history', 'userId', userId);

    return sendSuccess(res, {
      stats: readiness,
      recentActivities,
      recentDownloads: downloads.slice(-5)
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
