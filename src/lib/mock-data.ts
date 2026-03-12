export type UnitType = 'g' | 'unit';
export type MealType = 'breakfast' | 'lunch' | 'evening snacks' | 'dinner' | 'something extra';

export interface FoodItem {
  id: string;
  name: string;
  caloriesPer100: number; // For 'g' type
  proteinPer100: number;
  carbsPer100: number;
  fatPer100: number;
  fiberPer100: number;
  caloriesPerUnit?: number; // For 'unit' type
  proteinPerUnit?: number;
  carbsPerUnit?: number;
  fatPerUnit?: number;
  fiberPerUnit?: number;
  unitType: UnitType;
  isCustom?: boolean;
  creatorId?: string;
  updatedAt?: string;
}

export interface LogEntry {
  id: string;
  foodId: string;
  foodName: string;
  quantity: number; // weight in grams or number of units
  unitType: UnitType;
  timestamp: number;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  nutrients: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

export const INITIAL_FOODS: FoodItem[] = [
  // --- PROTEINS & EGGS ---
  { id: 'p1', name: 'Chicken Breast (Grilled)', caloriesPer100: 165, proteinPer100: 31, carbsPer100: 0, fatPer100: 3.6, fiberPer100: 0, unitType: 'g' },
  { id: 'p2', name: 'Egg (Large)', caloriesPer100: 155, proteinPer100: 13, carbsPer100: 1.1, fatPer100: 11, fiberPer100: 0, unitType: 'unit', caloriesPerUnit: 70, proteinPerUnit: 6, carbsPerUnit: 0.5, fatPerUnit: 5, fiberPerUnit: 0 },
  { id: 'p2-white', name: 'Egg White (Large)', caloriesPer100: 52, proteinPer100: 11, carbsPer100: 0.7, fatPer100: 0.2, fiberPer100: 0, unitType: 'unit', caloriesPerUnit: 17, proteinPerUnit: 3.6, carbsPerUnit: 0.2, fatPerUnit: 0.1, fiberPerUnit: 0 },
  { id: 'p3', name: 'Paneer (Raw)', caloriesPer100: 265, proteinPer100: 18, carbsPer100: 1.2, fatPer100: 20, fiberPer100: 0, unitType: 'g' },
  { id: 'p4', name: 'Tofu (Extra Firm)', caloriesPer100: 83, proteinPer100: 10, carbsPer100: 1.2, fatPer100: 4.8, fiberPer100: 1, unitType: 'g' },
  { id: 'p5', name: 'Whey Protein (Standard)', caloriesPer100: 380, proteinPer100: 75, carbsPer100: 8, fatPer100: 5, fiberPer100: 2, unitType: 'unit', caloriesPerUnit: 120, proteinPerUnit: 24, carbsPerUnit: 3, fatPerUnit: 1.5, fiberPerUnit: 0.5 },
  { id: 'p6', name: 'Salmon (Baked)', caloriesPer100: 208, proteinPer100: 22, carbsPer100: 0, fatPer100: 13, fiberPer100: 0, unitType: 'g' },
  { id: 'p7', name: 'Beef Lean Steak', caloriesPer100: 250, proteinPer100: 26, carbsPer100: 0, fatPer100: 15, fiberPer100: 0, unitType: 'g' },
  { id: 'p8', name: 'Peanut Butter', caloriesPer100: 588, proteinPer100: 25, carbsPer100: 20, fatPer100: 50, fiberPer100: 6, unitType: 'g' },

  // --- INDIAN BREADS (Unit Based) ---
  { id: 'ib1', name: 'Roti (Phulka/Whole Wheat)', caloriesPer100: 260, proteinPer100: 9, carbsPer100: 50, fatPer100: 3, fiberPer100: 8, unitType: 'unit', caloriesPerUnit: 85, proteinPerUnit: 3, carbsPerUnit: 18, fatPerUnit: 1, fiberPerUnit: 2.5 },
  { id: 'ib2', name: 'Butter Naan', caloriesPer100: 310, proteinPer100: 9, carbsPer100: 55, fatPer100: 8, fiberPer100: 2, unitType: 'unit', caloriesPerUnit: 260, proteinPerUnit: 7, carbsPerUnit: 45, fatPerUnit: 6, fiberPerUnit: 1.5 },
  { id: 'ib3', name: 'Paratha (Plain/Tawa)', caloriesPer100: 300, proteinPer100: 7, carbsPer100: 45, fatPer100: 12, fiberPer100: 5, unitType: 'unit', caloriesPerUnit: 150, proteinPerUnit: 3.5, carbsPerUnit: 22, fatPerUnit: 6, fiberPerUnit: 2.5 },
  { id: 'ib4', name: 'Aloo Paratha', caloriesPer100: 240, proteinPer100: 5, carbsPer100: 40, fatPer100: 8, fiberPer100: 4, unitType: 'unit', caloriesPerUnit: 220, proteinPerUnit: 5, carbsPerUnit: 38, fatPerUnit: 7, fiberPerUnit: 3.5 },
  { id: 'ib5', name: 'Paneer Paratha', caloriesPer100: 280, proteinPer100: 10, carbsPer100: 35, fatPer100: 12, fiberPer100: 4, unitType: 'unit', caloriesPerUnit: 280, proteinPerUnit: 10, carbsPerUnit: 35, fatPerUnit: 12, fiberPerUnit: 4 },
  { id: 'ib6', name: 'Puri', caloriesPer100: 330, proteinPer100: 7, carbsPer100: 45, fatPer100: 15, fiberPer100: 3, unitType: 'unit', caloriesPerUnit: 100, proteinPerUnit: 2, carbsPerUnit: 13, fatPerUnit: 5, fiberPerUnit: 1 },
  { id: 'ib7', name: 'Missi Roti', caloriesPer100: 270, proteinPer100: 12, carbsPer100: 45, fatPer100: 5, fiberPer100: 7, unitType: 'unit', caloriesPerUnit: 110, proteinPerUnit: 5, carbsPerUnit: 18, fatPerUnit: 2, fiberPerUnit: 3 },
  { id: 'ib8', name: 'Garlic Naan', caloriesPer100: 320, proteinPer100: 9, carbsPer100: 55, fatPer100: 9, fiberPer100: 2, unitType: 'unit', caloriesPerUnit: 270, proteinPerUnit: 7, carbsPerUnit: 46, fatPerUnit: 7, fiberPerUnit: 1.5 },

  // --- RICE & GRAINS ---
  { id: 'rg1', name: 'White Rice (Cooked)', caloriesPer100: 130, proteinPer100: 2.7, carbsPer100: 28, fatPer100: 0.3, fiberPer100: 0.4, unitType: 'g' },
  { id: 'rg2', name: 'Brown Rice (Cooked)', caloriesPer100: 111, proteinPer100: 2.6, carbsPer100: 23, fatPer100: 0.9, fiberPer100: 1.8, unitType: 'g' },
  { id: 'rg3', name: 'Vegetable Biryani', caloriesPer100: 160, proteinPer100: 4, carbsPer100: 25, fatPer100: 5, fiberPer100: 3, unitType: 'g' },
  { id: 'rg4', name: 'Chicken Biryani', caloriesPer100: 180, proteinPer100: 11, carbsPer100: 24, fatPer100: 6, fiberPer100: 2, unitType: 'g' },
  { id: 'rg5', name: 'Jeera Rice', caloriesPer100: 145, proteinPer100: 3, carbsPer100: 28, fatPer100: 2.5, fiberPer100: 1, unitType: 'g' },
  { id: 'rg6', name: 'Curd Rice', caloriesPer100: 120, proteinPer100: 4, carbsPer100: 18, fatPer100: 4, fiberPer100: 0.5, unitType: 'g' },
  { id: 'rg7', name: 'Khichdi', caloriesPer100: 110, proteinPer100: 4.5, carbsPer100: 20, fatPer100: 2, fiberPer100: 3, unitType: 'g' },
  { id: 'rg8', name: 'Quinoa (Cooked)', caloriesPer100: 120, proteinPer100: 4.4, carbsPer100: 21, fatPer100: 1.9, fiberPer100: 2.8, unitType: 'g' },
  { id: 'rg9-custom', name: 'Protein Oats (Custom)', caloriesPer100: 392, proteinPer100: 25, carbsPer100: 54.6, fatPer100: 8, fiberPer100: 9.6, unitType: 'g' },
  { id: 'rg9', name: 'Oats (Regular Cooked)', caloriesPer100: 68, proteinPer100: 2.4, carbsPer100: 12, fatPer100: 1.4, fiberPer100: 1.7, unitType: 'g' },

  // --- DALS & PULSES (Cooked) ---
  { id: 'dl1', name: 'Dal Tadka', caloriesPer100: 115, proteinPer100: 7, carbsPer100: 18, fatPer100: 3, fiberPer100: 6, unitType: 'g' },
  { id: 'dl2', name: 'Dal Makhani', caloriesPer100: 155, proteinPer100: 5.5, carbsPer100: 15, fatPer100: 8, fiberPer100: 5, unitType: 'g' },
  { id: 'dl3', name: 'Rajma Masala', caloriesPer100: 125, proteinPer100: 6.5, carbsPer100: 19, fatPer100: 3, fiberPer100: 6.5, unitType: 'g' },
  { id: 'dl4', name: 'Chole Masala', caloriesPer100: 150, proteinPer100: 7, carbsPer100: 22, fatPer100: 4, fiberPer100: 7, unitType: 'g' },
  { id: 'dl5', name: 'Moong Dal (Yellow)', caloriesPer100: 105, proteinPer100: 8, carbsPer100: 16, fatPer100: 2, fiberPer100: 5, unitType: 'g' },
  { id: 'dl6', name: 'Chana Dal', caloriesPer100: 140, proteinPer100: 9, carbsPer100: 22, fatPer100: 2.5, fiberPer100: 8, unitType: 'g' },
  { id: 'dl7', name: 'Sambar', caloriesPer100: 65, proteinPer100: 3, carbsPer100: 11, fatPer100: 1.5, fiberPer100: 3.5, unitType: 'g' },
  { id: 'dl8', name: 'Masoor Dal (Red)', caloriesPer100: 116, proteinPer100: 9, carbsPer100: 20, fatPer100: 0.4, fiberPer100: 8, unitType: 'g' },

  // --- INDIAN VEGETABLE DISHES (Cooked) ---
  { id: 'v1', name: 'Aloo Gobi', caloriesPer100: 110, proteinPer100: 3, carbsPer100: 15, fatPer100: 5, fiberPer100: 4, unitType: 'g' },
  { id: 'v2', name: 'Bhindi Masala', caloriesPer100: 90, proteinPer100: 2.5, carbsPer100: 11, fatPer100: 4.5, fiberPer100: 4, unitType: 'g' },
  { id: 'v3', name: 'Baingan Bharta', caloriesPer100: 85, proteinPer100: 2, carbsPer100: 10, fatPer100: 4, fiberPer100: 5, unitType: 'g' },
  { id: 'v4', name: 'Palak Paneer', caloriesPer100: 135, proteinPer100: 8, carbsPer100: 6, fatPer100: 9, fiberPer100: 3, unitType: 'g' },
  { id: 'v5', name: 'Mutter Paneer', caloriesPer100: 145, proteinPer100: 7.5, carbsPer100: 10, fatPer100: 8.5, fiberPer100: 3.5, unitType: 'g' },
  { id: 'v6', name: 'Paneer Butter Masala', caloriesPer100: 215, proteinPer100: 9, carbsPer100: 8, fatPer100: 17, fiberPer100: 1.5, unitType: 'g' },
  { id: 'v7', name: 'Mixed Vegetable Curried', caloriesPer100: 95, proteinPer100: 3, carbsPer100: 12, fatPer100: 4.5, fiberPer100: 4.5, unitType: 'g' },
  { id: 'v8', name: 'Gajar Methi', caloriesPer100: 80, proteinPer100: 2, carbsPer100: 10, fatPer100: 4, fiberPer100: 3, unitType: 'g' },
  { id: 'v9', name: 'Dum Aloo', caloriesPer100: 160, proteinPer100: 3.5, carbsPer100: 22, fatPer100: 7, fiberPer100: 4, unitType: 'g' },
  { id: 'v10', name: 'Malai Kofta', caloriesPer100: 240, proteinPer100: 6, carbsPer100: 18, fatPer100: 16, fiberPer100: 3, unitType: 'g' },

  // --- SOUTH INDIAN DISHES (Unit Based) ---
  { id: 'si1', name: 'Idli (Medium)', caloriesPer100: 120, proteinPer100: 4, carbsPer100: 25, fatPer100: 0.2, fiberPer100: 2, unitType: 'unit', caloriesPerUnit: 60, proteinPerUnit: 2, carbsPerUnit: 12, fatPerUnit: 0.1, fiberPerUnit: 1 },
  { id: 'si2', name: 'Medhu Vada', caloriesPer100: 330, proteinPer100: 10, carbsPer100: 30, fatPer100: 18, fiberPer100: 6, unitType: 'unit', caloriesPerUnit: 95, proteinPerUnit: 3, carbsPerUnit: 9, fatPerUnit: 5, fiberPerUnit: 1.5 },
  { id: 'si3', name: 'Masala Dosa', caloriesPer100: 185, proteinPer100: 4.5, carbsPer100: 32, fatPer100: 4.5, fiberPer100: 2.5, unitType: 'unit', caloriesPerUnit: 250, proteinPerUnit: 6, carbsPerUnit: 44, fatPerUnit: 6, fiberPerUnit: 3.5 },
  { id: 'si4', name: 'Rava Dosa (Plain)', caloriesPer100: 210, proteinPer100: 6, carbsPer100: 40, fatPer100: 3, fiberPer100: 2, unitType: 'unit', caloriesPerUnit: 180, proteinPerUnit: 5, carbsPerUnit: 34, fatPerUnit: 2.5, fiberPerUnit: 1.5 },
  { id: 'si5', name: 'Appam', caloriesPer100: 140, proteinPer100: 3, carbsPer100: 30, fatPer100: 1, fiberPer100: 1, unitType: 'unit', caloriesPerUnit: 120, proteinPerUnit: 2.5, carbsPerUnit: 26, fatPerUnit: 0.8, fiberPerUnit: 0.8 },
  { id: 'si6', name: 'Upma', caloriesPer100: 160, proteinPer100: 4, carbsPer100: 28, fatPer100: 4, fiberPer100: 2.5, unitType: 'g' },
  { id: 'si7', name: 'Poha (Kanda Poha)', caloriesPer100: 185, proteinPer100: 3.5, carbsPer100: 36, fatPer100: 3.5, fiberPer100: 2.5, unitType: 'g' },
  { id: 'si8', name: 'Coconut Chutney', caloriesPer100: 160, proteinPer100: 2, carbsPer100: 8, fatPer100: 14, fiberPer100: 5, unitType: 'g' },

  // --- INDIAN SNACKS & STREET FOOD ---
  { id: 'sn1', name: 'Samosa', caloriesPer100: 310, proteinPer100: 5, carbsPer100: 38, fatPer100: 16, fiberPer100: 3.5, unitType: 'unit', caloriesPerUnit: 250, proteinPerUnit: 4, carbsPerUnit: 30, fatPerUnit: 13, fiberPerUnit: 2.5 },
  { id: 'sn2', name: 'Dhokla', caloriesPer100: 160, proteinPer100: 6, carbsPer100: 28, fatPer100: 3, fiberPer100: 2.5, unitType: 'unit', caloriesPerUnit: 80, proteinPerUnit: 3, carbsPerUnit: 14, fatPerUnit: 1.5, fiberPerUnit: 1.2 },
  { id: 'sn3', name: 'Vada Pav', caloriesPer100: 280, proteinPer100: 7, carbsPer100: 42, fatPer100: 10, fiberPer100: 4, unitType: 'unit', caloriesPerUnit: 280, proteinPerUnit: 7, carbsPerUnit: 42, fatPerUnit: 10, fiberPerUnit: 4 },
  { id: 'sn4', name: 'Pav Bhaji', caloriesPer100: 160, proteinPer100: 4, carbsPer100: 22, fatPer100: 6, fiberPer100: 4, unitType: 'g' },
  { id: 'sn5', name: 'Pani Puri (6 pieces)', caloriesPer100: 180, proteinPer100: 3, carbsPer100: 32, fatPer100: 5, fiberPer100: 2.5, unitType: 'unit', caloriesPerUnit: 180, proteinPerUnit: 3, carbsPerUnit: 32, fatPerUnit: 5, fiberPerUnit: 2.5 },
  { id: 'sn6', name: 'Bhel Puri', caloriesPer100: 180, proteinPer100: 4, carbsPer100: 35, fatPer100: 3, fiberPer100: 3.5, unitType: 'g' },
  { id: 'sn7', name: 'Papdi Chaat', caloriesPer100: 220, proteinPer100: 5, carbsPer100: 35, fatPer100: 8, fiberPer100: 3, unitType: 'g' },
  { id: 'sn8', name: 'Pakora (Mix Veg)', caloriesPer100: 300, proteinPer100: 8, carbsPer100: 35, fatPer100: 15, fiberPer100: 5, unitType: 'g' },

  // --- FRUITS (Unit Based or 100g) ---
  { id: 'f1', name: 'Banana (Medium)', caloriesPer100: 89, proteinPer100: 1.1, carbsPer100: 23, fatPer100: 0.3, fiberPer100: 2.6, unitType: 'unit', caloriesPerUnit: 105, proteinPerUnit: 1.3, carbsPerUnit: 27, fatPerUnit: 0.4, fiberPerUnit: 3 },
  { id: 'f2', name: 'Apple (Medium)', caloriesPer100: 52, proteinPer100: 0.3, carbsPer100: 14, fatPer100: 0.2, fiberPer100: 2.4, unitType: 'unit', caloriesPerUnit: 95, proteinPerUnit: 0.5, carbsPerUnit: 25, fatPerUnit: 0.3, fiberPerUnit: 4.5 },
  { id: 'f3', name: 'Mango (Medium)', caloriesPer100: 60, proteinPer100: 0.8, carbsPer100: 15, fatPer100: 0.4, fiberPer100: 1.6, unitType: 'unit', caloriesPerUnit: 150, proteinPerUnit: 2, carbsPerUnit: 38, fatPerUnit: 1, fiberPerUnit: 4 },
  { id: 'f4', name: 'Orange', caloriesPer100: 47, proteinPer100: 0.9, carbsPer100: 12, fatPer100: 0.1, fiberPer100: 2.4, unitType: 'unit', caloriesPerUnit: 62, proteinPerUnit: 1.2, carbsPerUnit: 15, fatPerUnit: 0.2, fiberPerUnit: 3 },
  { id: 'f5', name: 'Papaya', caloriesPer100: 43, proteinPer100: 0.5, carbsPer100: 11, fatPer100: 0.3, fiberPer100: 1.7, unitType: 'g' },
  { id: 'f6', name: 'Grapes', caloriesPer100: 67, proteinPer100: 0.6, carbsPer100: 17, fatPer100: 0.4, fiberPer100: 0.9, unitType: 'g' },
  { id: 'f7', name: 'Watermelon', caloriesPer100: 30, proteinPer100: 0.6, carbsPer100: 8, fatPer100: 0.2, fiberPer100: 0.4, unitType: 'g' },
  { id: 'f8', name: 'Pomegranate', caloriesPer100: 83, proteinPer100: 1.7, carbsPer100: 19, fatPer100: 1.2, fiberPer100: 4, unitType: 'g' },
  { id: 'f9', name: 'Guava', caloriesPer100: 68, proteinPer100: 2.6, carbsPer100: 14, fatPer100: 1, fiberPer100: 5.4, unitType: 'unit', caloriesPerUnit: 40, proteinPerUnit: 1.5, carbsPerUnit: 8, fatPerUnit: 0.5, fiberPerUnit: 3 },

  // --- VEGETABLES (Raw/Salad) ---
  { id: 'vg1', name: 'Cucumber', caloriesPer100: 15, proteinPer100: 0.7, carbsPer100: 3.6, fatPer100: 0.1, fiberPer100: 0.5, unitType: 'g' },
  { id: 'vg2', name: 'Tomato', caloriesPer100: 18, proteinPer100: 0.9, carbsPer100: 3.9, fatPer100: 0.2, fiberPer100: 1.2, unitType: 'g' },
  { id: 'vg3', name: 'Carrot', caloriesPer100: 41, proteinPer100: 0.9, carbsPer100: 10, fatPer100: 0.2, fiberPer100: 2.8, unitType: 'g' },
  { id: 'vg4', name: 'Spinach (Boiled)', caloriesPer100: 23, proteinPer100: 3, carbsPer100: 3.6, fatPer100: 0.3, fiberPer100: 2.4, unitType: 'g' },
  { id: 'vg5', name: 'Broccoli (Steamed)', caloriesPer100: 35, proteinPer100: 2.4, carbsPer100: 7, fatPer100: 0.4, fiberPer100: 3.3, unitType: 'g' },
  { id: 'vg6', name: 'Onion (Raw)', caloriesPer100: 40, proteinPer100: 1.1, carbsPer100: 9, fatPer100: 0.1, fiberPer100: 1.7, unitType: 'g' },

  // --- DAIRY & BEVERAGES (Food Context) ---
  { id: 'dy1', name: 'Milk (Full Cream)', caloriesPer100: 62, proteinPer100: 3.2, carbsPer100: 4.8, fatPer100: 3.4, fiberPer100: 0, unitType: 'g' },
  { id: 'dy-sk', name: 'Milk (Fat-Free/Skimmed)', caloriesPer100: 35, proteinPer100: 3.4, carbsPer100: 5, fatPer100: 0.1, fiberPer100: 0, unitType: 'g' },
  { id: 'dy2', name: 'Curd (Plain)', caloriesPer100: 60, proteinPer100: 3.5, carbsPer100: 4.7, fatPer100: 3.3, fiberPer100: 0, unitType: 'g' },
  { id: 'dy3', name: 'Greek Yogurt', caloriesPer100: 59, proteinPer100: 10, carbsPer100: 3.6, fatPer100: 0.4, fiberPer100: 0, unitType: 'g' },
  { id: 'dy4', name: 'Cheddar Cheese', caloriesPer100: 403, proteinPer100: 25, carbsPer100: 1.3, fatPer100: 33, fiberPer100: 0, unitType: 'g' },
  { id: 'dy5', name: 'Butter', caloriesPer100: 717, proteinPer100: 0.9, carbsPer100: 0.1, fatPer100: 81, fiberPer100: 0, unitType: 'g' },
  { id: 'dy6', name: 'Masala Chai (with Sugar)', caloriesPer100: 45, proteinPer100: 1.5, carbsPer100: 8, fatPer100: 1.5, fiberPer100: 0, unitType: 'unit', caloriesPerUnit: 65, proteinPerUnit: 2, carbsPerUnit: 12, fatPerUnit: 2, fiberPerUnit: 0 },

  // --- GLOBAL FAVORITES ---
  { id: 'gf1', name: 'Pizza (Margherita Slice)', caloriesPer100: 260, proteinPer100: 11, carbsPer100: 33, fatPer100: 10, fiberPer100: 2.3, unitType: 'unit', caloriesPerUnit: 250, proteinPerUnit: 10, carbsPerUnit: 32, fatPerUnit: 9, fiberPerUnit: 2 },
  { id: 'gf2', name: 'Chicken Burger', caloriesPer100: 250, proteinPer100: 14, carbsPer100: 25, fatPer100: 11, fiberPer100: 2, unitType: 'unit', caloriesPerUnit: 450, proteinPerUnit: 25, carbsPerUnit: 45, fatPerUnit: 18, fiberPerUnit: 3 },
  { id: 'gf3', name: 'Pasta (Arrabbiata)', caloriesPer100: 140, proteinPer100: 5, carbsPer100: 25, fatPer100: 2.5, fiberPer100: 2.5, unitType: 'g' },
  { id: 'gf4', name: 'White Bread Slice', caloriesPer100: 265, proteinPer100: 9, carbsPer100: 49, fatPer100: 3, fiberPer100: 2.7, unitType: 'unit', caloriesPerUnit: 80, proteinPerUnit: 2.5, carbsPerUnit: 15, fatPerUnit: 1, fiberPerUnit: 0.8 },
  { id: 'gf5', name: 'Whole Wheat Bread Slice', caloriesPer100: 245, proteinPer100: 12, carbsPer100: 41, fatPer100: 3, fiberPer100: 7, unitType: 'unit', caloriesPerUnit: 75, proteinPerUnit: 3.5, carbsPerUnit: 13, fatPerUnit: 1, fiberPerUnit: 2 },
  { id: 'gf6', name: 'French Fries', caloriesPer100: 312, proteinPer100: 3.4, carbsPer100: 41, fatPer100: 15, fiberPer100: 3.8, unitType: 'g' },

  // --- MORE INDIAN CURRIES & DISHES ---
  { id: 'mi1', name: 'Butter Chicken', caloriesPer100: 210, proteinPer100: 14, carbsPer100: 6, fatPer100: 15, fiberPer100: 1, unitType: 'g' },
  { id: 'mi2', name: 'Fish Curry', caloriesPer100: 140, proteinPer100: 16, carbsPer100: 4, fatPer100: 7, fiberPer100: 1.5, unitType: 'g' },
  { id: 'mi3', name: 'Mutton Rogan Josh', caloriesPer100: 230, proteinPer100: 18, carbsPer100: 5, fatPer100: 16, fiberPer100: 2, unitType: 'g' },
  { id: 'mi4', name: 'Egg Curry', caloriesPer100: 160, proteinPer100: 10, carbsPer100: 5, fatPer100: 11, fiberPer100: 1, unitType: 'g' },
  { id: 'mi5', name: 'Kadai Chicken', caloriesPer100: 190, proteinPer100: 16, carbsPer100: 6, fatPer100: 11, fiberPer100: 2, unitType: 'g' },
  { id: 'mi6', name: 'Chana Paneer', caloriesPer100: 175, proteinPer100: 10, carbsPer100: 15, fatPer100: 9, fiberPer100: 5, unitType: 'g' },
  { id: 'mi7', name: 'Methi Matar Malai', caloriesPer100: 180, proteinPer100: 5, carbsPer100: 12, fatPer100: 13, fiberPer100: 3, unitType: 'g' },
  { id: 'mi8', name: 'Bhindi Do Pyaza', caloriesPer100: 100, proteinPer100: 3, carbsPer100: 12, fatPer100: 5, fiberPer100: 4, unitType: 'g' },
  { id: 'mi9', name: 'Kadhi Pakora', caloriesPer100: 130, proteinPer100: 5, carbsPer100: 14, fatPer100: 6, fiberPer100: 2, unitType: 'g' },
  { id: 'mi10', name: 'Keema Matar', caloriesPer100: 220, proteinPer100: 16, carbsPer100: 5, fatPer100: 15, fiberPer100: 3, unitType: 'g' },

  // --- NUTS & SEEDS ---
  { id: 'ns1', name: 'Almonds (Raw)', caloriesPer100: 579, proteinPer100: 21, carbsPer100: 22, fatPer100: 50, fiberPer100: 12, unitType: 'g' },
  { id: 'ns2', name: 'Walnuts', caloriesPer100: 654, proteinPer100: 15, carbsPer100: 14, fatPer100: 65, fiberPer100: 7, unitType: 'g' },
  { id: 'ns3', name: 'Cashews', caloriesPer100: 553, proteinPer100: 18, carbsPer100: 30, fatPer100: 44, fiberPer100: 3.3, unitType: 'g' },
  { id: 'ns4', name: 'Chia Seeds', caloriesPer100: 486, proteinPer100: 16, carbsPer100: 42, fatPer100: 31, fiberPer100: 34, unitType: 'g' },
  { id: 'ns5', name: 'Flax Seeds', caloriesPer100: 534, proteinPer100: 18, carbsPer100: 29, fatPer100: 42, fiberPer100: 27, unitType: 'g' },
  { id: 'ns6', name: 'Roasted Chana (Snack)', caloriesPer100: 360, proteinPer100: 19, carbsPer100: 58, fatPer100: 6, fiberPer100: 11, unitType: 'g' },
  { id: 'ns7', name: 'Makhana (Fox Nuts)', caloriesPer100: 350, proteinPer100: 9, carbsPer100: 77, fatPer100: 0.1, fiberPer100: 0, unitType: 'g' },

  // --- SWEETS & DESSERTS ---
  { id: 'sw1', name: 'Gulab Jamun', caloriesPer100: 320, proteinPer100: 4, carbsPer100: 50, fatPer100: 12, fiberPer100: 0, unitType: 'unit', caloriesPerUnit: 150, proteinPerUnit: 2, carbsPerUnit: 24, fatPerUnit: 6, fiberPerUnit: 0 },
  { id: 'sw2', name: 'Rasgulla', caloriesPer100: 210, proteinPer100: 5, carbsPer100: 40, fatPer100: 3, fiberPer100: 0, unitType: 'unit', caloriesPerUnit: 100, proteinPerUnit: 2, carbsPerUnit: 20, fatPerUnit: 1.5, fiberPerUnit: 0 },
  { id: 'sw3', name: 'Kheer', caloriesPer100: 120, proteinPer100: 3.5, carbsPer100: 20, fatPer100: 4, fiberPer100: 0.5, unitType: 'g' },
  { id: 'sw4', name: 'Jalebi', caloriesPer100: 350, proteinPer100: 3, carbsPer100: 70, fatPer100: 8, fiberPer100: 0, unitType: 'g' },
  { id: 'sw5', name: 'Gajar ka Halwa', caloriesPer100: 210, proteinPer100: 4, carbsPer100: 28, fatPer100: 10, fiberPer100: 3, unitType: 'g' },
  { id: 'sw6', name: 'Dark Chocolate (70%)', caloriesPer100: 600, proteinPer100: 8, carbsPer100: 45, fatPer100: 42, fiberPer100: 11, unitType: 'g' },
];
