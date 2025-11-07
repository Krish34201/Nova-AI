'use server';

/**
 * @fileOverview AI agent for automating complex tasks by breaking them down into simpler steps.
 *
 * - automateComplexTask - A function that orchestrates the automation process.
 * - AutomateComplexTaskInput - The input type for the automateComplexTask function.
 * - AutomateComplexTaskOutput - The return type for the automateComplexTask function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomateComplexTaskInputSchema = z.object({
  taskDescription: z
    .string()
    .describe('A detailed description of the complex task to automate.'),
});
export type AutomateComplexTaskInput = z.infer<typeof AutomateComplexTaskInputSchema>;

const AutomateComplexTaskOutputSchema = z.object({
  steps: z
    .array(z.string())
    .describe('A list of steps to accomplish the complex task.'),
  explanation: z
    .string()
    .describe('An explanation of why the task was broken down in this way.'),
});
export type AutomateComplexTaskOutput = z.infer<typeof AutomateComplexTaskOutputSchema>;

export async function automateComplexTask(input: AutomateComplexTaskInput): Promise<AutomateComplexTaskOutput> {
  return automateComplexTaskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'automateComplexTaskPrompt',
  input: {schema: AutomateComplexTaskInputSchema},
  output: {schema: AutomateComplexTaskOutputSchema},
  prompt: `You are an AI agent designed to automate complex tasks. Your job is to break down a complex task into a series of simpler, actionable steps. You should also explain why you broke down the task in this way. 

Complex task: {{{taskDescription}}}

Steps:`,
});

const automateComplexTaskFlow = ai.defineFlow(
  {
    name: 'automateComplexTaskFlow',
    inputSchema: AutomateComplexTaskInputSchema,
    outputSchema: AutomateComplexTaskOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
