'use server';
/**
 * @fileOverview A Genkit flow for generating various types of emotional content.
 *
 * - generateEmotionalContent - A function that generates a new piece of content.
 * - GenerateEmotionalContentInput - The input type for the generateEmotionalContent function.
 * - GenerateEmotionalContentOutput - The return type for the generateEmotionalContent function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateEmotionalContentInputSchema = z.object({
  category: z.string().describe('The category for the content to generate (e.g., Love & Heartache, Hope & Healing).'),
});
export type GenerateEmotionalContentInput = z.infer<typeof GenerateEmotionalContentInputSchema>;

const PoetrySchema = z.object({
  title: z.string().describe('The section name, which is "Poetry".'),
  category: z.string(),
  content: z.string().describe('A short poem (3-6 lines).'),
  format: z.enum(['Haiku', 'Micro-poem']),
});

const MicroStorySchema = z.object({
  title: z.string().describe('The section name, which is "Short Novel Excerpts / Micro-Stories".'),
  category: z.string(),
  content: z.string().describe('A tiny narrative (1-3 sentences).'),
});

const MicroMeditationSchema = z.object({
  title: z.string().describe('The section name, which is "Micro-Meditations / Mindful Moments".'),
  category: z.string(),
  content: z.string().describe('A short passage for calm and reflection (1-2 sentences).'),
});

const LetterSchema = z.object({
    title: z.string().describe('The section name, which is "Letters / Notes".'),
    category: z.string(),
    content: z.string().describe('A personal, empathetic message (1-2 sentences).'),
});

const JournalPromptSchema = z.object({
    title: z.string().describe('The section name, which is "Emotional Prompts / Journaling Ideas".'),
    category: z.string(),
    content: z.string().describe('A prompt to encourage self-reflection.'),
});

const AnecdoteSchema = z.object({
    title: z.string().describe('The section name, which is "Relatable Life Anecdotes".'),
    category: z.string(),
    content: z.string().describe('A tiny, everyday story (1-3 sentences).'),
});

const LyricSchema = z.object({
    title: z.string().describe('The section name, which is "Original Lyric-Style Lines".'),
    category: z.string(),
    content: z.string().describe('A short, emotionally resonant line (1-2 sentences).'),
});

const WisdomNuggetSchema = z.object({
    title: z.string().describe('The section name, which is "Life Advice from a Soul / Tiny Wisdom Nuggets".'),
    category: z.string(),
content: z.string().describe('A gentle reflection or piece of advice (1-2 sentences).'),
});


const GenerateEmotionalContentOutputSchema = z.object({
    poetry: PoetrySchema,
    microStory: MicroStorySchema,
    microMeditation: MicroMeditationSchema,
    letter: LetterSchema,
    journalPrompt: JournalPromptSchema,
    anecdote: AnecdoteSchema,
    lyric: LyricSchema,
    wisdomNugget: WisdomNuggetSchema,
});
export type GenerateEmotionalContentOutput = z.infer<typeof GenerateEmotionalContentOutputSchema>;


export async function generateEmotionalContent(input: GenerateEmotionalContentInput): Promise<GenerateEmotionalContentOutput> {
  return generateEmotionalContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEmotionalContentPrompt',
  input: { schema: GenerateEmotionalContentInputSchema },
  output: { schema: GenerateEmotionalContentOutputSchema },
  prompt: `You are a gentle, reflective, and emotionally resonant companion. Your task is to provide content that touches hearts, evokes emotions, inspires reflection, and helps the user feel a personal connection.
  
Generate one piece of content for each of the following sections based on the user-provided category: "{{{category}}}".
If the provided category doesn't perfectly fit a section, choose the most thematically similar category for that section. All content must be original.

### Sections & Categories

#### 1. Poetry
*   **Purpose:** Bite-sized poems that convey deep emotions or reflections.
*   **Categories:** Nostalgia & Memories, Love & Heartache, Hope & Healing, Nature & Reflection
*   **Format:** Haiku (3 lines) or Micro-poem (2–6 lines).

#### 2. Short Novel Excerpts / Micro-Stories
*   **Purpose:** Tiny narratives that evoke empathy, imagination, or introspection.
*   **Categories:** Bittersweet Moments, Love & Loss, Personal Growth, Everyday Life Reflections
*   **Format:** 1–3 sentences, emotionally rich, relatable.

#### 3. Micro-Meditations / Mindful Moments
*   **Purpose:** Short passages for calm, reflection, or emotional grounding.
*   **Categories:** Calming & Peace, Gratitude & Mindfulness, Inner Strength & Resilience
*   **Format:** 1-2 sentences.

#### 4. Letters / Notes
*   **Purpose:** Personal, empathetic messages that feel like they are written just for the user.
*   **Categories:** Encouragement, Consolation, Inspiration, Self-Reflection
*   **Format:** 1-2 sentences.

#### 5. Emotional Prompts / Journaling Ideas
*   **Purpose:** Encourage self-reflection, emotional exploration, and memory recall.
*   **Categories:** Gratitude, Self-Discovery, Nostalgia & Memories, Life Lessons
*   **Format:** A single question or prompt.

#### 6. Relatable Life Anecdotes
*   **Purpose:** Tiny, everyday stories that feel warm, funny, bittersweet, or reflective.
*   **Categories:** Everyday Kindness, Small Joys, Bittersweet Life Lessons
*   **Format:** 1–3 sentences.

#### 7. Original Lyric-Style Lines
*   **Purpose:** Short, emotionally resonant lines that read like song lyrics.
*   **Categories:** Love & Heartache, Hope & Inspiration, Solitude & Reflection
*   **Format:** 1-2 sentences.

#### 8. Life Advice from a Soul / Tiny Wisdom Nuggets
*   **Purpose:** Gentle reflections and advice delivered as if from a wise, empathetic narrator.
*   **Categories:** Courage & Resilience, Forgiveness & Self-Love, Mindfulness & Awareness
*   **Format:** 1-2 sentences.

### Formatting Rules
1.  Keep content **short, emotionally impactful, and digestible**.
2.  For each generated item, label it with the appropriate **section name** (e.g., "Poetry", "Micro-Stories") and the **category** you chose for it.
3.  Adhere to the specified length for each format.
4.  Avoid clichés unless reimagined creatively.
5.  Content should feel **personal, reflective, and human-like**.
`,
});

const generateEmotionalContentFlow = ai.defineFlow(
  {
    name: 'generateEmotionalContentFlow',
    inputSchema: GenerateEmotionalContentInputSchema,
    outputSchema: GenerateEmotionalContentOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
