"use client";

import { useEffect, useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { DailyProgress } from "@/components/dashboard/DailyProgress";
import { FoodDiary } from "@/components/food/FoodDiary";
import { AISuggestions } from "@/components/dashboard/AISuggestions";
import { Calendar, Loader2 } from "lucide-react";
import { useUser, useDoc, useCollection, useFirestore } from "@/firebase";
import { doc, collection } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase/provider";
import { LogEntry } from "@/lib/mock-data";
import { getLocalDateString } from "@/lib/utils";

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const [dateStr, setDateStr] = useState<string>("");
  const today = getLocalDateString();

  useEffect(() => {
    setDateStr(new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));
  }, []);

  // Fetch User Profile for Goals
  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "userProfiles", user.uid);
  }, [db, user]);
  const { data: profile } = useDoc(profileRef);

  // Fetch Logs
  const logsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, "userProfiles", user.uid, "foodLogs");
  }, [db, user]);
  const { data: allLogs, isLoading: isLogsLoading } = useCollection<LogEntry>(logsQuery);

  const currentData = useMemo(() => {
    const dailyLogs = allLogs?.filter(l => l.date === today) || [];
    return dailyLogs.reduce((acc, log) => ({
      calories: acc.calories + (log.nutrients.calories || 0),
      protein: acc.protein + (log.nutrients.protein || 0),
      carbs: acc.carbs + (log.nutrients.carbs || 0),
      fat: acc.fat + (log.nutrients.fat || 0),
      fiber: acc.fiber + (log.nutrients.fiber || 0),
      water: acc.water || 0,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, water: 0 });
  }, [allLogs, today]);

  const recentMealNames = useMemo(() => {
    return allLogs?.filter(l => l.date === today).map(l => l.foodName) || [];
  }, [allLogs, today]);

  const goalData = useMemo(() => ({
    calories: profile?.targetCalories || 2000,
    protein: profile?.targetProteinGrams || 150,
    carbs: profile?.targetCarbsGrams || 200,
    fat: profile?.targetFatGrams || 65,
    fiber: profile?.targetFiberGrams || 30,
    water: profile?.targetWaterLiters || 3.5
  }), [profile]);

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="pb-24 md:pt-20">
      <Navbar />
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 pt-6">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Hello, {user?.displayName || (user?.isAnonymous ? "Guest" : "User")}!
            </h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <Calendar className="h-4 w-4" />
              Today: {dateStr || "Loading..."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium">Tracking Active</span>
          </div>
        </header>

        <section className="space-y-8">
          <DailyProgress current={currentData} goals={goalData} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <FoodDiary />
            </div>
            <div className="space-y-6">
              <AISuggestions 
                userName={user?.displayName || "User"}
                current={currentData}
                goals={goalData}
                recentMeals={recentMealNames}
              />
              
              <div className="p-6 rounded-xl bg-white shadow-md border">
                <h3 className="font-bold text-lg mb-4">Meal Summary</h3>
                <div className="space-y-3">
                  {['breakfast', 'lunch', 'evening snacks', 'dinner', 'something extra'].map(type => {
                    const cals = allLogs?.filter(l => l.date === today && l.mealType === type)
                      .reduce((sum, l) => sum + l.nutrients.calories, 0) || 0;
                    return (
                      <div key={type} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground capitalize">{type}</span>
                        <span className="font-medium">{cals} kcal</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
