import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
import { config } from '../config/env.js';

let db = null;
let auth = null;
let storage = null;
let isMockFirebase = false;

const memoryStore = new Map();

try {
  if (config.firebase.clientEmail && config.firebase.privateKey) {
    const app = initializeApp({
      credential: cert({
        projectId: config.firebase.projectId,
        clientEmail: config.firebase.clientEmail,
        privateKey: config.firebase.privateKey
      }),
      storageBucket: config.firebase.storageBucket
    });

    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
    console.log('✅ Live Firebase Admin SDK Initialized Successfully (Project: ' + config.firebase.projectId + ')');
  } else {
    console.log('⚠️ Firebase credentials not found in env. Operating with In-Memory Firestore & Auth helper mode.');
    isMockFirebase = true;
  }
} catch (error) {
  console.warn('⚠️ Firebase Admin Initialization failed:', error.message);
  isMockFirebase = true;
}

export { db, auth, storage, isMockFirebase, memoryStore };

