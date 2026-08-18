import { FirestoreHelper } from '../firebase/firestoreHelper.js';
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
        streakDays: 0
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

    const weeklyProgress = [];

    return sendSuccess(res, {
      stats: readiness,
      recentActivities,
      recentDownloads: downloads.slice(-5),
      weeklyProgress
    }, 'Dashboard statistics retrieved');
  } catch (err) {
    next(err);
  }
};
