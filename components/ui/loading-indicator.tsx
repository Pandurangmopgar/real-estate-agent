import React from 'react';
import { motion } from 'framer-motion';

interface LoadingIndicatorProps {
  agentType: 'troubleshooting' | 'tenancy' | 'general';
}

export function LoadingIndicator({ agentType }: LoadingIndicatorProps) {
  // Determine color based on agent type
  let color: string;
  switch (agentType) {
    case 'troubleshooting':
      color = 'bg-blue-600';
      break;
    case 'tenancy':
      color = 'bg-green-600';
      break;
    case 'general':
      color = 'bg-purple-600';
      break;
    default:
      color = 'bg-primary';
  }
  
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
        {agentType === 'troubleshooting' ? 'Troubleshooting Agent' : 
         agentType === 'tenancy' ? 'Tenancy FAQ Agent' : 
         'Real Estate Agent'} is thinking...
      </motion.span>
    </motion.div>
  );
}