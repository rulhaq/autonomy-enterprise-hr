'use client';

import { useState, useEffect } from 'react';
import { Users, Calendar, MapPin, Briefcase, CheckCircle, XCircle, Clock, MessageSquare, TrendingUp, X } from 'lucide-react';
import { useChatStore } from '@/lib/store/chatStore';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import Link from 'next/link';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  employeeId: string;
  phone?: string;
  projects?: string[];
  site?: string;
  status?: 'available' | 'on_leave' | 'busy' | 'offline';
  currentLeave?: {
    type: string;
    startDate: Date;
    endDate: Date;
    days: number;
  };
  leaveBalance?: {
    annual: { available: number; used: number };
    sick: { available: number; used: number };
  };
}

export default function ManagerDashboard() {
  const { currentUser } = useChatStore();
  const { t } = useTranslation();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    if (currentUser?.role === 'manager') {
      loadTeamData();
    }
  }, [currentUser]);

  const loadTeamData = async () => {
    if (!currentUser?.id) {
      console.log('No current user ID');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      console.log('Loading team data for manager:', currentUser.id);
      
      // Load team members
      const teamQuery = query(
        collection(db, 'users'),
        where('managerId', '==', currentUser.id)
      );
      const teamSnapshot = await getDocs(teamQuery);
      console.log('Team members found:', teamSnapshot.docs.length);
      
      const members = teamSnapshot.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          name: data.name || 'Unknown',
          email: data.email || '',
          position: data.position || '',
          department: data.department || '',
          employeeId: data.employeeId || '',
          phone: data.phone,
          projects: data.projects || [],
          site: data.site || '',
          joinDate: data.joinDate?.toDate ? data.joinDate.toDate() : data.joinDate,
        };
      }) as TeamMember[];

      console.log('Processing members:', members.length);

      // Load leave balances and current leave for each member
      const membersWithData = await Promise.all(members.map(async (member) => {
        try {
          // Get leave balance
          const balanceQuery = query(
            collection(db, 'leaveBalances'),
            where('employeeId', '==', member.id)
          );
          const balanceSnapshot = await getDocs(balanceQuery);
          const balance = balanceSnapshot.docs[0]?.data();

          // Get current/upcoming leave
          const leaveQuery = query(
            collection(db, 'leaveApplications'),
            where('employeeId', '==', member.id),
            where('status', 'in', ['pending', 'approved'])
          );
          const leaveSnapshot = await getDocs(leaveQuery);
          const leaves = leaveSnapshot.docs.map(d => {
            const data = d.data();
            return {
              ...data,
              startDate: data.startDate?.toDate ? data.startDate.toDate() : data.startDate,
              endDate: data.endDate?.toDate ? data.endDate.toDate() : data.endDate,
            };
          });

          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const currentLeave = leaves.find((l: any) => {
            const start = l.startDate instanceof Date ? l.startDate : new Date(l.startDate);
            const end = l.endDate instanceof Date ? l.endDate : new Date(l.endDate);
            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);
            return start <= today && end >= today;
          });

          // Determine status
          let status: 'available' | 'on_leave' | 'busy' | 'offline' = 'available';
          if (currentLeave) {
            status = 'on_leave';
          } else if (member.status) {
            status = member.status;
          }

          return {
            ...member,
            leaveBalance: balance ? {
              annual: { 
                available: balance.annual?.available || 0, 
                used: balance.annual?.used || 0 
              },
              sick: { 
                available: balance.sick?.available || 0, 
                used: balance.sick?.used || 0 
              },
            } : undefined,
            currentLeave: currentLeave ? {
              type: (currentLeave as any).leaveType,
              startDate: currentLeave.startDate instanceof Date ? currentLeave.startDate : new Date(currentLeave.startDate),
              endDate: currentLeave.endDate instanceof Date ? currentLeave.endDate : new Date(currentLeave.endDate),
              days: (currentLeave as any).days || 0,
            } : undefined,
            status,
          };
        } catch (error) {
          console.error(`Error loading data for ${member.name}:`, error);
          return { ...member, status: 'offline' as const };
        }
      }));

      console.log('Members with data:', membersWithData.length);
      setTeamMembers(membersWithData);

      // Load pending leave requests
      const requestsQuery = query(
        collection(db, 'leaveApplications'),
        where('approverId', '==', currentUser.id),
        where('status', '==', 'pending')
      );
      const requestsSnapshot = await getDocs(requestsQuery);
      const requests = requestsSnapshot.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          startDate: data.startDate?.toDate ? data.startDate.toDate() : data.startDate,
          endDate: data.endDate?.toDate ? data.endDate.toDate() : data.endDate,
          submittedAt: data.submittedAt?.toDate ? data.submittedAt.toDate() : data.submittedAt,
        };
      });
      
      console.log('Pending requests:', requests.length);
      setPendingRequests(requests);
    } catch (error: any) {
      console.error('Error loading team data:', error);
      console.error('Error details:', error.message, error.code);
      toast.error(`Failed to load team data: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
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

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'on_leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'busy':
        return 'bg-blue-100 text-blue-800';
      case 'offline':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'on_leave':
        return 'On Leave';
      case 'busy':
        return 'Busy';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  if (currentUser?.role !== 'manager') {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const availableCount = teamMembers.filter(m => m.status === 'available').length;
  const onLeaveCount = teamMembers.filter(m => m.status === 'on_leave').length;
  const busyCount = teamMembers.filter(m => m.status === 'busy').length;

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your team and track their activities</p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Chat About Team
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Team</p>
                <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">{availableCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">On Leave</p>
                <p className="text-2xl font-bold text-gray-900">{onLeaveCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">{pendingRequests.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-gray-900" />
          <h2 className="text-2xl font-bold text-gray-900">Direct Reports</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No team members found</p>
            </div>
          ) : (
            teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedMember(member)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.position}</p>
                    <p className="text-xs text-gray-500">{member.employeeId}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                    {getStatusLabel(member.status)}
                  </span>
                </div>

                <div className="space-y-2 mt-4">
                  {member.department && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase className="w-4 h-4" />
                      <span>{member.department}</span>
                    </div>
                  )}
                  {member.site && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{member.site}</span>
                    </div>
                  )}
                  {member.projects && member.projects.length > 0 && (
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <TrendingUp className="w-4 h-4 mt-0.5" />
                      <div className="flex-1">
                        <span className="font-medium">Projects: </span>
                        <span>{member.projects.join(', ')}</span>
                      </div>
                    </div>
                  )}
                  {member.currentLeave && (
                    <div className="flex items-center gap-2 text-sm text-yellow-700 bg-yellow-50 rounded px-2 py-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        On {member.currentLeave.type} leave until {format(member.currentLeave.endDate, 'MMM d')}
                      </span>
                    </div>
                  )}
                  {member.leaveBalance && (
                    <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
                      <div>Annual: {member.leaveBalance.annual.available} days available</div>
                      <div>Sick: {member.leaveBalance.sick.available} days available</div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pending Leave Requests */}
      {pendingRequests.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-gray-900" />
            <h2 className="text-2xl font-bold text-gray-900">Pending Leave Requests</h2>
          </div>
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div key={request.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{request.employeeName}</h3>
                    <p className="text-sm text-gray-600 capitalize">
                      {request.leaveType} • {request.days} days
                    </p>
                    <p className="text-sm text-gray-600">
                      {format(request.startDate, 'MMM d')} - {format(request.endDate, 'MMM d, yyyy')}
                    </p>
                    {request.reason && (
                      <p className="text-gray-700 mt-2 text-sm">{request.reason}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Submitted: {format(request.submittedAt, 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApproval(request.id, true)}
                    className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(request.id, false)}
                    className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Employee Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedMember.name}</h2>
                  <p className="text-gray-600">{selectedMember.position} • {selectedMember.department}</p>
                </div>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Email:</span> {selectedMember.email}</p>
                    {selectedMember.phone && (
                      <p><span className="font-medium">Phone:</span> {selectedMember.phone}</p>
                    )}
                    <p><span className="font-medium">Employee ID:</span> {selectedMember.employeeId}</p>
                  </div>
                </div>

                {selectedMember.site && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Site Location
                    </h3>
                    <p className="text-gray-700">{selectedMember.site}</p>
                  </div>
                )}

                {selectedMember.projects && selectedMember.projects.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Projects
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.projects.map((project, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {project}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedMember.leaveBalance && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Leave Balance
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600">Annual Leave</p>
                        <p className="text-xl font-bold text-gray-900">
                          {selectedMember.leaveBalance.annual.available} days
                        </p>
                        <p className="text-xs text-gray-500">
                          {selectedMember.leaveBalance.annual.used} used
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600">Sick Leave</p>
                        <p className="text-xl font-bold text-gray-900">
                          {selectedMember.leaveBalance.sick.available} days
                        </p>
                        <p className="text-xs text-gray-500">
                          {selectedMember.leaveBalance.sick.used} used
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedMember.currentLeave && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Leave</h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="font-medium text-yellow-900 capitalize">{selectedMember.currentLeave.type} Leave</p>
                      <p className="text-sm text-yellow-700">
                        {format(selectedMember.currentLeave.startDate, 'MMM d')} - {format(selectedMember.currentLeave.endDate, 'MMM d, yyyy')}
                      </p>
                      <p className="text-sm text-yellow-700">{selectedMember.currentLeave.days} days</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

