'use client';

import { useChatStore } from '@/lib/store/chatStore';
import { useTranslation } from 'react-i18next';
import { 
  Calendar, 
  FileText, 
  Users, 
  TrendingUp, 
  BookOpen, 
  DollarSign,
  CheckCircle,
  Phone,
  UserCheck,
  BarChart3,
  Settings,
  Upload,
  Shield,
  Clock,
  MapPin,
  Briefcase
} from 'lucide-react';

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  message: string;
  color: string;
}

export default function QuickActions() {
  const { currentUser } = useChatStore();
  const { t } = useTranslation();

  // Expose sendMessage function to parent via custom event
  const handleAction = (message: string) => {
    // Dispatch custom event that ChatInterface will listen to
    window.dispatchEvent(new CustomEvent('quickAction', { detail: { message } }));
  };

  // Employee Actions
  const employeeActions: QuickAction[] = [
    {
      id: 'leave-apply',
      icon: <Calendar className="w-6 h-6" />,
      title: t('leave.apply'),
      description: 'Submit a new leave request',
      message: 'I want to apply for leave. Can you help me with the process?',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'leave-balance',
      icon: <FileText className="w-6 h-6" />,
      title: t('leave.balance'),
      description: 'Check your leave balance',
      message: 'What is my current leave balance? Show me how many days I have available for each leave type.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'payslip',
      icon: <DollarSign className="w-6 h-6" />,
      title: t('payslip.download'),
      description: 'Download your payslip',
      message: 'I need to download my payslip. How can I get it?',
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 'hierarchy',
      icon: <Users className="w-6 h-6" />,
      title: t('hierarchy.view'),
      description: 'View reporting structure',
      message: 'Show me my reporting hierarchy. Who is my manager and who are my team members?',
      color: 'from-orange-500 to-red-500',
    },
    {
      id: 'appraisal',
      icon: <TrendingUp className="w-6 h-6" />,
      title: t('appraisal.status'),
      description: 'Check appraisal status',
      message: 'What is my current appraisal status? When is my next performance review?',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      id: 'policies',
      icon: <BookOpen className="w-6 h-6" />,
      title: t('policies.browse'),
      description: 'Browse HR policies',
      message: 'Show me the HR policies. I want to know about leave policies, work from home, and other company policies.',
      color: 'from-teal-500 to-cyan-500',
    },
    {
      id: 'contact',
      icon: <Phone className="w-6 h-6" />,
      title: t('contact.hr'),
      description: 'Contact HR team',
      message: 'How can I contact the HR team? What are the contact details and office hours?',
      color: 'from-gray-500 to-slate-500',
    },
  ];

  // Manager Actions
  const managerActions: QuickAction[] = [
    {
      id: 'team-overview',
      icon: <Users className="w-6 h-6" />,
      title: 'My Team',
      description: 'View all team members',
      message: 'Show me my team members. Who are my direct reports and what are their current statuses?',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'team-leave',
      icon: <Calendar className="w-6 h-6" />,
      title: 'Team Leave Status',
      description: 'Check team leave availability',
      message: 'Show me who is on leave in my team. What are the current and upcoming leave requests?',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'pending-approvals',
      icon: <Clock className="w-6 h-6" />,
      title: 'Pending Approvals',
      description: 'Review pending leave requests',
      message: 'Show me all pending leave requests from my team that need my approval.',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      id: 'team-projects',
      icon: <Briefcase className="w-6 h-6" />,
      title: 'Team Projects',
      description: 'View team project assignments',
      message: 'What projects are my team members working on? Show me the project assignments for each team member.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 'team-sites',
      icon: <MapPin className="w-6 h-6" />,
      title: 'Team Locations',
      description: 'Check team site locations',
      message: 'Where are my team members located? Show me the site locations for each team member.',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      id: 'team-performance',
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Team Performance',
      description: 'View team performance metrics',
      message: 'Show me performance metrics for my team. What are the appraisal statuses and performance reviews?',
      color: 'from-teal-500 to-cyan-500',
    },
    {
      id: 'approve-request',
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Approve Requests',
      description: 'Approve team leave requests',
      message: 'I want to approve a leave request. How can I approve or reject leave requests from my team?',
      color: 'from-green-600 to-emerald-600',
    },
    {
      id: 'team-balance',
      icon: <FileText className="w-6 h-6" />,
      title: 'Team Leave Balances',
      description: 'Check team leave balances',
      message: 'Show me the leave balances for all my team members. Who has how many days available?',
      color: 'from-orange-500 to-red-500',
    },
  ];

  // HR Admin Actions
  const adminActions: QuickAction[] = [
    {
      id: 'manage-users',
      icon: <UserCheck className="w-6 h-6" />,
      title: 'Manage Users',
      description: 'View and update user information',
      message: 'Show me all users in the system. I need to manage user information, roles, and departments.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'manage-documents',
      icon: <Upload className="w-6 h-6" />,
      title: 'Manage Documents',
      description: 'Upload and manage HR documents',
      message: 'I need to upload HR documents and policies. How can I manage documents in the system?',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'view-analytics',
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'View Analytics',
      description: 'Check HR analytics and reports',
      message: 'Show me HR analytics. What are the statistics for leave usage, employee data, and other metrics?',
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 'manage-policies',
      icon: <Shield className="w-6 h-6" />,
      title: 'Manage Policies',
      description: 'Create and update HR policies',
      message: 'I need to manage HR policies. How can I create, update, or view company policies?',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      id: 'all-leave-requests',
      icon: <Calendar className="w-6 h-6" />,
      title: 'All Leave Requests',
      description: 'View all leave requests company-wide',
      message: 'Show me all leave requests across the company. What are the pending, approved, and rejected requests?',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      id: 'user-roles',
      icon: <Settings className="w-6 h-6" />,
      title: 'Manage Roles',
      description: 'Assign and update user roles',
      message: 'I need to manage user roles. How can I assign roles to users or update their permissions?',
      color: 'from-teal-500 to-cyan-500',
    },
    {
      id: 'external-storage',
      icon: <Upload className="w-6 h-6" />,
      title: 'External Storage',
      description: 'Connect to Google Drive, SharePoint',
      message: 'How can I connect external storage like Google Drive or SharePoint to sync documents?',
      color: 'from-gray-500 to-slate-500',
    },
    {
      id: 'ai-settings',
      icon: <Settings className="w-6 h-6" />,
      title: 'AI Settings',
      description: 'Configure AI assistant settings',
      message: 'I need to configure AI settings. How can I manage the AI model, prompts, and RAG settings?',
      color: 'from-red-500 to-pink-500',
    },
  ];

  // Get actions based on user role
  const getActions = (): QuickAction[] => {
    if (!currentUser) return employeeActions;
    
    switch (currentUser.role) {
      case 'manager':
        return managerActions;
      case 'admin':
      case 'hr':
        return adminActions;
      default:
        return employeeActions;
    }
  };

  const actions = getActions();

  // Get role-specific title
  const getTitle = () => {
    if (!currentUser) return 'Quick Actions';
    switch (currentUser.role) {
      case 'manager':
        return 'Manager Quick Actions';
      case 'admin':
      case 'hr':
        return 'Admin Quick Actions';
      default:
        return 'Quick Actions';
    }
  };

  // Get role-specific description
  const getDescription = () => {
    if (!currentUser) return 'Click any action to ask the AI assistant';
    switch (currentUser.role) {
      case 'manager':
        return 'Manage your team and approve requests';
      case 'admin':
      case 'hr':
        return 'Manage users, documents, and HR operations';
      default:
        return 'Click any action to ask the AI assistant';
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold text-gray-900 mb-3">{getTitle()}</h2>
      <p className="text-gray-600 text-sm mb-4">{getDescription()}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleAction(action.message)}
            className="bg-white border border-gray-200 rounded-lg p-4 text-left transition-all hover:bg-gray-50 hover:shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${action.color} text-white flex-shrink-0`}>
                {action.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{action.title}</h3>
                <p className="text-xs text-gray-600">{action.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
