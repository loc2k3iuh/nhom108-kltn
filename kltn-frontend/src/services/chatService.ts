import axiosInstance from '@/lib/axios';
import { ChatResponse } from '@/types/chat';

const BASE_URL = import.meta.env.VITE_API_BASE_URL; // This should be 'http://localhost:9999'

export const sendMessage = async (message: string): Promise<ChatResponse> => {
  try {
    // Construct the absolute URL to override the default baseURL prefix
    const absoluteUrl = `${BASE_URL}/chat`;
    const response = await axiosInstance.post<ChatResponse>(absoluteUrl, { message });
    return response.data;
  } catch (error) {
    console.error('Error sending message to chatbot API:', error);
    throw new Error('Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.');
  }
};
