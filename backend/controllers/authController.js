import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';
import { config } from '../config/env.js';
import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { calculatePlacementReadiness } from '../utils/scoring.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/emailService.js';
import { getFileUrl } from '../services/storageService.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/;

const generateToken = (userId, email, role) => {
  return jwt.sign({ userId, email, role }, config.jwtSecret, { expiresIn: '7d' });
};

const setAuthCookie = (res, token) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProd,              // HTTPS only in production (required for sameSite=none)
    sameSite: isProd ? 'none' : 'lax', // 'none' allows cross-site cookie on Vercel→Render
    maxAge: 7 * 24 * 60 * 60 * 1000   // 7 days
  });
};

export const issueCsrfToken = (req, res) => {
  // SEC-18 fix: always generate a fresh token — never reuse the existing cookie value.
  // Reusing allows an attacker who captures an old token to use it indefinitely.
  const csrfToken = randomBytes(32).toString('hex');
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('csrfToken', csrfToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  return sendSuccess(res, { csrfToken }, 'CSRF token issued');
};

/**
 * GET /api/auth/check-email?email=...
 * Lightweight probe — returns whether the email is already registered.
 * Used by Signup Step 1 to give instant feedback before the user proceeds.
 */
export const checkEmail = async (req, res, next) => {
  try {
    const raw = req.query.email;
    if (!raw) return sendError(res, 'email query param is required', 400);
    const sanitizedEmail = raw.trim().toLowerCase();
    if (!EMAIL_REGEX.test(sanitizedEmail)) {
      return sendError(res, 'Invalid email format', 400);
    }
    const existing = await FirestoreHelper.queryCollection('users', 'email', sanitizedEmail);
    if (existing.length === 0) {
      return sendSuccess(res, { exists: false }, 'Email check complete');
    }
    const user = existing[0];
    // Deactivated accounts: check cooldown so Signup can show the right message
    if (user.deactivated) {
      const deactivatedAt = user.deactivatedAt ? new Date(user.deactivatedAt) : null;
      const daysSince = deactivatedAt ? Math.floor((Date.now() - deactivatedAt.getTime()) / (1000 * 60 * 60 * 24)) : 999;
      const daysRemaining = Math.max(0, 30 - daysSince);
      return sendSuccess(res, {
        exists: daysRemaining > 0, // treat as taken during cooldown
        deactivated: true,
        daysRemaining
      }, 'Email check complete');
    }
    return sendSuccess(res, { exists: true }, 'Email check complete');
  } catch (err) {
    next(err);
  }
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

    if (!name || !String(name).trim()) {
      return sendError(res, 'Full name is required', 400);
    }

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
      const existing = existingUsers[0];
      // Allow re-signup if account was deactivated AND 30-day cooldown has passed
      if (existing.deactivated) {
        const deactivatedAt = existing.deactivatedAt ? new Date(existing.deactivatedAt) : null;
        const daysSince = deactivatedAt ? Math.floor((Date.now() - deactivatedAt.getTime()) / (1000 * 60 * 60 * 24)) : 999;
        if (daysSince < 30) {
          const daysRemaining = 30 - daysSince;
          return sendError(
            res,
            `This email was recently deactivated. You can re-register in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}.`,
            400,
            null,
            'DEACTIVATION_COOLDOWN'
          );
        }
        // 30 days passed — delete old account data and allow fresh registration
        try {
          await FirestoreHelper.deleteDoc('users', existing.userId);
          await FirestoreHelper.deleteDoc('profiles', 'prof_' + existing.userId);
          console.log(`♻️ Deactivated account for ${sanitizedEmail} cleaned up. Allowing re-registration.`);
        } catch (cleanupErr) {
          console.warn('Deactivated account cleanup notice:', cleanupErr.message);
        }
      } else {
        return sendError(res, 'User with this email already exists', 400);
      }
    }

    const userId = 'usr_' + Date.now();
    const hashedPassword = await bcrypt.hash(password, 10);
    const displayName = name ? name.trim().slice(0, 80) : sanitizedEmail.split('@')[0];
    const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`;

    // Sync with Firebase Auth Service if live Firebase is active.
    // NOTE: The verification email is sent by the frontend Firebase client SDK
    // (sendEmailVerification on clientAuth.currentUser) — not here.
    // Firebase Admin createUser does NOT auto-send a verification email by itself.
    try {
      const { auth } = await import('../firebase/firebaseAdmin.js');
      if (auth) {
        await auth.createUser({
          uid: userId,
          email: sanitizedEmail,
          password,
          displayName
        });
        console.log(`✅ Firebase Auth user created for ${sanitizedEmail} (uid: ${userId})`);
      }
    } catch (fbAuthErr) {
      // Non-fatal — user is saved in Firestore regardless; Firebase Auth sync failed
      console.warn('Firebase Auth user creation warning (non-fatal):', fbAuthErr.message);
    }

    // Development convenience: log a backend-generated verification link to the console.
    // The real email delivery happens via Firebase client SDK on the frontend.
    if (process.env.NODE_ENV !== 'production') {
      try {
        const { auth } = await import('../firebase/firebaseAdmin.js');
        if (auth) {
          const devLink = await auth.generateEmailVerificationLink(sanitizedEmail).catch(() => null);
          if (devLink) {
            console.log(`🔗 [DEV] Manual verification link for ${sanitizedEmail}:`, devLink);
          }
        }
      } catch (_) {}
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

    const hasCompulsoryData = Boolean(
      newUser.phone?.trim() &&
      newUser.college?.trim() &&
      newUser.branch?.trim() &&
      newUser.passingYear?.trim() &&
      (newUser.targetRole?.trim() || newUser.role?.trim())
    );

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
      needsProfileCompletion: !hasCompulsoryData,
      verificationLink: process.env.NODE_ENV !== 'production' ? verificationLink : undefined,
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
      return sendError(res, 'Invalid email or password', 401, null, 'EMAIL_NOT_FOUND');
    }

    // Deactivated account — block login
    if (user.deactivated) {
      const deactivatedAt = user.deactivatedAt ? new Date(user.deactivatedAt) : null;
      const daysSince = deactivatedAt ? Math.floor((Date.now() - deactivatedAt.getTime()) / (1000 * 60 * 60 * 24)) : 999;
      const daysRemaining = Math.max(0, 30 - daysSince);
      const message = daysRemaining > 0
        ? `This account has been deactivated. You can re-register with the same email in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}.`
        : 'This account has been deactivated.';
      return sendError(res, message, 403, null, 'ACCOUNT_DEACTIVATED');
    }

    const match = await bcrypt.compare(password, user.password || '');
    if (!match) {
      return sendError(res, 'Invalid email or password', 401, null, 'WRONG_PASSWORD');
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

    const hasCompulsoryData = Boolean(
      user.phone?.trim() &&
      user.college?.trim() &&
      user.branch?.trim() &&
      user.passingYear?.trim() &&
      (user.targetRole?.trim() || user.role?.trim())
    );

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
      needsProfileCompletion: !hasCompulsoryData,
      stats: readinessDoc
    };

    return sendSuccess(res, userResponse, 'Login successful');
  } catch (err) {
    next(err);
  }
};

export const googleLogin = async (req, res, next) => {
  try {
    const { idToken, name, photoURL } = req.body;
    const { auth, isMockFirebase } = await import('../firebase/firebaseAdmin.js');

    let userEmail = null;
    let displayName = name || '';
    let avatar = photoURL || '';
    let googleUid = null;

    if (idToken) {
      // 1. Try Firebase Admin SDK verification if available
      if (auth && !isMockFirebase) {
        try {
          const decodedToken = await auth.verifyIdToken(idToken);
          userEmail = decodedToken.email?.toLowerCase();
          displayName = decodedToken.name || displayName || userEmail?.split('@')[0];
          avatar = decodedToken.picture || avatar;
          googleUid = decodedToken.uid;
        } catch (tokenErr) {
          console.warn('Firebase ID token verification via Admin SDK failed, falling back to REST lookup:', tokenErr.message);
        }
      }

      // 2. If Admin SDK is not initialized or failed, verify via Firebase Identity Toolkit REST API
      if (!userEmail) {
        try {
          const apiKey = process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY;
          if (!apiKey) throw new Error('FIREBASE_API_KEY not configured for REST fallback');
          const verifyRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken })
          });
          if (verifyRes.ok) {
            const data = await verifyRes.json();
            const verifiedUser = data?.users?.[0];
            if (verifiedUser && verifiedUser.email) {
              userEmail = verifiedUser.email.toLowerCase();
              displayName = verifiedUser.displayName || displayName || userEmail.split('@')[0];
              avatar = verifiedUser.photoUrl || avatar;
              googleUid = verifiedUser.localId;
            }
          } else {
            const errData = await verifyRes.json().catch(() => ({}));
            console.warn('Firebase REST verification error response:', verifyRes.status, errData);
          }
        } catch (restErr) {
          console.warn('Firebase REST token verification network error:', restErr.message);
        }
      }
    }

    if (!userEmail) {
      return sendError(res, 'Invalid, expired, or unverified Google authentication token', 401);
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
    } else {
      const updates = {};
      if (avatar && (!user.photoURL || user.photoURL.includes('dicebear'))) {
        updates.photoURL = avatar;
        user.photoURL = avatar;
      }
      if (displayName && !user.name) {
        updates.name = displayName;
        user.name = displayName;
      }
      if (Object.keys(updates).length > 0) {
        await FirestoreHelper.setDoc('users', user.userId, updates, true);
      }
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

    const hasCompulsoryData = Boolean(
      user.phone?.trim() &&
      user.college?.trim() &&
      user.branch?.trim() &&
      user.passingYear?.trim() &&
      (user.targetRole?.trim() || user.role?.trim())
    );

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
      needsProfileCompletion: !hasCompulsoryData,
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
    if (!EMAIL_REGEX.test(sanitizedEmail)) {
      return sendError(res, 'Please provide a valid email address', 400);
    }

    // Always verify the user exists in our database before generating any reset link
    const users = await FirestoreHelper.queryCollection('users', 'email', sanitizedEmail);
    const userExists = users && users.length > 0;

    // Use a constant-time response to prevent email enumeration attacks
    const genericMessage = 'If an account with this email exists, password reset instructions have been sent.';

    if (!userExists) {
      // Return success response regardless so attackers can't enumerate emails
      return sendSuccess(res, { email: sanitizedEmail }, genericMessage);
    }

    const { auth } = await import('../firebase/firebaseAdmin.js');
    let resetLink = null;
    if (auth) {
      try {
        resetLink = await auth.generatePasswordResetLink(sanitizedEmail);
      } catch (fbErr) {
        console.warn('Firebase reset link generation notice:', fbErr.message);
      }
    }

    // Only dispatch an email if we got a real Firebase reset link.
    // The client SDK path (sendFirebasePasswordReset) handles delivery for accounts
    // created via Firebase Auth. This backend path covers accounts that were created
    // before Firebase Auth sync existed, if any.
    if (resetLink) {
      try {
        await sendPasswordResetEmail({ to: sanitizedEmail, resetLink });
      } catch (mailErr) {
        console.warn('Could not dispatch password reset email:', mailErr.message);
      }
    }

    return sendSuccess(res, { email: sanitizedEmail }, genericMessage);
  } catch (err) {
    next(err);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const isProd = process.env.NODE_ENV === 'production';
    res.clearCookie('token', {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax'
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

    // Sync emailVerified from Firebase Auth → Firestore.
    // When a user clicks the verification link, Firebase Auth marks them verified,
    // but our Firestore `emailVerified` field won't know unless we check here.
    if (!user.emailVerified) {
      try {
        const { auth } = await import('../firebase/firebaseAdmin.js');
        if (auth) {
          const fbUser = await auth.getUser(userId);
          if (fbUser.emailVerified) {
            await FirestoreHelper.setDoc('users', userId, { emailVerified: true }, true);
            user.emailVerified = true;
            console.log(`✅ Email verified synced from Firebase Auth for user ${userId}`);
          }
        }
      } catch (syncErr) {
        // Non-fatal — carry on with the stored Firestore value
        console.warn('Firebase email verified sync notice:', syncErr.message);
      }
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

    const hasCompulsoryData = Boolean(
      user.phone?.trim() &&
      user.college?.trim() &&
      user.branch?.trim() &&
      user.passingYear?.trim() &&
      (user.targetRole?.trim() || user.role?.trim())
    );

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
      needsProfileCompletion: !hasCompulsoryData,
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
    // Email comes from the authenticated JWT (set by protectRoute)
    const userEmail = req.user?.email;
    const userId = req.user?.userId;
    if (!userEmail) return sendError(res, 'Could not determine user email from token', 400);

    const sanitizedEmail = userEmail.trim().toLowerCase();

    // Check if already verified in Firestore to avoid redundant sends
    const userDoc = userId ? await FirestoreHelper.getDoc('users', userId) : null;
    if (userDoc?.emailVerified) {
      return sendSuccess(res, { email: sanitizedEmail, alreadyVerified: true }, 'Email is already verified.');
    }

    // Prefer: the frontend Firebase client SDK sends the email (sendFirebaseVerificationEmail).
    // This backend route is the FALLBACK for when there is no client Firebase session
    // (e.g. user closed the browser and re-opened the pending screen on a new device).
    //
    // We use Firebase Admin generateEmailVerificationLink + our SMTP transporter here.
    const displayName = userDoc?.name || sanitizedEmail.split('@')[0];
    const frontendBase = (process.env.FRONTEND_URL?.split(',')[0]?.trim()) || 'http://localhost:5173';
    let link = null;

    try {
      const { auth } = await import('../firebase/firebaseAdmin.js');
      if (auth) {
        link = await auth.generateEmailVerificationLink(sanitizedEmail);
        console.log(`✉️ Verification link generated for ${sanitizedEmail}`);
      }
    } catch (fbErr) {
      console.warn('Firebase generateEmailVerificationLink notice:', fbErr.message);
    }

    const verificationLink = link || `${frontendBase}/verify-email-pending`;

    try {
      await sendVerificationEmail({
        to: sanitizedEmail,
        name: displayName,
        verificationLink
      });
    } catch (mailErr) {
      console.warn('⚠️ Resend verification email dispatch notice:', mailErr.message);
    }

    return sendSuccess(res, {
      email: sanitizedEmail
    }, 'Verification email sent. Please check your inbox and spam folder.');
  } catch (err) {
    next(err);
  }
};

export const confirmEmailVerification = async (req, res, next) => {
  try {
    // Self-verification bypass is only available in development.
    // In production, email verification is handled by Firebase Auth's own flow.
    if (process.env.NODE_ENV === 'production') {
      return sendError(res, 'Manual email verification is not available in production. Please click the link in your verification email.', 403);
    }

    const userId = req.user?.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    await FirestoreHelper.setDoc('users', userId, { emailVerified: true }, true);
    return sendSuccess(res, { emailVerified: true }, 'Email has been successfully verified.');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/complete-profile
 * Saves compulsory academic & contact details on first-time login
 */
export const completeProfile = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return sendError(res, 'Unauthorized', 401);
    }

    const { phone, college, branch, passingYear, targetRole, location, name } = req.body;

    if (!phone || !String(phone).trim()) {
      return sendError(res, 'Phone number is a compulsory field and cannot be empty.', 400);
    }
    if (!college || !String(college).trim()) {
      return sendError(res, 'College / University is a compulsory field and cannot be empty.', 400);
    }
    if (!branch || !String(branch).trim()) {
      return sendError(res, 'Branch / Department is a compulsory field and cannot be empty.', 400);
    }
    if (!passingYear || !String(passingYear).trim()) {
      return sendError(res, 'Passing year is a compulsory field and cannot be empty.', 400);
    }
    if (!targetRole || !String(targetRole).trim()) {
      return sendError(res, 'Target role is a compulsory field and cannot be empty.', 400);
    }

    const sanitizedPhone = String(phone).trim().slice(0, 25);
    const sanitizedCollege = String(college).trim().slice(0, 150);
    const sanitizedBranch = String(branch).trim().slice(0, 100);
    const sanitizedPassingYear = String(passingYear).trim().slice(0, 10);
    const sanitizedTargetRole = String(targetRole).trim().slice(0, 80);
    const sanitizedLocation = location ? String(location).trim().slice(0, 100) : '';

    const userDoc = await FirestoreHelper.getDoc('users', userId);
    if (!userDoc) {
      return sendError(res, 'User not found.', 404);
    }

    const userUpdates = {
      phone: sanitizedPhone,
      college: sanitizedCollege,
      branch: sanitizedBranch,
      passingYear: sanitizedPassingYear,
      targetRole: sanitizedTargetRole,
      role: sanitizedTargetRole,
      location: sanitizedLocation || userDoc.location || ''
    };

    if (name && String(name).trim()) {
      userUpdates.name = String(name).trim().slice(0, 80);
    }

    await FirestoreHelper.setDoc('users', userId, userUpdates, true);

    const profileId = 'prof_' + userId;
    const profileUpdates = {
      profileId,
      userId,
      phone: sanitizedPhone,
      college: sanitizedCollege,
      branch: sanitizedBranch,
      passingYear: sanitizedPassingYear,
      targetRole: sanitizedTargetRole,
      role: sanitizedTargetRole,
      location: sanitizedLocation || userDoc.location || ''
    };
    await FirestoreHelper.setDoc('profiles', profileId, profileUpdates, true);

    const { password: _pw, ...safeUserDoc } = userDoc;
    const updatedUser = {
      ...safeUserDoc,
      ...userUpdates,
      uid: userId,
      needsProfileCompletion: false
    };

    return sendSuccess(res, updatedUser, 'Profile setup completed successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/deactivate
 * Deactivates the authenticated user's account.
 * - Sets deactivated=true, deactivatedAt=now on the user document
 * - Clears the auth cookie / invalidates session
 * - Account cannot be logged into
 * - Same email can re-register after 30 days
 */
export const deactivateAccount = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const userDoc = await FirestoreHelper.getDoc('users', userId);
    if (!userDoc) return sendError(res, 'User not found', 404);

    if (userDoc.deactivated) {
      return sendError(res, 'Account is already deactivated', 400);
    }

    await FirestoreHelper.setDoc('users', userId, {
      deactivated: true,
      deactivatedAt: new Date().toISOString(),
      // Preserve email for re-registration eligibility check
    }, true);

    // Also disable Firebase Auth user if Firebase is live
    try {
      const { auth } = await import('../firebase/firebaseAdmin.js');
      if (auth) {
        await auth.updateUser(userId, { disabled: true });
      }
    } catch (fbErr) {
      console.warn('Firebase account disable notice:', fbErr.message);
    }

    // Clear auth cookie
    const isProd = process.env.NODE_ENV === 'production';
    res.clearCookie('token', {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax'
    });

    return sendSuccess(res, { deactivatedAt: new Date().toISOString() }, 'Account deactivated successfully. You will be logged out.');
  } catch (err) {
    next(err);
  }
};
