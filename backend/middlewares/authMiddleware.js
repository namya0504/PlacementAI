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
      // 2. Fallback to Firebase Admin SDK ID token verification
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

      // 3. Fallback to Firebase Identity Toolkit REST API verification (only when API key is configured)
      const restApiKey = process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY;
      if (restApiKey) {
        try {
          const verifyRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${restApiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken: token })
          });
          if (verifyRes.ok) {
            const data = await verifyRes.json();
            const verifiedUser = data?.users?.[0];
            if (verifiedUser && verifiedUser.localId) {
              req.user = {
                userId: verifiedUser.localId,
                email: verifiedUser.email || '',
                role: ''
              };
              return next();
            }
          }
        } catch (restErr) {
          console.warn('REST auth verification fallback error:', restErr.message);
        }
      }
    }

    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid token',
      error: err.message
    });
  }
};
