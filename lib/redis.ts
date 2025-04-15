import { Redis } from '@upstash/redis';

// Initialize Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://careful-lynx-52258.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'AcwiAAIjcDEwNjM3ZGZhNjgwMDI0MThhYWFkM2Y2YzdhNTUzNzIyYXAxMA',
});

// Types for conversation storage
export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  agentType?: 'troubleshooting' | 'tenancy';
  hasImage?: boolean;
  imageUrl?: string;
};

export type Conversation = {
  id: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
};

// Function to get a conversation by ID
export async function getConversation(conversationId: string): Promise<Conversation | null> {
  try {
    // Check if this is a valid Redis conversation ID (not a local ID)
    if (conversationId.startsWith('local-')) {
      console.warn('Attempted to fetch a local conversation ID from Redis:', conversationId);
      return null;
    }
    
    const conversation = await redis.get<Conversation>(`conversation:${conversationId}`);
    return conversation;
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return null;
  }
}

// Function to create a new conversation
export async function createConversation(id?: string): Promise<Conversation> {
  const conversationId = id || crypto.randomUUID();
  const now = Date.now();
  
  const conversation: Conversation = {
    id: conversationId,
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
  
  await redis.set(`conversation:${conversationId}`, conversation);
  return conversation;
}

// Function to add a message to a conversation
export async function addMessageToConversation(
  conversationId: string,
  message: Omit<Message, 'id' | 'timestamp'>
): Promise<Message> {
  // Check if this is a local conversation ID (not stored in Redis)
  if (conversationId.startsWith('local-')) {
    console.warn('Cannot add message to local conversation in Redis:', conversationId);
    // Return a dummy message with the provided content
    return {
      id: crypto.randomUUID(),
      ...message,
      timestamp: Date.now(),
    };
  }
  
  const conversation = await getConversation(conversationId);
  
  if (!conversation) {
    // Create a new conversation if it doesn't exist
    console.warn(`Conversation ${conversationId} not found, creating a new one`);
    await createConversation(conversationId);
    return addMessageToConversation(conversationId, message);
  }
  
  const newMessage: Message = {
    id: crypto.randomUUID(),
    ...message,
    timestamp: Date.now(),
  };
  
  conversation.messages.push(newMessage);
  conversation.updatedAt = Date.now();
  
  await redis.set(`conversation:${conversationId}`, conversation);
  
  return newMessage;
}

// Function to get recent conversations
export async function getRecentConversations(limit = 10): Promise<Conversation[]> {
  try {
    const keys = await redis.keys('conversation:*');
    const conversations: Conversation[] = [];
    
    for (const key of keys.slice(0, limit)) {
      const conversation = await redis.get<Conversation>(key);
      if (conversation) {
        conversations.push(conversation);
      }
    }
    
    return conversations.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch (error) {
    console.error('Error fetching recent conversations:', error);
    return [];
  }
}
