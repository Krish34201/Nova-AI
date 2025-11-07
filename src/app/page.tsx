'use client';

import { AppSidebar } from '@/components/app/sidebar'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { ModelSwitcher } from '@/components/app/model-switcher'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Paperclip, Send, Mic } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useState, useRef, useEffect } from 'react';
import { personalizedResponse } from '@/ai/flows/personalized-response';
import { cn } from '@/lib/utils';
import { useUsername } from '@/components/username-provider';

type Message = {
  text: string;
  isUser: boolean;
  badges?: string[];
};

export default function Home() {
  const aiAvatar = PlaceHolderImages.find((p) => p.id === 'ai-avatar');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { username } = useUsername();

  const [messages, setMessages] = useState<Message[]>([
    {
      text: 'Hello! I am Nova, your advanced AI assistant. How can I help you today?',
      isUser: false,
    },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '') return;

    setIsSending(true);
    const userMessage: Message = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const aiResponse = await personalizedResponse({ query: input, userName: username || undefined });
      const aiMessage: Message = {
        text: aiResponse.response,
        isUser: false,
        badges: [],
      };
      setMessages(prev => [...prev, aiMessage]);
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
    <div className="flex h-screen w-full bg-background">
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <header className="flex h-16 items-center px-6 border-b shrink-0 bg-card/50 backdrop-blur-sm z-10">
          <SidebarTrigger />
          <div className="flex items-center gap-4 ml-4">
            <ModelSwitcher />
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
                <div className={cn(
                  'flex-1 space-y-2 max-w-2xl',
                  message.isUser ? 'text-right' : ''
                )}>
                  <Card className={cn(
                    'p-4 rounded-lg inline-block shadow-md',
                     message.isUser ? 'bg-primary text-primary-foreground slide-in-right' : 'bg-card slide-in-left'
                  )}>
                    <p className="text-sm">{message.text}</p>
                    {message.badges && message.badges.length > 0 && (
                       <div className="mt-4">
                        {message.badges.map((badge, i) => (
                           <Badge key={i} variant="secondary" className="ml-2">{badge}</Badge>
                        ))}
                       </div>
                    )}
                  </Card>
                </div>
                {message.isUser && (
                  <Avatar className="h-9 w-9 border">
                    <AvatarFallback>{username ? username.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>

          <div className="border-t bg-card/50 backdrop-blur-sm px-6 py-4">
            <div className="relative">
              <Textarea
                placeholder="Type your message..."
                className="w-full resize-none bg-input pr-28 pl-10 min-h-[48px] rounded-2xl"
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSending}
              />
              <div className="absolute top-1/2 left-3 transform -translate-y-1/2 flex items-center">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Paperclip className="h-5 w-5" />
                </Button>
              </div>
              <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center">
                <Button variant="ghost" size="icon" className="rounded-full">
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
