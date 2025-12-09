import { useChatStore } from '@/stores/useChatStore';
import ChatWindow from './ChatWindow';
import { MessageCircle } from 'lucide-react';

const Chatbot = () => {
  const { isOpen, toggleChat } = useChatStore();

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-5 right-5 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 z-[9999]"
        aria-label="Mở chatbot"
      >
        <MessageCircle size={24} />
      </button>
      {isOpen && <ChatWindow onClose={toggleChat} />}
    </>
  );
};

export default Chatbot;
