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

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useChatStore } from '@/lib/store/chatStore';
import { ChatMessage, Conversation } from '@/lib/types';
import { useTranslation } from 'react-i18next';
import MessageBubble from './MessageBubble';
import QuickActions from './QuickActions';
import toast from 'react-hot-toast';
import { saveConversation, updateConversation } from '@/lib/services/firestore';
import { chatWithGroq } from '@/lib/services/chatClient';

export default function ChatInterface() {
  const { messages, isLoading, language, addMessage, setLoading, currentUser, conversationId, setConversationId } = useChatStore();
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = useCallback(async (messageContent: string) => {
    if (!messageContent.trim() || isLoading || !currentUser) {
      console.log('Send message blocked:', { hasContent: !!messageContent.trim(), isLoading, hasUser: !!currentUser });
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUser.id,
      role: 'user',
      content: messageContent.trim(),
      timestamp: new Date(),
      language,
    };

    // Add user message to chat immediately
    addMessage(userMessage);
    setLoading(true);

    try {
      // Get updated messages from store after adding the user message
      // Use setTimeout to ensure state is updated
      const updatedMessages = await new Promise<ChatMessage[]>((resolve) => {
        setTimeout(() => {
          resolve(useChatStore.getState().messages);
        }, 10);
      });
      
      console.log('Sending chat request:', {
        messageCount: updatedMessages.length,
        userId: currentUser.id,
        language,
      });
      
      // Prepare messages for Groq - include all messages including the one we just added
      const messagesToSend = updatedMessages.map(m => ({
        role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: m.content,
      }));

      // Call Groq directly from client (no API route needed)
      console.log('Calling Groq API directly from client...');
      const assistantResponse = await chatWithGroq(
        messagesToSend,
        currentUser.id,
        language,
        true // useRAG
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
      const errorMsg = error.message || 'Failed to get response';
      toast.error(errorMsg);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        userId: currentUser.id,
        role: 'assistant',
        content: `I apologize, but I encountered an error processing your request: ${errorMsg}. Please try again or contact HR support.`,
        timestamp: new Date(),
        language,
      };
      addMessage(errorMessage);

      // Save conversation even if there's an error
      await saveChatSession();
    } finally {
      setLoading(false);
    }
  }, [isLoading, currentUser, language, addMessage, setLoading, conversationId, setConversationId]);

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
      // Don't show error to user, just log it
    }
  }, [currentUser, conversationId, language, setConversationId]);

  // Listen for quick action events
  useEffect(() => {
    const handleQuickAction = (event: Event) => {
      const customEvent = event as CustomEvent<{ message: string }>;
      if (customEvent.detail?.message) {
        sendMessage(customEvent.detail.message);
      }
    };

    window.addEventListener('quickAction', handleQuickAction);
    return () => {
      window.removeEventListener('quickAction', handleQuickAction);
    };
  }, [sendMessage]);

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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[calc(100vh-200px)] min-h-[600px]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {t('greeting')}
                      </h2>
              <p className="text-gray-900 mb-6">
                I&apos;m here to help you with leave applications, payslips, policies, and more!
              </p>
            </div>
            {/* Quick Actions inside chat when no messages */}
            <div className="w-full max-w-2xl">
              <QuickActions />
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {/* Show Quick Actions at bottom when there are messages */}
            {!isLoading && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <QuickActions />
              </div>
            )}
          </>
        )}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="bg-gray-50 rounded-lg p-4 max-w-[80%] border border-gray-200">
              <div className="flex items-center gap-2 text-gray-900">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t('chat.thinking')}</span>
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
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('chat.placeholder')}
            className="flex-1 px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
                <span className="hidden md:inline">{t('chat.send')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
