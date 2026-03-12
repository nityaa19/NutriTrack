'use server';
/**
 * @fileOverview A Genkit flow that generates a personalized weekly nutrient report using a predefined structure.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DailyNutrientSummarySchema = z.object({
  date: z.string(),
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
});

const GenerateWeeklyNutrientReportInputSchema = z.object({
  userName: z.string(),
  weeklySummary: z.object({
    totalCalories: z.number(),
    avgDailyCalories: z.number(),
    totalProtein: z.number(),
    avgDailyProtein: z.number(),
    totalCarbs: z.number(),
    avgDailyCarbs: z.number(),
    totalFat: z.number(),
    avgDailyFat: z.number(),
  }),
  dailyLogs: z.array(DailyNutrientSummarySchema),
});
export type GenerateWeeklyNutrientReportInput = z.infer<typeof GenerateWeeklyNutrientReportInputSchema>;

const GenerateWeeklyNutrientReportOutputSchema = z.object({
  reportText: z.string(),
});
export type GenerateWeeklyNutrientReportOutput = z.infer<typeof GenerateWeeklyNutrientReportOutputSchema>;

export async function generateWeeklyNutrientReport(input: GenerateWeeklyNutrientReportInput): Promise<GenerateWeeklyNutrientReportOutput> {
  const { output } = await ai.generate({
    model: 'googleai/gemini-2.5-flash',
    input: { schema: GenerateWeeklyNutrientReportInputSchema, data: input },
    output: { schema: GenerateWeeklyNutrientReportOutputSchema },
    config: {
      safetySettings: [
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      ],
    },
    prompt: `You are NutriTrack AI. Generate a weekly report for {{{userName}}} using this template:

# 📈 WEEKLY PROGRESS REPORT
**Summary for the last {{dailyLogs.length}} days**

### 📊 AVERAGE DAILY STATS
- **Calories**: {{{weeklySummary.avgDailyCalories}}} kcal
- **Protein**: {{{weeklySummary.avgDailyProtein}}} g
- **Carbs**: {{{weeklySummary.avgDailyCarbs}}} g
- **Fats**: {{{weeklySummary.avgDailyFat}}} g

### 🔍 WEEKLY TRENDS
Provide 2 short bullet points identifying trends in the daily logs provided.

### 💡 ACTION PLAN
Provide 2 actionable, supportive suggestions for the upcoming week.

Maintain professional Markdown formatting.`,
  });

  if (!output) {
    throw new Error("Weekly report generation failed.");
  }

  return output;
}
