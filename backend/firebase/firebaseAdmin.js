import admin from 'firebase-admin';
import { config } from '../config/env.js';

let db = null;
let auth = null;
let storage = null;
let isMockFirebase = false;

// In-Memory store for local testing fallback when Firebase credentials are not supplied
const memoryStore = new Map();

try {
  if (config.firebase.clientEmail && config.firebase.privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.firebase.projectId,
        clientEmail: config.firebase.clientEmail,
        privateKey: config.firebase.privateKey
      }),
      storageBucket: config.firebase.storageBucket
    });

    db = admin.firestore();
    auth = admin.auth();
    storage = admin.storage();
    console.log('✅ Firebase Admin SDK Initialized Successfully');
  } else {
    console.log('⚠️ Firebase credentials not found in env. Operating with In-Memory Firestore & Auth helper mode.');
    isMockFirebase = true;
  }
} catch (error) {
  console.warn('⚠️ Firebase Admin Initialization failed:', error.message);
  isMockFirebase = true;
}

export { admin, db, auth, storage, isMockFirebase, memoryStore };
