'use server';
/**
 * @fileOverview A Genkit flow for generating personalized confirmation messages and pre-treatment guidance.
 *
 * - aiPersonalizedConfirmation - A function that handles the generation of personalized messages.
 * - AIPersonalizedConfirmationInput - The input type for the aiPersonalizedConfirmation function.
 * - AIPersonalizedConfirmationOutput - The return type for the aiPersonalizedConfirmation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIPersonalizedConfirmationInputSchema = z.object({
  clientName: z.string().describe("The client's full name."),
  serviceName: z.string().describe('The name of the booked service.'),
});
export type AIPersonalizedConfirmationInput = z.infer<
  typeof AIPersonalizedConfirmationInputSchema
>;

const AIPersonalizedConfirmationOutputSchema = z.object({
  confirmationMessage: z
    .string()
    .describe('A personalized confirmation message for the client.'),
  preTreatmentGuidance: z
    .string()
    .describe('Detailed pre-treatment guidance for the booked service.'),
});
export type AIPersonalizedConfirmationOutput = z.infer<
  typeof AIPersonalizedConfirmationOutputSchema
>;

export async function aiPersonalizedConfirmation(
  input: AIPersonalizedConfirmationInput
): Promise<AIPersonalizedConfirmationOutput> {
  return aiPersonalizedConfirmationFlow(input);
}

const aiPersonalizedConfirmationPrompt = ai.definePrompt({
  name: 'aiPersonalizedConfirmationPrompt',
  input: {schema: AIPersonalizedConfirmationInputSchema},
  output: {schema: AIPersonalizedConfirmationOutputSchema},
  prompt: `You are an assistant for Lumina Aesthetics, a high-end aesthetic clinic specializing in 'Quiet Luxury'.
Your task is to generate a personalized confirmation message and pre-treatment guidance for a client who has booked a service.
Maintain a sophisticated, elegant, and reassuring tone throughout the message.

Client Name: {{{clientName}}}
Booked Service: {{{serviceName}}}

Craft a confirmation message that welcomes the client, confirms their booking for the specified service, and expresses anticipation for their visit.

Then, provide clear, concise, and helpful pre-treatment guidance specific to the booked service. This guidance should prepare the client for their experience, ensuring comfort and optimal results. If you don't have specific guidance, provide general advice for any aesthetic treatment, emphasizing comfort and communication with the specialists.

Example Confirmation Message: "Dear [Client Name], we are delighted to confirm your upcoming [Service Name] at Lumina Aesthetics. We look forward to welcoming you..."

Example Pre-Treatment Guidance: "To ensure the most serene and effective experience for your [Service Name], we kindly recommend..."
`,
});

const aiPersonalizedConfirmationFlow = ai.defineFlow(
  {
    name: 'aiPersonalizedConfirmationFlow',
    inputSchema: AIPersonalizedConfirmationInputSchema,
    outputSchema: AIPersonalizedConfirmationOutputSchema,
  },
  async input => {
    const {output} = await aiPersonalizedConfirmationPrompt(input);
    if (!output) {
      throw new Error('Failed to generate personalized confirmation and guidance.');
    }
    return output;
  }
);
