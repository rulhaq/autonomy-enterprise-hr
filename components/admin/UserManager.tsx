'use client';

import { useState, useEffect } from 'react';
import { Users, Edit, Trash2, Search, Plus } from 'lucide-react';
import { useChatStore } from '@/lib/store/chatStore';
import { collection, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { getUser, createOrUpdateUser } from '@/lib/services/firestore';
import toast from 'react-hot-toast';

export default function UserManager() {
  const { currentUser } = useChatStore();
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    role: 'employee' as 'employee' | 'manager' | 'hr' | 'admin',
    managerId: '',
    employeeId: '',
  });

  useEffect(() => {
    if (currentUser?.role === 'admin' || currentUser?.role === 'hr') {
      loadUsers();
    }
  }, [currentUser]);

  const loadUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      setUsers(snapshot.docs.map(d => ({ 
        id: d.id, 
        ...d.data(),
        createdAt: d.data().createdAt?.toDate(),
        updatedAt: d.data().updatedAt?.toDate(),
      })));
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleEdit = (user: any) => {
    setEditingId(user.id);
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      department: user.department || '',
      position: user.position || '',
      role: user.role || 'employee',
      managerId: user.managerId || '',
      employeeId: user.employeeId || '',
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    try {
      await createOrUpdateUser({
        id: editingId,
        ...editForm,
      });

      toast.success('User updated successfully!');
      setEditingId(null);
      loadUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update user');
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await deleteDoc(doc(db, 'users', userId));
      toast.success('User deleted successfully!');
      loadUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (currentUser?.role !== 'admin' && currentUser?.role !== 'hr') {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600 text-sm mt-1">Manage employee information and roles. You can add admins here.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No users found</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div key={user.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              {editingId === user.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Name</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Department</label>
                      <input
                        type="text"
                        value={editForm.department}
                        onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Position</label>
                      <input
                        type="text"
                        value={editForm.position}
                        onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Role</label>
                      <select
                        value={editForm.role}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value as any })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900"
                      >
                        <option value="employee">Employee</option>
                        <option value="manager">Manager</option>
                        <option value="hr">HR</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Employee ID</label>
                      <input
                        type="text"
                        value={editForm.employeeId}
                        onChange={(e) => setEditForm({ ...editForm, employeeId: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 rounded-lg bg-gray-200 text-gray-900 hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-gray-900 font-semibold">{user.name}</h3>
                    <p className="text-gray-600 text-sm">{user.email}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>{user.department || 'N/A'}</span>
                      <span>•</span>
                      <span>{user.position || 'N/A'}</span>
                      <span>•</span>
                      <span className="capitalize">{user.role}</span>
                      {user.employeeId && (
                        <>
                          <span>•</span>
                          <span>ID: {user.employeeId}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200"
                      title="Edit User"
                    >
                      <Edit className="w-5 h-5 text-blue-600" />
                    </button>
                    {user.id !== currentUser?.id && (
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 rounded-lg bg-red-100 hover:bg-red-200"
                        title="Delete User"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

