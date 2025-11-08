'use client';

import { useState } from 'react';
import { AppSidebar } from '@/components/app/sidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { generateStory, type GenerateStoryInput } from '@/ai/flows/generate-story';
import { Loader2, Wand2, BookText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const categories = [
  "Thriller / Suspense",
  "Romance / Love",
  "Horror / Supernatural",
  "Adventure / Action",
  "Fantasy / Sci-Fi",
  "Comedy / Humor",
  "Drama / Emotional",
  "Historical / Period",
  "Soulful / Heartfelt",
];

const storyLengths: GenerateStoryInput['length'][] = ["Micro", "Short", "Long"];
const moods = ["Dark", "Lighthearted", "Inspiring", "Sad", "Exciting", "Mysterious"];

export default function StoriesPage() {
  const [category, setCategory] = useState<string>(categories[0]);
  const [length, setLength] = useState<GenerateStoryInput['length']>(storyLengths[0]);
  const [mood, setMood] = useState<string>(moods[0]);
  const [characterNames, setCharacterNames] = useState('');
  const [characterTraits, setCharacterTraits] = useState('');
  const [generatedStory, setGeneratedStory] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateStory = async () => {
    setIsLoading(true);
    setGeneratedStory('');
    try {
      const result = await generateStory({
        category,
        length,
        mood,
        characterNames,
        characterTraits,
      });
      setGeneratedStory(result.story);
    } catch (error) {
      console.error('Error generating story:', error);
      setGeneratedStory('Sorry, there was an error generating your story. Please try again.');
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
            <BookText className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Stories</h1>
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
                <CardTitle className="text-3xl font-bold text-center">AI Story Generator</CardTitle>
                <CardDescription className="text-center max-w-2xl mx-auto">
                  Welcome to the Stories section! Choose a category and let AI craft a unique story just for you. You can select the genre, mood, and story length to match your taste.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  {/* Category */}
                  <div className="space-y-2">
                    <label className="font-medium">Category</label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                      <SelectContent>
                        {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Story Length */}
                  <div className="space-y-2">
                    <label className="font-medium">Story Length</label>
                    <Select value={length} onValueChange={(v) => setLength(v as GenerateStoryInput['length'])}>
                      <SelectTrigger><SelectValue placeholder="Select length" /></SelectTrigger>
                      <SelectContent>
                        {storyLengths.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Mood/Tone */}
                  <div className="space-y-2">
                    <label className="font-medium">Mood / Tone</label>
                    <Select value={mood} onValueChange={setMood}>
                      <SelectTrigger><SelectValue placeholder="Select a mood" /></SelectTrigger>
                      <SelectContent>
                        {moods.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Character Names */}
                  <div className="space-y-2">
                    <label className="font-medium">Character Names (Optional)</label>
                    <Input 
                      placeholder="e.g., Alex, Maria"
                      value={characterNames}
                      onChange={(e) => setCharacterNames(e.target.value)}
                    />
                  </div>
                  {/* Character Traits */}
                  <div className="space-y-2">
                    <label className="font-medium">Character Traits (Optional)</label>
                    <Input 
                      placeholder="e.g., Brave, witty, curious"
                      value={characterTraits}
                      onChange={(e) => setCharacterTraits(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-center mb-8">
                  <Button onClick={handleGenerateStory} disabled={isLoading} size="lg" className="rounded-full">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={isLoading ? "loading" : "ready"}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center"
                      >
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                        {isLoading ? 'Crafting Your Story...' : 'Let Your Story Unfold!'}
                      </motion.span>
                    </AnimatePresence>
                  </Button>
                </div>
                
                <AnimatePresence>
                  {isLoading && (
                     <motion.div
                        key="loader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex justify-center items-center h-48"
                     >
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                     </motion.div>
                  )}
                  {generatedStory && (
                    <motion.div
                      key="story"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className="bg-input/50">
                        <CardHeader>
                          <CardTitle>Your Story</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Textarea
                            readOnly
                            value={generatedStory}
                            className="w-full resize-none min-h-[300px] bg-transparent border-none text-base"
                          />
                        </CardContent>
                      </Card>
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
