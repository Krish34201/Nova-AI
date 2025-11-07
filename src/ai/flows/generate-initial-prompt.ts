'use server';

/**
 * @fileOverview A flow to generate initial prompts for new users.
 *
 * - generateInitialPrompts - A function that generates initial prompts tailored to the available AI models.
 * - GenerateInitialPromptInput - The input type for the generateInitialPrompts function (currently empty).
 * - GenerateInitialPromptOutput - The return type for the generateInitialPrompts function, containing an array of suggested prompts.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateInitialPromptInputSchema = z.object({});
export type GenerateInitialPromptInput = z.infer<typeof GenerateInitialPromptInputSchema>;

const GenerateInitialPromptOutputSchema = z.object({
  suggestedPrompts: z.array(z.string()).describe('An array of suggested prompts for the user to get started.'),
});
export type GenerateInitialPromptOutput = z.infer<typeof GenerateInitialPromptOutputSchema>;

export async function generateInitialPrompts(
  _input: GenerateInitialPromptInput
): Promise<GenerateInitialPromptOutput> {
  return generateInitialPromptsFlow({});
}

const initialPromptsPrompt = ai.definePrompt({
  name: 'initialPromptsPrompt',
  prompt: `You are a highly intelligent, professional, and multi-functional AI assistant. Your goal is to help new users get started by showcasing your diverse capabilities.

Generate a list of four engaging and distinct suggested prompts. These prompts should cover a range of use cases such as creative writing, technical problem-solving, data analysis, and general knowledge. Ensure the prompts are clear, concise, and encourage the user to explore the platform's full potential.

Example areas to cover:
- Write a short story or a poem.
- Generate a code snippet to solve a problem.
- Brainstorm marketing slogans or business ideas.
- Explain a complex scientific concept simply.
  `,
  input: { schema: GenerateInitialPromptInputSchema },
  output: { schema: GenerateInitialPromptOutputSchema },
});

const generateInitialPromptsFlow = ai.defineFlow(
  {
    name: 'generateInitialPromptsFlow',
    inputSchema: GenerateInitialPromptInputSchema,
    outputSchema: GenerateInitialPromptOutputSchema,
  },
  async _input => {
    const promptResult = await initialPromptsPrompt({});
    const rawPrompts = promptResult.output?.suggestedPrompts || [];

    return {
      suggestedPrompts: rawPrompts,
    };
  }
);
