/**
 * Autonomy Enterprise HR Assistant
 * 
 * Copyright (c) 2025 Scalovate Systems Solutions
 * 
 * MIT License (Educational Use) - See LICENSE file for details
 * 
 * DISCLAIMER:
 * This software is provided for EDUCATIONAL PURPOSES ONLY and "as is" without warranty
 * of any kind. Users must configure their own Firebase project and Groq API keys.
 * 
 * IMPORTANT RESTRICTIONS:
 * - Educational use only
 * - Reselling is NOT allowed
 * - For customization/modification, contact support@scalovate.com
 * - Replace demo credentials with your own before any use
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || process.env.FIREBASE_MEASUREMENT_ID || ''
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

// Initialize Firebase app
app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize services (auth can be initialized on server, it just won't have currentUser during build)
auth = getAuth(app);
db = getFirestore(app);
storage = getStorage(app);

export { app, auth, db, storage };

