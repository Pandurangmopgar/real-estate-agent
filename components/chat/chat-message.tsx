import React from 'react';
// Removed framer-motion import
import { MessageCircle, User, HomeIcon, Wrench } from 'lucide-react';
import { formatDate } from '@/lib/helpers';
import { Message } from '@/lib/redis';

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

  return (
    <div
      className={`flex w-full items-start gap-4 ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`flex max-w-[80%] flex-col gap-2 rounded-lg p-4 ${
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
        
        <div className="prose prose-sm dark:prose-invert">
          {message.hasImage && message.imageUrl && (
            <div className="mb-3 overflow-hidden rounded-md">
              <img 
                src={message.imageUrl} 
                alt="Uploaded property image" 
                className="h-auto max-h-[300px] w-auto object-contain"
              />
            </div>
          )}
          <div className="whitespace-pre-wrap">{message.content}</div>
        </div>
      </div>
    </div>
  );
}
