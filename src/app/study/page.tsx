'use client';

import { useState } from 'react';
import { AppSidebar } from '@/components/app/sidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { studyAiSummarizer, type StudyAiSummarizerOutput } from '@/ai/flows/study-ai-summarizer';
import { GraduationCap, Loader2, Wand2, Lightbulb, Brain, Gem, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudyAiPage() {
  const [chapterText, setChapterText] = useState('');
  const [summaryResult, setSummaryResult] = useState<StudyAiSummarizerOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSummarize = async () => {
    if (chapterText.trim() === '') return;

    setIsLoading(true);
    setSummaryResult(null);

    try {
      const result = await studyAiSummarizer({ chapterText });
      setSummaryResult(result);
    } catch (error) {
      console.error('Error summarizing chapter:', error);
      // You could show a toast or an error message here
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
            <GraduationCap className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Study AI</h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-5xl mx-auto"
          >
            <Card className="shadow-2xl bg-card/80 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-center">Smart Chapter Summarizer</CardTitle>
                <CardDescription className="text-center">
                  Paste your chapter text below and the AI will create a structured study guide for you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 mb-6">
                  <Textarea
                    placeholder="Enter your Class, Subject and chapter to let AI summarize the chapter for you."
                    className="w-full resize-none min-h-[200px] bg-input p-4 rounded-lg"
                    value={chapterText}
                    onChange={(e) => setChapterText(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button onClick={handleSummarize} disabled={isLoading || !chapterText.trim()} size="lg">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                    {isLoading ? 'Analyzing...' : 'Generate Study Guide'}
                  </Button>
                </div>

                <AnimatePresence>
                  {isLoading && (
                    <motion.div
                      key="loader"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex justify-center p-8"
                    >
                      <CardContent className="pt-6 text-center h-48 flex flex-col items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Simplifying your chapter now...</p>
                      </CardContent>
                    </motion.div>
                  )}

                  {summaryResult && (
                    <motion.div
                      className="mt-6 space-y-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {/* Easy Points */}
                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <Card className="h-full bg-card/90">
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Lightbulb className="text-green-400" /> Easy Points</CardTitle>
                                <CardDescription>Fundamental concepts to start with.</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <ul className="list-disc list-inside space-y-2">
                                  {summaryResult.easyPoints.map((point, i) => <li key={i}>{point}</li>)}
                                </ul>
                              </CardContent>
                            </Card>
                          </motion.div>
                          
                          {/* Medium Points */}
                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                            <Card className="h-full bg-card/90">
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Brain className="text-yellow-400" /> Medium Points</CardTitle>
                                <CardDescription>Detailed explanations and connections.</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <ul className="list-disc list-inside space-y-2">
                                  {summaryResult.mediumPoints.map((point, i) => <li key={i}>{point}</li>)}
                                </ul>
                              </CardContent>
                            </Card>
                          </motion.div>

                          {/* Advanced Points */}
                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                            <Card className="h-full bg-card/90">
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Gem className="text-purple-400" /> Advanced Points</CardTitle>
                                <CardDescription>In-depth topics for top scores.</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <ul className="list-disc list-inside space-y-2">
                                  {summaryResult.advancedPoints.map((point, i) => <li key={i}>{point}</li>)}
                                </ul>
                              </CardContent>
                            </Card>
                          </motion.div>
                      </div>

                      {/* Important Keywords */}
                       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                          <Card className="bg-card/90">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Key className="text-blue-400" /> Important Keywords & Definitions</CardTitle>
                                <CardDescription>Must-remember terms, formulas, and laws for quick revision.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                {summaryResult.importantKeywords.map((item, i) => (
                                    <div key={i} className="p-3 rounded-md bg-input border border-border/50">
                                    <p><strong>{item.keyword}:</strong> {item.definition}</p>
                                    </div>
                                ))}
                                </div>
                            </CardContent>
                          </Card>
                       </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </SidebarInset>
    </div>
  );
}
