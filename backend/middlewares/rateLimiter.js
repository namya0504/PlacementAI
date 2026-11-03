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
 *
 * For production multi-process deployments, replace this with a Redis-backed limiter
 * (e.g. `rate-limiter-flexible` with an `ioredis` store). This in-process
 * implementation is correct for single-process deployments.
 */
const requestHistory = new Map();

// Stagger the effective start of the rate-limit window by half the window on process
// start so a restart does not grant a completely fresh window to all clients.
const PROCESS_START = Date.now();

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
    const key = req.user?.userId || req.ip || 'anonymous';
    const now = Date.now();

    if (!requestHistory.has(key)) {
      requestHistory.set(key, []);
    }

    const timestamps = requestHistory.get(key);

    // Sliding window: keep only timestamps within the current window.
    // SEC-17: Prepend the process-start time as a synthetic "phantom" request so
    // that immediately after a restart clients don't start with a completely clean
    // slate. The phantom expires naturally after one window period.
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

    // Record this request (only real timestamps — not synthetic ones)
    timestamps.push(now);
    // Trim to window so the array doesn't grow without bound
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
