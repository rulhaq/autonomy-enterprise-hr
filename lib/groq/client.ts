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

import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || process.env.GROQ_API_KEY || '',
});

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionOptions {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export async function createChatCompletion(options: ChatCompletionOptions) {
  const {
    messages,
    model = 'llama-3.1-8b-instant',
    temperature = 0.7,
    maxTokens = 2048,
    stream = false,
  } = options;

  try {
    // Validate API key
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || process.env.GROQ_API_KEY;
    if (!apiKey || apiKey === 'your-groq-api-key-here') {
      throw new Error('Groq API key is not configured. Please set NEXT_PUBLIC_GROQ_API_KEY or GROQ_API_KEY environment variable.');
    }

    // Validate messages
    if (!messages || messages.length === 0) {
      throw new Error('Messages array is required and must not be empty');
    }

    // Filter out empty messages
    const validMessages = messages.filter(msg => msg.content && msg.content.trim().length > 0);
    if (validMessages.length === 0) {
      throw new Error('No valid messages found');
    }

    console.log(`Calling Groq API with model: ${model}, messages: ${validMessages.length}`);

    const completion = await groq.chat.completions.create({
      messages: validMessages as any,
      model,
      temperature,
      max_tokens: maxTokens,
      stream,
    });

    return completion;
  } catch (error: any) {
    console.error('Groq API Error:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      code: error.code,
    });
    
    // Provide more helpful error messages
    if (error.message?.includes('API key')) {
      throw new Error('Invalid or missing Groq API key. Please check your environment variables.');
    }
    if (error.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    if (error.status === 401) {
      throw new Error('Unauthorized. Please check your Groq API key.');
    }
    
    throw error;
  }
}

export async function streamChatCompletion(options: ChatCompletionOptions) {
  const {
    messages,
    model = 'llama-3.1-8b-instant',
    temperature = 0.7,
    maxTokens = 2048,
  } = options;

  try {
    const stream = await groq.chat.completions.create({
      messages: messages as any,
      model,
      temperature,
      max_tokens: maxTokens,
      stream: true,
    });

    return stream;
  } catch (error) {
    console.error('Groq Stream Error:', error);
    throw error;
  }
}

export default groq;

