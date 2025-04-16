"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChatContainer } from '@/components/chat/chat-container';
import { ThemeToggle } from '@/components/ui/theme-toggle';
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
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors">
      {/* Background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background dark:from-primary/10 dark:via-background dark:to-background"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 dark:bg-primary/15 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/15 dark:bg-primary/20 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto flex h-screen flex-col py-4 relative z-10">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold font-heading bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Multi-Agent Real Estate Assistant</h1>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <motion.button
            onClick={startNewConversation}
            className="relative rounded-lg border border-primary/20 bg-background/80 backdrop-blur-sm px-4 py-2 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 dark:border-primary/30 dark:hover:border-primary/50 dark:hover:bg-primary/10 flex items-center gap-2"
            disabled={isLoading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>New Conversation</span>
          </motion.button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden rounded-xl border border-primary/10 dark:border-primary/20 shadow-lg backdrop-blur-sm bg-card/30 dark:bg-card/20 h-[calc(100%-2rem)]">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="relative">
              <div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              <div className="absolute inset-0 h-10 w-10 rounded-full border-2 border-primary/10 border-b-transparent animate-spin animation-delay-500" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            </div>
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
    </div>
  );
}