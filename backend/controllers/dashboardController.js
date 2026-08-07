import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { sendSuccess } from '../utils/responseHandler.js';
import { calculatePlacementReadiness } from '../utils/scoring.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user?.userId || 'usr_default_namya';

    let readiness = await FirestoreHelper.getDoc('placement_readiness', 'readiness_' + userId);
    if (!readiness) {
      readiness = {
        resumeScore: 85,
        atsScore: 84,
        aptitudeScore: 72,
        technicalScore: 80,
        hrScore: 82,
        resumesCreated: 3,
        testsCompleted: 24,
        certificatesEarned: 5,
        mockInterviews: 6,
        streakDays: 7
      };
      readiness.overallReadiness = calculatePlacementReadiness(readiness);
      await FirestoreHelper.setDoc('placement_readiness', 'readiness_' + userId, readiness);
    } else {
      readiness.overallReadiness = calculatePlacementReadiness(readiness);
    }

    const mockTests = await FirestoreHelper.queryCollection('mock_tests', 'userId', userId);
    const hrInterviews = await FirestoreHelper.queryCollection('hr_interviews', 'userId', userId);
    const downloads = await FirestoreHelper.queryCollection('download_history', 'userId', userId);

    const recentActivities = [
      ...mockTests.slice(-3).map(m => ({ title: `Completed Aptitude Test (${m.topic || 'General'})`, score: `${m.score}%`, time: m.completedAt })),
      ...hrInterviews.slice(-2).map(h => ({ title: `Completed HR Interview (${h.questionTitle?.substring(0, 30)}...)`, score: `${h.score}%`, time: h.completedAt })),
      ...downloads.slice(-2).map(d => ({ title: `Downloaded Resume (${d.fileName})`, score: 'PDF', time: d.downloadedAt }))
    ].sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0)).slice(0, 5);

    if (recentActivities.length === 0) {
      recentActivities.push(
        { title: 'Attempted Technical Practice Stage 2', score: '80%', time: new Date().toISOString() },
        { title: 'Generated ATS Optimized Resume', score: '84%', time: new Date(Date.now() - 3600000).toISOString() },
        { title: 'Completed Aptitude Quantitative Test', score: '72%', time: new Date(Date.now() - 86400000).toISOString() }
      );
    }

    const weeklyProgress = [
      { day: 'Mon', score: 65 },
      { day: 'Tue', score: 68 },
      { day: 'Wed', score: 72 },
      { day: 'Thu', score: 70 },
      { day: 'Fri', score: 75 },
      { day: 'Sat', score: 78 },
      { day: 'Sun', score: readiness.overallReadiness }
    ];

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
