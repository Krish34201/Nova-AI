'use client';

import { useState } from 'react';
import { AppSidebar } from '@/components/app/sidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { automateComplexTask } from '@/ai/flows/automate-complex-task';
import { Loader2 } from 'lucide-react';

export default function AgentsPage() {
  const [taskDescription, setTaskDescription] = useState('');
  const [automationResult, setAutomationResult] = useState<{ steps: string[]; explanation: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAutomate = async () => {
    if (taskDescription.trim() === '') return;

    setIsLoading(true);
    setAutomationResult(null);

    try {
      const result = await automateComplexTask({ taskDescription });
      setAutomationResult(result);
    } catch (error) {
      console.error('Error automating task:', error);
      // You could show a toast or an error message here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-background">
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <header className="flex h-16 items-center px-6 border-b shrink-0 bg-card">
          <SidebarTrigger />
          <div className="flex items-center gap-4 ml-4">
            <h1 className="text-xl font-semibold">AI Agents</h1>
          </div>
        </header>

        <div className="flex-1 flex flex-col overflow-hidden p-6">
          <Card className="max-w-3xl mx-auto w-full">
            <CardHeader>
              <CardTitle>Automate a Complex Task</CardTitle>
              <CardDescription>
                Describe a complex task, and our AI agent will break it down into simpler, actionable steps for you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Textarea
                  placeholder="e.g., Plan a 3-day trip to Paris for a family of four..."
                  className="w-full resize-none min-h-[100px]"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  disabled={isLoading}
                />
                <Button onClick={handleAutomate} disabled={isLoading || !taskDescription.trim()}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Automate'}
                </Button>
              </div>

              {automationResult && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold">Generated Plan</h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <h4 className="font-semibold">Steps:</h4>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        {automationResult.steps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold">Explanation:</h4>
                      <p className="text-sm text-muted-foreground mt-2">{automationResult.explanation}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </div>
  );
}
