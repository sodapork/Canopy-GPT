'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Minimize2, Maximize2 } from 'lucide-react';
import ChatBox from './ChatBox';
import InputBar from './InputBar';
import { askQuestion, QAResponse } from '@/lib/api';

interface Message {
  id: string;
  type: 'question' | 'answer';
  content: string;
  timestamp: string;
}

interface QAWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

const QAWidget: React.FC<QAWidgetProps> = ({ isOpen, onToggle, className = '' }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (question: string) => {
    const questionMessage: Message = {
      id: Date.now().toString(),
      type: 'question',
      content: question,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, questionMessage]);
    setIsLoading(true);

    try {
      const response: QAResponse = await askQuestion(question);
      
      const answerMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'answer',
        content: response.answer,
        timestamp: response.timestamp,
      };

      setMessages(prev => [...prev, answerMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'answer',
        content: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105 z-50"
        aria-label="Open Canopy Q&A"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold">Canopy Assistant</h3>
            <p className="text-xs opacity-80">Ask me anything about Canopy</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
            aria-label={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      {!isMinimized && (
        <>
          <div ref={chatBoxRef} className="flex-1 overflow-hidden">
            <ChatBox messages={messages} isLoading={isLoading} />
          </div>
          
          {/* Input Area */}
          <InputBar 
            onSubmit={handleSubmit} 
            isLoading={isLoading}
            disabled={false}
          />
        </>
      )}
    </div>
  );
};

export default QAWidget; 