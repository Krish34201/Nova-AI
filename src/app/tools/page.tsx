'use client';
import { AppSidebar } from '@/components/app/sidebar'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Code2, Search } from 'lucide-react'
import { motion } from 'framer-motion';

const tools = [
  {
    name: 'Web Search',
    description: 'A tool to search the web for real-time information, news, and data.',
    icon: <Search className="h-6 w-6" />,
  },
  {
    name: 'Code Execution',
    description: 'A tool to execute code snippets in various languages to perform calculations or run algorithms.',
    icon: <Code2 className="h-6 w-6" />,
  },
];

export default function ToolsPage() {
  return (
    <div className="flex h-screen w-full bg-transparent">
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <header className="flex h-16 items-center px-6 border-b shrink-0 bg-card/50 backdrop-blur-sm z-10">
          <SidebarTrigger />
          <div className="flex items-center gap-4 ml-4">
            <h1 className="text-xl font-semibold">Tools</h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-4xl"
            >
              <Card className="w-full p-6 bg-card/80 backdrop-blur-sm border-border shadow-2xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-2">Available Tools</h2>
                    <p className="text-muted-foreground">
                    These are the tools that Nova AI can use to help you with your requests.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {tools.map((tool, index) => (
                    <motion.div
                      key={tool.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                    >
                      <Card className="bg-card/95 border-border backdrop-blur-sm shadow-lg hover:shadow-primary/20 hover:-translate-y-2 transition-transform duration-300">
                        <CardHeader className="flex flex-row items-center gap-4">
                          <div className="bg-primary/10 p-3 rounded-md text-primary">
                            {tool.icon}
                          </div>
                          <CardTitle>{tool.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription>{tool.description}</CardDescription>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
        </main>
      </SidebarInset>
    </div>
  )
}
