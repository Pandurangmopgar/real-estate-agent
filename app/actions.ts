"use server";

import { genAI, safetySettings } from '@/lib/gemini';

// Server action to generate text response
export async function generateTextResponseAction(prompt: string, agentType: 'troubleshooting' | 'tenancy' | 'general' = 'troubleshooting') {
  console.log(`[Server Action] Generating response for ${agentType} with prompt: ${prompt.substring(0, 50)}...`);
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    // Create system prompt based on agent type
    let systemPrompt = '';
    
    if (agentType === 'troubleshooting') {
      systemPrompt = 'You are a property troubleshooting expert. Help the user with their property issue.';
    } else if (agentType === 'tenancy') {
      systemPrompt = 'You are a tenancy law and rental agreement expert. Answer the user\'s question about tenancy rights, rental agreements, or landlord-tenant relations.';
    } else {
      // General agent type
      systemPrompt = 'You are a helpful real estate assistant who can provide general guidance on property matters. If the user asks about specific property issues or tenancy questions, ask for more details to provide better assistance.';
    }
    
    // Generate content with system prompt
    const result = await model.generateContent({
      contents: [
        { role: 'user', parts: [{ text: prompt }] }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
      systemInstruction: systemPrompt,
      safetySettings,
    });
    
    const response = result.response.text();
    console.log(`[Server Action] Response generated: ${response.substring(0, 50)}...`);
    return response;
  } catch (error) {
    console.error('[Server Action] Error generating response:', error);
    return 'Sorry, I encountered an error while processing your request. Please try again.';
  }
}

// Server action to analyze image
export async function analyzeImageAction(imageData: string, prompt: string) {
  console.log('[Server Action] Analyzing image with prompt:', prompt);
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    // Process the image data - ensure it's in the right format
    const processedImageData = imageData.includes('base64') 
      ? imageData.split(',')[1] 
      : imageData;
    
    // Generate content with image
    const result = await model.generateContent({
      contents: [
        { 
          role: 'user', 
          parts: [
            { text: prompt },
            { inlineData: { mimeType: 'image/jpeg', data: processedImageData } }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
      systemInstruction: 'You are a property troubleshooting expert who can analyze images to identify issues with homes and buildings.',
      safetySettings,
    });
    
    const response = result.response.text();
    console.log(`[Server Action] Image analysis response generated: ${response.substring(0, 50)}...`);
    return response;
  } catch (error) {
    console.error('[Server Action] Error analyzing image:', error);
    return 'Sorry, I encountered an error while analyzing the image. Please try again with a different image or provide more details about your issue.';
  }
}

// Server action to route messages
export async function routeToAgentAction(input: string, hasImage: boolean = false): Promise<'troubleshooting' | 'tenancy' | 'general'> {
  console.log(`[Server Action] Routing message: "${input.substring(0, 50)}..."${hasImage ? ' (with image)' : ''}`);
  
  // If there's an image, always route to troubleshooting
  if (hasImage) {
    console.log('[Server Action] Routing to troubleshooting agent (image detected)');
    return 'troubleshooting';
  }
  
  // Use simple keyword matching for faster response
  const troubleshootingKeywords = ['repair', 'broken', 'leak', 'damage', 'mold', 'issue', 'problem', 'fix', 'maintenance'];
  const tenancyKeywords = ['lease', 'rent', 'tenant', 'landlord', 'agreement', 'deposit', 'eviction', 'notice', 'rights'];
  
  const lowerMessage = input.toLowerCase();
  
  let troubleshootingScore = 0;
  let tenancyScore = 0;
  
  troubleshootingKeywords.forEach(keyword => {
    if (lowerMessage.includes(keyword)) troubleshootingScore++;
  });
  
  tenancyKeywords.forEach(keyword => {
    if (lowerMessage.includes(keyword)) tenancyScore++;
  });
  
  console.log(`[Server Action] Routing scores - Troubleshooting: ${troubleshootingScore}, Tenancy: ${tenancyScore}`);
  
  if (troubleshootingScore > tenancyScore) {
    console.log('[Server Action] Routing to troubleshooting agent');
    return 'troubleshooting';
  }
  if (tenancyScore > troubleshootingScore) {
    console.log('[Server Action] Routing to tenancy agent');
    return 'tenancy';
  }
  if (troubleshootingScore === 0 && tenancyScore === 0) {
    console.log('[Server Action] Unable to determine agent type, using general agent');
    return 'general';
  }
  
  // Equal scores but not zero
  console.log('[Server Action] Equal scores, defaulting to troubleshooting');
  return 'troubleshooting';
}
