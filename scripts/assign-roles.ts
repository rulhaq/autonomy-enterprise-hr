/**
 * Script to assign roles to specific email addresses
 * Run this script to set up default roles for test users
 */

import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase/config';

const roleAssignments = {
  'hradmin@company.com': 'admin',
  'manager@company.com': 'manager',
  'employee@company.com': 'employee',
};

export async function assignRoles() {
  try {
    console.log('Starting role assignment...');

    for (const [email, role] of Object.entries(roleAssignments)) {
      console.log(`Assigning role "${role}" to ${email}...`);

      // Find user by email
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log(`  ⚠️  User with email ${email} not found. Skipping...`);
        continue;
      }

      // Update each user found (should be only one)
      querySnapshot.forEach(async (userDoc) => {
        await updateDoc(doc(db, 'users', userDoc.id), {
          role: role,
          updatedAt: new Date(),
        });
        console.log(`  ✅ Assigned role "${role}" to ${email} (ID: ${userDoc.id})`);
      });
    }

    console.log('Role assignment completed!');
  } catch (error) {
    console.error('Error assigning roles:', error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  assignRoles()
    .then(() => {
      console.log('Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed:', error);
      process.exit(1);
    });
}

