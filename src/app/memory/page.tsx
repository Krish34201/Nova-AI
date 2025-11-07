'use client';
import { AppSidebar } from '@/components/app/sidebar'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Book } from 'lucide-react'
import { motion } from 'framer-motion'

export default function MemoryPage() {
  return (
    <div className="flex h-screen w-full bg-background">
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <header className="flex h-16 items-center px-6 border-b shrink-0 bg-card/50 backdrop-blur-sm z-10">
          <SidebarTrigger />
          <div className="flex items-center gap-4 ml-4">
            <h1 className="text-xl font-semibold">Memory</h1>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
           <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <Card className="w-full max-w-2xl text-center shadow-2xl bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Book className="h-12 w-12 text-primary" />
                </div>
                <CardTitle>AI Memory</CardTitle>
                <CardDescription>
                  Enhancing your experience by remembering context and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The AI's memory allows it to recall previous parts of your conversation. This helps it understand context, provide more relevant responses, and learn your preferences over time. This feature is currently in development and will be enhanced in future updates.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </SidebarInset>
    </div>
  )
}

    