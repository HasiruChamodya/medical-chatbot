import { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import ChatInput from "./ChatInput";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

const initialMessages: Message[] = [
  {
    id: "1",
    text: "Hello! I'm your AI Medical Assistant. I'm here to help you understand your symptoms and provide general health guidance. How can I assist you today?",
    isUser: false,
    timestamp: "Just now",
  },
];

const botResponses = [
  "Based on what you've described, this could be related to several conditions. Can you tell me more about when these symptoms started?",
  "I understand. It's important to monitor these symptoms. Have you experienced any other changes in your health recently?",
  "Thank you for sharing that information. While I can provide general guidance, I recommend consulting with a healthcare professional for a proper diagnosis.",
  "That's helpful to know. Let me provide some general information that might be useful, but please remember to seek professional medical advice.",
  "I've noted your symptoms. For your safety, if symptoms worsen or you experience severe discomfort, please seek immediate medical attention.",
];

const ChatContainer = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleSendMessage = async (text: string) => {
    // 1. Add User Message to UI immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: formatTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // 2. Prepare Data for Flask (app.py expects Form Data)
      const formData = new FormData();
      formData.append('msg', text);

      // 3. Send Request to your Python Backend
      const response = await fetch("http://localhost:8080/get", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // 4. Get the answer text
      const data = await response.text();

      // 5. Add Bot Message to UI
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data,
        isUser: false,
        timestamp: formatTime(),
      };
      setMessages((prev) => [...prev, botResponse]);

    } catch (error) {
      console.error("Error fetching response:", error);
      // Optional: Add an error message to the chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting to the server.",
        isUser: false,
        timestamp: formatTime(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto h-[90vh] max-h-[800px] glass-card rounded-3xl overflow-hidden flex flex-col shadow-2xl shadow-black/40">
      <ChatHeader />
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message.text}
            isUser={message.isUser}
            timestamp={message.timestamp}
          />
        ))}
        
        <AnimatePresence>
          {isTyping && <TypingIndicator />}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </div>
  );
};

export default ChatContainer;
