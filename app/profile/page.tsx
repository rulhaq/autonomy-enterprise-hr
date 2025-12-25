'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/config';
import { getUser, createOrUpdateUser } from '@/lib/services/firestore';
import { useChatStore } from '@/lib/store/chatStore';
import { User } from '@/lib/types';
import { languages, SupportedLanguage } from '@/lib/utils/language';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Save, Phone, Globe, User as UserIcon, Mail, Briefcase, Building } from 'lucide-react';
import Header from '@/components/Header';

export default function ProfilePage() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const { currentUser, setCurrentUser, setLanguage } = useChatStore();
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    } else if (user) {
      // Wait for currentUser to be set, or use user.uid directly
      if (currentUser) {
        loadProfile();
      } else if (user.uid) {
        // If currentUser is not set yet, try to load profile with user.uid
        const loadProfileWithUid = async () => {
          try {
            const userData = await getUser(user.uid);
            if (userData) {
              setProfile(userData);
              setCurrentUser(userData);
            }
          } catch (error) {
            console.error('Error loading profile:', error);
          }
        };
        loadProfileWithUid();
      }
    }
  }, [user, loading, currentUser, router, setCurrentUser]);

  const loadProfile = async () => {
    const userId = currentUser?.id || user?.uid;
    if (!userId) return;
    
    try {
      const userData = await getUser(userId);
      if (userData) {
        setProfile(userData);
        // Update store if currentUser is different
        if (!currentUser || currentUser.id !== userData.id) {
          setCurrentUser(userData);
        }
      } else if (currentUser) {
        setProfile(currentUser);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      if (currentUser) {
        setProfile(currentUser);
      }
    }
  };

  const handleSave = async () => {
    if (!profile || !currentUser) {
      toast.error('Profile data is missing');
      return;
    }

    setSaving(true);
    try {
      // Prepare updates - only send fields that can be updated
      const updates: any = {};
      if (profile.phone !== undefined) {
        updates.phone = profile.phone;
      }
      if (profile.language !== undefined) {
        updates.language = profile.language;
      }

      console.log('Saving profile updates:', updates);

      // Use API route for updates
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id,
          updates,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to update profile: ${response.status}`);
      }

      const result = await response.json();
      console.log('Profile update result:', result);

      // Reload profile to get updated data from Firestore
      await loadProfile();
      
      // Update store and i18n with new language if changed
      if (profile.language && profile.language !== currentUser.language) {
        setLanguage(profile.language as SupportedLanguage);
        i18n.changeLanguage(profile.language);
      }
      
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLanguageChange = (lang: SupportedLanguage) => {
    if (profile) {
      setProfile({ ...profile, language: lang });
    }
  };

  const handlePhoneChange = (phone: string) => {
    if (profile) {
      setProfile({ ...profile, phone });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!profile) {
    // Show loading state while profile is being fetched
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-900 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  const isManagerEditable = currentUser?.role === 'manager' || currentUser?.role === 'admin' || currentUser?.role === 'hr';
  const canEditPhone = true; // Employees can always edit their phone
  const canEditLanguage = true; // Employees can always edit their language

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
              <p className="text-gray-900">Manage your profile information</p>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900">
                    {profile.name}
                  </div>
                  <p className="text-xs text-gray-900 mt-1">Managed by HR/Manager</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {profile.email}
                  </div>
                  <p className="text-xs text-gray-900 mt-1">Managed by HR/Manager</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee ID
                  </label>
                  <div className="px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900">
                    {profile.employeeId || 'N/A'}
                  </div>
                  <p className="text-xs text-gray-900 mt-1">Managed by HR/Manager</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </label>
                  {editing && canEditPhone ? (
                    <input
                      type="tel"
                      value={profile.phone || ''}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="Enter phone number"
                      className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900">
                      {profile.phone || 'Not set'}
                    </div>
                  )}
                  <p className="text-xs text-gray-900 mt-1">You can update this</p>
                </div>
              </div>
            </div>

            {/* Work Information */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Work Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building className="w-4 h-4 inline mr-2" />
                    Department
                  </label>
                  <div className="px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900">
                    {profile.department || 'Not assigned'}
                  </div>
                  <p className="text-xs text-gray-900 mt-1">Managed by Manager/HR</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position
                  </label>
                  <div className="px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900">
                    {profile.position || 'Not assigned'}
                  </div>
                  <p className="text-xs text-gray-900 mt-1">Managed by Manager/HR</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <div className="px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 capitalize">
                    {profile.role}
                  </div>
                  <p className="text-xs text-gray-900 mt-1">Managed by HR</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Join Date
                  </label>
                  <div className="px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900">
                    {profile.joinDate ? (profile.joinDate instanceof Date ? profile.joinDate.toLocaleDateString() : new Date(profile.joinDate).toLocaleDateString()) : 'N/A'}
                  </div>
                  <p className="text-xs text-gray-900 mt-1">Managed by HR</p>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Preferences
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Language
                  </label>
                  {editing && canEditLanguage ? (
                    <select
                      value={profile.language || 'en'}
                      onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
                      className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.nativeName} ({lang.name})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900">
                      {languages.find(l => l.code === profile.language)?.nativeName || 'English'}
                    </div>
                  )}
                  <p className="text-xs text-gray-900 mt-1">You can update this</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {editing && (
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    loadProfile();
                  }}
                  className="px-6 py-3 rounded-lg bg-gray-200 text-gray-900 hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          </div>
        </div>
      </main>
    </div>
  );
}

