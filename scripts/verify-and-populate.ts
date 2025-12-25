/**
 * Script to verify Firebase connection and populate manager data
 * Run with: npx ts-node scripts/verify-and-populate.ts
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, Timestamp, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
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

async function verifyConnection() {
  console.log('Verifying Firebase connection...');
  try {
    const testDoc = await getDoc(doc(db, 'test', 'connection'));
    console.log('✓ Firebase connection successful');
    return true;
  } catch (error: any) {
    console.error('✗ Firebase connection failed:', error.message);
    return false;
  }
}

async function checkManagerExists() {
  console.log('Checking if manager exists...');
  try {
    const managerDoc = await getDoc(doc(db, 'users', 'manager456'));
    if (managerDoc.exists()) {
      console.log('✓ Manager exists:', managerDoc.data()?.name);
      return true;
    } else {
      console.log('✗ Manager does not exist');
      return false;
    }
  } catch (error: any) {
    console.error('✗ Error checking manager:', error.message);
    return false;
  }
}

async function checkTeamMembers() {
  console.log('Checking team members...');
  try {
    const teamQuery = query(
      collection(db, 'users'),
      where('managerId', '==', 'manager456')
    );
    const snapshot = await getDocs(teamQuery);
    console.log(`✓ Found ${snapshot.docs.length} team members`);
    return snapshot.docs.length;
  } catch (error: any) {
    console.error('✗ Error checking team members:', error.message);
    if (error.code === 'permission-denied') {
      console.error('  → This indicates Firestore rules need to be deployed!');
    }
    return 0;
  }
}

async function populateManagerData() {
  console.log('\n=== Populating Manager Data ===\n');

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
    console.log('✓ Created manager: Bob Johnson');

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
      console.log(`✓ Created team member: ${member.name}`);
    }

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
      await setDoc(doc(db, 'leaveBalances', balance.employeeId), balance);
      console.log(`✓ Created leave balance for: ${balance.employeeId}`);
    }

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
      console.log(`✓ Created leave application: ${leave.id}`);
    }

    console.log('\n✅ Successfully populated manager data!');
    return true;
  } catch (error: any) {
    console.error('\n✗ Error populating data:', error.message);
    if (error.code === 'permission-denied') {
      console.error('\n⚠️  PERMISSION DENIED - Firestore rules need to be deployed!');
      console.error('   Please deploy rules using: firebase deploy --only firestore:rules');
    }
    return false;
  }
}

async function main() {
  console.log('=== Firebase Manager Data Setup ===\n');

  // Step 1: Verify connection
  const connected = await verifyConnection();
  if (!connected) {
    console.log('\n✗ Cannot proceed without Firebase connection');
    process.exit(1);
  }

  // Step 2: Check if manager exists
  const managerExists = await checkManagerExists();

  // Step 3: Check team members
  const teamCount = await checkTeamMembers();

  // Step 4: Populate if needed
  if (!managerExists || teamCount === 0) {
    console.log('\n⚠️  Data missing. Populating...\n');
    const populated = await populateManagerData();
    if (!populated) {
      console.log('\n✗ Failed to populate data');
      process.exit(1);
    }
  } else {
    console.log('\n✓ Data already exists. Skipping population.');
  }

  // Step 5: Verify final state
  console.log('\n=== Final Verification ===\n');
  await checkManagerExists();
  await checkTeamMembers();

  console.log('\n✅ Setup complete!');
  console.log('\nNext steps:');
  console.log('1. Deploy Firestore rules: firebase deploy --only firestore:rules');
  console.log('2. Login as manager@company.com');
  console.log('3. Navigate to /manager to see the dashboard');
}

main().catch(console.error);

