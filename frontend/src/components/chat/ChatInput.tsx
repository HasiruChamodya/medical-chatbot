import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, Mic } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSendMessage, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 border-t border-white/10"
    >
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your symptoms..."
            disabled={disabled}
            className="w-full px-5 py-4 bg-secondary rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 disabled:opacity-50"
          />
        </div>
        
        <button
          type="button"
          className="p-3 rounded-xl bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all duration-200"
        >
          <Mic className="w-5 h-5" />
        </button>
        
        <motion.button
          type="submit"
          disabled={!message.trim() || disabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 rounded-2xl bg-gradient-to-r from-primary to-[hsl(199,89%,48%)] text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200"
        >
          <Send className="w-5 h-5" />
        </motion.button>
      </form>
      
      <p className="text-center text-xs text-muted-foreground mt-3">
        This AI provides general guidance only. Always consult a healthcare professional.
      </p>
    </motion.div>
  );
};

export default ChatInput;
