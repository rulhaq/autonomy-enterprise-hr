/**
 * Script to populate Firebase with sample HR data
 * Run with: node scripts/populate-sample-data.js
 * 
 * Note: This requires Firebase Admin SDK. For client-side, use the web version.
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin (you'll need to download serviceAccountKey.json from Firebase Console)
try {
  const serviceAccount = require('../serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (e) {
  console.log('Service account not found. Using default credentials or environment variables.');
  admin.initializeApp();
}

const db = admin.firestore();

async function populateSampleData() {
  console.log('Starting Firebase population...');

  // Sample HR Documents
  const hrDocuments = [
    {
      title: 'Employee Handbook 2025',
      content: `Welcome to our company! This comprehensive handbook contains all the policies and procedures you need to know.

LEAVE POLICY:
- Annual Leave: All employees are entitled to 20 days of annual leave per year
- Sick Leave: 10 days of paid sick leave per year
- Emergency Leave: 5 days of emergency leave per year
- Maternity Leave: 12 weeks paid maternity leave
- Paternity Leave: 2 weeks paid paternity leave
- Pilgrimage Leave: 15 days unpaid leave for religious pilgrimage

Leave applications must be submitted at least 48 hours in advance, except for emergency leave.

WORK FROM HOME POLICY:
Employees can work from home up to 2 days per week with prior manager approval. Requests must be submitted 24 hours in advance through the HR system.

ATTENDANCE POLICY:
- Standard working hours: 9:00 AM to 6:00 PM
- Flexible hours: 8:00 AM to 5:00 PM or 10:00 AM to 7:00 PM (with manager approval)
- Late arrival: More than 3 late arrivals per month may result in disciplinary action

PERFORMANCE REVIEW:
Annual performance reviews are conducted in December. Employees will receive feedback and set goals for the upcoming year.`,
      category: 'handbook',
      version: '3.2',
      tags: ['handbook', 'policies', 'onboarding', 'leave', 'attendance'],
      createdAt: admin.firestore.Timestamp.fromDate(new Date('2025-01-01')),
      updatedAt: admin.firestore.Timestamp.fromDate(new Date('2025-01-15')),
    },
    {
      title: 'Leave Management Policy',
      content: `LEAVE MANAGEMENT POLICY

1. ANNUAL LEAVE
- Accrual: 1.67 days per month
- Maximum carryover: 5 days to next year
- Blackout periods: Last week of December (requires special approval)

2. SICK LEAVE
- Requires medical certificate for more than 2 consecutive days
- Can be taken in half-day increments
- No carryover allowed

3. EMERGENCY LEAVE
- For family emergencies, medical appointments, etc.
- Requires explanation but no advance notice needed
- Limited to 5 days per year

4. APPROVAL PROCESS
- Leave applications are reviewed by direct manager
- Approval typically takes 24-48 hours
- Employees receive email notification upon approval/rejection`,
      category: 'policy',
      version: '2.1',
      tags: ['leave', 'policy', 'hr', 'approval'],
      createdAt: admin.firestore.Timestamp.fromDate(new Date('2024-12-01')),
      updatedAt: admin.firestore.Timestamp.fromDate(new Date('2025-01-10')),
    },
    {
      title: 'Code of Conduct',
      content: `CODE OF CONDUCT

Our company values integrity, respect, and professionalism. All employees are expected to:

1. Treat all colleagues with respect and dignity
2. Maintain confidentiality of company information
3. Avoid conflicts of interest
4. Report any unethical behavior
5. Follow all company policies and procedures

Violations may result in disciplinary action up to and including termination.`,
      category: 'policy',
      version: '1.0',
      tags: ['conduct', 'ethics', 'policy'],
      createdAt: admin.firestore.Timestamp.fromDate(new Date('2024-01-01')),
      updatedAt: admin.firestore.Timestamp.fromDate(new Date('2024-01-01')),
    },
    {
      title: 'Benefits and Compensation',
      content: `BENEFITS AND COMPENSATION

HEALTH INSURANCE:
- Comprehensive health insurance coverage for employee and dependents
- Coverage includes medical, dental, and vision
- Annual health checkup provided

RETIREMENT:
- Company contributes 5% of base salary to retirement fund
- Employee can contribute additional 5% (matched by company)

OTHER BENEFITS:
- Transportation allowance: $200/month
- Meal allowance: $150/month
- Professional development budget: $1000/year
- Gym membership reimbursement: 50% up to $50/month`,
      category: 'benefits',
      version: '2.0',
      tags: ['benefits', 'compensation', 'insurance'],
      createdAt: admin.firestore.Timestamp.fromDate(new Date('2024-06-01')),
      updatedAt: admin.firestore.Timestamp.fromDate(new Date('2025-01-01')),
    },
  ];

  // Add HR Documents
  for (const docData of hrDocuments) {
    await db.collection('hrDocuments').add(docData);
    console.log(`✓ Added HR document: ${docData.title}`);
  }

  console.log('\n✅ Firebase population completed!');
  console.log('Sample HR documents have been added to Firestore.');
  process.exit(0);
}

populateSampleData().catch((error) => {
  console.error('Error populating Firebase:', error);
  process.exit(1);
});

