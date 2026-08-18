import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const recordDownload = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { resumeId = 'res_1', fileName = 'Resume.pdf' } = req.body;

    const downloadId = 'dl_' + Date.now();
    const record = {
      downloadId,
      userId,
      resumeId,
      fileName,
      downloadedAt: new Date().toISOString()
    };

    await FirestoreHelper.setDoc('download_history', downloadId, record);

    return sendSuccess(res, record, 'Download recorded successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const getDownloadHistory = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const history = await FirestoreHelper.queryCollection('download_history', 'userId', userId);
    return sendSuccess(res, history, 'Download history retrieved');
  } catch (err) {
    next(err);
  }
};
