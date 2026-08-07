import { db, isMockFirebase, memoryStore } from './firebaseAdmin.js';

export const FirestoreHelper = {
  /**
   * Get document by Collection name and Document ID
   */
  async getDoc(collectionName, docId) {
    if (!docId) return null;
    if (isMockFirebase || !db) {
      const collection = memoryStore.get(collectionName) || new Map();
      return collection.get(docId) || null;
    }

    try {
      const docRef = db.collection(collectionName).doc(docId);
      const snapshot = await docRef.get();
      if (!snapshot.exists) return null;
      return { id: snapshot.id, ...snapshot.data() };
    } catch (err) {
      console.error(`Firestore getDoc error (${collectionName}/${docId}):`, err.message);
      return null;
    }
  },

  /**
   * Set/Update document by Collection name and Document ID
   */
  async setDoc(collectionName, docId, data, merge = true) {
    const payload = {
      ...data,
      updatedAt: new Date().toISOString()
    };

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
   * Query collection with field equality or list all
   */
  async queryCollection(collectionName, field = null, value = null) {
    if (isMockFirebase || !db) {
      const collection = memoryStore.get(collectionName) || new Map();
      const list = Array.from(collection.values());
      if (!field) return list;
      return list.filter(item => item[field] === value);
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
