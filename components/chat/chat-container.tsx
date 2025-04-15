import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatMessage } from '@/components/chat/chat-message';
import { addMessageToConversation } from '@/lib/redis';
import { generateTextResponseAction, analyzeImageAction, routeToAgentAction } from '@/app/actions';

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

  useEffect(() => {
    console.log('ChatContainer rendered with conversation:', conversation.id);
    console.log('Current messages count:', conversation.messages.length);
    console.log('Messages:', conversation.messages);
  }, [conversation.messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string, imageData?: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    // Create user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: Date.now(),
      agentType: activeTab,
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
      let agentType = activeTab;
      
      // If we have an image, use the troubleshooting agent
      if (imageData) {
        agentType = 'troubleshooting';
        response = await analyzeImageAction(
          imageData,
          `Analyze this property image and identify any issues or problems. ${content ? `The user asks: ${content}` : 'What issues can you identify in this image?'}`
        );
      } else {
        // Detect agent type if not provided
        const detectedAgentType = await routeToAgentAction(content, false);
        
        if (detectedAgentType === 'clarification') {
          response = "I'm not sure if your question is about property troubleshooting or tenancy rights. Could you please provide more details?";
          agentType = 'troubleshooting'; // Default to troubleshooting for clarification messages
        } else {
          agentType = detectedAgentType as 'troubleshooting' | 'tenancy';
          
          console.log('Generating response for agent type:', agentType);
          
          // Generate response based on agent type
          try {
            if (agentType === 'troubleshooting') {
              response = await generateTextResponseAction(content, 'troubleshooting');
            } else {
              response = await generateTextResponseAction(content, 'tenancy');
            }
            console.log('Response received:', response ? response.substring(0, 50) + '...' : 'No response');
          } catch (error) {
            console.error('Error generating response:', error);
            response = 'Sorry, I encountered an error while processing your request. Please try again.';
          }
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
        agentType,
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
      
      // Update active tab if agent type changed
      if (agentType !== activeTab) {
        setActiveTab(agentType);
      }
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
  };

  return (
    <div className="flex h-full flex-col">
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as 'troubleshooting' | 'tenancy')}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="troubleshooting">Troubleshooting Agent</TabsTrigger>
          <TabsTrigger value="tenancy">Tenancy FAQ Agent</TabsTrigger>
        </TabsList>
        
        <div className="mt-4 flex-1 overflow-y-auto p-4">
          <div>
            {conversation.messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <h3 className="mb-2 text-xl font-semibold">
                  Welcome to the {activeTab === 'troubleshooting' ? 'Troubleshooting' : 'Tenancy FAQ'} Agent
                </h3>
                <p className="mb-4 max-w-md text-muted-foreground">
                  {activeTab === 'troubleshooting'
                    ? 'Upload an image of your property issue and ask questions about repairs, maintenance, or troubleshooting.'
                    : 'Ask questions about rental laws, agreements, tenant rights, or landlord responsibilities.'}
                </p>
              </div>
            ) : (
              conversation.messages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isLast={index === conversation.messages.length - 1}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </Tabs>
      
      <div className="border-t p-4">
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
