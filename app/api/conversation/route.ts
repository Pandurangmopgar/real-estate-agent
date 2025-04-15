import { NextRequest, NextResponse } from 'next/server';
import { createConversation, getConversation, getRecentConversations } from '@/lib/redis';

export async function POST(request: NextRequest) {
  try {
    // Create a new conversation
    const conversation = await createConversation();
    
    return NextResponse.json({ conversation });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const conversationId = searchParams.get('id');
    
    if (conversationId) {
      // Get a specific conversation
      const conversation = await getConversation(conversationId);
      
      if (!conversation) {
        return NextResponse.json(
          { error: 'Conversation not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ conversation });
    } else {
      // Get recent conversations
      const limit = parseInt(searchParams.get('limit') || '10', 10);
      const conversations = await getRecentConversations(limit);
      
      return NextResponse.json({ conversations });
    }
  } catch (error) {
    console.error('Error fetching conversation(s):', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversation(s)' },
      { status: 500 }
    );
  }
}
