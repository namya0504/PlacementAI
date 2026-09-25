/**
 * In-memory sliding window rate limiter for AI and critical endpoints.
 */
const requestHistory = new Map();

/**
 * Creates an Express rate limiter middleware.
 * @param {Object} options
 * @param {number} [options.windowMs=60000] - Window size in milliseconds (default 1 minute)
 * @param {number} [options.maxRequests=30] - Max allowed requests per window
 * @param {string} [options.message] - Custom error message
 */
export function rateLimiter(options = {}) {
  const {
    windowMs = 60000,
    maxRequests = 30,
    message = 'Too many AI requests. Please wait a moment before trying again.'
  } = options;

  return (req, res, next) => {
    const key = req.user?.userId || req.ip || 'anonymous';
    const now = Date.now();

    if (!requestHistory.has(key)) {
      requestHistory.set(key, []);
    }

    const timestamps = requestHistory.get(key);
    // Filter timestamps within the window
    const recent = timestamps.filter(t => now - t < windowMs);

    if (recent.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message,
        retryAfterSeconds: Math.ceil((recent[0] + windowMs - now) / 1000)
      });
    }

    recent.push(now);
    requestHistory.set(key, recent);

    // Garbage collection periodically
    if (requestHistory.size > 1000) {
      for (const [k, ts] of requestHistory.entries()) {
        const valid = ts.filter(t => now - t < windowMs);
        if (valid.length === 0) {
          requestHistory.delete(k);
        } else {
          requestHistory.set(k, valid);
        }
      }
    }

    next();
  };
}
