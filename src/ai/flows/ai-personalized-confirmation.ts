'use server';
/**
 * @fileOverview A Genkit flow for generating personalized confirmation messages and email content.
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
    .describe('A personalized confirmation message for WhatsApp.'),
  preTreatmentGuidance: z
    .string()
    .describe('Detailed pre-treatment guidance for the booked service.'),
  emailSubject: z
    .string()
    .describe('A professional and elegant email subject line.'),
  emailBody: z
    .string()
    .describe('The full HTML body for the confirmation email, maintaining the Lumina luxury tone.'),
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
Your task is to generate a personalized confirmation message (for WhatsApp) and a formal email for a client who has booked a service.
Maintain a sophisticated, elegant, and reassuring tone throughout.

Client Name: {{{clientName}}}
Booked Service: {{{serviceName}}}

1. WhatsApp Message: Concise, welcoming, and elegant.
2. Guidance: Specific tips for the service.
3. Email Subject: Professional and exclusive.
4. Email Body: A detailed HTML email. Use professional formatting. Include greetings, the confirmation of the service, a section for guidance, and a signature from 'Concierge Lumina Aesthetics'.

Example Email Subject: "Sua Experiência Lumina: Agendamento Confirmado - [Service Name]"
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
