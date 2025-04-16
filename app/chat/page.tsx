"use client";

import React, { useState, useEffect } from 'react';
// Removed framer-motion import
import { ChatContainer } from '@/components/chat/chat-container';
import { Conversation, createConversation, getConversation } from '@/lib/redis';

export default function ChatPage() {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeConversation = async () => {
      try {
        // Check for existing conversation ID in localStorage
        const storedConversationId = localStorage.getItem('currentConversationId');
        
        let currentConversation: Conversation | null = null;
        
        if (storedConversationId) {
          try {
            // Try to fetch existing conversation
            currentConversation = await getConversation(storedConversationId);
          } catch (error) {
            console.error('Error fetching conversation:', error);
            // Clear the invalid conversation ID
            localStorage.removeItem('currentConversationId');
          }
        }
        
        // If no stored conversation or couldn't fetch it, create a new one or use a local fallback
        if (!currentConversation) {
          try {
            currentConversation = await createConversation();
            localStorage.setItem('currentConversationId', currentConversation.id);
          } catch (error) {
            console.error('Error creating conversation in Redis, using local fallback:', error);
            // Create a local fallback conversation
            const fallbackId = `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
            currentConversation = {
              id: fallbackId,
              messages: [],
              createdAt: Date.now(),
              updatedAt: Date.now()
            };
            localStorage.setItem('currentConversationId', fallbackId);
          }
        }
        
        setConversation(currentConversation);
      } catch (error) {
        console.error('Error initializing conversation:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeConversation();
  }, []);

  const handleConversationUpdate = async () => {
    if (!conversation) return;
    
    // Check if this is a local conversation (not stored in Redis)
    if (conversation.id.startsWith('local-')) {
      // For local conversations, we rely on the ChatContainer to update the messages
      // The actual state update happens in the ChatContainer component
      return;
    }
    
    try {
      const updatedConversation = await getConversation(conversation.id);
      if (updatedConversation) {
        setConversation(updatedConversation);
      }
    } catch (error) {
      console.error('Error updating conversation from Redis:', error);
      // If we can't get the updated conversation from Redis, we'll continue with local state
      // The ChatContainer component will handle the local state updates
    }
  };

  const startNewConversation = async () => {
    try {
      setIsLoading(true);
      const newConversation = await createConversation();
      localStorage.setItem('currentConversationId', newConversation.id);
      setConversation(newConversation);
    } catch (error) {
      console.error('Error creating new conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex h-[calc(100vh-4rem)] flex-col py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Multi-Agent Real Estate Assistant</h1>
        <button
          onClick={startNewConversation}
          className="rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          disabled={isLoading}
        >
          New Conversation
        </button>
      </div>
      
      <div className="flex-1 overflow-hidden rounded-lg border">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : conversation ? (
          <ChatContainer 
            conversation={conversation} 
            onConversationUpdate={handleConversationUpdate} 
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Failed to load conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}