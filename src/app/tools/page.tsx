import { AppSidebar } from '@/components/app/sidebar'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Code2, Search } from 'lucide-react'

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
    <div className="flex h-screen w-full bg-background">
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <header className="flex h-16 items-center px-6 border-b shrink-0 bg-card">
          <SidebarTrigger />
          <div className="flex items-center gap-4 ml-4">
            <h1 className="text-xl font-semibold">Tools</h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-2">Available Tools</h2>
            <p className="text-muted-foreground mb-6">
              These are the tools that Nova AI can use to help you with your requests.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              {tools.map((tool) => (
                <Card key={tool.name}>
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
              ))}
            </div>
          </div>
        </div>
      </SidebarInset>
    </div>
  )
}
