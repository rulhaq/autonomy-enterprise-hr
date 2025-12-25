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

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useChatStore } from '@/lib/store/chatStore';
import { 
  FileText, 
  Users, 
  Settings, 
  Upload, 
  BarChart3,
  MessageSquare,
  BookOpen,
  Shield
} from 'lucide-react';
import DocumentManager from '@/components/admin/DocumentManager';
import PolicyManager from '@/components/admin/PolicyManager';
import UserManager from '@/components/admin/UserManager';
import AdminChat from '@/components/admin/AdminChat';
import Analytics from '@/components/admin/Analytics';
import ChatViewer from '@/components/admin/ChatViewer';
import AISettings from '@/components/admin/AISettings';
import ExternalStorage from '@/components/admin/ExternalStorage';

type AdminTab = 'documents' | 'policies' | 'users' | 'chats' | 'chat' | 'analytics' | 'settings' | 'storage';

export default function AdminDashboard() {
  const { currentUser } = useChatStore();
  const [activeTab, setActiveTab] = useState<AdminTab>('documents');

  if (currentUser?.role !== 'admin' && currentUser?.role !== 'hr') {
    return null;
  }

  const tabs = [
    { id: 'documents' as AdminTab, label: 'Documents', icon: FileText },
    { id: 'policies' as AdminTab, label: 'Policies', icon: BookOpen },
    { id: 'users' as AdminTab, label: 'Users', icon: Users },
    { id: 'chats' as AdminTab, label: 'View Chats', icon: MessageSquare },
    { id: 'chat' as AdminTab, label: 'RAG Chat', icon: MessageSquare },
    { id: 'storage' as AdminTab, label: 'Storage', icon: Upload },
    { id: 'analytics' as AdminTab, label: 'Analytics', icon: BarChart3 },
    { id: 'settings' as AdminTab, label: 'AI Settings', icon: Settings },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-3">
          <a
            href="/admin/populate-manager"
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm font-medium"
          >
            Populate Manager Data
          </a>
          <a
            href="/admin/populate"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium"
          >
            Populate Sample Data
          </a>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'documents' && <DocumentManager />}
        {activeTab === 'policies' && <PolicyManager />}
        {activeTab === 'users' && <UserManager />}
        {activeTab === 'chats' && <ChatViewer />}
        {activeTab === 'chat' && <AdminChat />}
        {activeTab === 'storage' && <ExternalStorage />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'settings' && <AISettings />}
      </div>
    </div>
  );
}
