'use client';

import { useState, useEffect } from 'react';
import { Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useChatStore } from '@/lib/store/chatStore';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

export default function TeamManager() {
  const { currentUser } = useChatStore();
  const { t } = useTranslation();
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);

  useEffect(() => {
    if (currentUser?.role === 'manager') {
      loadTeamData();
    }
  }, [currentUser]);

  const loadTeamData = async () => {
    try {
      // Load team members
      const teamQuery = query(
        collection(db, 'users'),
        where('managerId', '==', currentUser?.id)
      );
      const teamSnapshot = await getDocs(teamQuery);
      setTeamMembers(teamSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));

      // Load pending leave requests from team
      const requestsQuery = query(
        collection(db, 'leaveApplications'),
        where('approverId', '==', currentUser?.id),
        where('status', '==', 'pending')
      );
      const requestsSnapshot = await getDocs(requestsQuery);
      setPendingRequests(requestsSnapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
        startDate: d.data().startDate?.toDate(),
        endDate: d.data().endDate?.toDate(),
      })));
    } catch (error) {
      console.error('Error loading team data:', error);
    }
  };

  const handleApproval = async (requestId: string, approved: boolean) => {
    try {
      await updateDoc(doc(db, 'leaveApplications', requestId), {
        status: approved ? 'approved' : 'rejected',
        reviewedAt: new Date(),
      });
      toast.success(`Request ${approved ? 'approved' : 'rejected'} successfully!`);
      loadTeamData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update request');
    }
  };

  if (currentUser?.role !== 'manager') {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Team Members */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-6 h-6 text-white" />
          <h2 className="text-2xl font-bold text-white">{t('manager.team')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="glass rounded-xl p-4">
              <h3 className="text-white font-semibold">{member.name}</h3>
              <p className="text-white/60 text-sm">{member.position}</p>
              <p className="text-white/60 text-sm">{member.email}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Requests */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-6 h-6 text-white" />
          <h2 className="text-2xl font-bold text-white">{t('manager.requests')}</h2>
        </div>
        <div className="space-y-4">
          {pendingRequests.length === 0 ? (
            <p className="text-white/60">No pending requests</p>
          ) : (
            pendingRequests.map((request) => (
              <div key={request.id} className="glass rounded-xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-white font-semibold">{request.employeeName}</h3>
                    <p className="text-white/60 text-sm">
                      {request.leaveType} • {request.days} days
                    </p>
                    <p className="text-white/60 text-sm">
                      {request.startDate?.toLocaleDateString()} - {request.endDate?.toLocaleDateString()}
                    </p>
                    {request.reason && (
                      <p className="text-white/80 mt-2">{request.reason}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApproval(request.id, true)}
                    className="flex-1 px-4 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    {t('approvals.approve')}
                  </button>
                  <button
                    onClick={() => handleApproval(request.id, false)}
                    className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    {t('approvals.reject')}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

