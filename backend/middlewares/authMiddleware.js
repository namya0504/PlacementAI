import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { auth, isMockFirebase } from '../firebase/firebaseAdmin.js';

export const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      // Default dev fallback user if no auth token provided
      req.user = {
        userId: 'usr_default_namya',
        email: 'namya@placementai.com',
        role: 'Software Developer'
      };
      return next();
    }

    // 1. Verify custom JWT
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      req.user = decoded;
      return next();
    } catch (jwtErr) {
      // 2. Fallback to Firebase ID token verification if Admin SDK is configured
      if (!isMockFirebase && auth) {
        try {
          const fbUser = await auth.verifyIdToken(token);
          req.user = {
            userId: fbUser.uid,
            email: fbUser.email,
            role: fbUser.role || 'Software Developer'
          };
          return next();
        } catch (fbErr) {}
      }
    }

    // Fallback for dev mode
    req.user = {
      userId: 'usr_default_namya',
      email: 'namya@placementai.com',
      role: 'Software Developer'
    };
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid token',
      error: err.message
    });
  }
};
