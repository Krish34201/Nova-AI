
'use client';

import { useState, useRef } from 'react';
import { AppSidebar } from '@/components/app/sidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { homeworkHelper, type HomeworkHelperOutput } from '@/ai/flows/homework-helper';
import { Loader2, Wand2, BookMarked, Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useAccess } from '@/components/access-provider';

const wordLimits = ["20-30 words", "30-40 words", "40-50 words", "50-70 words", "No limit"];
const classes = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);
const subjects = ["Maths", "Science", "English", "Social Science", "History", "Geography"];
const styles = ["Simple", "Detailed", "Exam-Oriented"];

export default function HomeworkPage() {
  const { toast } = useToast();
  const { limitExceeded, incrementRequestCount, requestCount, hasSpecialKey } = useAccess();
  const [question, setQuestion] = useState('');
  const [wordLimit, setWordLimit] = useState(wordLimits[0]);
  const [classLevel, setClassLevel] = useState('none');
  const [subject, setSubject] = useState('none');
  const [style, setStyle] = useState('default');
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [result, setResult] = useState<HomeworkHelperOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImageFile(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  const handleSubmit = async () => {
    if (limitExceeded) {
        toast({
            variant: "destructive",
            title: "Limit Exceeded",
            description: "You have exceeded your daily limit of 20 requests.",
        });
        return;
    }
    if (!question.trim() && !uploadedImage) {
        toast({
            variant: "destructive",
            title: "Input Required",
            description: "Please type a question or upload an image.",
        });
        return;
    }

    setIsLoading(true);
    setResult(null);
    incrementRequestCount();

    try {
        const input = {
            question: question,
            imageDataUri: uploadedImage || undefined,
            wordLimit: wordLimit,
            classLevel: classLevel === 'none' ? undefined : classLevel,
            subject: subject === 'none' ? undefined : subject,
            style: style === 'default' ? undefined : style,
        };
        const response = await homeworkHelper(input);
        setResult(response);
    } catch (error) {
      console.error('Error getting homework help:', error);
      toast({
        variant: "destructive",
        title: "An Error Occurred",
        description: "Sorry, there was an error processing your request. Please try again.",
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
            <BookMarked className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Homework Helper</h1>
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
                <CardTitle className="text-3xl font-bold text-center">AI Homework Helper</CardTitle>
                <CardDescription className="text-center max-w-2xl mx-auto">
                  Need help with your homework? Enter your question or upload an image of it, select your preferences, and let AI provide a clear, accurate, and concise answer.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                    <div className="space-y-4">
                        <Textarea
                            placeholder="Type your question here..."
                            className="w-full resize-none min-h-[150px] bg-input p-4 rounded-lg"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            disabled={isLoading || limitExceeded}
                        />
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                         <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()} disabled={isLoading || limitExceeded}>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload an Image
                        </Button>
                        {uploadedImage && (
                            <div className="relative w-fit mx-auto">
                                <Image src={uploadedImage} alt="Uploaded homework" width={200} height={200} className="rounded-md object-contain border p-1" />
                                <Button variant="ghost" size="icon" className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-muted text-muted-foreground" onClick={removeImage}>
                                    <X className="h-4 w-4"/>
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="font-medium text-sm mb-2 block">Word Limit</label>
                                <Select value={wordLimit} onValueChange={setWordLimit} disabled={isLoading || limitExceeded}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {wordLimits.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                             <div>
                                <label className="font-medium text-sm mb-2 block">Style (Optional)</label>
                                <Select value={style} onValueChange={setStyle} disabled={isLoading || limitExceeded}>
                                    <SelectTrigger><SelectValue placeholder="Select a style" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="default">Default</SelectItem>
                                        {styles.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="font-medium text-sm mb-2 block">Class (Optional)</label>
                                <Select value={classLevel} onValueChange={setClassLevel} disabled={isLoading || limitExceeded}>
                                    <SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        {classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="font-medium text-sm mb-2 block">Subject (Optional)</label>
                                <Select value={subject} onValueChange={setSubject} disabled={isLoading || limitExceeded}>
                                    <SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center mb-8">
                  <Button onClick={handleSubmit} disabled={isLoading || limitExceeded} size="lg" className="rounded-full">
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                      {isLoading ? 'Finding the Answer...' : 'Let AI Do the Homework!'}
                  </Button>
                   {!hasSpecialKey && (
                        <div className="text-center text-muted-foreground text-xs pt-2">
                           {limitExceeded ? 'LIMIT EXCEED 20 REQUEST ONLY PER DAY.' : `${requestCount} / 20 daily requests used.`}
                        </div>
                    )}
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
                  {result && (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <Card className="bg-input/50">
                        <CardHeader>
                          <CardTitle>Answer</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-base whitespace-pre-wrap">{result.answer}</p>
                        </CardContent>
                      </Card>

                     {result.explanation && (
                         <Card className="bg-input/50">
                            <CardHeader>
                            <CardTitle>Explanation</CardTitle>
                            </CardHeader>
                            <CardContent>
                            <p className="text-base whitespace-pre-wrap">{result.explanation}</p>
                            </CardContent>
                        </Card>
                     )}
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
