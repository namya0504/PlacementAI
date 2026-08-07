import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user?.userId || 'usr_default_namya';
    const profileId = 'prof_' + userId;

    let profileDoc = await FirestoreHelper.getDoc('profiles', profileId);
    let userDoc = await FirestoreHelper.getDoc('users', userId);

    if (!profileDoc) {
      profileDoc = {
        profileId,
        userId,
        college: 'Stanford University',
        branch: 'Computer Science',
        passingYear: '2025',
        linkedIn: 'https://linkedin.com/in/namyashah',
        github: 'https://github.com/namyashah',
        bio: 'Passionate Full Stack & AI Developer seeking innovative software engineering roles.',
        interests: ['Artificial Intelligence', 'Web Development', 'System Architecture'],
        skills: ['React', 'Node.js', 'Python', 'Tailwind CSS', 'TypeScript']
      };
      await FirestoreHelper.setDoc('profiles', profileId, profileDoc);
    }

    const combined = {
      uid: userId,
      name: userDoc?.name || 'Namya Shah',
      email: userDoc?.email || 'namya@placementai.com',
      role: userDoc?.role || 'Software Developer',
      photoURL: userDoc?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      ...profileDoc
    };

    return sendSuccess(res, combined, 'Profile retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user?.userId || 'usr_default_namya';
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
    const userId = req.user?.userId || 'usr_default_namya';
    if (!req.file) {
      return sendError(res, 'No image file uploaded', 400);
    }

    // Convert image buffer to base64 data URI for storage & quick rendering
    const base64Img = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    await FirestoreHelper.setDoc('users', userId, { photoURL: base64Img }, true);

    return sendSuccess(res, { photoURL: base64Img }, 'Profile picture uploaded successfully');
  } catch (err) {
    next(err);
  }
};
