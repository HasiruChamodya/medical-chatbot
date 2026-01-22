import { motion } from "framer-motion";
import { User, Stethoscope } from "lucide-react";

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  timestamp: string;
}

const MessageBubble = ({ message, isUser, timestamp }: MessageBubbleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex items-end gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <div 
        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isUser 
            ? "bg-gradient-to-br from-primary to-[hsl(199,89%,48%)]" 
            : "bg-secondary"
        }`}
      >
        {isUser ? (
          <User className="w-5 h-5 text-primary-foreground" />
        ) : (
          <Stethoscope className="w-5 h-5 text-primary" />
        )}
      </div>
      
      <div className={`max-w-[75%] ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        <div
          className={`px-5 py-3.5 rounded-2xl ${
            isUser
              ? "bg-gradient-to-br from-primary to-[hsl(199,89%,48%)] text-primary-foreground rounded-br-md"
              : "bg-secondary text-foreground rounded-bl-md border border-white/5"
          }`}
        >
          <p className="text-sm leading-relaxed">{message}</p>
        </div>
        <span className="text-xs text-muted-foreground mt-1.5 px-2">{timestamp}</span>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
