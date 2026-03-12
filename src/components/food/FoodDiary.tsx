"use client";

import { useState, useRef, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Plus, Trash2, Utensils, Camera, Loader2, Check, Sparkles } from "lucide-react";
import { FoodItem, LogEntry, INITIAL_FOODS, MealType } from "@/lib/mock-data";
import { scanNutritionLabel } from "@/ai/flows/scan-nutrition-label-flow";
import { searchFoodAI } from "@/ai/flows/search-food-ai-flow";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useFirestore, useUser, useCollection } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { setDocumentNonBlocking, addDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { useMemoFirebase } from "@/firebase/provider";
import { getLocalDateString } from "@/lib/utils";

const MEAL_TYPES: { id: MealType; label: string }[] = [
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'evening snacks', label: 'Evening Snacks' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'something extra', label: 'Something Extra' },
];

export function FoodDiary() {
  const { user } = useUser();
  const db = useFirestore();
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
  const [isScanning, setIsScanning] = useState(false);
  const [activeMealForScan, setActiveMealForScan] = useState<MealType | null>(null);
  const [isAISearching, setIsAISearching] = useState<Record<string, boolean>>({});
  const [aiResults, setAIResults] = useState<Record<string, FoodItem[]>>({});
  const [loggingFood, setLoggingFood] = useState<{ food: FoodItem; mealType: MealType } | null>(null);
  const [quantity, setQuantity] = useState<string>("100");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const today = getLocalDateString();

  const customFoodsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, "userProfiles", user.uid, "customFoodItems");
  }, [db, user]);

  const { data: customFoods } = useCollection<FoodItem>(customFoodsQuery);

  const allAvailableFoods = useMemo(() => {
    const combined = [...INITIAL_FOODS];
    if (customFoods) {
      customFoods.forEach(cf => {
        if (!combined.find(f => f.id === cf.id)) combined.push(cf);
      });
    }
    return combined;
  }, [customFoods]);

  const logsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, "userProfiles", user.uid, "foodLogs");
  }, [db, user]);

  const { data: allLogs } = useCollection<LogEntry>(logsQuery);
  const logs = useMemo(() => allLogs?.filter(l => l.date === today) || [], [allLogs, today]);

  const handleAddLog = (food: FoodItem, mealType: MealType, qty: number) => {
    if (!user || !db) return;

    const isGrams = food.unitType === 'g';
    const multiplier = isGrams ? qty / 100 : qty;

    const nutrients = isGrams ? {
      calories: Math.round(food.caloriesPer100 * multiplier),
      protein: Math.round(food.proteinPer100 * multiplier),
      carbs: Math.round(food.carbsPer100 * multiplier),
      fat: Math.round(food.fatPer100 * multiplier),
      fiber: Math.round(food.fiberPer100 * multiplier),
    } : {
      calories: Math.round((food.caloriesPerUnit || 0) * multiplier),
      protein: Math.round((food.proteinPerUnit || 0) * multiplier),
      carbs: Math.round((food.carbsPerUnit || 0) * multiplier),
      fat: Math.round((food.fatPerUnit || 0) * multiplier),
      fiber: Math.round((food.fiberPerUnit || 0) * multiplier),
    };

    const logData = {
      foodId: food.id,
      foodName: food.name,
      quantity: qty,
      unitType: food.unitType,
      timestamp: Date.now(),
      date: today,
      mealType,
      userId: user.uid,
      nutrients
    };

    const logsRef = collection(db, "userProfiles", user.uid, "foodLogs");
    addDocumentNonBlocking(logsRef, logData);
    
    if (food.id.startsWith('ai-') || food.id.startsWith('scan-')) {
      const foodRef = doc(db, "userProfiles", user.uid, "customFoodItems", food.id);
      setDocumentNonBlocking(foodRef, { 
        ...food, 
        creatorId: user.uid,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }

    setLoggingFood(null);
    setSearchTerms(prev => ({ ...prev, [mealType]: "" }));
    setAIResults(prev => ({ ...prev, [mealType]: [] }));
  };

  const handleAISearch = async (mealId: MealType) => {
    const query = searchTerms[mealId];
    if (!query) return;

    setIsAISearching(prev => ({ ...prev, [mealId]: true }));
    try {
      const results = await searchFoodAI({ query });
      const foodItems: FoodItem[] = results.map((r, i) => ({
        id: `ai-${Date.now()}-${i}`,
        name: r.name,
        caloriesPer100: r.caloriesPer100,
        proteinPer100: r.proteinPer100,
        carbsPer100: r.carbsPer100,
        fatPer100: r.fatPer100,
        fiberPer100: r.fiberPer100,
        unitType: 'g',
        isCustom: true
      }));
      setAIResults(prev => ({ ...prev, [mealId]: foodItems }));
    } catch (err: any) {
      const isRateLimit = err.message?.includes('429') || err.message?.includes('RESOURCE_EXHAUSTED');
      toast({ 
        title: "AI Search Failed", 
        description: isRateLimit ? "Too many requests. Please wait a minute and try again." : "Could not get nutrition estimates.", 
        variant: "destructive" 
      });
    } finally {
      setIsAISearching(prev => ({ ...prev, [mealId]: false }));
    }
  };

  const removeLog = (id: string) => {
    if (!user || !db) return;
    const logRef = doc(db, "userProfiles", user.uid, "foodLogs", id);
    deleteDocumentNonBlocking(logRef);
  };

  const handleProcessImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const mealType = activeMealForScan;
    if (!file || !user || !db || !mealType) return;

    setIsScanning(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUri = event.target?.result as string;
      try {
        const result = await scanNutritionLabel({ photoDataUri: dataUri });
        const foodId = "scan-" + Math.random().toString(36).substr(2, 9);
        const newFood: FoodItem = {
          id: foodId,
          name: result.name,
          caloriesPer100: result.caloriesPer100,
          proteinPer100: result.proteinPer100,
          carbsPer100: result.carbsPer100,
          fatPer100: result.fatPer100,
          fiberPer100: result.fiberPer100,
          unitType: 'g',
          isCustom: true,
          creatorId: user.uid
        };

        setLoggingFood({ food: newFood, mealType });
        setQuantity("100");
        toast({ title: "Label Scanned!", description: `Identified: ${result.name}` });
      } catch (err: any) {
        const isRateLimit = err.message?.includes('429') || err.message?.includes('RESOURCE_EXHAUSTED');
        toast({ 
          title: "Scan Failed", 
          description: isRateLimit ? "AI Rate limit reached. Please wait a minute before scanning again." : (err.message || "Could not read label. Please try a clearer photo."), 
          variant: "destructive" 
        });
      } finally {
        setIsScanning(false);
        setActiveMealForScan(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleProcessImage} 
      />

      {MEAL_TYPES.map(meal => {
        const searchTerm = searchTerms[meal.id] || "";
        const mealLogs = logs.filter(l => l.mealType === meal.id);
        const totalCals = mealLogs.reduce((acc, log) => acc + log.nutrients.calories, 0);

        const localFiltered = searchTerm.length > 0 
          ? allAvailableFoods.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()))
          : [];
        
        const currentAIResults = aiResults[meal.id] || [];
        const filteredFoods = [...localFiltered, ...currentAIResults];

        return (
          <Card key={meal.id} className="border-none shadow-md bg-white">
            <CardHeader className="py-4 pb-2 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Utensils className="h-4 w-4 text-primary" />
                <CardTitle className="text-base font-bold">{meal.label}</CardTitle>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-muted-foreground">{totalCals} kcal</span>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 px-2" 
                  onClick={() => {
                    setActiveMealForScan(meal.id);
                    fileInputRef.current?.click();
                  }}
                  disabled={isScanning}
                >
                  {isScanning && activeMealForScan === meal.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Camera className="h-3 w-3 mr-1" />
                  )}
                  Scan
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="relative group">
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={`Search for ${meal.label.toLowerCase()}...`}
                      className="pl-10 h-9 text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerms(prev => ({ ...prev, [meal.id]: e.target.value }))}
                    />
                  </div>
                  {searchTerm.length > 2 && (
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="h-9 px-3 shrink-0"
                      onClick={() => handleAISearch(meal.id)}
                      disabled={isAISearching[meal.id]}
                    >
                      {isAISearching[meal.id] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 mr-1 text-accent" />}
                      AI Search
                    </Button>
                  )}
                </div>

                {(filteredFoods.length > 0 || isAISearching[meal.id]) && searchTerm.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-white border rounded-md shadow-lg max-h-64 overflow-y-auto">
                    {isAISearching[meal.id] && (
                      <div className="p-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Gemini is estimating...
                      </div>
                    )}
                    
                    {filteredFoods.map(food => (
                      <button
                        key={food.id}
                        className="w-full text-left p-2 hover:bg-muted transition-colors border-b last:border-0 flex justify-between items-center"
                        onClick={() => {
                          setLoggingFood({ food, mealType: meal.id });
                          setQuantity(food.unitType === 'g' ? "100" : "1");
                        }}
                      >
                        <div>
                          <div className="text-sm font-medium flex items-center gap-1">
                            {food.name} 
                            {food.id.startsWith('ai-') && <Sparkles className="h-3 w-3 text-accent" />}
                            {food.isCustom && !food.id.startsWith('ai-') && <span className="px-1 bg-blue-100 text-[8px] rounded text-blue-700 uppercase">Custom</span>}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {food.unitType === 'g' ? `${food.caloriesPer100} kcal/100g` : `${food.caloriesPerUnit} kcal/unit`}
                          </div>
                        </div>
                        <Plus className="h-4 w-4 text-primary" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {mealLogs.length > 0 ? (
                  mealLogs.map(log => (
                    <div key={log.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/20 border-transparent hover:border-muted transition-all group">
                      <div className="flex-grow">
                        <div className="font-medium text-sm">{log.foodName}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {log.quantity}{log.unitType === 'g' ? 'g' : ' units'} · {log.nutrients.calories} kcal
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="text-[10px] font-mono text-muted-foreground hidden sm:block">
                            P: {log.nutrients.protein}g · C: {log.nutrients.carbs}g · F: {log.nutrients.fat}g
                         </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" 
                          onClick={() => removeLog(log.id)}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-xs text-muted-foreground italic border-dashed border rounded-lg">
                    No entries for {meal.label.toLowerCase()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Dialog open={!!loggingFood} onOpenChange={() => setLoggingFood(null)}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle className="text-lg">Log {loggingFood?.food.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="qty">
                {loggingFood?.food.unitType === 'g' ? 'Weight (grams)' : 'Quantity (count)'}
              </Label>
              <Input 
                id="qty" 
                type="number" 
                value={quantity} 
                onChange={(e) => setQuantity(e.target.value)} 
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              className="w-full" 
              onClick={() => {
                if (loggingFood) {
                  handleAddLog(loggingFood.food, loggingFood.mealType, Number(quantity));
                }
              }}
            >
              <Check className="mr-2 h-4 w-4" />
              Add to {loggingFood?.mealType}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
