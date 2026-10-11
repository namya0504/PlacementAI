import { API } from './api';

// In-memory cache for short-lived signed URLs to prevent refetch thrashing
const signedUrlCache = new Map();

/**
 * Gets a valid download or display URL for a resource.
 * Handles both legacy Firebase URLs (static/public) and Supabase Storage URLs (signed).
 *
 * @param {object} record - Document object containing storage metadata
 * @param {string} [urlField='photoURL'] - Field containing the legacy URL or snapshot
 * @returns {Promise<string|null>} Resolved display/download URL
 */
export async function getFileUrl(record, urlField = 'photoURL') {
  if (!record) return null;

  // Legacy records without Supabase storageProvider
  if (record.storageProvider !== 'supabase' || !record.storagePath) {
    return record[urlField] || null;
  }

  // Check cache for non-expired signed URL (cached for 4 minutes, signed for 5+)
  const cached = signedUrlCache.get(record.storagePath);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.url;
  }

  // Request fresh signed URL from backend
  try {
    const res = await API.getStorageDownloadUrl(record.storagePath);
    if (res?.url) {
      signedUrlCache.set(record.storagePath, {
        url: res.url,
        expiresAt: Date.now() + ((res.expiresIn || 300) - 30) * 1000 // Expire 30s before actual expiry
      });
      return res.url;
    }
  } catch (err) {
    console.warn('[StorageService] Failed to obtain signed URL, using snapshot URL fallback:', err.message);
  }

  return record[urlField] || null;
}

/**
 * Deletes a file stored in Supabase Storage via backend.
 *
 * @param {string} storagePath - Full storage path (e.g. 'resumes/uid/file.pdf')
 * @param {string} [collection] - Optional Firestore collection to update
 * @param {string} [docId] - Optional Firestore document ID to update
 * @returns {Promise<boolean>}
 */
export async function deleteStorageFile(storagePath, collection, docId) {
  if (!storagePath) return false;
  try {
    await API.deleteStorageFile({ storagePath, collection, docId });
    signedUrlCache.delete(storagePath);
    return true;
  } catch (err) {
    console.error('[StorageService] Delete file error:', err.message);
    throw err;
  }
}

/**
 * Checks if a record was uploaded to Supabase Storage.
 * @param {object} record
 * @returns {boolean}
 */
export function isSupabaseFile(record) {
  return record?.storageProvider === 'supabase';
}
