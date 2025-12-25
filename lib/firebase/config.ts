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
  apiKey: "AIzaSyCkfVo9ue1PGnJeeRG-CNYOcHH1l8_rNZA",
  authDomain: "scalovate-hr-ai.firebaseapp.com",
  projectId: "scalovate-hr-ai",
  storageBucket: "scalovate-hr-ai.firebasestorage.app",
  messagingSenderId: "645411630048",
  appId: "1:645411630048:web:ee67f50123149d6fd85985",
  measurementId: "G-VZ63PH3ZDK"
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

