import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { auth, isMockFirebase } from '../firebase/firebaseAdmin.js';

export const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    // 1. Verify custom JWT
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      req.user = decoded;
      return next();
    } catch (jwtErr) {
      // 2. Fallback to Firebase ID token verification if Admin SDK is configured
      if (auth) {
        try {
          const fbUser = await auth.verifyIdToken(token);
          req.user = {
            userId: fbUser.uid,
            email: fbUser.email,
            role: fbUser.role || ''
          };
          return next();
        } catch (fbErr) {
          console.warn('Firebase ID token verification failed:', fbErr.message);
        }
      }
    }

    if (process.env.NODE_ENV === 'production') {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }
    
    // In strict mode, we no longer fallback to dev mock user
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid token',
      error: err.message
    });
  }
};
