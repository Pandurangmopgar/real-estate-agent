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
      {agentType === 'troubleshooting' && (
        <div 
          className={`mb-4 mt-2 rounded-lg border-2 border-dashed p-5 transition-colors ${
            isDragActive ? 'border-primary bg-primary/10 dark:bg-primary/20' : 'border-primary/30 dark:border-primary/40'
          }`}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          {imagePreview ? (
            <div className="relative">
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
                className="absolute right-2 top-2 rounded-full bg-background p-1 text-foreground shadow-md dark:bg-background/90 dark:text-foreground/90"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20 mb-3">
                <Upload className="h-6 w-6" />
              </div>
              <h3 className="text-base font-medium mb-1">Upload a property image</h3>
              <p className="text-sm text-muted-foreground mb-1">
                Drag & drop an image here, or click to select
              </p>
              <p className="text-xs text-muted-foreground/70">
                Get AI analysis of property issues • JPEG, PNG, WebP formats
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex items-end gap-2 rounded-lg border bg-background p-2 shadow-sm hover:shadow transition-shadow duration-200 dark:border-muted-foreground/20 dark:bg-background/80 dark:backdrop-blur">
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
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleSendMessage}
          disabled={isDisabled || (message.trim() === '' && !imageFile)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50 hover:bg-primary/90 transition-colors"
        >
          <Send className="h-5 w-5" />
        </motion.button>
      </div>

      {isAgentTyping && (
        <div className="mt-2 text-sm text-muted-foreground">
          Agent is typing...
        </div>
      )}
    </div>
  );
}