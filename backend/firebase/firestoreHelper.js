import { db, isMockFirebase, memoryStore } from './firebaseAdmin.js';

// High-speed in-memory cache for Firestore reads to drastically cut latency & egress
const memoryCache = new Map();

const CACHE_RULES = {
  companies: 5 * 60 * 1000,           // 5 min (company guides / catalog rarely change)
  aptitude_questions: 3 * 60 * 1000,   // 3 min (question pools)
  technical_questions: 3 * 60 * 1000,  // 3 min
  ai_recommendations: 10 * 60 * 1000,  // 10 min
  profiles: 30 * 1000,                 // 30 seconds
  users: 30 * 1000,                    // 30 seconds
  placement_readiness: 10 * 1000,      // 10 seconds
  default: 15 * 1000                   // 15 seconds
};

function getTtl(collectionName) {
  return CACHE_RULES[collectionName] || CACHE_RULES.default;
}

function getCache(key) {
  const item = memoryCache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return item.data;
}

function setCache(key, data, ttl) {
  if (memoryCache.size > 2000) {
    const now = Date.now();
    for (const [k, v] of memoryCache.entries()) {
      if (now > v.expiresAt) memoryCache.delete(k);
    }
  }
  memoryCache.set(key, { data, expiresAt: Date.now() + ttl });
}

function invalidateCollectionCache(collectionName) {
  const prefix = `${collectionName}:`;
  const queryPrefix = `${collectionName}_query:`;
  for (const key of memoryCache.keys()) {
    if (key.startsWith(prefix) || key.startsWith(queryPrefix)) {
      memoryCache.delete(key);
    }
  }
}

export const FirestoreHelper = {
  /**
   * Clears the in-memory cache for a specific collection or all collections
   */
  clearCache(collectionName = null) {
    if (collectionName) {
      invalidateCollectionCache(collectionName);
    } else {
      memoryCache.clear();
    }
  },

  /**
   * Get document by Collection name and Document ID with high-speed in-memory caching
   */
  async getDoc(collectionName, docId, skipCache = false) {
    if (!docId) return null;
    const cacheKey = `${collectionName}:${docId}`;

    if (!skipCache) {
      const cached = getCache(cacheKey);
      if (cached !== null) return cached;
    }

    if (isMockFirebase || !db) {
      const collection = memoryStore.get(collectionName) || new Map();
      const doc = collection.get(docId) || null;
      if (doc) setCache(cacheKey, doc, getTtl(collectionName));
      return doc;
    }

    try {
      const docRef = db.collection(collectionName).doc(docId);
      const snapshot = await docRef.get();
      if (!snapshot.exists) {
        setCache(cacheKey, null, 5000); // cache negative hits for 5s
        return null;
      }
      const data = { id: snapshot.id, ...snapshot.data() };
      setCache(cacheKey, data, getTtl(collectionName));
      return data;
    } catch (err) {
      console.error(`Firestore getDoc error (${collectionName}/${docId}):`, err.message);
      return null;
    }
  },

  /**
   * Set/Update document by Collection name and Document ID
   * Automatically invalidates relevant cached queries and document reads.
   */
  async setDoc(collectionName, docId, data, merge = true) {
    const payload = {
      ...data,
      updatedAt: new Date().toISOString()
    };

    // Invalidate stale cache
    invalidateCollectionCache(collectionName);

    if (isMockFirebase || !db) {
      if (!memoryStore.has(collectionName)) {
        memoryStore.set(collectionName, new Map());
      }
      const collection = memoryStore.get(collectionName);
      const existing = collection.get(docId) || {};
      const updated = merge ? { ...existing, ...payload } : payload;
      collection.set(docId, updated);
      return updated;
    }

    try {
      const docRef = db.collection(collectionName).doc(docId);
      await docRef.set(payload, { merge });
      return { id: docId, ...payload };
    } catch (err) {
      console.error(`Firestore setDoc error (${collectionName}/${docId}):`, err.message);
      throw err;
    }
  },

  /**
   * Query collection with field equality or list all, with caching
   */
  async queryCollection(collectionName, field = null, value = null, skipCache = false) {
    const cacheKey = `${collectionName}_query:${field || 'all'}:${value !== null ? value : '*'}`;

    if (!skipCache) {
      const cached = getCache(cacheKey);
      if (cached !== null) return cached;
    }

    if (isMockFirebase || !db) {
      const collection = memoryStore.get(collectionName) || new Map();
      const list = Array.from(collection.values());
      const results = !field ? list : list.filter(item => item[field] === value);
      setCache(cacheKey, results, getTtl(collectionName));
      return results;
    }

    try {
      let ref = db.collection(collectionName);
      if (field && value !== null) {
        ref = ref.where(field, '==', value);
      }
      const snapshot = await ref.get();
      const results = [];
      snapshot.forEach(doc => {
        results.push({ id: doc.id, ...doc.data() });
      });
      setCache(cacheKey, results, getTtl(collectionName));
      return results;
    } catch (err) {
      console.error(`Firestore queryCollection error (${collectionName}):`, err.message);
      return [];
    }
  },

  /**
   * Delete document by Collection name and Document ID
   */
  async deleteDoc(collectionName, docId) {
    invalidateCollectionCache(collectionName);

    if (isMockFirebase || !db) {
      const collection = memoryStore.get(collectionName);
      if (collection) {
        collection.delete(docId);
      }
      return true;
    }

    try {
      await db.collection(collectionName).doc(docId).delete();
      return true;
    } catch (err) {
      console.error(`Firestore deleteDoc error (${collectionName}/${docId}):`, err.message);
      return false;
    }
  }
};
