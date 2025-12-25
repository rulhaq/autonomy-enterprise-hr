'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase/config';
import { useChatStore } from '@/lib/store/chatStore';
import Header from '@/components/Header';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const { currentUser } = useChatStore();

  useEffect(() => {
    if (!loading && (!user || (currentUser && currentUser.role !== 'admin' && currentUser.role !== 'hr'))) {
      router.push('/');
    }
  }, [user, loading, currentUser, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {children}
      </div>
    </div>
  );
}

