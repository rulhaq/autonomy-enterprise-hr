'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useChatStore } from '@/lib/store/chatStore';
import toast from 'react-hot-toast';

export default function PopulatePage() {
  const { currentUser } = useChatStore();
  const [loading, setLoading] = useState(false);

  const populateData = async () => {
    if (currentUser?.role !== 'admin' && currentUser?.role !== 'hr') {
      toast.error('Only admins can populate data');
      return;
    }

    setLoading(true);
    try {
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
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-15'),
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
          createdAt: new Date('2024-12-01'),
          updatedAt: new Date('2025-01-10'),
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
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
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
          createdAt: new Date('2024-06-01'),
          updatedAt: new Date('2025-01-01'),
        },
      ];

      for (const docData of hrDocuments) {
        await addDoc(collection(db, 'hrDocuments'), docData);
      }

      toast.success('Sample data populated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to populate data');
    } finally {
      setLoading(false);
    }
  };

  if (currentUser?.role !== 'admin' && currentUser?.role !== 'hr') {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="glass rounded-2xl p-8">
          <p className="text-white">Access denied. Admin or HR role required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Populate Sample Data</h2>
      <p className="text-white/80 mb-6">
        This will add sample HR documents to Firestore for testing the RAG system.
      </p>
      <button
        onClick={populateData}
        disabled={loading}
        className="px-6 py-3 rounded-xl bg-white text-primary-600 font-semibold hover:bg-white/90 transition-colors disabled:opacity-50"
      >
        {loading ? 'Populating...' : 'Populate Sample Data'}
      </button>
    </div>
  );
}

