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

import { create } from 'zustand';
import { ChatMessage, User } from '@/lib/types';
import { SupportedLanguage } from '@/lib/utils/language';

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  currentUser: User | null;
  language: SupportedLanguage;
  conversationId: string | null;
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setLoading: (loading: boolean) => void;
  setCurrentUser: (user: User | null) => void;
  setLanguage: (lang: SupportedLanguage) => void;
  setConversationId: (id: string | null) => void;
  clearMessages: () => void;
  getState: () => ChatState;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  currentUser: null,
  language: 'en',
  conversationId: null,
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
  setLoading: (isLoading) => set({ isLoading }),
  setCurrentUser: (currentUser) => set({ currentUser }),
  setLanguage: (language) => set({ language }),
  setConversationId: (conversationId) => set({ conversationId }),
  clearMessages: () => set({ messages: [] }),
  getState: () => get(),
}));

