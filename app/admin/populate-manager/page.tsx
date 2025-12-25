'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useChatStore } from '@/lib/store/chatStore';
import { doc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import toast from 'react-hot-toast';
import { Loader2, Users } from 'lucide-react';
import Header from '@/components/Header';

const projects = [
  'Project Alpha',
  'Project Beta',
  'Project Gamma',
  'Project Delta',
  'Project Echo',
  'Project Falcon',
  'Project Gemini',
  'Project Horizon',
];

const sites = [
  'Head Office - New York',
  'Regional Office - London',
  'Regional Office - Singapore',
  'Regional Office - Dubai',
  'Site Office - Mumbai',
  'Site Office - Bangalore',
  'Site Office - Chennai',
];

export default function PopulateManagerPage() {
  const { currentUser } = useChatStore();
  const [loading, setLoading] = useState(false);

  const populateData = async () => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'hr')) {
      toast.error('You must be an Admin or HR to populate data.');
      return;
    }

    setLoading(true);
    try {
      // Create Manager
      const managerId = 'manager456';
      const managerData = {
        id: managerId,
        email: 'manager@company.com',
        name: 'Bob Johnson',
        employeeId: 'MGR001',
        department: 'Engineering',
        position: 'Engineering Manager',
        role: 'manager',
        language: 'en',
        phone: '+1987654321',
        site: sites[0],
        projects: [projects[0], projects[1]],
        status: 'available',
        joinDate: Timestamp.fromDate(new Date('2018-03-01')),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(doc(db, 'users', managerId), managerData);
      console.log('✓ Created manager');

      // Create Team Members
      const teamMembers = [
        {
          id: 'emp001',
          email: 'alice.smith@company.com',
          name: 'Alice Smith',
          employeeId: 'EMP001',
          department: 'Engineering',
          position: 'Senior Software Engineer',
          managerId: managerId,
          role: 'employee',
          language: 'en',
          phone: '+1234567890',
          site: sites[0],
          projects: [projects[0], projects[2]],
          status: 'available',
          joinDate: new Date('2020-01-15'),
        },
        {
          id: 'emp002',
          email: 'charlie.brown@company.com',
          name: 'Charlie Brown',
          employeeId: 'EMP002',
          department: 'Engineering',
          position: 'Software Engineer',
          managerId: managerId,
          role: 'employee',
          language: 'en',
          phone: '+1234567891',
          site: sites[1],
          projects: [projects[1]],
          status: 'on_leave',
          joinDate: new Date('2021-06-10'),
        },
        {
          id: 'emp003',
          email: 'diana.prince@company.com',
          name: 'Diana Prince',
          employeeId: 'EMP003',
          department: 'Engineering',
          position: 'Frontend Developer',
          managerId: managerId,
          role: 'employee',
          language: 'en',
          phone: '+1234567892',
          site: sites[0],
          projects: [projects[0], projects[3]],
          status: 'available',
          joinDate: new Date('2019-09-20'),
        },
        {
          id: 'emp004',
          email: 'edward.norton@company.com',
          name: 'Edward Norton',
          employeeId: 'EMP004',
          department: 'Engineering',
          position: 'Backend Developer',
          managerId: managerId,
          role: 'employee',
          language: 'en',
          phone: '+1234567893',
          site: sites[2],
          projects: [projects[2], projects[4]],
          status: 'busy',
          joinDate: new Date('2020-11-05'),
        },
        {
          id: 'emp005',
          email: 'fiona.apple@company.com',
          name: 'Fiona Apple',
          employeeId: 'EMP005',
          department: 'Engineering',
          position: 'DevOps Engineer',
          managerId: managerId,
          role: 'employee',
          language: 'en',
          phone: '+1234567894',
          site: sites[0],
          projects: [projects[5]],
          status: 'available',
          joinDate: new Date('2021-03-15'),
        },
        {
          id: 'emp006',
          email: 'george.lucas@company.com',
          name: 'George Lucas',
          employeeId: 'EMP006',
          department: 'Engineering',
          position: 'QA Engineer',
          managerId: managerId,
          role: 'employee',
          language: 'en',
          phone: '+1234567895',
          site: sites[3],
          projects: [projects[1], projects[6]],
          status: 'available',
          joinDate: new Date('2022-01-10'),
        },
      ];

      for (const member of teamMembers) {
        await setDoc(doc(db, 'users', member.id), {
          ...member,
          joinDate: Timestamp.fromDate(member.joinDate),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      console.log('✓ Created team members');

      // Create Leave Balances
      const leaveBalances = [
        {
          employeeId: 'emp001',
          annual: { earned: 20, used: 5, available: 15, pending: 0 },
          sick: { earned: 10, used: 2, available: 8, pending: 0 },
          emergency: { earned: 5, used: 0, available: 5, pending: 0 },
          lastUpdated: serverTimestamp(),
        },
        {
          employeeId: 'emp002',
          annual: { earned: 15, used: 8, available: 7, pending: 0 },
          sick: { earned: 10, used: 1, available: 9, pending: 0 },
          emergency: { earned: 5, used: 0, available: 5, pending: 0 },
          lastUpdated: serverTimestamp(),
        },
        {
          employeeId: 'emp003',
          annual: { earned: 22, used: 10, available: 12, pending: 0 },
          sick: { earned: 10, used: 3, available: 7, pending: 0 },
          emergency: { earned: 5, used: 1, available: 4, pending: 0 },
          lastUpdated: serverTimestamp(),
        },
        {
          employeeId: 'emp004',
          annual: { earned: 18, used: 6, available: 12, pending: 0 },
          sick: { earned: 10, used: 0, available: 10, pending: 0 },
          emergency: { earned: 5, used: 0, available: 5, pending: 0 },
          lastUpdated: serverTimestamp(),
        },
        {
          employeeId: 'emp005',
          annual: { earned: 16, used: 4, available: 12, pending: 0 },
          sick: { earned: 10, used: 2, available: 8, pending: 0 },
          emergency: { earned: 5, used: 0, available: 5, pending: 0 },
          lastUpdated: serverTimestamp(),
        },
        {
          employeeId: 'emp006',
          annual: { earned: 12, used: 2, available: 10, pending: 0 },
          sick: { earned: 10, used: 0, available: 10, pending: 0 },
          emergency: { earned: 5, used: 0, available: 5, pending: 0 },
          lastUpdated: serverTimestamp(),
        },
      ];

      for (const balance of leaveBalances) {
        await setDoc(doc(db, 'leaveBalances', balance.employeeId), {
          ...balance,
          lastUpdated: serverTimestamp(),
        });
      }
      console.log('✓ Created leave balances');

      // Create Leave Applications
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      const nextMonth = new Date(today);
      nextMonth.setDate(today.getDate() + 30);

      const leaveApplications = [
        {
          id: 'leave001',
          employeeId: 'emp002',
          employeeName: 'Charlie Brown',
          leaveType: 'annual',
          startDate: Timestamp.fromDate(new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)),
          endDate: Timestamp.fromDate(new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000)),
          days: 7,
          reason: 'Family vacation',
          status: 'approved',
          approverId: managerId,
          approverName: 'Bob Johnson',
          submittedAt: Timestamp.fromDate(new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000)),
          reviewedAt: Timestamp.fromDate(new Date(today.getTime() - 13 * 24 * 60 * 60 * 1000)),
        },
        {
          id: 'leave002',
          employeeId: 'emp001',
          employeeName: 'Alice Smith',
          leaveType: 'annual',
          startDate: Timestamp.fromDate(nextWeek),
          endDate: Timestamp.fromDate(new Date(nextWeek.getTime() + 5 * 24 * 60 * 60 * 1000)),
          days: 5,
          reason: 'Personal time off',
          status: 'pending',
          approverId: managerId,
          submittedAt: Timestamp.fromDate(new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)),
        },
        {
          id: 'leave003',
          employeeId: 'emp003',
          employeeName: 'Diana Prince',
          leaveType: 'sick',
          startDate: Timestamp.fromDate(new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000)),
          endDate: Timestamp.fromDate(new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)),
          days: 2,
          reason: 'Medical appointment',
          status: 'pending',
          approverId: managerId,
          submittedAt: Timestamp.fromDate(new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)),
        },
        {
          id: 'leave004',
          employeeId: 'emp004',
          employeeName: 'Edward Norton',
          leaveType: 'annual',
          startDate: Timestamp.fromDate(nextMonth),
          endDate: Timestamp.fromDate(new Date(nextMonth.getTime() + 10 * 24 * 60 * 60 * 1000)),
          days: 10,
          reason: 'Holiday trip',
          status: 'pending',
          approverId: managerId,
          submittedAt: Timestamp.fromDate(new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000)),
        },
      ];

      for (const leave of leaveApplications) {
        await setDoc(doc(db, 'leaveApplications', leave.id), leave);
      }
      console.log('✓ Created leave applications');

      toast.success('Manager data populated successfully! Login as manager@company.com to see the dashboard.');
    } catch (error: any) {
      console.error('Error populating data:', error);
      toast.error(error.message || 'Failed to populate manager data');
    } finally {
      setLoading(false);
    }
  };

  if (currentUser?.role !== 'admin' && currentUser?.role !== 'hr') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
        <p className="text-gray-600">You do not have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Populate Manager Data</h2>
      <p className="text-gray-600 mb-6">
        This will create a manager (manager@company.com) with 6 direct reports, including:
      </p>
      <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
        <li>Manager: Bob Johnson (Engineering Manager)</li>
        <li>6 Team Members with projects, sites, and leave information</li>
        <li>Leave balances for all team members</li>
        <li>Current and pending leave applications</li>
        <li>Status indicators (Available, On Leave, Busy)</li>
      </ul>
      <button
        onClick={populateData}
        disabled={loading}
        className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Users className="w-5 h-5" />
        )}
        {loading ? 'Populating...' : 'Populate Manager Data'}
      </button>
        </div>
      </div>
      </main>
    </div>
  );
}

