'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { useChatStore } from '@/lib/store/chatStore';
import { ChatMessage, Conversation } from '@/lib/types';
import { useTranslation } from 'react-i18next';
import MessageBubble from '../MessageBubble';
import toast from 'react-hot-toast';
import { chatWithGroq } from '@/lib/services/chatClient';
import { saveConversation, updateConversation } from '@/lib/services/firestore';

export default function AdminChat() {
  const { messages, isLoading, language, addMessage, setLoading, currentUser, setMessages, conversationId, setConversationId } = useChatStore();
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [ragEnabled, setRagEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to save chat session to Firebase
  const saveChatSession = useCallback(async () => {
    if (!currentUser) return;

    try {
      const allMessages = useChatStore.getState().messages;
      if (allMessages.length === 0) return;
      
      if (conversationId) {
        // Update existing conversation
        await updateConversation(conversationId, {
          messages: allMessages.map(msg => ({
            ...msg,
            timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp),
          })),
          language,
        } as Partial<Conversation>);
      } else {
        // Create new conversation
        const newConversationId = await saveConversation({
          userId: currentUser.id,
          messages: allMessages.map(msg => ({
            ...msg,
            timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp),
          })),
          language,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        setConversationId(newConversationId);
      }
    } catch (error) {
      console.error('Error saving chat session:', error);
    }
  }, [currentUser, conversationId, language, setConversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (messageContent: string) => {
    if (!messageContent.trim() || isLoading || !currentUser) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUser.id,
      role: 'user',
      content: messageContent.trim(),
      timestamp: new Date(),
      language,
    };

    addMessage(userMessage);
    setLoading(true);

    try {
      // Get updated messages from store
      const updatedMessages = await new Promise<ChatMessage[]>((resolve) => {
        setTimeout(() => {
          resolve(useChatStore.getState().messages);
        }, 10);
      });
      
      const messagesToSend = updatedMessages.map(m => ({
        role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: m.content,
      }));

      // Call Groq directly from client (no API route needed)
      const assistantResponse = await chatWithGroq(
        messagesToSend,
        currentUser.id,
        language,
        ragEnabled // useRAG
      );

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        userId: currentUser.id,
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date(),
        language,
      };

      addMessage(assistantMessage);
      
      // Save conversation to Firebase after both messages are added
      await saveChatSession();
    } catch (error: any) {
      console.error('Chat error:', error);
      toast.error(error.message || 'Failed to get response');
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        userId: currentUser.id,
        role: 'assistant',
        content: `I apologize, but I encountered an error: ${error.message}. Please try again.`,
        timestamp: new Date(),
        language,
      };
      addMessage(errorMessage);

      // Save conversation even if there's an error
      await saveChatSession();
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const messageToSend = input.trim();
    setInput('');
    await sendMessage(messageToSend);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setConversationId(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[600px]">
      {/* Header with RAG Toggle */}
      <div className="border-b border-gray-200 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">RAG-Enhanced Chat</h3>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-gray-900 text-sm">
            <input
              type="checkbox"
              checked={ragEnabled}
              onChange={(e) => setRagEnabled(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            RAG Enabled
          </label>
          <button
            onClick={clearChat}
            className="px-3 py-1 rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200 text-sm"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">RAG-Enhanced Chat</h3>
              <p className="text-gray-600">
                Test the AI with RAG enabled. It will search through uploaded documents and policies.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="bg-gray-50 rounded-lg p-4 max-w-[80%] border border-gray-200">
              <div className="flex items-center gap-2 text-gray-900">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Searching documents and generating response...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about policies, documents, or HR information..."
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span className="hidden md:inline">Send</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

