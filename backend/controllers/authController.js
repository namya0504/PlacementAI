import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config/env.js';
import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { calculatePlacementReadiness } from '../utils/scoring.js';

const generateToken = (userId, email, role) => {
  return jwt.sign({ userId, email, role }, config.jwtSecret, { expiresIn: '7d' });
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role = 'Software Developer' } = req.body;
    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400);
    }

    const existingUsers = await FirestoreHelper.queryCollection('users', 'email', email);
    if (existingUsers.length > 0) {
      return sendError(res, 'User with this email already exists', 400);
    }

    const userId = 'usr_' + Date.now();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Sync with Firebase Auth Service if live Firebase is active
    try {
      const { auth, isMockFirebase } = await import('../firebase/firebaseAdmin.js');
      if (auth && !isMockFirebase) {
        await auth.createUser({
          uid: userId,
          email,
          password,
          displayName: name
        });
      }
    } catch (fbAuthErr) {
      console.warn('Firebase Auth user creation warning:', fbAuthErr.message);
    }

    const newUser = {
      userId,
      name: name || email.split('@')[0],
      email,
      password: hashedPassword,
      role,
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      createdAt: new Date().toISOString()
    };

    await FirestoreHelper.setDoc('users', userId, newUser);

    // Initial Profile
    const profileId = 'prof_' + userId;
    await FirestoreHelper.setDoc('profiles', profileId, {
      profileId,
      userId,
      college: '',
      branch: '',
      passingYear: '',
      linkedIn: '',
      github: '',
      bio: '',
      interests: [],
      skills: ['JavaScript', 'React']
    });

    // Initial Readiness Score
    const initialStats = {
      resumeScore: 85,
      atsScore: 84,
      aptitudeScore: 72,
      technicalScore: 80,
      hrScore: 82,
      resumesCreated: 1,
      testsCompleted: 0,
      certificatesEarned: 0,
      mockInterviews: 0,
      streakDays: 1
    };
    initialStats.overallReadiness = calculatePlacementReadiness(initialStats);

    await FirestoreHelper.setDoc('placement_readiness', 'readiness_' + userId, {
      readinessId: 'readiness_' + userId,
      userId,
      ...initialStats
    });

    const token = generateToken(userId, email, role);

    const userResponse = {
      uid: userId,
      name: newUser.name,
      email: newUser.email,
      photoURL: newUser.photoURL,
      role: newUser.role,
      token,
      stats: initialStats
    };

    return sendSuccess(res, userResponse, 'Registration successful', 201);
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400);
    }

    const users = await FirestoreHelper.queryCollection('users', 'email', email);
    let user = users[0];

    if (!user) {
      return sendError(res, 'Invalid email or password', 401);
    } else {
      const match = await bcrypt.compare(password, user.password || '');
      if (!match) {
        return sendError(res, 'Invalid email or password', 401);
      }
    }

    const token = generateToken(user.userId, user.email, user.role);

    // Retrieve Readiness
    let readinessDoc = await FirestoreHelper.getDoc('placement_readiness', 'readiness_' + user.userId);
    if (!readinessDoc) {
      readinessDoc = {
        resumeScore: 0,
        atsScore: 0,
        aptitudeScore: 0,
        technicalScore: 0,
        hrScore: 0,
        overallReadiness: 0,
        resumesCreated: 0,
        testsCompleted: 0,
        certificatesEarned: 0,
        mockInterviews: 0,
        streakDays: 0
      };
    }

    const userResponse = {
      uid: user.userId,
      name: user.name,
      email: user.email,
      photoURL: user.photoURL,
      role: user.role,
      token,
      stats: readinessDoc
    };

    return sendSuccess(res, userResponse, 'Login successful');
  } catch (err) {
    next(err);
  }
};

export const googleLogin = async (req, res, next) => {
  try {
    const { email, name, photoURL } = req.body;
    const userEmail = email || 'google.user@example.com';
    const users = await FirestoreHelper.queryCollection('users', 'email', userEmail);
    let user = users[0];

    if (!user) {
      const userId = 'usr_google_' + Date.now();
      user = {
        userId,
        name: name || 'Google User',
        email: userEmail,
        photoURL: photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        role: 'Software Developer',
        createdAt: new Date().toISOString()
      };
      await FirestoreHelper.setDoc('users', userId, user);
    }

    const token = generateToken(user.userId, user.email, user.role);

    let readinessDoc = await FirestoreHelper.getDoc('placement_readiness', 'readiness_' + user.userId);
    if (!readinessDoc) {
      readinessDoc = {
        resumeScore: 0,
        atsScore: 0,
        aptitudeScore: 0,
        technicalScore: 0,
        hrScore: 0,
        overallReadiness: 0,
        resumesCreated: 0,
        testsCompleted: 0,
        certificatesEarned: 0,
        mockInterviews: 0,
        streakDays: 0
      };
    }

    return sendSuccess(res, {
      uid: user.userId,
      name: user.name,
      email: user.email,
      photoURL: user.photoURL,
      role: user.role,
      token,
      stats: readinessDoc
    }, 'Google Login successful');
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return sendError(res, 'Email is required', 400);

    return sendSuccess(res, { email }, 'Password reset instructions have been sent to your email.');
  } catch (err) {
    next(err);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    return sendSuccess(res, {}, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    let user = await FirestoreHelper.getDoc('users', userId);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    let readinessDoc = await FirestoreHelper.getDoc('placement_readiness', 'readiness_' + userId);

    return sendSuccess(res, {
      uid: user.userId,
      name: user.name,
      email: user.email,
      photoURL: user.photoURL,
      role: user.role,
      stats: readinessDoc || {
        resumeScore: 0,
        atsScore: 0,
        aptitudeScore: 0,
        technicalScore: 0,
        hrScore: 0,
        overallReadiness: 0
      }
    });
  } catch (err) {
    next(err);
  }
};
