'use client';

import { useState } from 'react';
import { User as UserIcon, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useChatStore } from '@/lib/store/chatStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function UserProfile() {
  const { currentUser } = useChatStore();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully');
      router.push('/auth');
    } catch (error: any) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-100 rounded-lg p-2 text-gray-900 hover:bg-gray-200 transition-colors"
      >
        <UserIcon className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[100]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[200px] z-[101]">
            {currentUser && (
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-gray-900 font-semibold">{currentUser.name}</p>
                <p className="text-gray-600 text-sm">{currentUser.email}</p>
                <p className="text-gray-500 text-xs mt-1 capitalize">{currentUser.role}</p>
              </div>
            )}
            <a
              href="/profile"
              className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-gray-900 hover:bg-gray-50 transition-colors mb-2"
            >
              <UserIcon className="w-4 h-4" />
              <span>My Profile</span>
            </a>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

