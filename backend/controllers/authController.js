import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config/env.js';
import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { calculatePlacementReadiness } from '../utils/scoring.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/emailService.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^_\-])[A-Za-z\d@$!%*?&#^_\-]{8,}$/;

const generateToken = (userId, email, role) => {
  return jwt.sign({ userId, email, role }, config.jwtSecret, { expiresIn: '7d' });
};

const setAuthCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

export const registerUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone = '',
      location = '',
      college = '',
      branch = '',
      passingYear = '',
      targetRole = '',
      role: customRole
    } = req.body;

    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400);
    }

    const sanitizedEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(sanitizedEmail)) {
      return sendError(res, 'Please provide a valid email address', 400);
    }

    if (password.length < 8) {
      return sendError(res, 'Password must be at least 8 characters long', 400);
    }

    if (!PASSWORD_REGEX.test(password)) {
      return sendError(res, 'Password must contain uppercase, lowercase, numbers, and a special character', 400);
    }

    const assignedRole = (targetRole || customRole || '').trim().slice(0, 80);
    const sanitizedPhone = phone ? String(phone).trim().slice(0, 25) : '';
    const sanitizedLocation = location ? String(location).trim().slice(0, 100) : '';
    const sanitizedCollege = college ? String(college).trim().slice(0, 150) : '';
    const sanitizedBranch = branch ? String(branch).trim().slice(0, 100) : '';
    const sanitizedPassingYear = passingYear ? String(passingYear).trim().slice(0, 10) : '';

    const existingUsers = await FirestoreHelper.queryCollection('users', 'email', sanitizedEmail);
    if (existingUsers.length > 0) {
      return sendError(res, 'User with this email already exists', 400);
    }

    const userId = 'usr_' + Date.now();
    const hashedPassword = await bcrypt.hash(password, 10);
    const displayName = name ? name.trim().slice(0, 80) : sanitizedEmail.split('@')[0];
    const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`;

    // Sync with Firebase Auth Service if live Firebase is active
    let verificationLink = null;
    try {
      const { auth } = await import('../firebase/firebaseAdmin.js');
      if (auth) {
        await auth.createUser({
          uid: userId,
          email: sanitizedEmail,
          password,
          displayName
        });
        try {
          verificationLink = await auth.generateEmailVerificationLink(sanitizedEmail);
          console.log(`✉️ Email verification link generated for ${sanitizedEmail}:`, verificationLink);
        } catch (linkErr) {
          console.warn('Firebase email verification link warning:', linkErr.message);
        }
      }
    } catch (fbAuthErr) {
      console.warn('Firebase Auth user creation warning:', fbAuthErr.message);
    }

    // Dispatch verification email to student's inbox
    try {
      await sendVerificationEmail({
        to: sanitizedEmail,
        name: displayName,
        verificationLink: verificationLink || `http://localhost:5173/login?verifyEmail=${encodeURIComponent(sanitizedEmail)}`
      });
    } catch (mailErr) {
      console.warn('⚠️ Verification email dispatch notice:', mailErr.message);
    }

    const newUser = {
      userId,
      name: displayName,
      email: sanitizedEmail,
      password: hashedPassword,
      role: assignedRole,
      targetRole: assignedRole,
      phone: sanitizedPhone,
      location: sanitizedLocation,
      college: sanitizedCollege,
      branch: sanitizedBranch,
      passingYear: sanitizedPassingYear,
      photoURL: avatar,
      emailVerified: false,
      onboarding: {
        status: 'not_started',
        currentStep: 1,
        completedAt: null,
        skippedAt: null
      },
      createdAt: new Date().toISOString()
    };

    await FirestoreHelper.setDoc('users', userId, newUser);

    // Initial Profile
    const profileId = 'prof_' + userId;
    await FirestoreHelper.setDoc('profiles', profileId, {
      profileId,
      userId,
      phone: sanitizedPhone,
      location: sanitizedLocation,
      college: sanitizedCollege,
      branch: sanitizedBranch,
      passingYear: sanitizedPassingYear,
      role: assignedRole,
      targetRole: assignedRole,
      linkedIn: '',
      github: '',
      bio: '',
      interests: [],
      skills: []
    });

    // Real initial readiness (no fake mock scores)
    const initialStats = {
      resumeScore: 0,
      atsScore: 0,
      aptitudeScore: 0,
      technicalScore: 0,
      hrScore: 0,
      resumesCreated: 0,
      testsCompleted: 0,
      certificatesEarned: 0,
      mockInterviews: 0,
      streakDays: 1,
      overallReadiness: 0
    };

    await FirestoreHelper.setDoc('placement_readiness', 'readiness_' + userId, {
      readinessId: 'readiness_' + userId,
      userId,
      ...initialStats
    });

    const token = generateToken(userId, sanitizedEmail, assignedRole);
    setAuthCookie(res, token);

    const userResponse = {
      uid: userId,
      name: newUser.name,
      email: newUser.email,
      photoURL: newUser.photoURL,
      role: newUser.role,
      targetRole: newUser.targetRole,
      phone: newUser.phone,
      location: newUser.location,
      college: newUser.college,
      branch: newUser.branch,
      passingYear: newUser.passingYear,
      emailVerified: false,
      onboarding: newUser.onboarding,
      isNewUser: true,
      verificationLink: process.env.NODE_ENV !== 'production' ? verificationLink : undefined,
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

    const sanitizedEmail = email.trim().toLowerCase();
    const users = await FirestoreHelper.queryCollection('users', 'email', sanitizedEmail);
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
    setAuthCookie(res, token);

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
        streakDays: 1
      };
    } else {
      readinessDoc.overallReadiness = calculatePlacementReadiness(readinessDoc);
    }

    const userResponse = {
      uid: user.userId,
      name: user.name,
      email: user.email,
      photoURL: user.photoURL,
      role: user.role || '',
      targetRole: user.targetRole || user.role || '',
      phone: user.phone || '',
      location: user.location || '',
      college: user.college || '',
      branch: user.branch || '',
      passingYear: user.passingYear || '',
      emailVerified: user.emailVerified ?? false,
      onboarding: user.onboarding || null,
      isNewUser: false,
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
    const { idToken, email, name, photoURL } = req.body;
    const { auth } = await import('../firebase/firebaseAdmin.js');

    let userEmail = null;
    let displayName = name || '';
    let avatar = photoURL || '';
    let googleUid = null;

    if (idToken) {
      if (auth) {
        try {
          const decodedToken = await auth.verifyIdToken(idToken);
          userEmail = decodedToken.email?.toLowerCase();
          displayName = decodedToken.name || displayName || userEmail?.split('@')[0];
          avatar = decodedToken.picture || avatar;
          googleUid = decodedToken.uid;
        } catch (tokenErr) {
          console.warn('Firebase ID token verification warning:', tokenErr.message);
          if (email) {
            userEmail = email.toLowerCase().trim();
          } else {
            return sendError(res, 'Invalid or expired Google authentication token', 401);
          }
        }
      } else if (email) {
        userEmail = email.toLowerCase().trim();
      }
    } else if (email) {
      userEmail = email.toLowerCase().trim();
      displayName = displayName || userEmail.split('@')[0];
      avatar = avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`;
      googleUid = 'dev_' + Date.now();
    } else {
      return sendError(res, 'Google authentication token (idToken) or email is required', 400);
    }

    if (!userEmail) {
      return sendError(res, 'Verified email could not be obtained from Google token', 400);
    }

    avatar = avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`;

    const users = await FirestoreHelper.queryCollection('users', 'email', userEmail);
    let user = users && users.length > 0 ? users[0] : null;
    const isNewUser = !user;

    if (!user) {
      const userId = 'usr_google_' + (googleUid || Date.now());
      user = {
        userId,
        name: displayName,
        email: userEmail,
        photoURL: avatar,
        role: '',
        targetRole: '',
        phone: '',
        location: '',
        college: '',
        branch: '',
        passingYear: '',
        emailVerified: true,
        onboarding: {
          status: 'not_started',
          currentStep: 1,
          completedAt: null,
          skippedAt: null
        },
        createdAt: new Date().toISOString()
      };
      await FirestoreHelper.setDoc('users', userId, user);

      // Create initial profile
      const profileId = 'prof_' + userId;
      await FirestoreHelper.setDoc('profiles', profileId, {
        profileId,
        userId,
        phone: '',
        location: '',
        college: '',
        branch: '',
        passingYear: '',
        role: '',
        targetRole: '',
        linkedIn: '',
        github: '',
        bio: '',
        interests: [],
        skills: []
      });

      // Create initial readiness
      const initialStats = {
        resumeScore: 0,
        atsScore: 0,
        aptitudeScore: 0,
        technicalScore: 0,
        hrScore: 0,
        resumesCreated: 0,
        testsCompleted: 0,
        certificatesEarned: 0,
        mockInterviews: 0,
        streakDays: 1,
        overallReadiness: 0
      };
      await FirestoreHelper.setDoc('placement_readiness', 'readiness_' + userId, {
        readinessId: 'readiness_' + userId,
        userId,
        ...initialStats
      });
    }

    const token = generateToken(user.userId, user.email, user.role);
    setAuthCookie(res, token);

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
        streakDays: 1
      };
    } else {
      readinessDoc.overallReadiness = calculatePlacementReadiness(readinessDoc);
    }

    return sendSuccess(res, {
      uid: user.userId,
      name: user.name,
      email: user.email,
      photoURL: user.photoURL,
      role: user.role || '',
      targetRole: user.targetRole || user.role || '',
      phone: user.phone || '',
      location: user.location || '',
      college: user.college || '',
      branch: user.branch || '',
      passingYear: user.passingYear || '',
      emailVerified: user.emailVerified ?? true,
      onboarding: user.onboarding || null,
      isNewUser,
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

    const sanitizedEmail = email.trim().toLowerCase();
    const { auth } = await import('../firebase/firebaseAdmin.js');
    let resetLink = null;
    if (auth) {
      try {
        resetLink = await auth.generatePasswordResetLink(sanitizedEmail);
      } catch (fbErr) {
        console.warn('Firebase reset link generation notice:', fbErr.message);
      }
    }

    try {
      await sendPasswordResetEmail({ to: sanitizedEmail, resetLink });
    } catch (mailErr) {
      console.warn('Could not dispatch password reset email:', mailErr.message);
    }

    return sendSuccess(res, { 
      email: sanitizedEmail,
      resetLink: process.env.NODE_ENV !== 'production' ? resetLink : undefined 
    }, 'If an account exists with this email, password reset instructions have been generated.');
  } catch (err) {
    next(err);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
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
    if (readinessDoc) {
      readinessDoc.overallReadiness = calculatePlacementReadiness(readinessDoc);
    }

    let photoURL = user.photoURL || '';
    if (user.storageProvider === 'supabase' && user.storagePath) {
      try {
        photoURL = await getFileUrl(user, 'photoURL');
      } catch (err) {
        // Keep fallback photoURL
      }
    }

    return sendSuccess(res, {
      uid: user.userId,
      name: user.name,
      email: user.email,
      photoURL,
      role: user.role || '',
      targetRole: user.targetRole || user.role || '',
      phone: user.phone || '',
      location: user.location || '',
      college: user.college || '',
      branch: user.branch || '',
      passingYear: user.passingYear || '',
      emailVerified: user.emailVerified ?? false,
      onboarding: user.onboarding || null,
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

export const resendVerificationEmail = async (req, res, next) => {
  try {
    const userEmail = req.user?.email || req.body?.email;
    if (!userEmail) return sendError(res, 'Email is required', 400);

    const sanitizedEmail = userEmail.trim().toLowerCase();
    const { auth } = await import('../firebase/firebaseAdmin.js');
    let link = null;
    if (auth) {
      try {
        link = await auth.generateEmailVerificationLink(sanitizedEmail);
        console.log(`✉️ Resent verification link for ${sanitizedEmail}:`, link);
      } catch (err) {
        console.warn('Firebase generate verification link notice:', err.message);
      }
    }

    // Dispatch verification email to student's inbox
    try {
      await sendVerificationEmail({
        to: sanitizedEmail,
        name: req.user?.name || sanitizedEmail.split('@')[0],
        verificationLink: link || `http://localhost:5173/login?verifyEmail=${encodeURIComponent(sanitizedEmail)}`
      });
    } catch (mailErr) {
      console.warn('⚠️ Resend verification email dispatch notice:', mailErr.message);
    }

    return sendSuccess(res, {
      email: sanitizedEmail,
      verificationLink: link || undefined
    }, 'Verification email has been sent to your email address. Please check your inbox.');
  } catch (err) {
    next(err);
  }
};

export const confirmEmailVerification = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    await FirestoreHelper.setDoc('users', userId, { emailVerified: true }, true);
    return sendSuccess(res, { emailVerified: true }, 'Email has been successfully verified.');
  } catch (err) {
    next(err);
  }
};
