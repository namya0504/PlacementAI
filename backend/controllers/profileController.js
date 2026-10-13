import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import {
  uploadFile,
  validateFile,
  generateStoragePath,
  getSignedDownloadUrl,
  deleteFile,
  parseStoragePath,
  isOwnedByUser
} from '../services/storageService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const profileId = 'prof_' + userId;

    let profileDoc = await FirestoreHelper.getDoc('profiles', profileId);
    let userDoc = await FirestoreHelper.getDoc('users', userId);

    if (!userDoc) {
      return sendError(res, 'User not found', 404);
    }

    if (!profileDoc) {
      profileDoc = {
        profileId,
        userId,
        phone: userDoc.phone || '',
        location: userDoc.location || '',
        college: userDoc.college || '',
        branch: userDoc.branch || '',
        passingYear: userDoc.passingYear || '',
        role: userDoc.role || '',
        targetRole: userDoc.targetRole || userDoc.role || '',
        linkedIn: '',
        github: '',
        bio: '',
        interests: [],
        skills: []
      };
      await FirestoreHelper.setDoc('profiles', profileId, profileDoc);
    }

    // Resolve avatar URL (signed Supabase URL for new records, legacy URL for old)
    let photoURL = userDoc.photoURL || '';
    if (userDoc.storageProvider === 'supabase' && userDoc.storagePath) {
      try {
        const { bucket, filePath } = parseStoragePath(userDoc.storagePath);
        photoURL = await getSignedDownloadUrl(bucket, filePath, 3600); // 1 hour for profile display
      } catch (err) {
        console.warn('[Profile] Signed URL fallback:', err.message);
        // Keep the existing photoURL as fallback
      }
    }

    const combined = {
      uid: userId,
      name: userDoc.name || '',
      email: userDoc.email || '',
      role: profileDoc.role || userDoc.role || '',
      targetRole: profileDoc.targetRole || profileDoc.role || userDoc.role || '',
      phone: profileDoc.phone || userDoc.phone || '',
      location: profileDoc.location || userDoc.location || '',
      college: profileDoc.college || userDoc.college || '',
      branch: profileDoc.branch || userDoc.branch || '',
      passingYear: profileDoc.passingYear || userDoc.passingYear || '',
      photoURL,
      storageProvider: userDoc.storageProvider || null,
      storagePath: userDoc.storagePath || null,
      ...profileDoc
    };

    return sendSuccess(res, combined, 'Profile retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const profileId = 'prof_' + userId;

    const {
      name,
      role,
      targetRole,
      phone,
      location,
      photoURL,
      college,
      branch,
      passingYear,
      linkedIn,
      github,
      bio,
      interests,
      skills
    } = req.body;

    const assignedRole = role || targetRole;

    // Update user info
    const userUpdates = {};
    if (typeof name === 'string') userUpdates.name = name.trim().slice(0, 80);
    if (typeof assignedRole === 'string') {
      userUpdates.role = assignedRole.trim().slice(0, 80);
      userUpdates.targetRole = assignedRole.trim().slice(0, 80);
    }
    if (typeof phone === 'string') userUpdates.phone = phone.trim().slice(0, 25);
    if (typeof location === 'string') userUpdates.location = location.trim().slice(0, 100);
    if (typeof college === 'string') userUpdates.college = college.trim().slice(0, 150);
    if (typeof branch === 'string') userUpdates.branch = branch.trim().slice(0, 100);
    if (typeof passingYear === 'string') userUpdates.passingYear = passingYear.trim().slice(0, 10);
    if (typeof photoURL === 'string') userUpdates.photoURL = photoURL.trim().slice(0, 500);

    if (Object.keys(userUpdates).length > 0) {
      await FirestoreHelper.setDoc('users', userId, userUpdates, true);
    }

    // Update profile document in profiles collection
    const profileUpdates = {
      profileId,
      userId,
      ...(assignedRole !== undefined && { role: String(assignedRole).slice(0, 80), targetRole: String(assignedRole).slice(0, 80) }),
      ...(phone !== undefined && { phone: String(phone).slice(0, 25) }),
      ...(location !== undefined && { location: String(location).slice(0, 100) }),
      ...(college !== undefined && { college: String(college).slice(0, 150) }),
      ...(branch !== undefined && { branch: String(branch).slice(0, 100) }),
      ...(passingYear !== undefined && { passingYear: String(passingYear).slice(0, 10) }),
      ...(linkedIn !== undefined && { linkedIn: String(linkedIn).slice(0, 200) }),
      ...(github !== undefined && { github: String(github).slice(0, 200) }),
      ...(bio !== undefined && { bio: String(bio).slice(0, 1000) }),
      ...(Array.isArray(interests) && { interests: interests.slice(0, 30) }),
      ...(Array.isArray(skills) && { skills: skills.slice(0, 50) })
    };

    const updatedProfile = await FirestoreHelper.setDoc('profiles', profileId, profileUpdates, true);

    const userDoc = await FirestoreHelper.getDoc('users', userId);

    // Resolve avatar URL for response
    let resolvedPhotoURL = userDoc?.photoURL || photoURL;
    if (userDoc?.storageProvider === 'supabase' && userDoc?.storagePath) {
      try {
        const { bucket, filePath } = parseStoragePath(userDoc.storagePath);
        resolvedPhotoURL = await getSignedDownloadUrl(bucket, filePath, 3600);
      } catch (err) {
        // Keep existing photoURL
      }
    }

    return sendSuccess(res, {
      uid: userId,
      name: userDoc?.name || name,
      email: userDoc?.email,
      role: updatedProfile.role || userDoc?.role || '',
      targetRole: updatedProfile.targetRole || updatedProfile.role || userDoc?.role || '',
      phone: updatedProfile.phone || userDoc?.phone || '',
      location: updatedProfile.location || userDoc?.location || '',
      college: updatedProfile.college || userDoc?.college || '',
      branch: updatedProfile.branch || userDoc?.branch || '',
      passingYear: updatedProfile.passingYear || userDoc?.passingYear || '',
      photoURL: resolvedPhotoURL,
      ...updatedProfile
    }, 'Profile updated successfully');
  } catch (err) {
    next(err);
  }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    if (!req.file) {
      return sendError(res, 'No image file uploaded', 400);
    }

    // Server-side validation
    const validation = validateFile('profile-images', req.file.mimetype, req.file.size);
    if (!validation.valid) {
      return sendError(res, validation.error, 400);
    }

    // Generate safe storage path
    const storagePath = generateStoragePath('profile-images', userId, req.file.mimetype);

    // Delete previous Supabase avatar if one exists
    const currentUser = await FirestoreHelper.getDoc('users', userId);
    if (currentUser?.storageProvider === 'supabase' && currentUser?.storagePath) {
      try {
        const { bucket: oldBucket, filePath: oldPath } = parseStoragePath(currentUser.storagePath);
        if (isOwnedByUser(oldPath, userId)) {
          await deleteFile(oldBucket, oldPath);
        }
      } catch (delErr) {
        console.warn('[Profile] Old avatar cleanup notice:', delErr.message);
        // Non-blocking — continue with upload
      }
    }

    // Upload to Supabase Storage
    const result = await uploadFile('profile-images', storagePath, req.file.buffer, req.file.mimetype);

    // Get a signed URL to return to the frontend
    const signedUrl = await getSignedDownloadUrl('profile-images', storagePath, 3600);

    // Update Firestore with both legacy and new fields
    await FirestoreHelper.setDoc('users', userId, {
      photoURL: signedUrl,
      storageProvider: 'supabase',
      storagePath: result.storagePath,
      avatarFileName: storagePath.split('/').pop(),
      avatarFileType: req.file.mimetype,
      avatarFileSize: req.file.size,
      avatarUploadedAt: new Date().toISOString()
    }, true);

    return sendSuccess(res, { photoURL: signedUrl }, 'Profile picture uploaded successfully');
  } catch (err) {
    next(err);
  }
};

