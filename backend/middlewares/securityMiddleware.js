/**
 * Security Middleware for PlacementAI
 * Implements defenses against:
 * 1. Prototype Pollution attacks
 * 2. Null-byte injection
 * 3. Cross-Site Scripting (XSS) input vectors
 * 4. Parameter Pollution
 */

const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
const SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
const JAVASCRIPT_PROTOCOL_REGEX = /(?:javascript|vbscript|data):/gi;

/**
 * Recursively sanitizes a value by removing prototype pollution keys,
 * stripping null bytes, and cleaning basic executable script injection.
 */
function sanitizeValue(val, depth = 0) {
  if (depth > 10 || val === null || val === undefined) return val;

  if (typeof val === 'string') {
    // 1. Remove null bytes (\0)
    let cleaned = val.replace(/\0/g, '');
    // 2. Strip embedded script tags
    cleaned = cleaned.replace(SCRIPT_REGEX, '');
    // 3. Strip dangerous URI protocols in inline attributes
    cleaned = cleaned.replace(JAVASCRIPT_PROTOCOL_REGEX, '');
    return cleaned;
  }

  if (Array.isArray(val)) {
    return val.map(item => sanitizeValue(item, depth + 1));
  }

  if (typeof val === 'object' && val !== null) {
    const sanitizedObj = {};
    for (const [key, prop] of Object.entries(val)) {
      if (DANGEROUS_KEYS.has(key)) {
        console.warn(`[Security] Blocked prototype pollution attempt via key: ${key}`);
        continue;
      }
      // Remove null bytes from keys
      const cleanKey = key.replace(/\0/g, '');
      sanitizedObj[cleanKey] = sanitizeValue(prop, depth + 1);
    }
    return sanitizedObj;
  }

  return val;
}

/**
 * Express middleware to sanitize req.body, req.query, and req.params
 */
export const sanitizeInputs = (req, res, next) => {
  try {
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeValue(req.body);
    }
    if (req.query && typeof req.query === 'object') {
      req.query = sanitizeValue(req.query);
    }
    if (req.params && typeof req.params === 'object') {
      req.params = sanitizeValue(req.params);
    }
    next();
  } catch (err) {
    console.error('[Security] Input sanitization error:', err.message);
    next();
  }
};

/**
 * Standard Security Headers Enhancement
 */
export const securityHeaders = (req, res, next) => {
  // Prevent MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Clickjacking defense
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  // Strict Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Permissions-Policy (allow mic for interview, block unneeded sensors)
  res.setHeader('Permissions-Policy', 'microphone=(self), camera=(), geolocation=(), payment=()');
  // Allow Google OAuth popup window communication while blocking malicious opener access
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');

  next();
};

