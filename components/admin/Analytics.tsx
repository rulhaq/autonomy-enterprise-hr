'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Users, MessageSquare, FileText, TrendingUp, Clock } from 'lucide-react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export default function Analytics() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDocuments: 0,
    totalConversations: 0,
    avgResponseTime: 0,
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      // Load users count
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const totalUsers = usersSnapshot.size;

      // Load documents count
      const docsSnapshot = await getDocs(collection(db, 'hrDocuments'));
      const totalDocuments = docsSnapshot.size;

      // Load conversations count
      const conversationsSnapshot = await getDocs(collection(db, 'conversations'));
      const totalConversations = conversationsSnapshot.size;

      setStats({
        totalUsers,
        totalDocuments,
        totalConversations,
        avgResponseTime: 2.3, // Mock data
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Users className="w-8 h-8" />}
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          color="from-blue-500 to-cyan-500"
        />
        <StatCard
          icon={<FileText className="w-8 h-8" />}
          title="Documents"
          value={stats.totalDocuments.toLocaleString()}
          color="from-purple-500 to-pink-500"
        />
        <StatCard
          icon={<MessageSquare className="w-8 h-8" />}
          title="Conversations"
          value={stats.totalConversations.toLocaleString()}
          color="from-green-500 to-emerald-500"
        />
        <StatCard
          icon={<Clock className="w-8 h-8" />}
          title="Avg Response Time"
          value={`${stats.avgResponseTime}s`}
          color="from-orange-500 to-red-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Query Volume</h2>
          <div className="h-64 flex items-center justify-center text-gray-600">
            <BarChart3 className="w-16 h-16" />
            <p className="ml-4">Chart visualization would go here</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Queries</h2>
          <div className="space-y-3">
            {['Leave balance', 'Payslip download', 'Policy questions', 'Appraisal status'].map((query, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-gray-900">{query}</span>
                <span className="text-gray-600 text-sm">{Math.floor(Math.random() * 1000)} queries</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }: { icon: React.ReactNode; title: string; value: string; color: string }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

