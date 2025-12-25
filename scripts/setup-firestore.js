/**
 * Firestore Setup Script
 * Run this script to initialize Firestore collections with sample data
 * 
 * Usage: node scripts/setup-firestore.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json'); // You'll need to download this from Firebase

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function setupFirestore() {
  console.log('Setting up Firestore collections...');

  try {
    // Create sample HR documents
    const hrDocuments = [
      {
        title: 'Employee Handbook 2025',
        content: 'Welcome to our company! This handbook contains all the policies and procedures you need to know...',
        category: 'handbook',
        version: '3.2',
        tags: ['handbook', 'policies', 'onboarding'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Leave Policy',
        content: 'Annual Leave: 20 days per year. Sick Leave: 10 days per year. Emergency Leave: 5 days per year...',
        category: 'policy',
        version: '2.1',
        tags: ['leave', 'policy', 'hr'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Work from Home Policy',
        content: 'Employees can work from home up to 2 days per week with manager approval...',
        category: 'policy',
        version: '1.5',
        tags: ['wfh', 'remote', 'policy'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const doc of hrDocuments) {
      await db.collection('hrDocuments').add(doc);
      console.log(`Created HR document: ${doc.title}`);
    }

    console.log('Firestore setup completed successfully!');
  } catch (error) {
    console.error('Error setting up Firestore:', error);
  }
}

setupFirestore();

