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
  prompt: `You are an AI assistant designed to help new users get started with the platform.
  Generate a list of diverse suggested prompts that showcase the capabilities of the available AI models.
  These prompts should be engaging, easy to understand, and cover a range of use cases, such as text generation, image creation, and data analysis.
  The suggested prompts are aimed at demonstrating all aspects of the platform.

  Available Models: Gemini

  Here are some suggested prompts:
  1. Write a short story about a futuristic city where AI governs every aspect of life.
  2. Generate an image of a cat wearing sunglasses on a beach.
  3. Brainstorm a list of marketing slogans for a new electric car.
  4. Describe what is Google Gemini?
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

    // Split the prompt result into individual prompts.  This assumes the prompt returns a numbered list.
    const rawPrompts = promptResult.output?.suggestedPrompts || [];

    return {
      suggestedPrompts: rawPrompts,
    };
  }
);
