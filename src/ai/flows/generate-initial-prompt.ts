'use server';

/**
 * @fileOverview A flow to generate initial prompts for new users.
 *
 * - generateInitialPrompts - A function that generates initial prompts tailored to the available AI models and tools.
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
  Generate a list of diverse suggested prompts that showcase the capabilities of the available AI models and tools.
  These prompts should be engaging, easy to understand, and cover a range of use cases, such as text generation, image creation, and data analysis.
  The prompts should be tailored based on the available tools, referencing the specific tools, so that the user understands their use.
  The suggested prompts are aimed at demonstrating all aspects of the platform.

  {{#each availableTools}}
  Tool Name: {{this.name}}
  Tool Description: {{this.description}}
  {{/each}}

  Available Models: Gemini

  Here are some suggested prompts:
  1. Write a short story about a futuristic city where AI governs every aspect of life.
  2. Generate an image of a cat wearing sunglasses on a beach.
  3. Use the available tools to fetch top news headlines about AI and summarize them in three bullet points.
  4. Brainstorm a list of marketing slogans for a new electric car.
  5. Describe what is Google Gemini?
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
    // In a real application, available tools might be fetched from a database or configuration.
    // For this example, we'll define them directly here.

    const availableTools = [
      {
        name: 'webSearch',
        description: 'A tool to search the web for information.',
      },
      {
        name: 'codeExecution',
        description: 'A tool to execute code snippets.',
      },
    ];

    const promptResult = await initialPromptsPrompt({
      availableTools: availableTools,
    });

    // Split the prompt result into individual prompts.  This assumes the prompt returns a numbered list.
    const rawPrompts = promptResult.output?.suggestedPrompts || [];

    return {
      suggestedPrompts: rawPrompts,
    };
  }
);
