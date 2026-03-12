
/**
 * @fileOverview Utility functions for calculating nutritional targets based on user metrics.
 */

export interface CalculationInput {
  weightKg: number;
  heightCm: number;
  age: number;
  gender: 'male' | 'female';
  activityLevel: number; // 1-5 scale mapped from gym hours/steps
  goal: 'lose' | 'maintain' | 'gain' | 'muscle';
}

export interface NutritionTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  water: number;
}

/**
 * Calculates BMR using the Mifflin-St Jeor Equation.
 */
function calculateBMR(input: CalculationInput): number {
  const { weightKg, heightCm, age, gender } = input;
  if (gender === 'male') {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
}

/**
 * Maps activity metrics to a TDEE multiplier.
 */
export function getActivityMultiplier(gymHours: number, steps: number): number {
  // Base sedentary
  let multiplier = 1.2;
  
  // Adjust based on gym hours
  if (gymHours >= 10) multiplier = 1.9;
  else if (gymHours >= 6) multiplier = 1.725;
  else if (gymHours >= 3) multiplier = 1.55;
  else if (gymHours >= 1) multiplier = 1.375;

  // Adjust slightly for high step count
  if (steps > 15000) multiplier += 0.1;
  else if (steps > 10000) multiplier += 0.05;

  return Math.min(multiplier, 2.0);
}

/**
 * Calculates comprehensive daily nutrition targets.
 */
export function calculateTargets(input: CalculationInput): NutritionTargets {
  const bmr = calculateBMR(input);
  const tdee = bmr * input.activityLevel;
  
  let targetCalories = tdee;
  let proteinRatio = 0.25;
  let fatRatio = 0.25;

  // Adjust for Goals
  switch (input.goal) {
    case 'lose':
      targetCalories -= 500;
      proteinRatio = 0.30; // Higher protein to preserve muscle
      break;
    case 'gain':
      targetCalories += 500;
      break;
    case 'muscle':
      targetCalories += 250;
      proteinRatio = 0.35; // Significant protein focus
      break;
    case 'maintain':
    default:
      break;
  }

  // Ensure minimum safe calories
  targetCalories = Math.max(targetCalories, input.gender === 'male' ? 1500 : 1200);

  // Calculate Macros
  // Protein: 4 kcal/g, Fat: 9 kcal/g, Carbs: 4 kcal/g
  const protein = Math.round((targetCalories * proteinRatio) / 4);
  const fat = Math.round((targetCalories * fatRatio) / 9);
  const carbs = Math.round((targetCalories - (protein * 4) - (fat * 9)) / 4);

  return {
    calories: Math.round(targetCalories),
    protein,
    carbs,
    fat,
    fiber: Math.round(targetCalories / 1000 * 14), // Recommendation: 14g per 1000kcal
    water: Number((input.weightKg * 0.033).toFixed(1)), // ~33ml per kg
  };
}
