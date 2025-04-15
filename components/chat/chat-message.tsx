import React from 'react';
import { motion } from 'framer-motion';
import { User, HomeIcon, Wrench } from 'lucide-react';
import { formatDate } from '@/lib/helpers';
import { Message } from '@/lib/redis';
import { formatMessageContent } from '@/lib/message-formatter';

interface ChatMessageProps {
  message: Message;
  isLast: boolean;
}

export function ChatMessage({ message, isLast }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  const getAgentIcon = () => {
    if (isUser) return <User className="h-6 w-6" />;
    
    if (message.agentType === 'troubleshooting') {
      return <Wrench className="h-6 w-6" />;
    } else {
      return <HomeIcon className="h-6 w-6" />;
    }
  };

  // Animation variants for messages
  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={messageVariants}
      className={`flex w-full items-start gap-4 mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <motion.div
        whileHover={{ scale: 1.01 }}
        className={`flex max-w-[80%] flex-col gap-2 rounded-lg p-4 shadow-sm ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground'
        }`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              isUser ? 'bg-primary-foreground text-primary' : 'bg-background text-foreground'
            }`}
          >
            {getAgentIcon()}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {isUser ? 'You' : message.agentType === 'troubleshooting' 
                ? 'Troubleshooting Agent' 
                : 'Tenancy FAQ Agent'}
            </span>
            <span className="text-xs opacity-70">
              {formatDate(message.timestamp)}
            </span>
          </div>
        </div>
        
        <div className="prose prose-sm dark:prose-invert max-w-full">
          {message.hasImage && message.imageUrl && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-3 overflow-hidden rounded-md"
            >
              <img 
                src={message.imageUrl} 
                alt="Uploaded property image" 
                className="h-auto max-h-[300px] w-auto object-contain rounded-md"
              />
            </motion.div>
          )}
          <div 
            className="message-content" 
            dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
