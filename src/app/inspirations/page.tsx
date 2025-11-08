'use client';

import { AppSidebar } from '@/components/app/sidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { quotes, Quote } from '@/lib/quotes';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Shuffle, Loader2 } from 'lucide-react';
import { generateQuote } from '@/ai/flows/generate-quote';


type Category = 'Motivational' | 'Emotional' | 'Love' | 'Friendship' | 'Life' | 'Humor' | 'Inspirational' | 'Success';
const categories: Category[] = ['Motivational', 'Emotional', 'Love', 'Friendship', 'Life', 'Humor', 'Inspirational', 'Success'];

const QUOTES_PER_PAGE = 6;

export default function InspirationsPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [visibleQuotes, setVisibleQuotes] = useState(QUOTES_PER_PAGE);
  const [aiQuotes, setAiQuotes] = useState<Quote[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredQuotes = useMemo(() => {
    if (selectedCategory === 'All') {
      return quotes;
    }
    return quotes.filter((q) => q.category === selectedCategory);
  }, [selectedCategory]);

  const handleLoadMore = () => {
    setVisibleQuotes((prev) => prev + QUOTES_PER_PAGE);
  };

  const handleGenerateAiQuotes = async () => {
    setIsGenerating(true);
    setAiQuotes(null);
    try {
      const result = await generateQuote({ category: selectedCategory });
      setAiQuotes(result.quotes as Quote[]);
    } catch (error) {
      console.error("Error generating quotes:", error);
      // Optionally, show an error toast to the user
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCategorySelect = (category: Category | 'All') => {
    setSelectedCategory(category);
    setVisibleQuotes(QUOTES_PER_PAGE);
    setAiQuotes(null);
  };

  const quotesToShow = filteredQuotes.slice(0, visibleQuotes);
  const canLoadMore = visibleQuotes < filteredQuotes.length;
  const showStaticContent = !aiQuotes && !isGenerating;

  return (
    <div className="flex h-screen w-full bg-transparent">
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <header className="flex h-16 items-center px-6 border-b shrink-0 bg-card/50 backdrop-blur-sm z-10">
          <SidebarTrigger />
          <div className="flex items-center gap-4 ml-4">
            <Lightbulb className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Quotes</h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Card className="max-w-7xl mx-auto p-6 bg-card/80 backdrop-blur-sm border-border shadow-2xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                <Button
                  variant={selectedCategory === 'All' ? 'default' : 'outline'}
                  onClick={() => handleCategorySelect('All')}
                  className="transition-all"
                >
                  All
                </Button>
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    onClick={() => handleCategorySelect(cat)}
                    className="transition-all"
                  >
                    {cat}
                  </Button>
                ))}
              </div>

              <div className="flex justify-center mb-8">
                <Button onClick={handleGenerateAiQuotes} disabled={isGenerating} size="lg">
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Shuffle className="mr-2 h-4 w-4" />
                  )}
                  {isGenerating ? 'Generating...' : 'Generate AI Quotes'}
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
                          <p className="text-muted-foreground">Generating your inspiration...</p>
                      </CardContent>
                  </motion.div>
                )}
              
              {aiQuotes && (
                <motion.div
                  key="ai-quotes"
                  className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.05 }}
                >
                  <div className="md:col-span-2 lg:col-span-3 text-center mb-4">
                      <h2 className="text-2xl font-bold">AI Generated Quotes</h2>
                      <p className="text-muted-foreground">Category: {selectedCategory}</p>
                  </div>
                  {aiQuotes.map((quote, index) => (
                    <motion.div
                      key={`${quote.quote}-${index}`}
                      variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 },
                      }}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="h-full flex flex-col justify-between transform hover:-translate-y-2 transition-transform duration-300 bg-card/95 border-border backdrop-blur-sm shadow-lg hover:shadow-primary/20">
                        <CardContent className="pt-6">
                          <p className="text-lg font-medium">"{quote.quote}"</p>
                        </CardContent>
                        <CardHeader className="pt-0">
                          <CardDescription>- {quote.author}</CardDescription>
                        </CardHeader>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {showStaticContent && (
                <motion.div
                  key="static-quotes"
                  className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {quotesToShow.map((quote, index) => (
                    <motion.div
                      key={`${quote.quote}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (index % QUOTES_PER_PAGE) * 0.05 }}
                    >
                      <Card className="h-full flex flex-col justify-between transform hover:-translate-y-2 transition-transform duration-300 bg-card/95 border-border backdrop-blur-sm shadow-lg hover:shadow-primary/20">
                        <CardContent className="pt-6">
                          <p className="text-lg font-medium">"{quote.quote}"</p>
                        </CardContent>
                        <CardHeader className="pt-0">
                          <CardDescription>- {quote.author}</CardDescription>
                        </CardHeader>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
              </AnimatePresence>

              {showStaticContent && canLoadMore && (
                <div className="flex justify-center mt-8">
                  <Button onClick={handleLoadMore}>Load More</Button>              </div>
              )}
            </motion.div>
          </Card>
        </main>
      </SidebarInset>
    </div>
  );
}
