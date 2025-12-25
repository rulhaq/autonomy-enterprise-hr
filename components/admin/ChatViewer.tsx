'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { format } from 'date-fns';
import { MessageSquare, Search } from 'lucide-react';

export default function ChatViewer() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const q = query(
        collection(db, 'conversations'),
        orderBy('updatedAt', 'desc'),
        limit(50)
      );
      const snapshot = await getDocs(q);
      const convos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        updatedAt: doc.data().updatedAt?.toDate(),
      }));
      setConversations(convos);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.messages?.some((m: any) => m.content?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Chat Viewer</h2>
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-gray-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No conversations found</p>
            ) : (
              filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedConversation?.id === conv.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">
                      User: {conv.userId?.substring(0, 8)}...
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {conv.messages?.length || 0} messages
                  </p>
                  {conv.updatedAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      {format(conv.updatedAt, 'MMM d, HH:mm')}
                    </p>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedConversation ? (
            <div className="bg-gray-50 rounded-lg p-4 max-h-[600px] overflow-y-auto">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Conversation Details</h3>
              <div className="space-y-4">
                {selectedConversation.messages?.map((msg: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-blue-100 text-gray-900 ml-auto max-w-[80%]'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    <p className="text-sm font-medium mb-1 capitalize">{msg.role}</p>
                    <p className="text-gray-900">{msg.content}</p>
                    {msg.timestamp && (
                      <p className="text-xs text-gray-500 mt-2">
                        {format(msg.timestamp.toDate(), 'MMM d, HH:mm')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[600px] bg-gray-50 rounded-lg">
              <p className="text-gray-600">Select a conversation to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

