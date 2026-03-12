
'use server';
/**
 * @fileOverview A flow to search for food nutritional data using AI when not found in the local database.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SearchFoodAIInputSchema = z.object({
  query: z.string().describe('The name or description of the food to search for.'),
});

const AIProductSchema = z.object({
  name: z.string().describe('Short, descriptive name of the food.'),
  caloriesPer100: z.number().describe('Calories per 100g.'),
  proteinPer100: z.number().describe('Protein grams per 100g.'),
  carbsPer100: z.number().describe('Carbohydrates grams per 100g.'),
  fatPer100: z.number().describe('Fat grams per 100g.'),
  fiberPer100: z.number().describe('Fiber grams per 100g.'),
});

const SearchFoodAIOutputSchema = z.array(AIProductSchema).describe('A list of potential food matches with estimated nutrition.');

export type AIProduct = z.infer<typeof AIProductSchema>;

export async function searchFoodAI(input: { query: string }): Promise<AIProduct[]> {
  const { output } = await ai.generate({
    model: 'googleai/gemini-2.5-flash',
    prompt: `You are an expert nutritional database. The user is searching for: "${input.query}". 
    Provide estimated nutritional facts per 100g for this food. 
    If it's a generic dish (e.g., "Chicken Biryani"), provide a realistic average. 
    Return 1 to 3 relevant variations if the query is broad.
    DO NOT provide water content estimates.`,
    output: { schema: SearchFoodAIOutputSchema },
  });
  
  if (!output) throw new Error("Could not find nutrition data for this item.");
  return output;
}
