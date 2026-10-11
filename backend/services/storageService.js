import { supabase } from '../config/supabase.js';
import path from 'path';

/**
 * Bucket-level configuration for file validation.
 */
const BUCKET_CONFIG = {
  'profile-images': {
    maxSize: 5 * 1024 * 1024, // 5 MB
    allowedMimes: ['image/jpeg', 'image/png', 'image/webp'],
    friendlyName: 'Profile Image'
  },
  'resumes': {
    maxSize: 5 * 1024 * 1024, // 5 MB
    allowedMimes: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ],
    friendlyName: 'Resume'
  },
  'certificates': {
    maxSize: 5 * 1024 * 1024, // 5 MB
    allowedMimes: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
    friendlyName: 'Certificate'
  },
  'reports': {
    maxSize: 10 * 1024 * 1024, // 10 MB
    allowedMimes: ['application/pdf'],
    friendlyName: 'Report'
  }
};

/**
 * MIME type to file extension mapping.
 */
const MIME_TO_EXT = {
  'image/jpeg': 'jpeg',
  'image/png': 'png',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/msword': 'doc'
};

/**
 * Validates file buffer magic bytes against expected MIME type.
 * @param {Buffer} buffer - File buffer
 * @param {string} mimeType - Claimed MIME type
 * @returns {boolean}
 */
export function validateFileSignature(buffer, mimeType) {
  if (!buffer || buffer.length < 4) return false;

  // PDF: %PDF (0x25 0x50 0x44 0x46)
  if (mimeType === 'application/pdf') {
    return buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46;
  }

  // DOCX / Office Open XML: PK\x03\x04 (0x50 0x4B 0x03 0x04)
  if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return buffer[0] === 0x50 && buffer[1] === 0x4B && buffer[2] === 0x03 && buffer[3] === 0x04;
  }

  // DOC (legacy Compound Binary): 0xD0 0xCF 0x11 0xE0
  if (mimeType === 'application/msword') {
    return buffer[0] === 0xD0 && buffer[1] === 0xCF && buffer[2] === 0x11 && buffer[3] === 0xE0;
  }

  // JPEG: 0xFF 0xD8 0xFF
  if (mimeType === 'image/jpeg') {
    return buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
  }

  // PNG: 0x89 0x50 0x4E 0x47
  if (mimeType === 'image/png') {
    return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
  }

  // WEBP: RIFF....WEBP
  if (mimeType === 'image/webp') {
    return buffer.length >= 12 &&
      buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
      buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50;
  }

  return false;
}

/**
 * Validates a file against bucket-specific rules.
 * Returns { valid: true } or { valid: false, error: '...' }.
 */
export function validateFile(bucket, mimeType, size) {
  const config = BUCKET_CONFIG[bucket];
  if (!config) {
    return { valid: false, error: 'Unknown storage bucket.' };
  }

  if (!config.allowedMimes.includes(mimeType)) {
    return {
      valid: false,
      error: `File type is not supported. ${config.friendlyName} accepts: ${config.allowedMimes.map(m => m.split('/')[1].toUpperCase()).join(', ')}.`
    };
  }

  if (size > config.maxSize) {
    const maxMB = Math.round(config.maxSize / (1024 * 1024));
    return {
      valid: false,
      error: `File is too large. ${config.friendlyName} must be under ${maxMB} MB.`
    };
  }

  return { valid: true };
}

/**
 * Generates a safe, unique storage path.
 * Never trusts the original filename — generates its own.
 * @param {string} bucket - Bucket name
 * @param {string} uid - Verified Firebase UID from the token
 * @param {string} mimeType - File MIME type
 * @param {string} [subId] - Optional sub-identifier (resumeId, certificateId, etc.)
 * @returns {string} Safe storage path
 */
export function generateStoragePath(bucket, uid, mimeType, subId = null) {
  // Block path traversal
  if (!uid || uid.includes('..') || uid.includes('/') || uid.includes('\\')) {
    throw new Error('Invalid user identifier.');
  }
  if (subId && (subId.includes('..') || subId.includes('/') || subId.includes('\\'))) {
    throw new Error('Invalid resource identifier.');
  }

  const ext = MIME_TO_EXT[mimeType] || 'bin';
  const timestamp = Date.now();
  const safeName = `${bucket.replace('s$', '')}-${timestamp}.${ext}`;

  if (subId) {
    return `${uid}/${subId}/${safeName}`;
  }
  return `${uid}/${safeName}`;
}

