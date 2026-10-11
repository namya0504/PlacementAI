import crypto from 'crypto';

/**
 * Normalizes question text by trimming, lowercasing, and stripping non-alphanumeric characters.
 * @param {string} text 
 * @returns {string}
 */
export function normalizeQuestionText(text) {
  if (typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Generates an SHA-256 fingerprint for a question based on its normalized text.
 * @param {string} text 
 * @returns {string}
 */
export function generateQuestionFingerprint(text) {
  const normalized = normalizeQuestionText(text);
  return crypto.createHash('sha256').update(normalized).digest('hex').slice(0, 32);
}
