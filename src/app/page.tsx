'use client';

import { AppSidebar } from '@/components/app/sidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, Send, Mic, X, File as FileIcon, Loader2, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { personalizedResponse } from '@/ai/flows/personalized-response';
import { summarizeDocument } from '@/ai/flows/summarize-document';
import { generateInitialPrompts } from '@/ai/flows/generate-initial-prompt';
import { cn } from '@/lib/utils';
import { useUsername } from '@/components/username-provider';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

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

function ChatPageContent() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { username } = useUsername();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [initialPrompts, setInitialPrompts] = useState<string[]>([]);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(true);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInitialPrompts() {
      try {
        const result = await generateInitialPrompts({});
        setInitialPrompts(result.suggestedPrompts);
      } catch (error) {
        console.error('Error generating initial prompts:', error);
      } finally {
        setIsLoadingPrompts(false);
      }
    }

    if (messages.length === 0) {
        fetchInitialPrompts();
    }
  }, [messages.length]);

  // Load messages from localStorage on initial render if 'continue=true'
  useEffect(() => {
    if (username && searchParams.get('continue') === 'true') {
      try {
        const storedConversationRaw = localStorage.getItem(`chatHistory_${username}`);
        if (storedConversationRaw) {
          const storedConversation: StoredConversation = JSON.parse(storedConversationRaw);
          const now = new Date().getTime();

          if (now - storedConversation.timestamp < CONVERSATION_EXPIRATION_MS) {
            setMessages(storedConversation.messages);
          } else {
            localStorage.removeItem(`chatHistory_${username}`);
          }
        }
        // Remove the query param after loading
        router.replace('/', { scroll: false });
      } catch (error) {
        console.error("Could not load chat history:", error);
      }
    }
  }, [username, searchParams, router]);


  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (username && messages.length > 0) {
        try {
            const conversationToStore: StoredConversation = {
                timestamp: new Date().getTime(),
                messages: messages,
            };
            localStorage.setItem(`chatHistory_${username}`, JSON.stringify(conversationToStore));
        } catch (error) {
            console.error("Could not save chat history:", error);
        }
    }
  }, [messages, username]);


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
  
  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  const handleSend = async (textToSend?: string) => {
    const currentInput = textToSend || input;
    if (currentInput.trim() === '' && !attachedFile) return;

    setIsSending(true);

    const userMessage: Message = { text: currentInput, isUser: true };
    if (attachedFile) {
        userMessage.file = { name: attachedFile.name, type: attachedFile.type };
        if (filePreview) {
            userMessage.image = filePreview;
        }
    }

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    const currentFile = attachedFile;
    removeAttachment();

    try {
      if (currentFile) {
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
         return;
      } else {
        const pastInteractions = messages.slice(-5).map(m => `${m.isUser ? 'User' : 'AI'}: ${m.text}`);
        const aiResponse = await personalizedResponse({ query: currentInput, userName: username || undefined, pastInteractions });
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
  
  const WelcomeCard = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto"
    >
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary">
          Welcome to Nova AI
        </h1>
        <p className="text-lg text-muted-foreground mt-4">Your advanced, all-in-one AI assistant. How can I help you today?</p>
      </div>
      
      <div className="w-full text-left mt-4">
        {isLoadingPrompts ? (
          <div className="grid md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-card rounded-lg p-4 animate-pulse"></div>
              ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {initialPrompts.map((prompt, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card 
                  className="p-4 bg-card/80 backdrop-blur-lg border border-border hover:border-primary/50 hover:bg-card/90 cursor-pointer transition-all duration-300 group shadow-lg hover:shadow-primary/20"
                  onClick={() => handlePromptClick(prompt)}
                >
                  <p className="text-sm text-foreground group-hover:text-primary transition-colors">{prompt}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );


  return (
    <div className="flex h-screen w-full">
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <header className="flex h-16 items-center px-6 border-b shrink-0 bg-background/80 backdrop-blur-lg z-10">
          <SidebarTrigger />
          <div className="flex items-center gap-4 ml-4">
             <h1 className="text-xl font-semibold">Nova AI</h1>
          </div>
        </header>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-6 space-y-8">
            <AnimatePresence initial={false}>
              {messages.length === 0 ? <WelcomeCard /> : messages.map((message, index) => (
                <motion.div 
                  key={index} 
                  className={cn('flex items-start gap-4', message.isUser ? 'justify-end' : '')}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
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
                    <Card className={cn(
                      'p-4 rounded-xl inline-block shadow-lg border',
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
                    <Avatar className="h-9 w-9 border-white/10">
                      <AvatarFallback className="bg-white/10">{username ? username.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                    </Avatar>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
             {isSending && (
                <motion.div 
                    className={cn('flex items-start gap-4')}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    <Avatar className="h-9 w-9 border border-white/10">
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
                            <Sparkles className="w-5 h-5 text-black/80" />
                        </div>
                    </Avatar>
                    <div className="flex-1 space-y-2 max-w-2xl">
                        <Card className="p-4 rounded-xl inline-block shadow-lg bg-card/80 backdrop-blur-lg border-border">
                             <div className="flex items-center justify-center gap-2">
                                <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.3s]" />
                                <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.15s]" />
                                <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse" />
                            </div>
                        </Card>
                    </div>
                </motion.div>
            )}
          </div>
          <div className="px-4 pb-4">
              <div className="border-t border-border bg-background/50 backdrop-blur-lg p-2 rounded-2xl">
                {attachedFile && (
                  <div className="relative mb-2 w-fit px-2">
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
                    placeholder={"Type your message, or drop a file..."}
                    className="w-full resize-none bg-input pr-28 pl-12 min-h-[52px] rounded-xl border-transparent focus:border-primary/50 focus:ring-primary/50 transition-colors"
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isSending}
                  />
                  <div className="absolute top-1/2 left-4 transform -translate-y-1/2 flex items-center">
                     <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground" onClick={() => fileInputRef.current?.click()} disabled={isSending}>
                        <Paperclip className="h-5 w-5" />
                     </Button>
                  </div>
                  <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center">
                    <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground" disabled={isSending}>
                      <Mic className="h-5 w-5" />
                    </Button>
                    <Button size="icon" className="rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity" onClick={() => handleSend()} disabled={isSending || (!input.trim() && !attachedFile)}>
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </SidebarInset>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatPageContent />
    </Suspense>
  );
}

    