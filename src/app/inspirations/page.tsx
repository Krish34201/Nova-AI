'use client';

import { AppSidebar } from '@/components/app/sidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { quotes, Quote } from '@/lib/quotes';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Shuffle } from 'lucide-react';

type Category = 'Motivational' | 'Emotional' | 'Love' | 'Friendship' | 'Life' | 'Humor' | 'Inspirational' | 'Success';
const categories: Category[] = ['Motivational', 'Emotional', 'Love', 'Friendship', 'Life', 'Humor', 'Inspirational', 'Success'];

const QUOTES_PER_PAGE = 6;

export default function InspirationsPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [visibleQuotes, setVisibleQuotes] = useState(QUOTES_PER_PAGE);
  const [randomQuote, setRandomQuote] = useState<Quote | null>(null);

  const filteredQuotes = useMemo(() => {
    if (selectedCategory === 'All') {
      return quotes;
    }
    return quotes.filter((q) => q.category === selectedCategory);
  }, [selectedCategory]);

  const handleLoadMore = () => {
    setVisibleQuotes((prev) => prev + QUOTES_PER_PAGE);
  };

  const handleRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setRandomQuote(quotes[randomIndex]);
    setSelectedCategory('All');
    setVisibleQuotes(QUOTES_PER_PAGE);
  };

  const handleCategorySelect = (category: Category | 'All') => {
    setSelectedCategory(category);
    setVisibleQuotes(QUOTES_PER_PAGE);
    setRandomQuote(null);
  };

  const quotesToShow = filteredQuotes.slice(0, visibleQuotes);
  const canLoadMore = visibleQuotes < filteredQuotes.length;

  return (
    <div className="flex h-screen w-full bg-background">
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <header className="flex h-16 items-center px-6 border-b shrink-0 bg-card/50 backdrop-blur-sm z-10">
          <SidebarTrigger />
          <div className="flex items-center gap-4 ml-4">
            <Lightbulb className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Inspirations</h1>
          </div>
          <div className="ml-auto">
            <Button onClick={handleRandomQuote}>
              <Shuffle className="mr-2 h-4 w-4" />
              Random Quote
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              <Button
                variant={selectedCategory === 'All' ? 'default' : 'outline'}
                onClick={() => handleCategorySelect('All')}
              >
                All
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  onClick={() => handleCategorySelect(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>

            <AnimatePresence>
              {randomQuote ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex justify-center"
                >
                  <Card className="w-full max-w-2xl shadow-2xl bg-card/80 backdrop-blur-sm transform hover:scale-105 transition-transform duration-300">
                    <CardHeader>
                      <CardTitle className="text-center text-primary">{randomQuote.category}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-2xl font-semibold mb-4">"{randomQuote.quote}"</p>
                      <p className="text-lg text-muted-foreground">- {randomQuote.author}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {quotesToShow.map((quote, index) => (
                    <motion.div
                      key={`${quote.quote}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (index % QUOTES_PER_PAGE) * 0.1 }}
                    >
                      <Card className="h-full flex flex-col justify-between transform hover:-translate-y-1 transition-transform duration-300">
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

            {!randomQuote && canLoadMore && (
              <div className="flex justify-center mt-8">
                <Button onClick={handleLoadMore}>Load More</Button>
              </div>
            )}
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
