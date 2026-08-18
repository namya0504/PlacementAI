import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { storage, isMockFirebase } from '../firebase/firebaseAdmin.js';
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

    // Update user info
    const userUpdates = {};
    if (name) userUpdates.name = name;
    if (role) userUpdates.role = role;
    if (photoURL) userUpdates.photoURL = photoURL;

    if (Object.keys(userUpdates).length > 0) {
      await FirestoreHelper.setDoc('users', userId, userUpdates, true);
    }

    // Update profile document in profiles collection
    const profileUpdates = {
      profileId,
      userId,
      ...(college !== undefined && { college }),
      ...(branch !== undefined && { branch }),
      ...(passingYear !== undefined && { passingYear }),
      ...(linkedIn !== undefined && { linkedIn }),
      ...(github !== undefined && { github }),
      ...(bio !== undefined && { bio }),
      ...(interests !== undefined && { interests }),
      ...(skills !== undefined && { skills })
    };

    const updatedProfile = await FirestoreHelper.setDoc('profiles', profileId, profileUpdates, true);

    const userDoc = await FirestoreHelper.getDoc('users', userId);

    return sendSuccess(res, {
      uid: userId,
      name: userDoc?.name || name,
      email: userDoc?.email,
      role: userDoc?.role || role,
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

    let photoURL = '';

    if (!isMockFirebase && storage) {
      const bucket = storage.bucket();
      const fileExt = req.file.mimetype.split('/')[1] || 'jpeg';
      const fileName = `profile-images/${userId}_${Date.now()}.${fileExt}`;
      const file = bucket.file(fileName);
      
      await file.save(req.file.buffer, {
        metadata: { contentType: req.file.mimetype }
      });
      await file.makePublic();
      photoURL = file.publicUrl();
    } else {
      // Fallback for local mock development
      photoURL = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }

    await FirestoreHelper.setDoc('users', userId, { photoURL }, true);

    return sendSuccess(res, { photoURL }, 'Profile picture uploaded successfully');
  } catch (err) {
    next(err);
  }
};
