import axios from 'axios';

// Use relative path for Vercel serverless API
const API_BASE_URL = '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface QAResponse {
  answer: string;
  question: string;
  timestamp: string;
}

export interface QARequest {
  question: string;
}

export const askQuestion = async (question: string): Promise<QAResponse> => {
  try {
    const response = await api.post<QAResponse>('/api/ask', { question });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to get answer');
    }
    throw new Error('An unexpected error occurred');
  }
};

export const checkHealth = async (): Promise<{ status: string; timestamp: string }> => {
  // No health endpoint for serverless, so just return OK
  return { status: 'OK', timestamp: new Date().toISOString() };
}; 