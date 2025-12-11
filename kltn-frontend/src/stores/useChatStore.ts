import { create } from 'zustand';
import { Message } from '@/types/chat';
import { sendMessage } from '@/services/chatService';

// Simple ID generator to replace uuid
const generateId = () => `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

interface ChatState {
  messages: Message[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  toggleChat: () => void;
  addMessage: (message: Omit<Message, 'id'>) => Promise<void>;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [
    {
      id: generateId(),
      text: 'Chào bạn! Tôi là trợ lý ảo của DAVINCI. Tôi có thể giúp gì cho bạn?',
      sender: 'bot',
    },
  ],
  isOpen: false,
  isLoading: false,
  error: null,
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  addMessage: async (message) => {
    const userMessage: Message = { ...message, id: generateId() };
    set((state) => ({
      messages: [...state.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      const response = await sendMessage(message.text);
      const botMessage: Message = {
        id: generateId(),
        text: response.responseMessage,
        sender: 'bot',
        products: response.products?.content,
      };
      set((state) => ({
        messages: [...state.messages, botMessage],
        isLoading: false,
      }));
    } catch (e: any) {
      const errorMessage: Message = {
        id: generateId(),
        text: e.message || 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.',
        sender: 'bot',
      };
      set((state) => ({
        messages: [...state.messages, errorMessage],
        isLoading: false,
        error: e.message || 'An unknown error occurred.',
      }));
    }
  },
}));
