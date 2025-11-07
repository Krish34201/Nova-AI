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

export default function Home() {
  const userAvatar = PlaceHolderImages.find((p) => p.id === 'user-avatar')
  const aiAvatar = PlaceHolderImages.find((p) => p.id === 'ai-avatar')

  return (
    <div className="flex h-screen w-full bg-background">
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <header className="flex h-16 items-center px-6 border-b shrink-0 bg-card">
          <SidebarTrigger />
          <div className="flex items-center gap-4 ml-4">
            <ModelSwitcher />
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Button variant="outline">Subscription</Button>
          </div>
        </header>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <div className="flex items-start gap-4">
              <Avatar className="h-9 w-9 border">
                {aiAvatar && <AvatarImage src={aiAvatar.imageUrl} alt="AI Avatar" data-ai-hint={aiAvatar.imageHint} />}
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Card className="bg-white rounded-lg p-4 shadow-sm max-w-2xl">
                  <p className="text-sm">
                    Hello! I am Nova, your advanced AI assistant. How can I help you today?
                  </p>
                </Card>
              </div>
            </div>

            <div className="flex items-start gap-4 justify-end">
              <div className="flex-1 space-y-2 max-w-2xl text-right">
                <Card className="bg-primary text-primary-foreground p-4 rounded-lg inline-block shadow-sm">
                  <p className="text-sm">What's the latest news on AI?</p>
                </Card>
              </div>
              <Avatar className="h-9 w-9 border">
                {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" data-ai-hint={userAvatar.imageHint} />}
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex items-start gap-4">
              <Avatar className="h-9 w-9 border">
                {aiAvatar && <AvatarImage src={aiAvatar.imageUrl} alt="AI Avatar" data-ai-hint={aiAvatar.imageHint} />}
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Card className="bg-white rounded-lg p-4 shadow-sm max-w-2xl">
                    <p className="text-sm">
                        Certainly. As of today, there's significant buzz around advancements in multi-modal models. Google has just released a new version of Gemini that shows impressive capabilities in understanding both text and video simultaneously. Also, there's a growing trend in open-source models, with platforms like Hugging Face seeing a surge in community-contributed models that are surprisingly powerful.
                    </p>
                    <div className="mt-4">
                        <Badge variant="secondary">Web Search</Badge>
                        <Badge variant="secondary" className="ml-2">Real-time Data</Badge>
                    </div>
                </Card>
              </div>
            </div>

          </div>

          <div className="border-t bg-card px-6 py-4">
            <div className="relative">
              <Textarea
                placeholder="Type your message..."
                className="w-full resize-none bg-input pr-28 pl-10 min-h-[48px] rounded-2xl"
                rows={1}
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
                <Button size="icon" className="rounded-full">
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
