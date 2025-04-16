import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, ImagePlus, X, Camera, Image as ImageIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { fileToBase64 } from '@/lib/helpers';

interface ChatInputProps {
  onSendMessage: (message: string, imageData?: string) => void;
  isDisabled?: boolean;
  isAgentTyping?: boolean;
  agentType: 'troubleshooting' | 'tenancy';
}

export function ChatInput({ 
  onSendMessage, 
  isDisabled = false, 
  isAgentTyping = false,
  agentType
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    disabled: isDisabled || agentType !== 'troubleshooting',
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  });

  const handleSendMessage = async () => {
    if (message.trim() === '' && !imageFile) return;
    
    let base64Image: string | undefined;
    
    if (imageFile) {
      base64Image = await fileToBase64(imageFile);
    }
    
    onSendMessage(message, base64Image);
    setMessage('');
    setImageFile(null);
    setImagePreview(null);
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div className="relative w-full">
      <div className="flex flex-col rounded-xl border border-primary/10 dark:border-primary/20 bg-card/30 dark:bg-card/20 shadow-md hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
        {/* Image preview area - only shown when an image is selected */}
        {agentType === 'troubleshooting' && imagePreview && (
          <div className="relative p-4 border-b border-primary/10 dark:border-primary/20">
            <Image 
              src={imagePreview} 
              alt="Preview" 
              width={400}
              height={300}
              className="mx-auto max-h-[200px] rounded-lg object-contain shadow-sm" 
              style={{ width: 'auto', height: 'auto' }}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearImage();
              }}
              className="absolute right-3 top-3 rounded-full bg-background/80 backdrop-blur-sm p-1.5 text-foreground shadow-md dark:bg-background/50 dark:text-foreground/90 border border-primary/10 dark:border-primary/20 hover:bg-background/90 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        
        <div className="flex items-end gap-3 p-3">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask the ${agentType === 'troubleshooting' ? 'Troubleshooting' : 'Tenancy FAQ'} Agent...`}
            className="flex-1 resize-none bg-transparent p-2 text-[15px] font-sans focus:outline-none min-h-[44px] max-h-[120px] leading-relaxed"
            rows={1}
            disabled={isDisabled}
          />
          {agentType === 'troubleshooting' && !imagePreview && (
            <div 
              {...getRootProps()}
              className={`flex h-10 w-10 items-center justify-center rounded-full ${isDragActive ? 'bg-primary text-primary-foreground' : 'bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30'} transition-all cursor-pointer shadow-sm hover:shadow border border-primary/10 dark:border-primary/20`}
            >
              <input {...getInputProps()} />
              <ImagePlus className="h-5 w-5 text-primary dark:text-primary" />
            </div>
          )}
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={handleSendMessage}
            disabled={isDisabled || (message.trim() === '' && !imageFile)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50 hover:bg-primary/90 transition-all duration-300 shadow-sm hover:shadow disabled:hover:scale-100"
          >
            <Send className="h-5 w-5" />
          </motion.button>
        </div>
      </div>

      {isAgentTyping && (
        <div className="mt-3 text-sm text-primary/70 font-medium flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
          <span>Agent is thinking...</span>
        </div>
      )}
    </div>
  );
}