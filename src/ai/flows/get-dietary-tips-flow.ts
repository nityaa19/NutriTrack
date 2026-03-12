'use server';
/**
 * @fileOverview A Genkit flow that provides personalized dietary tips or answers specific questions based on current progress.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DietaryTipsInputSchema = z.object({
  userName: z.string(),
  goals: z.object({
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
    fiber: z.number(),
  }),
  current: z.object({
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
    fiber: z.number(),
  }),
  recentMeals: z.array(z.string()).describe('List of food items eaten today.'),
  userQuestion: z.string().optional().describe('A specific question from the user about their diet.'),
});

const DietaryTipsOutputSchema = z.object({
  tips: z.array(z.string()).describe('A list of 3-4 short, actionable points or a direct answer to a question.'),
  headline: z.string().describe('A catchy, encouraging headline for the response.'),
});

export type DietaryTipsInput = z.infer<typeof DietaryTipsInputSchema>;
export type DietaryTipsOutput = z.infer<typeof DietaryTipsOutputSchema>;

export async function getDietaryTips(input: DietaryTipsInput): Promise<DietaryTipsOutput> {
  const { output } = await ai.generate({
    model: 'googleai/gemini-2.5-flash',
    input: { schema: DietaryTipsInputSchema, data: input },
    output: { schema: DietaryTipsOutputSchema },
    prompt: `You are a professional nutritionist AI named NutriTrack. 

User Name: {{userName}}

Goal Metrics:
- Calories: {{goals.calories}} kcal
- Protein: {{goals.protein}}g
- Carbs: {{goals.carbs}}g
- Fat: {{goals.fat}}g
- Fiber: {{goals.fiber}}g

Current Intake Today:
- Calories: {{current.calories}} kcal
- Protein: {{current.protein}}g
- Carbs: {{current.carbs}}g
- Fat: {{current.fat}}g
- Fiber: {{current.fiber}}g

Food Eaten Today:
{{#each recentMeals}}
- {{this}}
{{/each}}

{{#if userQuestion}}
The user has a specific question: "{{{userQuestion}}}"
Please answer this question directly while considering their progress today. Provide 3-4 concise points as the "tips".
{{else}}
Provide personalized and encouraging dietary tips based on their progress. Analyze the gaps (e.g., low protein, high fat). Suggest high-volume/low-cal foods or fiber if they are near their limit but hungry.
{{/if}}

Keep all points short (1-2 sentences). Be encouraging and supportive.`,
  });

  if (!output) throw new Error("Could not generate response.");
  return output;
}
