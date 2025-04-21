import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize the Gemini API
export const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || 'AIzaSyCPAXJvnOMK23-fvhA1XkaeBaZli9qqhgk');

// Safety settings to filter out harmful content
export const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];



// Generate text response using Gemini API
export async function generateTextResponse(prompt: string, agentType: 'troubleshooting' | 'tenancy' = 'troubleshooting') {
  console.log(`Generating response for ${agentType} with prompt: ${prompt.substring(0, 50)}...`);
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    // Create system prompt based on agent type
    let systemPrompt = '';
    
    if (agentType === 'troubleshooting') {
      systemPrompt = 'You are a property troubleshooting expert. Help the user with their property issue.';
    } else {
      systemPrompt = 'You are a tenancy law and rental agreement expert. Answer the user\'s question about tenancy rights, rental agreements, or landlord-tenant relations.';
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
    console.log(`Response generated: ${response.substring(0, 50)}...`);
    return response;
  } catch (error) {
    console.error('Error generating response:', error);
    return 'Sorry, I encountered an error while processing your request. Please try again.';
  }
}

// Function to analyze image and generate response
export async function analyzeImage(imageData: string, prompt: string) {
  console.log('Analyzing image with prompt:', prompt);
  
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
    console.log(`Image analysis response generated: ${response.substring(0, 50)}...`);
    return response;
  } catch (error) {
    console.error('Error analyzing image:', error);
    return 'Sorry, I encountered an error while analyzing the image. Please try again with a different image or provide more details about your issue.';
  }
}

// Function to determine which agent should handle the request
export async function routeToAgent(input: string, hasImage: boolean = false): Promise<'troubleshooting' | 'tenancy' | 'general'> {
  console.log(`Routing message: "${input.substring(0, 50)}..."${hasImage ? ' (with image)' : ''}`);
  
  // If there's an image, always route to troubleshooting
  if (hasImage) {
    console.log('Routing to troubleshooting agent (image detected)');
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
  
  console.log(`Routing scores - Troubleshooting: ${troubleshootingScore}, Tenancy: ${tenancyScore}`);
  
  if (troubleshootingScore > tenancyScore) {
    console.log('Routing to troubleshooting agent');
    return 'troubleshooting';
  }
  if (tenancyScore > troubleshootingScore) {
    console.log('Routing to tenancy agent');
    return 'tenancy';
  }
  if (troubleshootingScore === 0 && tenancyScore === 0) {
    console.log('Unable to determine agent type, using general agent');
    return 'general';
  }
  
  // Equal scores but not zero
  console.log('Equal scores, defaulting to troubleshooting');
  return 'troubleshooting';
}
