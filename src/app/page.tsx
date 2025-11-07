'use client';

import { AppSidebar } from '@/components/app/sidebar'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Paperclip, Send, Mic, X, File as FileIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useState, useRef, useEffect } from 'react';
import { personalizedResponse } from '@/ai/flows/personalized-response';
import { summarizeDocument } from '@/ai/flows/summarize-document';
import { cn } from '@/lib/utils';
import { useUsername } from '@/components/username-provider';
import Image from 'next/image';
import { motion } from 'framer-motion';

type Message = {
  text: string;
  isUser: boolean;
  badges?: string[];
  image?: string;
  file?: {
    name: string;
    type: string;
  };
};

export default function Home() {
  const aiAvatar = PlaceHolderImages.find((p) => p.id === 'ai-avatar');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { username } = useUsername();

  const [messages, setMessages] = useState<Message[]>([
    {
      text: 'Hello! I am Nova, your advanced AI assistant. How can I help you today? You can also upload a document for me to summarize.',
      isUser: false,
    },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);


  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachedFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const removeAttachment = () => {
    setAttachedFile(null);
    setFilePreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  const handleSend = async () => {
    if (input.trim() === '' && !attachedFile) return;

    setIsSending(true);

    const userMessage: Message = { text: input, isUser: true };
    if (attachedFile) {
        userMessage.file = { name: attachedFile.name, type: attachedFile.type };
        if (filePreview) {
            userMessage.image = filePreview;
        }
    }

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    
    const currentFile = attachedFile;
    removeAttachment();

    try {
      if (currentFile) {
         // If there is a file, we assume it's for summarization for now.
         const reader = new FileReader();
         reader.readAsDataURL(currentFile);
         reader.onload = async () => {
            const documentDataUri = reader.result as string;
            try {
                const summaryResponse = await summarizeDocument({ documentDataUri });
                 const aiMessage: Message = {
                    text: `Summary for ${currentFile.name}:\n\n${summaryResponse.summary}`,
                    isUser: false,
                 };
                 setMessages(prev => [...prev, aiMessage]);
            } catch (error) {
                 console.error('Error summarizing document:', error);
                 const errorMessage: Message = {
                    text: 'Sorry, I had trouble processing that document. Please try again.',
                    isUser: false,
                 };
                 setMessages(prev => [...prev, errorMessage]);
            } finally {
                 setIsSending(false);
            }
         };
         reader.onerror = (error) => {
             console.error('Error reading file:', error);
             const errorMessage: Message = {
                text: 'Sorry, I could not read the uploaded file.',
                isUser: false,
             };
             setMessages(prev => [...prev, errorMessage]);
             setIsSending(false);
         };
         return; // The response will be handled in the onload callback
      } else {
        // Default chat response
        const aiResponse = await personalizedResponse({ query: currentInput, userName: username || undefined });
        const aiMessage: Message = {
            text: aiResponse.response,
            isUser: false,
            badges: [],
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen w-full bg-transparent">
      <AppSidebar />
      <SidebarInset className="flex flex-col bg-transparent">
        <header className="flex h-16 items-center px-6 border-b shrink-0 bg-card/50 backdrop-blur-sm z-10">
          <SidebarTrigger />
          <div className="flex items-center gap-4 ml-4">
             <h1 className="text-xl font-semibold">Nova AI v1.0</h1>
          </div>
          <div className="ml-auto flex items-center gap-4">
          </div>
        </header>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-6 space-y-8">
            {messages.map((message, index) => (
              <div key={index} className={cn('flex items-start gap-4', message.isUser ? 'justify-end' : '')}>
                {!message.isUser && (
                  <Avatar className="h-9 w-9 border">
                    {aiAvatar && <AvatarImage src={aiAvatar.imageUrl} alt="AI Avatar" data-ai-hint={aiAvatar.imageHint} />}
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                  'flex-1 space-y-2 max-w-2xl',
                  message.isUser ? 'text-right' : ''
                )}>
                  <Card className={cn(
                    'p-4 rounded-lg inline-block shadow-md',
                     message.isUser ? 'bg-primary text-primary-foreground' : 'bg-card'
                  )}>
                    {message.image && (
                      <Image src={message.image} alt="Uploaded image" width={300} height={300} className="rounded-md mb-2 max-w-full h-auto"/>
                    )}
                    {message.file && !message.image && (
                      <div className="flex items-center gap-2 mb-2 p-2 rounded-md bg-background/50">
                        <FileIcon className="h-5 w-5"/>
                        <span className="text-sm">{message.file.name}</span>
                      </div>
                    )}
                    {message.text && <p className="text-sm whitespace-pre-wrap">{message.text}</p>}
                    {message.badges && message.badges.length > 0 && (
                       <div className="mt-4">
                        {message.badges.map((badge, i) => (
                           <Badge key={i} variant="secondary" className="ml-2">{badge}</Badge>
                        ))}
                       </div>
                    )}
                  </Card>
                </motion.div>
                {message.isUser && (
                  <Avatar className="h-9 w-9 border">
                    <AvatarFallback>{username ? username.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isSending && messages[messages.length-1]?.isUser && (
                <div className={cn('flex items-start gap-4')}>
                    <Avatar className="h-9 w-9 border">
                        {aiAvatar && <AvatarImage src={aiAvatar.imageUrl} alt="AI Avatar" />}
                        <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <motion.div 
                      className="flex-1 space-y-2 max-w-2xl"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                        <Card className="p-4 rounded-lg inline-block shadow-md bg-card">
                             <div className="flex items-center justify-center gap-2">
                                <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.3s]" />
                                <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.15s]" />
                                <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse" />
                            </div>
                        </Card>
                    </motion.div>
                </div>
            )}
          </div>

          <div className="border-t bg-card/50 backdrop-blur-sm px-6 py-4">
            {attachedFile && (
              <div className="relative mb-2 w-fit">
                {filePreview ? (
                    <Image src={filePreview} alt="Preview" width={80} height={80} className="rounded-md"/>
                ) : (
                    <div className="flex items-center gap-2 p-2 rounded-md bg-input">
                        <FileIcon className="h-6 w-6"/>
                        <span className="text-sm">{attachedFile.name}</span>
                    </div>
                )}
                 <Button variant="ghost" size="icon" className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-muted text-muted-foreground" onClick={removeAttachment}>
                    <X className="h-4 w-4"/>
                </Button>
              </div>
            )}
            <div className="relative">
             <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              <Textarea
                placeholder={"Type your message..."}
                className="w-full resize-none bg-input pr-28 pl-10 min-h-[48px] rounded-2xl"
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSending}
              />
              <div className="absolute top-1/2 left-3 transform -translate-y-1/2 flex items-center">
                 <Button variant="ghost" size="icon" className="rounded-full" onClick={() => fileInputRef.current?.click()} disabled={isSending}>
                    <Paperclip className="h-5 w-5" />
                 </Button>
              </div>
              <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center">
                <Button variant="ghost" size="icon" className="rounded-full" disabled={isSending}>
                  <Mic className="h-5 w-5" />
                </Button>
                <Button size="icon" className="rounded-full" onClick={handleSend} disabled={isSending}>
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Nova AI can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </SidebarInset>
    </div>
  )
}

    