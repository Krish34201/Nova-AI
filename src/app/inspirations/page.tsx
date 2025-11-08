'use client';

import { AppSidebar } from '@/components/app/sidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartHandshake, Wand2, Loader2 } from 'lucide-react';
import { generateEmotionalContent, type GenerateEmotionalContentOutput } from '@/ai/flows/generate-emotional-content';

type Category = 'Nostalgia & Memories' | 'Love & Heartache' | 'Hope & Healing' | 'Bittersweet Moments' | 'Personal Growth' | 'Inner Strength & Resilience' | 'Encouragement' | 'Self-Discovery';
const categories: Category[] = ['Nostalgia & Memories', 'Love & Heartache', 'Hope & Healing', 'Bittersweet Moments', 'Personal Growth', 'Inner Strength & Resilience', 'Encouragement', 'Self-Discovery'];

const iconMap: { [key: string]: React.ReactNode } = {
  "Poetry": "📜",
  "Short Novel Excerpts / Micro-Stories": "📖",
  "Micro-Meditations / Mindful Moments": "🧘",
  "Letters / Notes": "💌",
  "Emotional Prompts / Journaling Ideas": "✍️",
  "Relatable Life Anecdotes": "💬",
  "Original Lyric-Style Lines": "🎶",
  "Life Advice from a Soul / Tiny Wisdom Nuggets": "✨",
};

export default function InspirationsPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>(categories[0]);
  const [generatedContent, setGeneratedContent] = useState<GenerateEmotionalContentOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateContent = async () => {
    setIsGenerating(true);
    setGeneratedContent(null);
    try {
      const result = await generateEmotionalContent({ category: selectedCategory });
      setGeneratedContent(result);
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const contentAsArray = generatedContent ? Object.values(generatedContent) : [];

  return (
    <div className="flex h-screen w-full bg-transparent">
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <header className="flex h-16 items-center px-6 border-b shrink-0 bg-card/50 backdrop-blur-sm z-10">
          <SidebarTrigger />
          <div className="flex items-center gap-4 ml-4">
            <HeartHandshake className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Reflections</h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Card className="max-w-7xl mx-auto p-6 bg-card/80 backdrop-blur-sm border-border shadow-2xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <CardHeader className="text-center p-0 mb-6">
                <CardTitle className="text-3xl font-bold">Emotional Content Hub</CardTitle>
                <CardDescription>A space for reflection, connection, and inspiration.</CardDescription>
              </CardHeader>
              
              <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(cat)}
                    className="transition-all rounded-full"
                  >
                    {cat}
                  </Button>
                ))}
              </div>

              <div className="flex justify-center mb-8">
                <Button onClick={handleGenerateContent} disabled={isGenerating} size="lg" className="rounded-full">
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                  )}
                  {isGenerating ? 'Generating...' : `Generate for "${selectedCategory}"`}
                </Button>
              </div>

              <AnimatePresence mode="wait">
                {isGenerating && (
                  <motion.div
                    key="loader"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex justify-center"
                  >
                      <CardContent className="pt-6 text-center h-48 flex flex-col items-center justify-center">
                          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                          <p className="text-muted-foreground">Crafting some beautiful thoughts for you...</p>
                      </CardContent>
                  </motion.div>
                )}
              
              {generatedContent && (
                <motion.div
                  key="ai-content"
                  className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: { staggerChildren: 0.07, delayChildren: 0.1 }
                    }
                  }}
                >
                  {contentAsArray.map((item, index) => (
                    <motion.div
                      key={index}
                       variants={{
                          hidden: { y: 20, opacity: 0 },
                          visible: { y: 0, opacity: 1 }
                      }}
                    >
                      <Card className="h-full flex flex-col justify-between transform hover:-translate-y-2 transition-transform duration-300 bg-card/95 border-border backdrop-blur-sm shadow-lg hover:shadow-primary/20">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-3 text-lg">
                            <span className="text-2xl">{iconMap[item.title]}</span>
                            <span>{item.title}</span>
                          </CardTitle>
                          <CardDescription>{item.category}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-lg font-medium italic">"{item.content}"</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {!isGenerating && !generatedContent && (
                <motion.div 
                  className="text-center text-muted-foreground py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <p>Select a category and click "Generate" to fill this space with inspiration.</p>
                </motion.div>
              )}

              </AnimatePresence>
            </motion.div>
          </Card>
        </main>
      </SidebarInset>
    </div>
  );
}
