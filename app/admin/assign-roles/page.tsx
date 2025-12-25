'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useChatStore } from '@/lib/store/chatStore';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import toast from 'react-hot-toast';
import Header from '@/components/Header';

const roleAssignments = {
  'hradmin@company.com': 'admin',
  'manager@company.com': 'manager',
  'employee@company.com': 'employee',
};

export default function AssignRolesPage() {
  const { currentUser } = useChatStore();
  const [assigning, setAssigning] = useState(false);
  const [results, setResults] = useState<Record<string, string>>({});

  const handleAssignRoles = async () => {
    if (currentUser?.role !== 'admin' && currentUser?.role !== 'hr') {
      toast.error('Only admins can assign roles');
      return;
    }

    setAssigning(true);
    setResults({});

    try {
      const newResults: Record<string, string> = {};

      for (const [email, role] of Object.entries(roleAssignments)) {
        try {
          // Find user by email
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('email', '==', email));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            newResults[email] = 'not_found';
            continue;
          }

          // Update each user found (should be only one)
          for (const userDoc of querySnapshot.docs) {
            await updateDoc(doc(db, 'users', userDoc.id), {
              role: role,
              updatedAt: new Date(),
            });
            newResults[email] = 'success';
          }
        } catch (error: any) {
          console.error(`Error assigning role to ${email}:`, error);
          newResults[email] = `error: ${error.message}`;
        }
      }

      setResults(newResults);
      toast.success('Roles assigned successfully!');
    } catch (error: any) {
      console.error('Error assigning roles:', error);
      toast.error(`Failed to assign roles: ${error.message}`);
    } finally {
      setAssigning(false);
    }
  };

  if (currentUser?.role !== 'admin' && currentUser?.role !== 'hr') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="p-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-900">You don&apos;t have permission to access this page.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Assign Roles</h1>
          <p className="text-gray-600 mb-6">
            Assign roles to specific email addresses. This will update existing users in the database.
          </p>

          <div className="space-y-4 mb-6">
            {Object.entries(roleAssignments).map(([email, role]) => (
              <div
                key={email}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div>
                  <p className="font-medium text-gray-900">{email}</p>
                  <p className="text-sm text-gray-600">Role: {role}</p>
                </div>
                {results[email] && (
                  <div className="text-sm">
                    {results[email] === 'success' && (
                      <span className="text-green-600 font-medium">✓ Assigned</span>
                    )}
                    {results[email] === 'not_found' && (
                      <span className="text-yellow-600 font-medium">⚠ Not Found</span>
                    )}
                    {results[email]?.startsWith('error') && (
                      <span className="text-red-600 font-medium">✗ Error</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleAssignRoles}
            disabled={assigning}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {assigning ? 'Assigning Roles...' : 'Assign Roles'}
          </button>
        </div>
      </main>
    </div>
  );
}

