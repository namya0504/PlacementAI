import express from 'express';
import { protectRoute } from '../middlewares/authMiddleware.js';
import { rateLimiter } from '../middlewares/rateLimiter.js';
import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import {
  getSignedDownloadUrl,
  deleteFile,
  parseStoragePath,
  isOwnedByUser
} from '../services/storageService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

const router = express.Router();

// Rate limit storage endpoints: 30 requests per minute
const storageRateLimiter = rateLimiter({
  windowMs: 60000,
  maxRequests: 30,
  message: 'Too many storage requests. Please wait a moment before trying again.'
});

/**
 * GET /api/storage/download-url
 * Returns a short-lived signed URL for a private file.
 * Query params: storagePath (required)
 */
router.get('/download-url', protectRoute, storageRateLimiter, async (req, res, next) => {
  try {
    const uid = req.user.userId;
    const { storagePath } = req.query;

    if (!storagePath || typeof storagePath !== 'string') {
      return sendError(res, 'Storage path is required.', 400);
    }

    // Parse and validate ownership
    const { bucket, filePath } = parseStoragePath(storagePath);

    if (!isOwnedByUser(filePath, uid)) {
      return sendError(res, 'Access denied.', 403);
    }

    const signedUrl = await getSignedDownloadUrl(bucket, filePath, 300);
    return sendSuccess(res, { url: signedUrl, expiresIn: 300 }, 'Download URL generated');
  } catch (err) {
    if (err.message.includes('Invalid') || err.message.includes('Unknown')) {
      return sendError(res, err.message, 400);
    }
    next(err);
  }
});

/**
 * DELETE /api/storage/file
 * Deletes a file from Supabase Storage and clears the relevant Firestore fields.
 * Body: { storagePath, collection, docId }
 */
router.delete('/file', protectRoute, storageRateLimiter, async (req, res, next) => {
  try {
    const uid = req.user.userId;
    const { storagePath, collection, docId } = req.body;

    if (!storagePath || typeof storagePath !== 'string') {
      return sendError(res, 'Storage path is required.', 400);
    }

    // Parse and validate ownership
    const { bucket, filePath } = parseStoragePath(storagePath);

    if (!isOwnedByUser(filePath, uid)) {
      return sendError(res, 'Access denied.', 403);
    }

    // If the caller specifies a Firestore document, verify ownership there too
    if (collection && docId) {
      const doc = await FirestoreHelper.getDoc(collection, docId);
      if (doc && doc.userId && doc.userId !== uid) {
        return sendError(res, 'Access denied.', 403);
      }
    }

    // Delete from Supabase
    await deleteFile(bucket, filePath);

    // Clear Firestore metadata if requested
    if (collection && docId) {
      await FirestoreHelper.setDoc(collection, docId, {
        storageProvider: null,
        storagePath: null
      }, true);
    }

    return sendSuccess(res, { deleted: storagePath }, 'File deleted successfully');
  } catch (err) {
    if (err.message.includes('Invalid') || err.message.includes('Unknown')) {
      return sendError(res, err.message, 400);
    }
    next(err);
  }
});

export default router;
