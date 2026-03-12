import { config } from 'dotenv';
config();

import '@/ai/flows/generate-weekly-nutrient-report-flow.ts';
import '@/ai/flows/generate-daily-nutrient-report-flow.ts';
import '@/ai/flows/scan-nutrition-label-flow.ts';
import '@/ai/flows/search-food-ai-flow.ts';
import '@/ai/flows/get-dietary-tips-flow.ts';
