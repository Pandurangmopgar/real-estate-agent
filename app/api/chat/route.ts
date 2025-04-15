import { NextRequest, NextResponse } from 'next/server';
import { generateTextResponseAction, analyzeImageAction, routeToAgentAction } from '@/app/actions';
import { addMessageToConversation, getConversation } from '@/lib/redis';

// Enable more detailed logging
const DEBUG = true;

function log(...args: any[]) {
  if (DEBUG) {
    console.log('[API]', ...args);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { conversationId, message, imageData } = await request.json();
    
    log('Received chat request:', { conversationId, message: message?.content, hasImage: !!imageData });
    
    if (!conversationId || !message) {
      log('Error: Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get the conversation
    const conversation = await getConversation(conversationId);
    
    if (!conversation) {
      log('Error: Conversation not found:', conversationId);
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }
    
    log('Retrieved conversation:', { id: conversation.id, messageCount: conversation.messages.length });
    
    // Determine which agent should handle the request
    const agentType = imageData 
      ? 'troubleshooting' 
      : await routeToAgentAction(message.content, false);
      
    log('Selected agent type:', agentType);
    
    // Add user message to conversation
    const userMessage = await addMessageToConversation(conversationId, {
      role: 'user',
      content: message.content,
      agentType: agentType === 'clarification' ? 'troubleshooting' : agentType,
      hasImage: !!imageData,
      imageUrl: imageData ? `data:image/jpeg;base64,${imageData}` : undefined,
    });
    
    // Generate response based on agent type and input
    let responseText: string;
    
    log('Generating response for agent type:', agentType);
    
    try {
      if (agentType === 'clarification') {
        responseText = "I'm not sure if your question is about property troubleshooting or tenancy rights. Could you please provide more details?";
        log('Using clarification response');
      } else if (agentType === 'troubleshooting' && imageData) {
        log('Analyzing image...');
        responseText = await analyzeImageAction(
          imageData,
          `Analyze this property image and identify any issues or problems. ${message.content ? `The user asks: ${message.content}` : 'What issues can you identify in this image?'}`
        );
      } else if (agentType === 'troubleshooting') {
        log('Generating troubleshooting response...');
        responseText = await generateTextResponseAction(message.content, 'troubleshooting');
      } else {
        log('Generating tenancy response...');
        responseText = await generateTextResponseAction(message.content, 'tenancy');
      }
      
      log('Response generated:', responseText ? responseText.substring(0, 50) + '...' : 'No response');
    } catch (error) {
      log('Error generating response:', error);
      responseText = 'Sorry, I encountered an error while processing your request. Please try again.';
    }
    
    // Add assistant message to conversation
    const assistantMessage = await addMessageToConversation(conversationId, {
      role: 'assistant',
      content: responseText,
      agentType: agentType === 'clarification' ? 'troubleshooting' : agentType,
    });
    
    // Return the updated conversation
    const updatedConversation = await getConversation(conversationId);
    
    log('Returning assistant message:', { id: assistantMessage.id, content: assistantMessage.content?.substring(0, 50) + '...' });
    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error('Error processing chat request:', error);
    log('Error processing chat request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
