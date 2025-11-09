'use client';

import { useState } from 'react';
import { AppSidebar } from '@/components/app/sidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { automateComplexTask } from '@/ai/flows/automate-complex-task';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAccess } from '@/components/access-provider';
import { useToast } from '@/hooks/use-toast';

export default function AgentsPage() {
  const { toast } = useToast();
  const { limitExceeded, incrementRequestCount, requestCount, hasSpecialKey } = useAccess();
  const [taskDescription, setTaskDescription] = useState('');
  const [automationResult, setAutomationResult] = useState<{ steps: string[]; explanation: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAutomate = async () => {
    if (limitExceeded) {
      toast({
        variant: 'destructive',
        title: 'Limit Exceeded',
        description: 'You have exceeded your daily limit of 20 requests.',
      });
      return;
    }
    if (taskDescription.trim() === '') return;

    setIsLoading(true);
    setAutomationResult(null);
    incrementRequestCount();

    try {
      const result = await automateComplexTask({ taskDescription });
      setAutomationResult(result);
    } catch (error) {
      console.error('Error automating task:', error);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: 'Sorry, there was an error processing your request. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-transparent">
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <header className="flex h-16 items-center px-6 border-b shrink-0 bg-card/50 backdrop-blur-sm z-10">
          <SidebarTrigger />
          <div className="flex items-center gap-4 ml-4">
            <h1 className="text-xl font-semibold">AI Agents</h1>
          </div>
        </header>

        <main className="flex-1 flex flex-col p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-3xl mx-auto"
          >
            <Card className="shadow-2xl bg-card/80 backdrop-blur-sm border-border">
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
                    className="w-full resize-none min-h-[100px] bg-input"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    disabled={isLoading || limitExceeded}
                  />
                  <div className="flex flex-col items-center">
                    <Button onClick={handleAutomate} disabled={isLoading || !taskDescription.trim() || limitExceeded}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Automate'}
                    </Button>
                    {!hasSpecialKey && (
                        <div className="text-center text-muted-foreground text-xs pt-2">
                            {limitExceeded ? 'LIMIT EXCEED 20 REQUEST ONLY PER DAY.' : `${requestCount} / 20 daily requests used.`}
                        </div>
                    )}
                  </div>
                </div>

                {automationResult && (
                  <motion.div
                    className="mt-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <h3 className="text-lg font-semibold">Generated Plan</h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <h4 className="font-semibold">Steps:</h4>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          {automationResult.steps.map((step, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              {step}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold">Explanation:</h4>
                        <p className="text-sm text-muted-foreground mt-2">{automationResult.explanation}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </SidebarInset>
    </div>
  );
}
