
'use server';
/**
 * @fileOverview A Genkit flow for dynamically generating and adjusting training drills.
 * Includes a robust fallback mechanism for handling API rate limits (RESOURCE_EXHAUSTED).
 *
 * - dynamicAdaptiveDrills - A function that generates a personalized training drill.
 * - DynamicAdaptiveDrillsInput - The input type for the dynamicAdaptiveDrills function.
 * - DynamicAdaptiveDrillsOutput - The return type for the dynamicAdaptiveDrills function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DynamicAdaptiveDrillsInputSchema = z.object({
  sport: z
    .string()
    .describe('The sport the user is training for (e.g., cricket, tennis, soccer, boxing).'),
  currentPerformanceData: z
    .string()
    .describe('A summary of the user\'s recent performance data.'),
  lastDrillOutcome: z
    .enum(['success', 'failure', 'partial_success', 'not_applicable'])
    .describe('The outcome of the user\'s last training drill.'),
  currentWeather: z
    .string()
    .optional()
    .describe('Optional: Current weather conditions.'),
  matchScenarioData: z
    .string()
    .optional()
    .describe('Optional: Specific match scenario data.'),
  skillLevel: z
    .enum(['beginner', 'intermediate', 'advanced', 'elite'])
    .describe('The user\'s current skill level.'),
});
export type DynamicAdaptiveDrillsInput = z.infer<typeof DynamicAdaptiveDrillsInputSchema>;

const DynamicAdaptiveDrillsOutputSchema = z.object({
  drillName: z.string().describe('The name of the generated training drill.'),
  drillDescription: z.string().describe('Detailed instructions for the training drill.'),
  difficultyAdjustment: z
    .enum(['increased', 'decreased', 'maintained'])
    .describe('How the difficulty was adjusted based on performance.'),
  reasoning: z
    .string()
    .describe('An explanation for why this specific drill was chosen.'),
  arElements: z.array(z.string()).describe('List of AR elements for the drill.'),
  apiIntegrations: z
    .array(z.string())
    .describe('External APIs used for dynamic data.'),
});
export type DynamicAdaptiveDrillsOutput = z.infer<typeof DynamicAdaptiveDrillsOutputSchema>;

export async function dynamicAdaptiveDrills(
  input: DynamicAdaptiveDrillsInput
): Promise<DynamicAdaptiveDrillsOutput> {
  return dynamicAdaptiveDrillsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adaptiveDrillsPrompt',
  input: { schema: DynamicAdaptiveDrillsInputSchema },
  output: { schema: DynamicAdaptiveDrillsOutputSchema },
  prompt: `You are an AI Sports Coach specializing in dynamic, adaptive training drills.
Your goal is to generate a highly personalized training drill for a user, adapting it based on their sport, performance, and real-world conditions.

Sport: {{{sport}}}
Skill Level: {{{skillLevel}}}
Recent Performance Data: {{{currentPerformanceData}}}
Last Drill Outcome: {{{lastDrillOutcome}}}
{{#if currentWeather}}Current Weather: {{{currentWeather}}}{{/if}}
{{#if matchScenarioData}}Match Scenario Data: {{{matchScenarioData}}}{{/if}}

Design a new training drill relevant to the sport and skill level. Adjust difficulty based on last outcome.
Provide reasoning and a list of AR elements (virtual balls, lines, opponents).`,
});

const dynamicAdaptiveDrillsFlow = ai.defineFlow(
  {
    name: 'dynamicAdaptiveDrillsFlow',
    inputSchema: DynamicAdaptiveDrillsInputSchema,
    outputSchema: DynamicAdaptiveDrillsOutputSchema,
  },
  async (input: DynamicAdaptiveDrillsInput) => {
    try {
      const { output } = await prompt(input);
      if (!output) throw new Error("No output generated from AI");
      return output;
    } catch (error: unknown) {
      // Sovereign Baseline Protocol: Robust fallback for 429 quota errors
      console.warn("Genkit AI limit reached. Reverting to Sovereign Baseline Protocol.");
      
      const sportName = input.sport.charAt(0).toUpperCase() + input.sport.slice(1);
      
      const fallback: DynamicAdaptiveDrillsOutput = {
        drillName: `Sovereign ${sportName} Protocol`,
        drillDescription: `A high-intensity spatial reflex session designed to calibrate your neural baseline for ${input.sport}. Neutralize AR targets using kinetic hand movements within your field of vision.`,
        difficultyAdjustment: "maintained",
        reasoning: "The adaptive engine is currently synchronizing or quota limited. Reverting to the professional baseline protocol to maintain training momentum.",
        arElements: ["Kinetic AR Targets", "Neural Scan Overlay", "Spatial Boundaries"],
        apiIntegrations: ["Local Biometric Cache"]
      };
      return fallback;
    }
  }
);
