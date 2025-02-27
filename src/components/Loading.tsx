"use client";

import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50">
      <motion.div
        className="w-12 h-12 border-4 border-gray-300 dark:border-gray-600 border-t-gray-900 dark:border-t-gray-50 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default Loading;
