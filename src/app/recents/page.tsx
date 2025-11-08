'use client';

import { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/app/sidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { History, Sparkles, MessageSquarePlus } from 'lucide-react';
import { useUsername } from '@/components/username-provider';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { File as FileIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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

type StoredConversation = {
    timestamp: number;
    messages: Message[];
}

const CONVERSATION_EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours


export default function RecentsPage() {
  const { username } = useUsername();
  const [conversation, setConversation] = useState<StoredConversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (username) {
        setIsLoading(true);
        try {
            const storedConversationRaw = localStorage.getItem(`chatHistory_${username}`);
            if (storedConversationRaw) {
                const storedConversation: StoredConversation = JSON.parse(storedConversationRaw);
                const now = new Date().getTime();

                if (now - storedConversation.timestamp < CONVERSATION_EXPIRATION_MS) {
                    setConversation(storedConversation);
                } else {
                    // Conversation has expired
                    localStorage.removeItem(`chatHistory_${username}`);
                    setConversation(null);
                }
            } else {
                 setConversation(null);
            }
        } catch (error) {
            console.error("Could not load chat history:", error);
            setConversation(null);
        } finally {
            setIsLoading(false);
        }
    } else {
        setIsLoading(false);
    }
  }, [username]);

  return (
    <div className="flex h-screen w-full bg-transparent">
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <header className="flex h-16 items-center px-6 border-b shrink-0 bg-card/50 backdrop-blur-sm z-10">
          <SidebarTrigger />
          <div className="flex items-center gap-4 ml-4">
            <History className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Recent Chats</h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
            {isLoading && (
                 <div className="flex items-center justify-center h-full">
                    <div className="text-center text-muted-foreground">Loading recent chats...</div>
                </div>
            )}

            {!isLoading && !conversation && (
                 <div className="flex items-center justify-center h-full">
                     <Card className="text-center shadow-2xl bg-card/80 backdrop-blur-sm border-border w-full max-w-md p-6">
                        <CardHeader>
                            <div className="flex justify-center mb-4">
                                <History className="h-12 w-12 text-primary" />
                            </div>
                            <CardTitle>No Recent Chats</CardTitle>
                            <CardDescription>
                                Your conversations from the last 24 hours will appear here. Start a new chat to see it saved!
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            )}

            {conversation && (
                 <Card className="bg-card/80 backdrop-blur-sm border-border shadow-2xl">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>Conversation History</CardTitle>
                                <CardDescription>
                                    This chat was saved {formatDistanceToNow(new Date(conversation.timestamp), { addSuffix: true })}.
                                </CardDescription>
                            </div>
                             <Button asChild>
                                <Link href="/?continue=true">
                                    <MessageSquarePlus className="mr-2 h-4 w-4" />
                                    Continue Chat
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-8">
                       {conversation.messages.map((message, index) => (
                            <div 
                                key={index} 
                                className={cn('flex items-start gap-4', message.isUser ? 'justify-end' : '')}
                            >
                                {!message.isUser && (
                                    <Avatar className="h-9 w-9 border border-white/10">
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
                                        <Sparkles className="w-5 h-5 text-black/80" />
                                    </div>
                                    </Avatar>
                                )}
                                <div className={cn(
                                    'flex-1 space-y-2 max-w-2xl',
                                    message.isUser ? 'text-right' : ''
                                )}>
                                    <div className={cn(
                                    'p-4 rounded-xl inline-block shadow-lg border text-left',
                                    message.isUser 
                                        ? 'bg-gradient-to-br from-primary to-secondary text-primary-foreground border-none' 
                                        : 'bg-card/80 backdrop-blur-lg border-border'
                                    )}>
                                    {message.image && (
                                        <Image src={message.image} alt="Uploaded image" width={300} height={300} className="rounded-md mb-2 max-w-full h-auto"/>
                                    )}
                                    {message.file && !message.image && (
                                        <div className="flex items-center gap-2 mb-2 p-2 rounded-md bg-black/20">
                                        <FileIcon className="h-5 w-5"/>
                                        <span className="text-sm">{message.file.name}</span>
                                        </div>
                                    )}
                                    {message.text && <p className="text-sm whitespace-pre-wrap">{message.text}</p>}
                                    </div>
                                </div>
                                {message.isUser && (
                                    <Avatar className="h-9 w-9 border-white/10">
                                    <AvatarFallback className="bg-white/10">{username ? username.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                                    </Avatar>
                                )}
                                </div>
                       ))}
                    </CardContent>
                 </Card>
            )}
        </main>
      </SidebarInset>
    </div>
  );
}

    