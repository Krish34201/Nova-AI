'use server';

/**
 * @fileOverview AI agent for creating structured, exam-focused study notes from chapter text.
 *
 * - studyAiSummarizer - A function that orchestrates the summarization process.
 * - StudyAiSummarizerInput - The input type for the studyAiSummarizer function.
 * - StudyAiSummarizerOutput - The return type for the studyAiSummarizer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const StudyAiSummarizerInputSchema = z.object({
  chapterText: z.string().describe('The full text content of the chapter to be summarized.'),
});
export type StudyAiSummarizerInput = z.infer<typeof StudyAiSummarizerInputSchema>;

export const StudyAiSummarizerOutputSchema = z.object({
  easyPoints: z.array(z.string()).describe('A list of the most fundamental and easy-to-understand points from the chapter.'),
  mediumPoints: z.array(z.string()).describe('A list of the more detailed and intermediate-level points.'),
  advancedPoints: z.array(z.string()).describe('A list of advanced concepts, complex topics, or in-depth explanations for students aiming for top marks.'),
  importantKeywords: z.array(z.object({
    keyword: z.string(),
    definition: z.string(),
  })).describe('A list of must-remember keywords, formulas, or definitions with their explanations.'),
});
export type StudyAiSummarizerOutput = z.infer<typeof StudyAiSummarizerOutputSchema>;


export async function studyAiSummarizer(input: StudyAiSummarizerInput): Promise<StudyAiSummarizerOutput> {
  return studyAiSummarizerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'studyAiSummarizerPrompt',
  input: {schema: StudyAiSummarizerInputSchema},
  output: {schema: StudyAiSummarizerOutputSchema},
  prompt: `You are an expert academic tutor AI. Your task is to read the provided chapter text and convert it into a structured, easy-to-digest study guide for a student preparing for an exam.

Your response must be organized into four distinct sections:
1.  **Easy Points:** Break down the most fundamental concepts. These should be the absolute basics that every student must know.
2.  **Medium Points:** Elaborate on the basics with more detail, connecting concepts and providing further explanations.
3.  **Advanced Points:** Cover the complex, nuanced, or in-depth topics that would be required for a student to achieve a top score.
4.  **Important Keywords / Formulas:** Identify and list the critical keywords, definitions, formulas, or laws from the text. For each, provide a concise definition or explanation.

Analyze the following chapter text and generate the study guide.

Chapter Text:
{{{chapterText}}}

Generate the structured study guide.`,
});

const studyAiSummarizerFlow = ai.defineFlow(
  {
    name: 'studyAiSummarizerFlow',
    inputSchema: StudyAiSummarizerInputSchema,
    outputSchema: StudyAiSummarizerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
