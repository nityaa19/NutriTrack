'use server';
/**
 * @fileOverview A Genkit flow that generates a personalized daily nutrient report using a predefined structure.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DailyNutrientInputSchema = z.object({
  userName: z.string(),
  date: z.string(),
  nutrients: z.object({
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
    fiber: z.number(),
  }),
  meals: z.array(z.string()),
  goals: z.object({
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
    fiber: z.number(),
  }),
});
export type GenerateDailyNutrientReportInput = z.infer<typeof DailyNutrientInputSchema>;

const GenerateDailyNutrientReportOutputSchema = z.object({
  reportText: z.string(),
});
export type GenerateDailyNutrientReportOutput = z.infer<typeof GenerateDailyNutrientReportOutputSchema>;

export async function generateDailyNutrientReport(input: GenerateDailyNutrientReportInput): Promise<GenerateDailyNutrientReportOutput> {
  const { output } = await ai.generate({
    model: 'googleai/gemini-2.5-flash',
    input: { schema: DailyNutrientInputSchema, data: input },
    output: { schema: GenerateDailyNutrientReportOutputSchema },
    config: {
      safetySettings: [
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_CIVIC_INTEGRITY', threshold: 'BLOCK_NONE' },
      ],
    },
    prompt: `You are a professional nutritionist AI named NutriTrack. 
    
Fill in the following report template for {{{userName}}} for the date {{{date}}}. 
Use the statistics provided. 

### 📊 DAILY SUMMARY ({{{date}}})
- **Calories**: {{{nutrients.calories}}} / {{{goals.calories}}} kcal
- **Protein**: {{{nutrients.protein}}}g / {{{goals.protein}}}g
- **Carbs**: {{{nutrients.carbs}}}g / {{{goals.carbs}}}g
- **Fats**: {{{nutrients.fat}}}g / {{{goals.fat}}}g
- **Fiber**: {{{nutrients.fiber}}}g / {{{goals.fiber}}}g

### 🍎 FOOD LOGGED
{{#if meals.length}}
{{#each meals}}
- {{this}}
{{/each}}
{{else}}
- No specific meals logged.
{{/if}}

### 💡 NUTRITIONIST INSIGHTS
1. Provide a 1-sentence positive feedback on today's intake.
2. Provide a 1-sentence practical tip for tomorrow based on the data.

Keep the response strictly to this template. Use simple Markdown.`,
  });

  if (!output) {
    throw new Error("AI could not generate report. Please check rate limits.");
  }

  return output;
}
