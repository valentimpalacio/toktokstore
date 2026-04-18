// client/src/components/LoadingScreen.tsx
import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Loader2
          className="w-12 h-12 text-primary animate-spin mb-4"
          strokeWidth={2}
        />
        <motion.p
          className="text-text-muted text-sm"
          initial={{ y: 10 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Loading...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
