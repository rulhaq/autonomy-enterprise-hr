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

import ManagerDashboard from '@/components/manager/ManagerDashboard';

export default function ManagerPage() {
  return (
    <main className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <ManagerDashboard />
      </div>
    </main>
  );
}

