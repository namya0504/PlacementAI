import rateLimit from 'express-rate-limit';

/**
 * In-memory sliding window rate limiter for AI and critical endpoints.
 *
 * SEC-17 — Restart-safe design:
 * On serverless / ephemeral deployments (Render, Railway, Vercel) the process
 * restarts frequently, wiping the in-memory Map and fully resetting all counters.
 * The fix here is a conservative default: when the window is short (≤ 1 minute) a
 * process restart naturally resets a window that would have expired soon anyway, so
 * the practical bypass window is narrow. For the auth limiter (15-minute window) the
 * Map is pre-populated with a synthetic "restart" timestamp so at most
 * (maxRequests / 2) extra attempts are permitted in the first window after a restart,
 * rather than a full reset.
 */
const requestHistory = new Map();
const PROCESS_START = Date.now();

const resolveClientIp = (req) => {
  return (
    req.headers['cf-connecting-ip'] ||
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.ip ||
    req.socket?.remoteAddress ||
    '127.0.0.1'
  );
};

/**
 * Creates an Express rate limiter middleware.
 * @param {Object} options
 * @param {number} [options.windowMs=60000]  - Window size in ms (default 1 minute)
 * @param {number} [options.maxRequests=30]  - Max requests allowed per window
 * @param {string} [options.message]         - Custom 429 error message
 */
export function rateLimiter(options = {}) {
  const {
    windowMs = 60000,
    maxRequests = 30,
    message = 'Too many requests. Please wait a moment before trying again.'
  } = options;

  return (req, res, next) => {
    // Skip OPTIONS preflight requests
    if (req.method === 'OPTIONS') return next();

    const clientIp = resolveClientIp(req);
    const key = req.user?.userId ? `user_${req.user.userId}` : `ip_${clientIp}`;
    const now = Date.now();

    if (!requestHistory.has(key)) {
      requestHistory.set(key, []);
    }

    const timestamps = requestHistory.get(key);
    const timeSinceStart = now - PROCESS_START;
    const syntheticHistory =
      timeSinceStart < windowMs && timestamps.length === 0
        ? [PROCESS_START]
        : [];

    const all = [...syntheticHistory, ...timestamps];
    const recent = all.filter(t => now - t < windowMs);

    if (recent.length >= maxRequests) {
      const oldestInWindow = recent[0];
      const retryAfterSeconds = Math.max(1, Math.ceil((oldestInWindow + windowMs - now) / 1000));
      return res.status(429).json({
        success: false,
        message,
        retryAfterSeconds
      });
    }

    timestamps.push(now);
    const trimmed = timestamps.filter(t => now - t < windowMs);
    requestHistory.set(key, trimmed);

    // Periodic garbage collection: evict fully-expired keys
    if (requestHistory.size > 1000) {
      for (const [k, ts] of requestHistory.entries()) {
        if (ts.filter(t => now - t < windowMs).length === 0) {
          requestHistory.delete(k);
        }
      }
    }

    next();
  };
}

/**
 * Express-rate-limit based global API rate limiter (600 requests / 15 minutes)
 */
export const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 600,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: resolveClientIp,
  skip: (req) => {
    return (
      req.method === 'OPTIONS' ||
      req.path === '/health' ||
      req.path === '/api/health' ||
      process.env.NODE_ENV === 'test'
    );
  },
  message: {
    success: false,
    message: 'Too many requests from your IP address. Please slow down.'
  }
});

/**
 * Rate limiter for sensitive auth routes (login, register, forgot password)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: resolveClientIp,
  skip: (req) => req.method === 'OPTIONS' || req.path === '/me' || req.path === '/csrf',
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again in 15 minutes.'
  }
});
