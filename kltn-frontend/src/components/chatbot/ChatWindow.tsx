import { useEffect, useRef } from 'react';
import { useChatStore } from '@/stores/useChatStore';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';

interface ChatWindowProps {
  onClose: () => void;
}

const ChatWindow = ({ onClose }: ChatWindowProps) => {
  const { messages, isLoading, addMessage } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = (text: string) => {
    addMessage({ text, sender: 'user' });
  };

  return (
    <div className="fixed bottom-20 right-5 w-96 h-[60vh] bg-white rounded-lg shadow-xl flex flex-col z-[9999]">
      <header className="p-4 bg-blue-500 text-white rounded-t-lg flex justify-between items-center">
        <h2 className="text-lg font-semibold">Trợ lý ảo DAVINCI</h2>
        <button onClick={onClose} className="text-white hover:text-gray-200">&times;</button>
      </header>
      <main className="flex-grow p-4 overflow-y-auto">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && (
            <div className="flex justify-start mb-4">
                 <div className="rounded-lg px-4 py-2 max-w-sm bg-gray-200 text-gray-800">
                    <p>Bot đang suy nghĩ...</p>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </main>
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
};

export default ChatWindow;
