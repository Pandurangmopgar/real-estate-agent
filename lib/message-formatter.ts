/**
 * Formats text with basic markdown-like styling
 * Handles **bold**, *italic*, # headings, - lists, and code blocks
 */
export function formatMessageContent(content: string): string {
  if (!content) return '';
  
  // Process the content with HTML for styling
  let formattedContent = content
    // Replace headings (# Heading)
    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold my-2">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold my-2">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-md font-semibold my-1">$1</h3>')
    
    // Replace bold (**text**)
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold">$1</strong>')
    
    // Replace italic (*text*)
    .replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>')
    
    // Replace lists (- item)
    .replace(/^- (.+)$/gm, '<li class="ml-5 list-disc">$1</li>')
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, '<ul class="my-2">$&</ul>')
    
    // Replace numbered lists (1. item)
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-5 list-decimal">$1</li>')
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, '<ul class="my-2">$&</ul>')
    
    // Replace code blocks (```code```)
    .replace(/```([^`]+)```/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-2 rounded my-2 overflow-x-auto text-sm"><code>$1</code></pre>')
    
    // Replace inline code (`code`)
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 rounded text-sm">$1</code>')
    
    // Replace paragraphs (lines with content)
    .replace(/^(?!<[hou]).+$/gm, '<p class="my-2">$&</p>');
  
  return formattedContent;
}