/**
 * Uploads a file buffer to Supabase Storage.
 * @param {string} bucket - Bucket name
 * @param {string} storagePath - Path within the bucket
 * @param {Buffer} buffer - File content
 * @param {string} mimeType - Content type
 * @returns {Promise<{ storagePath: string }>}
 */
export async function uploadFile(bucket, storagePath, buffer, mimeType) {
  if (!supabase) {
    throw new Error('Storage service is not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  }

  const { error } = await supabase.storage
    .from(bucket)
    .upload(storagePath, buffer, {
      contentType: mimeType,
      upsert: false
    });

  if (error) {
    console.error(`[StorageService] Upload error (${bucket}/${storagePath}):`, error.message);
    throw new Error('Upload failed. Please try again.');
  }

  return { storagePath: `${bucket}/${storagePath}` };
}

/**
 * Gets a short-lived signed download URL for a private file.
 * @param {string} bucket - Bucket name
 * @param {string} filePath - Path within the bucket (without bucket prefix)
 * @param {number} [expiresIn=300] - Seconds until the URL expires (default 5 min)
 * @returns {Promise<string>} Signed URL
 */
export async function getSignedDownloadUrl(bucket, filePath, expiresIn = 300) {
  if (!supabase) {
    throw new Error('Storage service is not configured.');
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(filePath, expiresIn);

  if (error) {
    console.error(`[StorageService] Signed URL error (${bucket}/${filePath}):`, error.message);
    throw new Error('Could not generate download link. Please try again.');
  }

  return data.signedUrl;
}

/**
 * Deletes a file from Supabase Storage.
 * @param {string} bucket - Bucket name
 * @param {string} filePath - Path within the bucket (without bucket prefix)
 * @returns {Promise<boolean>}
 */
export async function deleteFile(bucket, filePath) {
  if (!supabase) {
    throw new Error('Storage service is not configured.');
  }

  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);

  if (error) {
    console.error(`[StorageService] Delete error (${bucket}/${filePath}):`, error.message);
    throw new Error('Could not delete file. Please try again.');
  }

  return true;
}

/**
 * Resolves the correct download URL for a Firestore record.
 * Handles backward compatibility:
 * - Old records without `storageProvider` → return existing URL field as-is
 * - New records with `storageProvider: "supabase"` → generate signed URL
 *
 * @param {object} record - Firestore document
 * @param {string} urlField - Name of the legacy URL field (e.g. 'photoURL', 'pdfUrl')
 * @returns {Promise<string|null>} Resolved URL or null
 */
export async function getFileUrl(record, urlField = 'pdfUrl') {
  if (!record) return null;

  // New Supabase-backed records
  if (record.storageProvider === 'supabase' && record.storagePath) {
    try {
      // storagePath is stored as "bucket/path/to/file" — split it
      const fullPath = record.storagePath;
      const slashIndex = fullPath.indexOf('/');
      if (slashIndex === -1) return record[urlField] || null;

      const bucket = fullPath.substring(0, slashIndex);
      const filePath = fullPath.substring(slashIndex + 1);

      return await getSignedDownloadUrl(bucket, filePath);
    } catch (err) {
      console.warn('[StorageService] Signed URL fallback to legacy URL:', err.message);
      // Fall back to whatever URL is stored
      return record[urlField] || null;
    }
  }

  // Legacy Firebase-backed records — return the stored URL as-is
  return record[urlField] || null;
}

/**
 * Parses a full storagePath ("bucket/uid/file.ext") into bucket and filePath.
 * @param {string} storagePath - Full storage path
 * @returns {{ bucket: string, filePath: string }}
 */
export function parseStoragePath(storagePath) {
  if (!storagePath || typeof storagePath !== 'string') {
    throw new Error('Invalid storage path.');
  }

  // Block path traversal
  if (storagePath.includes('..')) {
    throw new Error('Invalid storage path.');
  }

  const slashIndex = storagePath.indexOf('/');
  if (slashIndex === -1) {
    throw new Error('Invalid storage path format.');
  }

  const bucket = storagePath.substring(0, slashIndex);
  const filePath = storagePath.substring(slashIndex + 1);

  if (!BUCKET_CONFIG[bucket]) {
    throw new Error('Unknown storage bucket.');
  }

  return { bucket, filePath };
}

/**
 * Verifies that a storage path belongs to the given UID.
 * The path format is: {uid}/... or {uid}/{subId}/...
 * @param {string} filePath - Path within a bucket (without bucket prefix)
 * @param {string} uid - Verified UID from token
 * @returns {boolean}
 */
export function isOwnedByUser(filePath, uid) {
  if (!filePath || !uid) return false;
  return filePath.startsWith(`${uid}/`);
}
