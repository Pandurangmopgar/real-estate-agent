import React from 'react';
import { motion } from 'framer-motion';
import { User, HomeIcon, Wrench, Building2 } from 'lucide-react';
import Image from 'next/image';
import { formatDate } from '@/lib/helpers';
import { Message } from '@/lib/redis';
import { formatMessageContent } from '@/lib/message-formatter';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  const getAgentIcon = () => {
    if (isUser) return <User className="h-6 w-6" />;
    
    if (message.agentType === 'troubleshooting') {
      return <Wrench className="h-6 w-6" />;
    } else if (message.agentType === 'tenancy') {
      return <HomeIcon className="h-6 w-6" />;
    } else {
      // General agent type
      return <Building2 className="h-6 w-6" />;
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
      className={`flex w-full items-start gap-3 mb-3 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <motion.div
        whileHover={{ scale: 1.01 }}
        className={`flex max-w-[85%] flex-col gap-2 rounded-lg p-4 shadow-sm transition-colors ${
          isUser
            ? 'bg-primary text-primary-foreground dark:bg-primary/90'
            : 'bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-slate-50'
        }`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              isUser ? 'bg-primary-foreground text-primary dark:bg-primary-foreground/90' : 'bg-primary/10 text-primary dark:bg-primary/20'
            }`}
          >
            {getAgentIcon()}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold font-sans">
              {isUser ? 'You' : 
                message.agentType === 'troubleshooting' ? 'Troubleshooting Agent' :
                message.agentType === 'tenancy' ? 'Tenancy FAQ Agent' :
                'Real Estate Agent'}
            </span>
            <span className="text-xs opacity-70 font-sans">
              {formatDate(message.timestamp)}
            </span>
          </div>
        </div>
        
        <div className="prose prose-sm dark:prose-invert max-w-full leading-relaxed transition-colors font-sans">
          {message.hasImage && message.imageUrl && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-3 overflow-hidden rounded-md transition-all"
            >
              <Image 
                src={message.imageUrl} 
                alt="Uploaded property image" 
                width={500}
                height={400}
                className="max-h-[300px] object-contain rounded-md"
                style={{ width: 'auto', height: 'auto' }}
              />
            </motion.div>
          )}
          <div 
            className="message-content font-sans text-[15px] leading-relaxed" 
            dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}