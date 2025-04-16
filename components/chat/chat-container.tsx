import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatMessage } from '@/components/chat/chat-message';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Upload } from 'lucide-react';
import { addMessageToConversation } from '@/lib/redis';
import { generateTextResponseAction, analyzeImageAction } from '@/app/actions';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  agentType: 'troubleshooting' | 'tenancy';
  hasImage?: boolean;
  imageUrl?: string;
}

interface Conversation {
  id: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

interface ChatContainerProps {
  conversation: Conversation;
  onConversationUpdate: () => void;
}

export function ChatContainer({ conversation, onConversationUpdate }: ChatContainerProps) {
  const [activeTab, setActiveTab] = useState<'troubleshooting' | 'tenancy'>('troubleshooting');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Filter messages based on active agent
  const filteredMessages = useMemo(() => {
    return conversation.messages.filter(message => 
      message.agentType === activeTab
    );
  }, [conversation.messages, activeTab]);

  useEffect(() => {
    console.log('ChatContainer rendered with conversation:', conversation.id);
    console.log('Current messages count:', conversation.messages.length);
    console.log('Messages:', conversation.messages);
  }, [conversation.id, conversation.messages, conversation.messages.length]);

  useEffect(() => {
    // Only scroll to bottom when new messages are added
    if (conversation.messages.length > 0) {
      scrollToBottom();
    }
  }, [conversation.messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  // Process AI responses to be more concise and better formatted with markdown-like syntax
  const processAIResponse = (response: string, maxLength: number = 800): string => {
    // If response is already short, return it as is
    if (response.length <= maxLength) return response;
    
    // Split into paragraphs and process
    const paragraphs = response.split('\n\n');
    
    // If there are multiple paragraphs, keep the first few and add a summary
    if (paragraphs.length > 3) {
      // Keep introduction and key points
      const shortened = paragraphs.slice(0, 2).join('\n\n');
      
      // Add a brief summary if needed
      if (shortened.length < maxLength) {
        return shortened + '\n\n**In summary:** ' + paragraphs[paragraphs.length - 1];
      }
      return shortened.substring(0, maxLength) + '...';
    }
    
    // Format headings and lists to improve readability
    const enhanceFormatting = (text: string): string => {
      // Convert plain text patterns to markdown-like syntax
      return text
        // Convert "Title:" to heading
        .replace(/^([A-Z][^\n:]+):\s*$/gm, '# $1')
        // Convert numbered items to proper list format
        .replace(/^(\d+)\. (.+)$/gm, '$1. $2')
        // Convert bullet points to list items
        .replace(/^[•\-*]\s+(.+)$/gm, '- $1')
        // Highlight important terms
        .replace(/(Important|Note|Warning|Caution):/g, '**$1:**')
        // Enhance key terms
        .replace(/([A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)+):/g, '**$1:**');
    };
    
    // Just truncate with ellipsis if it's one long paragraph, but enhance formatting first
    return enhanceFormatting(response.substring(0, maxLength)) + '...';
  };

  const handleSendMessage = async (content: string, imageData?: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    // Determine which agent to use based on the active tab
    const currentAgentType = activeTab;
    console.log('Current active agent:', currentAgentType);
    
    // Create user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: Date.now(),
      agentType: currentAgentType, // Use the currently selected tab's agent
      hasImage: !!imageData,
      imageUrl: imageData ? `data:image/jpeg;base64,${imageData}` : undefined,
    };
    
    console.log('Sending message:', userMessage);
    
    // Add message to local state first for immediate UI update
    const updatedMessages = [...conversation.messages, userMessage];
    
    // Create a new conversation object instead of mutating the existing one
    const updatedConversation = {
      ...conversation,
      messages: updatedMessages,
      updatedAt: Date.now()
    };
    
    // Replace the conversation reference with the updated one
    Object.assign(conversation, updatedConversation);
    
    console.log('Updated conversation:', conversation);
    
    // Try to update Redis, but don't block the UI
    try {
      await addMessageToConversation(conversation.id, {
        role: userMessage.role,
        content: userMessage.content,
        agentType: userMessage.agentType,
        hasImage: userMessage.hasImage,
        imageUrl: userMessage.imageUrl,
      });
    } catch (error) {
      console.error('Error adding user message to Redis:', error);
      // Continue with local state only
    }
    
    // Update the UI immediately
    onConversationUpdate();
    
    try {
      let response: string = '';
      let responseAgentType = currentAgentType; // Default to current tab
      
      // If we have an image, force troubleshooting agent regardless of tab
      if (imageData) {
        // Force switch to troubleshooting for image analysis
        responseAgentType = 'troubleshooting';
        
        // If we're not already on the troubleshooting tab, switch to it
        if (activeTab !== 'troubleshooting') {
          setActiveTab('troubleshooting');
        }
        
        const rawResponse = await analyzeImageAction(
          imageData,
          `Analyze this property image and identify any issues or problems. Keep your response concise and focused on key issues. ${content ? `The user asks: ${content}` : 'What issues can you identify in this image?'}`
        );
        response = processAIResponse(rawResponse);
      } else {
        // For text queries, respect the selected tab and don't auto-switch
        try {
          if (currentAgentType === 'troubleshooting') {
            const rawResponse = await generateTextResponseAction(content, 'troubleshooting');
            response = processAIResponse(rawResponse);
          } else if (currentAgentType === 'tenancy') {
            const rawResponse = await generateTextResponseAction(content, 'tenancy');
            response = processAIResponse(rawResponse);
          }
          console.log('Response received from', responseAgentType, ':', response ? response.substring(0, 50) + '...' : 'No response');
        } catch (error) {
          console.error('Error generating response:', error);
          response = 'Sorry, I encountered an error while processing your request. Please try again.';
        }
      }
      
      // Wait a moment before sending response (optional)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create assistant message
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
        agentType: responseAgentType, // Use the determined agent type
      };
      
      console.log('Adding assistant message to conversation:', assistantMessage);
      
      // Add to local state
      const finalMessages = [...updatedMessages, assistantMessage];
      
      // Create a new conversation object
      const finalConversation = {
        ...conversation,
        messages: finalMessages,
        updatedAt: Date.now()
      };
      
      // Replace the conversation reference with the updated one
      Object.assign(conversation, finalConversation);
      
      console.log('Final conversation state:', conversation);
      
      // Try to update Redis, but don't block the UI
      try {
        await addMessageToConversation(conversation.id, {
          role: assistantMessage.role,
          content: assistantMessage.content,
          agentType: assistantMessage.agentType,
        });
      } catch (error) {
        console.error('Error adding assistant message to Redis:', error);
        // Continue with local state only
      }
      
      // Update the UI
      onConversationUpdate();
    } catch (error) {
      console.error('Error generating response:', error);
      
      // Create error message for local state
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: Date.now(),
        agentType: activeTab,
      };
      
      // Add to local state
      const errorMessages = [...updatedMessages, errorMessage];
      
      // Update conversation with error message
      const errorConversation = {
        ...conversation,
        messages: errorMessages,
        updatedAt: Date.now()
      };
      
      // Replace the conversation reference with the updated one
      Object.assign(conversation, errorConversation);
      
      // Try to update Redis, but don't block the UI
      try {
        await addMessageToConversation(conversation.id, {
          role: errorMessage.role,
          content: errorMessage.content,
          agentType: errorMessage.agentType,
        });
      } catch (redisError) {
        console.error('Error adding error message to Redis:', redisError);
        // Continue with local state only
      }
      
      onConversationUpdate();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => {
          // Clear loading state when switching tabs
          setIsLoading(false);
          setActiveTab(value as 'troubleshooting' | 'tenancy');
        }}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="troubleshooting">Troubleshooting Agent</TabsTrigger>
          <TabsTrigger value="tenancy">Tenancy FAQ Agent</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Tabs content */}
      <div className="flex-1 overflow-y-auto p-2 pb-4">
        <div>
          <AnimatePresence mode="wait">
            {filteredMessages.length === 0 ? (
              <motion.div 
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-full flex-col items-center justify-center text-center"
              >
                <h3 className="mb-2 text-xl font-semibold">
                  Welcome to the {activeTab === 'troubleshooting' ? 'Troubleshooting' : 'Tenancy FAQ'} Agent
                </h3>
                <p className="mb-4 max-w-md text-muted-foreground">
                  {activeTab === 'troubleshooting'
                    ? 'Upload an image of your property issue and ask questions about repairs, maintenance, or troubleshooting.'
                    : 'Ask questions about rental laws, agreements, tenant rights, or landlord responsibilities.'}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="messages"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full"
              >
                {filteredMessages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                  />
                ))}
                
                {/* Loading animation when waiting for response */}
                {isLoading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4"
                  >
                    <LoadingIndicator agentType={activeTab} />
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="border-t p-2 sticky bottom-0 bg-background shadow-md z-10 dark:bg-background/95 dark:backdrop-blur">
        <ChatInput
          onSendMessage={handleSendMessage}
          isDisabled={isLoading}
          isAgentTyping={isLoading}
          agentType={activeTab}
        />
      </div>
    </div>
  );
}