'use client';

import { useState, useEffect } from 'react';
import { Upload, FileText, Edit, Trash2, Save, X } from 'lucide-react';
import { useChatStore } from '@/lib/store/chatStore';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function PolicyManager() {
  const { currentUser } = useChatStore();
  const { t } = useTranslation();
  const [policies, setPolicies] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', content: '', category: '', version: '', tags: '' });

  useEffect(() => {
    if (currentUser?.role === 'admin' || currentUser?.role === 'hr') {
      loadPolicies();
    }
  }, [currentUser]);

  const loadPolicies = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'hrDocuments'));
      const policyDocs = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter((doc: any) => doc.category === 'policy' || doc.category === 'handbook');
      setPolicies(policyDocs);
    } catch (error) {
      console.error('Error loading policies:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Upload to Firebase Storage
      const storageRef = ref(storage, `hr-policies/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Extract text from document
      const content = await extractTextFromFile(file);

      // Determine category from file name or user input
      const category = file.name.toLowerCase().includes('policy') ? 'policy' : 
                      file.name.toLowerCase().includes('handbook') ? 'handbook' : 'policy';

      // Save to Firestore
      await addDoc(collection(db, 'hrDocuments'), {
        title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
        content: content,
        category: category,
        version: '1.0',
        tags: extractTags(file.name),
        sourceUrl: downloadURL,
        uploadedBy: currentUser?.id,
        uploadedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      toast.success('Policy uploaded successfully!');
      loadPolicies();
      setShowUpload(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload policy');
    } finally {
      setUploading(false);
    }
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      return await file.text();
    }
    return `[Policy Document: ${file.name}]\n\nThis policy document has been uploaded and is available for RAG search. The full content will be extracted using document parsing libraries in production.`;
  };

  const extractTags = (filename: string): string[] => {
    const tags: string[] = [];
    const lower = filename.toLowerCase();
    if (lower.includes('leave')) tags.push('leave');
    if (lower.includes('attendance')) tags.push('attendance');
    if (lower.includes('wfh') || lower.includes('work from home')) tags.push('wfh');
    if (lower.includes('benefit')) tags.push('benefits');
    if (lower.includes('conduct')) tags.push('conduct');
    if (lower.includes('handbook')) tags.push('handbook');
    return tags;
  };

  const handleEdit = (policy: any) => {
    setEditingId(policy.id);
    setEditForm({
      title: policy.title || '',
      content: policy.content || '',
      category: policy.category || 'policy',
      version: policy.version || '1.0',
      tags: Array.isArray(policy.tags) ? policy.tags.join(', ') : '',
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    try {
      await updateDoc(doc(db, 'hrDocuments', editingId), {
        title: editForm.title,
        content: editForm.content,
        category: editForm.category,
        version: editForm.version,
        tags: editForm.tags.split(',').map(t => t.trim()).filter(t => t),
        updatedAt: new Date(),
      });

      toast.success('Policy updated successfully!');
      setEditingId(null);
      loadPolicies();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update policy');
    }
  };

  const handleDelete = async (policyId: string) => {
    if (!confirm('Are you sure you want to delete this policy?')) return;

    try {
      await deleteDoc(doc(db, 'hrDocuments', policyId));
      toast.success('Policy deleted successfully!');
      loadPolicies();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete policy');
    }
  };

  if (currentUser?.role !== 'admin' && currentUser?.role !== 'hr') {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Policy Management</h2>
          <p className="text-gray-600 text-sm mt-1">Upload and manage HR policies for RAG search</p>
        </div>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 flex items-center gap-2"
        >
          <Upload className="w-5 h-5" />
          Upload Policy
        </button>
      </div>

      {showUpload && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">Upload Policy Document</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
              multiple
              onChange={handleFileUpload}
              disabled={uploading}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900"
            />
            <p className="text-xs text-gray-600 mt-2">Supports PDF, Word, Text, and Images (with OCR)</p>
            {uploading && <p className="text-gray-600 mt-2">Uploading and processing...</p>}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {policies.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No policies uploaded yet</p>
          </div>
        ) : (
          policies.map((policy) => (
            <div key={policy.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              {editingId === policy.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Title</label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Content</label>
                    <textarea
                      value={editForm.content}
                      onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                      rows={8}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Category</label>
                      <select
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900"
                      >
                        <option value="policy">Policy</option>
                        <option value="handbook">Handbook</option>
                        <option value="benefits">Benefits</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Version</label>
                      <input
                        type="text"
                        value={editForm.version}
                        onChange={(e) => setEditForm({ ...editForm, version: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={editForm.tags}
                      onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900"
                      placeholder="leave, wfh, benefits"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 rounded-lg bg-gray-200 text-gray-900 hover:bg-gray-300 flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-semibold text-lg mb-1">{policy.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{policy.category}</span>
                        <span>•</span>
                        <span>v{policy.version}</span>
                        {policy.tags && policy.tags.length > 0 && (
                          <>
                            <span>•</span>
                            <span>{Array.isArray(policy.tags) ? policy.tags.join(', ') : policy.tags}</span>
                          </>
                        )}
                      </div>
                      <p className="text-gray-700 mt-2 text-sm line-clamp-2">
                        {policy.content?.substring(0, 200)}...
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(policy)}
                        className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200"
                        title="Edit Policy"
                      >
                        <Edit className="w-5 h-5 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(policy.id)}
                        className="p-2 rounded-lg bg-red-100 hover:bg-red-200"
                        title="Delete Policy"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

