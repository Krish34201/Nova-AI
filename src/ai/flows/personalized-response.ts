'use server';
/**
 * @fileOverview Implements a Genkit flow for generating personalized responses based on user's past interactions.
 *
 * - personalizedResponse - A function that generates personalized responses.
 * - PersonalizedResponseInput - The input type for the personalizedResponse function.
 * - PersonalizedResponseOutput - The return type for the personalizedResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedResponseInputSchema = z.object({
  query: z.string().describe('The user query.'),
  userName: z.string().optional().describe('The name of the user, if known.'),
  pastInteractions: z.array(z.string()).optional().describe('An array of the user\'s past interactions.'),
});
export type PersonalizedResponseInput = z.infer<typeof PersonalizedResponseInputSchema>;

const PersonalizedResponseOutputSchema = z.object({
  response: z.string().describe('The personalized response from the AI.'),
});
export type PersonalizedResponseOutput = z.infer<typeof PersonalizedResponseOutputSchema>;

export async function personalizedResponse(input: PersonalizedResponseInput): Promise<PersonalizedResponseOutput> {
  return personalizedResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedResponsePrompt',
  input: {schema: PersonalizedResponseInputSchema},
  output: {schema: PersonalizedResponseOutputSchema},
  prompt: `You are an intelligent AI assistant that personalizes responses based on past interactions.

  User Name: {{userName}}

  Past Interactions:
  {{#each pastInteractions}}
  - {{{this}}}
  {{/each}}

  Current Query: {{{query}}}

  Please generate a response that takes into account the user's name and past interactions to provide a more personalized and contextually relevant answer.`, // Updated prompt here
});

const personalizedResponseFlow = ai.defineFlow(
  {
    name: 'personalizedResponseFlow',
    inputSchema: PersonalizedResponseInputSchema,
    outputSchema: PersonalizedResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
