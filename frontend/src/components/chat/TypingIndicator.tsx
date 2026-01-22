import { motion } from "framer-motion";
import { Stethoscope } from "lucide-react";

const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-end gap-3"
    >
      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
        <Stethoscope className="w-5 h-5 text-primary" />
      </div>
      
      <div className="px-5 py-4 rounded-2xl rounded-bl-md bg-secondary border border-white/5">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-primary rounded-full animate-typing-1" />
          <span className="w-2 h-2 bg-primary rounded-full animate-typing-2" />
          <span className="w-2 h-2 bg-primary rounded-full animate-typing-3" />
        </div>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;
