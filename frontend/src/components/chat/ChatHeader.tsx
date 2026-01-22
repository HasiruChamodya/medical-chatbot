import { motion } from "framer-motion";
import { Stethoscope, Sparkles } from "lucide-react";

const ChatHeader = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 p-6 border-b border-white/10"
    >
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-[hsl(199,89%,48%)] flex items-center justify-center shadow-lg animate-pulse-glow">
          <Stethoscope className="w-7 h-7 text-primary-foreground" />
        </div>
        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-online rounded-full border-2 border-card" />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-foreground">Medical Assistant</h1>
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground">AI-powered health guidance</p>
      </div>
      
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-online/10 border border-online/20">
        <span className="w-2 h-2 bg-online rounded-full animate-pulse" />
        <span className="text-xs text-online font-medium">Online</span>
      </div>
    </motion.div>
  );
};

export default ChatHeader;
