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

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase/config';
import ChatInterface from '@/components/ChatInterface';
import Header from '@/components/Header';
import { useChatStore } from '@/lib/store/chatStore';
import { useTranslation } from 'react-i18next';
import { SupportedLanguage } from '@/lib/utils/language';

export const dynamic = 'force-dynamic';

export default function Home() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const { currentUser, setCurrentUser, language, setLanguage } = useChatStore();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    } else if (user) {
      // Fetch user data from Firestore and set in store
      const fetchUserData = async () => {
        try {
          const { getUser, createOrUpdateUser } = await import('@/lib/services/firestore');
          const userData = await getUser(user.uid);
          
          if (userData) {
            // Ensure role is set correctly based on email
            const userEmail = userData.email || '';
            const correctRole = userEmail === 'hradmin@company.com' ? 'admin' : 
                              userEmail === 'manager@company.com' ? 'manager' : 
                              userEmail === 'employee@company.com' ? 'employee' : 
                              userData.role || 'employee';
            
            // Update role if it doesn't match email
            if (userData.role !== correctRole) {
              const updatedUser = { ...userData, role: correctRole };
              await createOrUpdateUser(updatedUser);
              setCurrentUser(updatedUser);
            } else {
              setCurrentUser(userData);
            }
            
            // Sync language from user data
            if (userData.language && userData.language !== language) {
              const userLang = userData.language as SupportedLanguage;
              setLanguage(userLang);
              i18n.changeLanguage(userLang);
            }
          } else {
            // Create default user if not found in Firestore
            // Assign role based on email
            const userEmail = user.email || '';
            const userRole = userEmail === 'hradmin@company.com' ? 'admin' : 
                            userEmail === 'manager@company.com' ? 'manager' : 
                            userEmail === 'employee@company.com' ? 'employee' : 'employee';
            
            const defaultUser = {
              id: user.uid,
              email: userEmail,
              name: user.displayName || 'User',
              employeeId: user.uid.substring(0, 8).toUpperCase(),
              department: 'General',
              position: 'Employee',
              role: userRole as 'employee' | 'manager' | 'hr' | 'admin',
              language: 'en' as const,
              joinDate: new Date(),
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            setCurrentUser(defaultUser);
            
            // Save to Firestore
            await createOrUpdateUser(defaultUser);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Fallback to basic user data
          setCurrentUser({
            id: user.uid,
            email: user.email || '',
            name: user.displayName || 'User',
            employeeId: user.uid.substring(0, 8).toUpperCase(),
            department: 'General',
            position: 'Employee',
            role: 'employee',
            language: 'en',
            joinDate: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      };
      
      fetchUserData();
    }
  }, [user, loading, router, setCurrentUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Chat Interface */}
          <div className="w-full">
            <ChatInterface />
          </div>
        </div>
      </main>
    </div>
  );
}
