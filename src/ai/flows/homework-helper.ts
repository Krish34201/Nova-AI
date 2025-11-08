'use server';

/**
 * @fileOverview An AI-powered homework helper.
 *
 * - homeworkHelper - A function that answers homework questions from text or images.
 * - HomeworkHelperInput - The input type for the homeworkHelper function.
 * - HomeworkHelperOutput - The return type for the homeworkHelper function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const HomeworkHelperInputSchema = z.object({
  question: z.string().optional().describe('The homework question typed by the user.'),
  imageDataUri: z.string().optional().describe("An image of the homework question, as a data URI."),
  wordLimit: z.string().describe('The desired word limit for the answer (e.g., "20-30 words", "No limit").'),
  subject: z.string().optional().describe('The subject of the question (e.g., Maths, Science).'),
  style: z.string().optional().describe('The desired style for the answer (e.g., Simple, Detailed).'),
});
export type HomeworkHelperInput = z.infer<typeof HomeworkHelperInputSchema>;

export const HomeworkHelperOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the homework question.'),
  explanation: z.string().optional().describe('An optional, short explanation that provides context for the answer.'),
});
export type HomeworkHelperOutput = z.infer<typeof HomeworkHelperOutputSchema>;

export async function homeworkHelper(input: HomeworkHelperInput): Promise<HomeworkHelperOutput> {
  // Basic validation to ensure at least one input is provided
  if (!input.question && !input.imageDataUri) {
    throw new Error('Either a question or an image must be provided.');
  }
  return homeworkHelperFlow(input);
}

const prompt = ai.definePrompt({
  name: 'homeworkHelperPrompt',
  input: { schema: HomeworkHelperInputSchema },
  output: { schema: HomeworkHelperOutputSchema },
  prompt: `You are an expert tutor AI, designed to help students with their homework. Your goal is to provide clear, accurate, and concise answers based on the user's request.

Analyze the user's submission, which may be a typed question or an image of a question.

**Task:**
1.  Identify the core question from the provided input.
2.  Formulate a precise and easy-to-understand answer.
3.  Adhere strictly to the requested word limit: {{{wordLimit}}}.
4.  If a subject is specified ({{{subject}}}), use knowledge specific to that field.
5.  If a style is specified ({{{style}}}), adopt that tone.
6.  Provide a short, helpful explanation along with the answer to clarify the concept.

**User's Request:**
{{#if question}}
Question: {{{question}}}
{{/if}}
{{#if imageDataUri}}
Question from image: {{media url=imageDataUri}}
{{/if}}

Generate the answer and a brief explanation.`,
});

const homeworkHelperFlow = ai.defineFlow(
  {
    name: 'homeworkHelperFlow',
    inputSchema: HomeworkHelperInputSchema,
    outputSchema: HomeworkHelperOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
