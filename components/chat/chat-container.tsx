import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Wrench, HomeIcon, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatMessage } from '@/components/chat/chat-message';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
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
  const [isLoading, setIsLoading] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false); // Start with tutorial hidden
  const showTutorialButton = true; // Always show the tutorial button
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // We no longer filter messages by agent type - all messages are shown in a single thread
  const messages = useMemo(() => {
    return conversation.messages;
  }, [conversation.messages]);

  // Render welcome message
  const renderWelcomeMessage = () => {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 max-w-2xl mx-auto h-full">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="mb-8 p-5 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/30 dark:to-primary/10 text-primary shadow-lg dark:shadow-primary/10 backdrop-blur-sm"
        >
          <HomeIcon className="h-12 w-12" />
        </motion.div>
        
        <motion.h2 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, type: "spring", damping: 12 }}
          className="text-2xl md:text-3xl font-bold mb-5 font-heading bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent pb-1"
        >
          Welcome to the Real Estate Assistant
        </motion.h2>
        
        <motion.p 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground max-w-xl text-[16px] leading-relaxed font-sans mb-8 tracking-wide"
        >
          Ask questions about rental laws, agreements, tenant rights, or landlord responsibilities. 
          If you have a property issue, upload an image and ask about repairs or maintenance.
        </motion.p>
        
        {showTutorialButton && (
          <motion.button
            onClick={() => setShowTutorial(true)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="px-5 py-2.5 bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 text-primary rounded-lg font-medium transition-all duration-300 hover:shadow-md flex items-center gap-2 mb-6"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="relative flex h-3 w-3 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            How to use the assistant
          </motion.button>
        )}
        
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "4rem" }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="h-1 bg-primary/20 dark:bg-primary/30 rounded-full mt-4"
        />
      </div>
    );
  };

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

  async function handleSendMessage(content: string, imageData?: string) {
    if (!content.trim() && !imageData) return;
    
    // Determine which agent to use based on whether an image is uploaded
    const agentType = imageData ? 'troubleshooting' : 'tenancy';
    
    // Create a new message
    const newUserMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: content,
      timestamp: Date.now(),
      agentType: agentType,
      hasImage: !!imageData,
      imageUrl: imageData || undefined
    };
    
    console.log('Sending message:', newUserMessage);
    
    setIsLoading(true);
    
    // Add message to local state first for immediate UI update
    const updatedMessages = [...conversation.messages, newUserMessage];
    
    // Update conversation with new message
    const updatedConversation = {
      ...conversation,
      messages: updatedMessages,
      updatedAt: Date.now()
    };
    
    // Replace the conversation reference with the updated one
    Object.assign(conversation, updatedConversation);
    
    console.log('Updated conversation:', conversation);
    
    // Try to add the message to Redis in the background
    try {
      await addMessageToConversation(conversation.id, {
        role: newUserMessage.role,
        content: newUserMessage.content,
        agentType: newUserMessage.agentType,
        hasImage: newUserMessage.hasImage,
        imageUrl: newUserMessage.imageUrl
      });
    } catch (error) {
      console.error('Error adding message to Redis:', error);
      // Continue with local state only
    }
    
    // Update the UI
    onConversationUpdate();
    
    // Process the message based on agent type
    try {
      let aiResponse;
      
      if (newUserMessage.agentType === 'troubleshooting' && imageData) {
        // For troubleshooting agent with image
        console.log('Processing image with troubleshooting agent');
        aiResponse = await analyzeImageAction(imageData, content);
      } else {
        // For tenancy agent or troubleshooting without image
        console.log(`Processing text with ${newUserMessage.agentType} agent`);
        
        // Use the agent type directly
        aiResponse = await generateTextResponseAction(content, newUserMessage.agentType);
      }
      
      // Process the response to make it more concise and better formatted
      const processedResponse = processAIResponse(aiResponse);
      
      // Create AI response message
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: processedResponse,
        timestamp: Date.now(),
        agentType: newUserMessage.agentType, // Use the same agent type as the user message
      };
      
      console.log('Adding assistant message to conversation:', aiMessage);
      
      // Add to local state
      const finalMessages = [...updatedMessages, aiMessage];
      
      // Create a new conversation object
      const finalConversation = {
        ...conversation,
        messages: finalMessages,
        updatedAt: Date.now()
      };
      
      // Replace the conversation reference with the updated one
      Object.assign(conversation, finalConversation);
      
      console.log('Final conversation state:', conversation);
      
      // Try to add the assistant message to Redis
      try {
        await addMessageToConversation(conversation.id, {
          role: aiMessage.role,
          content: aiMessage.content,
          agentType: aiMessage.agentType,
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
        agentType: messages.length > 0 ? messages[messages.length - 1].agentType : 'tenancy',
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

  // Tutorial overlay component
  const renderTutorialOverlay = () => {
    if (!showTutorial) return null;
    
    return (
      <motion.div 
        className="fixed inset-0 bg-black/70 dark:bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowTutorial(false)}
      >
        <motion.div 
          className="relative bg-card dark:bg-card/95 border border-primary/20 dark:border-primary/30 rounded-2xl p-8 w-full max-w-2xl mx-auto shadow-2xl overflow-hidden"
          initial={{ scale: 0.85, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.85, y: 30, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Animated background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 dark:bg-primary/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 dark:bg-primary/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary/5 dark:bg-primary/10 rounded-full blur-2xl"></div>
          
          {/* Close button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowTutorial(false);
            }}
            className="absolute top-5 right-5 text-foreground/70 hover:text-foreground transition-colors p-2 rounded-full hover:bg-primary/10 dark:hover:bg-primary/20 z-10"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="relative z-10">
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="p-3 bg-primary/15 dark:bg-primary/25 rounded-full shadow-sm">
                <HomeIcon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold text-primary">How to use the assistant</h3>
            </motion.div>
            
            <div className="flex flex-col gap-5">
              <motion.div 
                className="flex items-start gap-4 bg-background/50 dark:bg-background/20 p-4 rounded-lg border border-primary/5 dark:border-primary/10"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-2.5 mt-1">
                  <HomeIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Tenancy Questions</p>
                  <p className="text-sm text-muted-foreground mt-1">For rental laws, agreements, and rights. Simply type your question.</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start gap-4 bg-background/50 dark:bg-background/20 p-4 rounded-lg border border-primary/5 dark:border-primary/10"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-2.5 mt-1">
                  <Wrench className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Property Issues</p>
                  <p className="text-sm text-muted-foreground mt-1">For repairs and maintenance help. Upload an image with your question.</p>
                </div>
              </motion.div>
              
              {/* Graphical animation */}
              <motion.div
                className="mt-4 p-5 rounded-xl border border-primary/15 dark:border-primary/25 bg-background/40 dark:bg-background/20 shadow-md"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <div className="flex flex-col items-center">
                  <p className="text-base font-medium text-foreground mb-4">How it works:</p>
                  <div className="relative w-full h-20 flex items-center justify-between px-6 mb-2">
                    {/* User input animation */}
                    <motion.div 
                      className="flex items-center gap-2 bg-background p-2 rounded-lg border border-primary/10 dark:border-primary/20 shadow-sm"
                      initial={{ x: 0, opacity: 0 }}
                      animate={{
                        x: [0, 20, 20, 0],
                        opacity: [0, 1, 1, 0]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        repeatDelay: 1
                      }}
                    >
                      <span className="text-xs">Your question</span>
                      <Send className="h-3 w-3 text-primary" />
                    </motion.div>
                    
                    {/* Processing animation */}
                    <motion.div 
                      className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-1"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: [0, 1, 1, 0]
                      }}
                      transition={{ 
                        duration: 3, 
                        delay: 1,
                        repeat: Infinity, 
                        repeatDelay: 1
                      }}
                    >
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </motion.div>
                    
                    {/* Response animation */}
                    <motion.div 
                      className="flex items-center gap-2 bg-primary/10 dark:bg-primary/20 p-2 rounded-lg border border-primary/10 dark:border-primary/20 shadow-sm"
                      initial={{ x: 0, opacity: 0 }}
                      animate={{
                        x: [0, -20, -20, 0],
                        opacity: [0, 0, 1, 0]
                      }}
                      transition={{ 
                        duration: 3, 
                        delay: 2,
                        repeat: Infinity, 
                        repeatDelay: 1
                      }}
                    >
                      <span className="text-xs">Smart answer</span>
                      <HomeIcon className="h-3 w-3 text-primary" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <motion.button 
              onClick={(e) => {
                e.stopPropagation();
                setShowTutorial(false);
              }}
              className="mt-8 w-full px-5 py-4 bg-primary text-primary-foreground rounded-lg font-medium text-lg transition-all duration-300 hover:bg-primary/90 shadow-md hover:shadow-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Got it
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="flex h-full flex-col relative">
      
      <div className="flex-1 overflow-y-auto">
        <div className="h-full">
          <AnimatePresence mode="wait">
            {messages.length === 0 ? (
              <motion.div 
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="flex h-full flex-col items-center justify-center"
              >
                {renderWelcomeMessage()}
              </motion.div>
            ) : (
              <motion.div
                key="messages"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full p-4"
              >
                {messages.map((message) => (
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
                    <LoadingIndicator agentType={messages.length > 0 ? messages[messages.length - 1].agentType : 'tenancy'} />
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="border-t p-3 sticky bottom-0 bg-background/95 shadow-md z-10 dark:bg-background/90 dark:backdrop-blur-sm">
        <ChatInput
          onSendMessage={handleSendMessage}
          isDisabled={isLoading}
          isAgentTyping={isLoading}
          agentType="unified"
        />
      </div>
      
      {/* Tutorial overlay */}
      <AnimatePresence>
        {renderTutorialOverlay()}
      </AnimatePresence>
    </div>
  );
}