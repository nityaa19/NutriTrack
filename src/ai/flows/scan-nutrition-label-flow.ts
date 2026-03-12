
'use server';
/**
 * @fileOverview A flow to scan nutrition labels from photos and extract nutritional data using Gemini.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ScanLabelInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a nutrition label, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

const ScanLabelOutputSchema = z.object({
  name: z.string().describe("The name of the food item detected."),
  caloriesPer100: z.number().describe("Calories per 100g or 100ml."),
  proteinPer100: z.number().describe("Protein grams per 100g or 100ml."),
  carbsPer100: z.number().describe("Carbohydrates grams per 100g or 100ml."),
  fatPer100: z.number().describe("Fat grams per 100g or 100ml."),
  fiberPer100: z.number().describe("Fiber grams per 100g or 100ml."),
});

export type ScanLabelOutput = z.infer<typeof ScanLabelOutputSchema>;

/**
 * Prompt definition for scanning nutrition labels.
 */
const scanLabelPrompt = ai.definePrompt({
  name: 'scanLabelPrompt',
  input: { schema: ScanLabelInputSchema },
  output: { schema: ScanLabelOutputSchema },
  prompt: `You are a nutritional data extraction expert. 
  
Extract the nutrition facts per 100g or 100ml from the provided image of a food label. 

CRITICAL INSTRUCTIONS:
1. If values on the label are provided "per serving", you MUST convert them to 100g or 100ml values using the serving size mentioned on the label.
2. Provide a short, concise name for the product (e.g., "Amul Gold Milk").
3. DO NOT include water content in your extraction.

Photo of Label: {{media url=photoDataUri}}`,
});

/**
 * Server action to scan a nutrition label and return structured data.
 */
export async function scanNutritionLabel(input: { photoDataUri: string }): Promise<ScanLabelOutput> {
  const { output } = await scanLabelPrompt(input);
  
  if (!output) {
    throw new Error("Could not extract nutrition data from this image. Please ensure the label is clear and well-lit.");
  }
  
  return output;
}
