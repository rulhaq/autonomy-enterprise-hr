'use client';

import { ChatMessage } from '@/lib/types';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`flex-1 ${isUser ? 'flex justify-end' : ''}`}>
        <div
          className={`inline-block max-w-[80%] md:max-w-[70%] rounded-lg p-4 ${
            isUser
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-900 border border-gray-200'
          }`}
        >
          <div className="prose max-w-none">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className={`mb-2 last:mb-0 ${isUser ? 'text-white' : 'text-gray-900'}`}>{children}</p>,
                ul: ({ children }) => <ul className={`list-disc list-inside mb-2 ${isUser ? 'text-white' : 'text-gray-900'}`}>{children}</ul>,
                ol: ({ children }) => <ol className={`list-decimal list-inside mb-2 ${isUser ? 'text-white' : 'text-gray-900'}`}>{children}</ol>,
                li: ({ children }) => <li className={`mb-1 ${isUser ? 'text-white' : 'text-gray-900'}`}>{children}</li>,
                strong: ({ children }) => <strong className={`font-semibold ${isUser ? 'text-white' : 'text-gray-900'}`}>{children}</strong>,
                code: ({ children }) => (
                  <code className={`${isUser ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-900'} px-2 py-1 rounded text-sm`}>{children}</code>
                ),
                blockquote: ({ children }) => (
                  <blockquote className={`border-l-4 ${isUser ? 'border-white/30 text-white' : 'border-gray-400 text-gray-900'} pl-4 italic`}>
                    {children}
                  </blockquote>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
          <div className={`text-xs mt-2 ${isUser ? 'text-white/80 text-right' : 'text-gray-600 text-left'}`}>
            {format(new Date(message.timestamp), 'HH:mm')}
          </div>
        </div>
      </div>
    </div>
  );
}

