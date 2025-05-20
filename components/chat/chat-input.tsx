"use client";

import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import clsx from "clsx";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSendMessage, disabled = false }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || disabled) return;
    
    onSendMessage(message);
    setMessage("");
  };
  
    return (
    <form 
      onSubmit={handleSubmit}
      className="flex items-center gap-2 bg-white border-t border-gray-200 p-3 w-full"
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escribe un mensaje..."
        className="flex-1 min-w-0 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 overflow-hidden text-ellipsis"
        disabled={disabled}
        maxLength={1000}
      />
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className={clsx(
          "p-2 rounded-full",
          message.trim() && !disabled
            ? "bg-purple-500 text-white hover:bg-purple-600" 
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        )}
      >
        <SendHorizontal size={20} />
      </button>
    </form>
  );
};

export default ChatInput;
