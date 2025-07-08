'use client';

import React from 'react';
import { MessageCircle, User, Bot } from 'lucide-react';

interface Message {
  id: string;
  type: 'question' | 'answer';
  content: string;
  timestamp: string;
}

interface ChatBoxProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages, isLoading }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-lg">
      {messages.length === 0 && !isLoading && (
        <div className="text-center text-gray-500 py-8">
          <MessageCircle className="mx-auto h-12 w-12 mb-4 text-gray-300" />
          <p className="text-lg font-medium">Ask me anything about Canopy!</p>
          <p className="text-sm">I can help you learn about our remote monitoring and management platform.</p>
        </div>
      )}
      
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-3 ${
            message.type === 'question' ? 'justify-end' : 'justify-start'
          }`}
        >
          {message.type === 'answer' && (
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
            </div>
          )}
          
          <div
            className={`max-w-[80%] rounded-lg px-4 py-3 ${
              message.type === 'question'
                ? 'bg-blue-600 text-gray-900'
                : 'bg-white text-gray-800 border border-gray-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {message.type === 'question' && (
                <User className="w-4 h-4" />
              )}
              <span className="text-xs opacity-70">
                {message.type === 'question' ? 'You' : 'Canopy Assistant'}
              </span>
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
            <div className="text-xs opacity-50 mt-2">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
          
          {message.type === 'question' && (
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          )}
        </div>
      ))}
      
      {isLoading && (
        <div className="flex gap-3 justify-start">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="bg-white text-gray-800 border border-gray-200 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs opacity-70">Canopy Assistant</span>
            </div>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox; 