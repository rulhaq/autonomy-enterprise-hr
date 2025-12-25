/**
 * Script to populate Firebase with dummy manager and employee data
 * Includes projects, sites, leave information, and team structures
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import * as dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || '',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

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

async function populateManagerData() {
  console.log('Starting to populate manager data...');

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
      createdAt: Timestamp.fromDate(new Date('2018-03-01')),
      updatedAt: Timestamp.now(),
    };
    await setDoc(doc(db, 'users', managerId), managerData);
    console.log('✓ Created manager:', managerData.name);

    // Create Team Members (Direct Reports)
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
        createdAt: Timestamp.fromDate(member.joinDate),
        updatedAt: Timestamp.now(),
      });
      console.log('✓ Created team member:', member.name);
    }

    // Create Leave Balances
    const leaveBalances = [
      {
        employeeId: 'emp001',
        annual: { earned: 20, used: 5, available: 15, pending: 0 },
        sick: { earned: 10, used: 2, available: 8, pending: 0 },
        emergency: { earned: 5, used: 0, available: 5, pending: 0 },
        lastUpdated: Timestamp.now(),
      },
      {
        employeeId: 'emp002',
        annual: { earned: 15, used: 8, available: 7, pending: 0 },
        sick: { earned: 10, used: 1, available: 9, pending: 0 },
        emergency: { earned: 5, used: 0, available: 5, pending: 0 },
        lastUpdated: Timestamp.now(),
      },
      {
        employeeId: 'emp003',
        annual: { earned: 22, used: 10, available: 12, pending: 0 },
        sick: { earned: 10, used: 3, available: 7, pending: 0 },
        emergency: { earned: 5, used: 1, available: 4, pending: 0 },
        lastUpdated: Timestamp.now(),
      },
      {
        employeeId: 'emp004',
        annual: { earned: 18, used: 6, available: 12, pending: 0 },
        sick: { earned: 10, used: 0, available: 10, pending: 0 },
        emergency: { earned: 5, used: 0, available: 5, pending: 0 },
        lastUpdated: Timestamp.now(),
      },
      {
        employeeId: 'emp005',
        annual: { earned: 16, used: 4, available: 12, pending: 0 },
        sick: { earned: 10, used: 2, available: 8, pending: 0 },
        emergency: { earned: 5, used: 0, available: 5, pending: 0 },
        lastUpdated: Timestamp.now(),
      },
      {
        employeeId: 'emp006',
        annual: { earned: 12, used: 2, available: 10, pending: 0 },
        sick: { earned: 10, used: 0, available: 10, pending: 0 },
        emergency: { earned: 5, used: 0, available: 5, pending: 0 },
        lastUpdated: Timestamp.now(),
      },
    ];

    for (const balance of leaveBalances) {
      await setDoc(doc(db, 'leaveBalances', balance.employeeId), balance);
      console.log('✓ Created leave balance for:', balance.employeeId);
    }

    // Create Leave Applications (some approved, some pending)
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const nextMonth = new Date(today);
    nextMonth.setDate(today.getDate() + 30);

    const leaveApplications = [
      // Current leave (emp002 is on leave)
      {
        id: 'leave001',
        employeeId: 'emp002',
        employeeName: 'Charlie Brown',
        leaveType: 'annual',
        startDate: Timestamp.fromDate(new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)), // 3 days ago
        endDate: Timestamp.fromDate(new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000)), // 4 days from now
        days: 7,
        reason: 'Family vacation',
        status: 'approved',
        approverId: managerId,
        approverName: 'Bob Johnson',
        submittedAt: Timestamp.fromDate(new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000)),
        reviewedAt: Timestamp.fromDate(new Date(today.getTime() - 13 * 24 * 60 * 60 * 1000)),
      },
      // Pending requests
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
      // Past approved leave
      {
        id: 'leave005',
        employeeId: 'emp001',
        employeeName: 'Alice Smith',
        leaveType: 'annual',
        startDate: Timestamp.fromDate(new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000)),
        endDate: Timestamp.fromDate(new Date(today.getTime() - 55 * 24 * 60 * 60 * 1000)),
        days: 5,
        reason: 'Previous leave',
        status: 'approved',
        approverId: managerId,
        approverName: 'Bob Johnson',
        submittedAt: Timestamp.fromDate(new Date(today.getTime() - 70 * 24 * 60 * 60 * 1000)),
        reviewedAt: Timestamp.fromDate(new Date(today.getTime() - 69 * 24 * 60 * 60 * 1000)),
      },
    ];

    for (const leave of leaveApplications) {
      await setDoc(doc(db, 'leaveApplications', leave.id), leave);
      console.log('✓ Created leave application:', leave.id);
    }

    console.log('\n✅ Successfully populated manager data!');
    console.log('\nManager:', managerData.email);
    console.log('Team Members:', teamMembers.length);
    console.log('Leave Applications:', leaveApplications.length);
    console.log('\nYou can now login as manager@company.com to see the dashboard');

  } catch (error) {
    console.error('Error populating data:', error);
    throw error;
  }
}

// Run the script
populateManagerData()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });

