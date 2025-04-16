import React from 'react';
import { motion } from 'framer-motion';

interface LoadingIndicatorProps {
  agentType: 'troubleshooting' | 'tenancy';
}

export function LoadingIndicator({ agentType }: LoadingIndicatorProps) {
  const color = agentType === 'troubleshooting' ? 'bg-blue-600' : 'bg-green-600';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center space-x-2 p-3 rounded-lg bg-muted"
    >
      <div className="flex space-x-1.5">
        <motion.div 
          className={`w-2 h-2 rounded-full ${color}`}
          animate={{ 
            y: [0, -6, 0],
            opacity: [1, 0.5, 1]
          }}
          transition={{ 
            duration: 1.2, 
            repeat: Infinity, 
            ease: "easeInOut",
            times: [0, 0.5, 1],
            delay: 0
          }}
        />
        <motion.div 
          className={`w-2 h-2 rounded-full ${color}`}
          animate={{ 
            y: [0, -6, 0],
            opacity: [1, 0.5, 1]
          }}
          transition={{ 
            duration: 1.2, 
            repeat: Infinity, 
            ease: "easeInOut",
            times: [0, 0.5, 1],
            delay: 0.2
          }}
        />
        <motion.div 
          className={`w-2 h-2 rounded-full ${color}`}
          animate={{ 
            y: [0, -6, 0],
            opacity: [1, 0.5, 1]
          }}
          transition={{ 
            duration: 1.2, 
            repeat: Infinity, 
            ease: "easeInOut",
            times: [0, 0.5, 1],
            delay: 0.4
          }}
        />
      </div>
      <motion.span 
        className="text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {agentType === 'troubleshooting' ? 'Troubleshooting Agent' : 'Tenancy FAQ Agent'} is thinking...
      </motion.span>
    </motion.div>
  );
}