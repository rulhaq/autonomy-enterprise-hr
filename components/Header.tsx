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

import { useChatStore } from '@/lib/store/chatStore';
import LanguageSelector from './LanguageSelector';
import UserProfile from './UserProfile';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { currentUser } = useChatStore();
  const { t } = useTranslation();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-gray-900 hover:text-gray-700">
              <Home className="w-5 h-5" />
              <h1 className="text-2xl md:text-3xl font-bold">Autonomy HR</h1>
            </Link>
            {currentUser?.name && (
              <p className="text-gray-900 text-sm md:text-base hidden md:block">
                {t('header.welcome', { name: currentUser.name })}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {(currentUser?.role === 'admin' || currentUser?.role === 'hr') && (
              <Link
                href="/admin"
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Admin
              </Link>
            )}
            {currentUser?.role === 'manager' && (
              <Link
                href="/manager"
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Manager
              </Link>
            )}
            <Link
              href="/profile"
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Profile
            </Link>
            <LanguageSelector />
            <UserProfile />
          </div>
        </div>
      </div>
    </header>
  );
}

