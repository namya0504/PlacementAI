import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { sendSuccess } from '../utils/responseHandler.js';

export const logActivity = async (userId, activityType, description = '') => {
  if (!userId) return null;
  try {
    const activityId = 'act_' + userId + '_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const doc = {
      activityId,
      userId,
      activityType,
      description,
      createdAt: new Date().toISOString()
    };
    await FirestoreHelper.setDoc('activities', activityId, doc);
    return doc;
  } catch (err) {
    console.error('Failed to log activity:', err);
    return null;
  }
};

export const getActivities = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    let list = await FirestoreHelper.queryCollection('activities', 'userId', userId);
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return sendSuccess(res, list.slice(0, 20), 'Activities retrieved successfully');
  } catch (err) {
    next(err);
  }
};
