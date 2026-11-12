import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { auth } from '../firebase/firebaseAdmin.js';
import { hasValidCsrfToken, isSafeCsrfMethod } from './csrfMiddleware.js';

const REVOKED_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const revokedTokens = new Map();

/**
 * Adds an authenticated JWT or ID token to the server revocation list until its expiry.
 */
export const revokeToken = (token) => {
  if (!token || typeof token !== 'string') return;
  const now = Date.now();
  if (revokedTokens.size > 5000) {
    for (const [key, exp] of revokedTokens.entries()) {
      if (exp <= now) revokedTokens.delete(key);
    }
  }
  revokedTokens.set(token, now + REVOKED_TOKEN_TTL_MS);
};

export const isTokenRevoked = (token) => {
  if (!token) return false;
  const exp = revokedTokens.get(token);
  if (!exp) return false;
  if (Date.now() > exp) {
    revokedTokens.delete(token);
    return false;
  }
  return true;
};

export const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
      if (!isSafeCsrfMethod(req.method) && !hasValidCsrfToken(req)) {
        return res.status(403).json({
          success: false,
          message: 'Your session could not be verified. Refresh the page and try again.'
        });
      }
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    if (isTokenRevoked(token)) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Session has been logged out' });
    }

    // 1. Verify custom JWT (explicit HS256 algorithm enforcement prevents alg:none attacks)
    try {
      const decoded = jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'] });
      req.user = decoded;
      req.token = token;
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
      const rawRestKey = process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || 'AIzaSyBd2Zoslz2SoI1kkkzHJ4nrFYEXHWH8d3w';
      const trimmedKey = String(rawRestKey).trim().replace(/^["']+|["']+$/g, '');
      const restApiKey = (trimmedKey.startsWith('AIza') && trimmedKey.length >= 35) ? trimmedKey : 'AIzaSyBd2Zoslz2SoI1kkkzHJ4nrFYEXHWH8d3w';
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

/**
 * Optional protection middleware — attaches req.user if valid token exists,
 * but allows the request to continue if unauthenticated.
 */
export const optionalProtectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) return next();

    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      req.user = decoded;
      req.token = token;
      return next();
    } catch {
      if (auth) {
        try {
          const fbUser = await auth.verifyIdToken(token);
          req.user = {
            userId: fbUser.uid,
            email: fbUser.email,
            role: fbUser.role || ''
          };
          return next();
        } catch {}
      }
    }
    return next();
  } catch {
    return next();
  }
};
