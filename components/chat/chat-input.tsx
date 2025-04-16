import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Upload, X } from 'lucide-react';
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
      <div className="flex flex-col rounded-lg border bg-background shadow-sm hover:shadow transition-shadow duration-200 dark:border-muted-foreground/20 dark:bg-background/80 dark:backdrop-blur">
        {/* Image preview area - only shown when an image is selected */}
        {agentType === 'troubleshooting' && imagePreview && (
          <div className="relative p-3 border-b dark:border-muted-foreground/20">
            <Image 
              src={imagePreview} 
              alt="Preview" 
              width={400}
              height={300}
              className="mx-auto max-h-[200px] rounded-md object-contain" 
              style={{ width: 'auto', height: 'auto' }}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearImage();
              }}
              className="absolute right-3 top-3 rounded-full bg-background p-1 text-foreground shadow-md dark:bg-background/90 dark:text-foreground/90"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        
        <div className="flex items-end gap-2 p-2">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask the ${agentType === 'troubleshooting' ? 'Troubleshooting' : 'Tenancy FAQ'} Agent...`}
            className="flex-1 resize-none bg-transparent p-2 text-sm focus:outline-none min-h-[40px] max-h-[120px]"
            rows={1}
            disabled={isDisabled}
          />
          {agentType === 'troubleshooting' && !imagePreview && (
            <div 
              {...getRootProps()}
              className={`flex h-10 w-10 items-center justify-center rounded-full ${isDragActive ? 'bg-primary/80' : 'bg-muted hover:bg-muted/80'} transition-colors cursor-pointer`}
            >
              <input {...getInputProps()} />
              <Upload className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSendMessage}
            disabled={isDisabled || (message.trim() === '' && !imageFile)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50 hover:bg-primary/90 transition-colors"
          >
            <Send className="h-5 w-5" />
          </motion.button>
        </div>
      </div>

      {isAgentTyping && (
        <div className="mt-2 text-sm text-muted-foreground">
          Agent is typing...
        </div>
      )}
    </div>
  );
}