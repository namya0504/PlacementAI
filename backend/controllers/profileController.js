import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { storage } from '../firebase/firebaseAdmin.js';
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
        college: '',
        branch: '',
        passingYear: '',
        linkedIn: '',
        github: '',
        bio: '',
        interests: [],
        skills: []
      };
      await FirestoreHelper.setDoc('profiles', profileId, profileDoc);
    }

    const combined = {
      uid: userId,
      name: userDoc.name || '',
      email: userDoc.email || '',
      role: userDoc.role || 'Software Developer',
      photoURL: userDoc.photoURL || '',
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

    // Update user info - Prevent role mass assignment / privilege escalation
    const userUpdates = {};
    if (typeof name === 'string') userUpdates.name = name.trim().slice(0, 80);
    if (typeof photoURL === 'string') userUpdates.photoURL = photoURL.trim().slice(0, 500);

    if (Object.keys(userUpdates).length > 0) {
      await FirestoreHelper.setDoc('users', userId, userUpdates, true);
    }

    // Update profile document in profiles collection
    const profileUpdates = {
      profileId,
      userId,
      ...(college !== undefined && { college: String(college).slice(0, 100) }),
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

    return sendSuccess(res, {
      uid: userId,
      name: userDoc?.name || name,
      email: userDoc?.email,
      role: userDoc?.role || 'Software Developer',
      photoURL: userDoc?.photoURL || photoURL,
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

    // Validate image mime type
    const validImageMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validImageMimes.includes(req.file.mimetype)) {
      return sendError(res, 'Invalid image format. Only JPEG, PNG, and WebP are allowed.', 400);
    }

    let photoURL = '';

    if (storage) {
      const bucket = storage.bucket();
      const fileExt = req.file.mimetype === 'image/png' ? 'png' : req.file.mimetype === 'image/webp' ? 'webp' : 'jpeg';
      const fileName = `profile-images/${userId}/${Date.now()}.${fileExt}`;
      const file = bucket.file(fileName);
      
      await file.save(req.file.buffer, {
        metadata: { contentType: req.file.mimetype }
      });
      await file.makePublic();
      photoURL = file.publicUrl();
    } else {
      throw new Error('Firebase storage is not configured.');
    }

    await FirestoreHelper.setDoc('users', userId, { photoURL }, true);

    return sendSuccess(res, { photoURL }, 'Profile picture uploaded successfully');
  } catch (err) {
    next(err);
  }
};
