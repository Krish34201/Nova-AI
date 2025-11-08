'use server';

/**
 * @fileOverview A Genkit flow for generating stories based on user specifications.
 *
 * - generateStory - A function that generates a story.
 * - GenerateStoryInput - The input type for the generateStory function.
 * - GenerateStoryOutput - The return type for the generateStory function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const GenerateStoryInputSchema = z.object({
  category: z.string().describe('The genre of the story (e.g., Thriller, Romance).'),
  length: z.enum(['Micro', 'Short', 'Long']).describe('The desired length of the story.'),
  mood: z.string().describe('The mood or tone of the story (e.g., Dark, Lighthearted).'),
  characterNames: z.string().optional().describe('Optional custom names for characters.'),
  characterTraits: z.string().optional().describe('Optional traits for main characters.'),
});
export type GenerateStoryInput = z.infer<typeof GenerateStoryInputSchema>;

export const GenerateStoryOutputSchema = z.object({
  story: z.string().describe('The generated story text.'),
});
export type GenerateStoryOutput = z.infer<typeof GenerateStoryOutputSchema>;

export async function generateStory(input: GenerateStoryInput): Promise<GenerateStoryOutput> {
  return generateStoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStoryPrompt',
  input: { schema: GenerateStoryInputSchema },
  output: { schema: GenerateStoryOutputSchema },
  prompt: `You are a master storyteller. Your task is to write a compelling story based on the user's specifications.

Genre/Category: {{{category}}}
Story Length: {{{length}}} (Micro: 1-2 paragraphs, Short: 1-2 pages, Long: chapter-length)
Mood/Tone: {{{mood}}}

{{#if characterNames}}
Main Character Names: {{{characterNames}}}
{{/if}}
{{#if characterTraits}}
Main Character Traits: {{{characterTraits}}}
{{/if}}

Please craft a unique and engaging story that fits these criteria. The story should have a clear beginning, middle, and end. Make it immersive and memorable.

Generate the story now.`,
});

const generateStoryFlow = ai.defineFlow(
  {
    name: 'generateStoryFlow',
    inputSchema: GenerateStoryInputSchema,
    outputSchema: GenerateStoryOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
