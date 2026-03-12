
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame, Beef, Wheat, Droplets, Leaf } from "lucide-react";

interface Nutrients {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  water: number;
}

interface DailyProgressProps {
  current: Nutrients;
  goals: Nutrients;
}

export function DailyProgress({ current, goals }: DailyProgressProps) {
  const calPercent = Math.min((current.calories / goals.calories) * 100, 100);
  const proteinPercent = Math.min((current.protein / goals.protein) * 100, 100);
  const carbsPercent = Math.min((current.carbs / goals.carbs) * 100, 100);
  const fatPercent = Math.min((current.fat / goals.fat) * 100, 100);
  const fiberPercent = Math.min((current.fiber / goals.fiber) * 100, 100);
  const waterPercent = Math.min((current.water / goals.water) * 100, 100);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-none shadow-md bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Calories</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{current.calories} / {goals.calories}</div>
            <p className="text-xs text-muted-foreground mb-4">kcal remaining: {Math.max(goals.calories - current.calories, 0)}</p>
            <Progress value={calPercent} className="h-2" />
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Fiber</CardTitle>
            <Leaf className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{current.fiber.toFixed(1)}g / {goals.fiber}g</div>
            <p className="text-xs text-muted-foreground mb-4">Daily target: {goals.fiber}g</p>
            <Progress value={fiberPercent} className="h-2 bg-emerald-100" />
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Daily Hydration</CardTitle>
            <Droplets className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{current.water.toFixed(1)}L / {goals.water}L</div>
            <p className="text-xs text-muted-foreground mb-4">Drink 8-10 glasses of water daily.</p>
            <Progress value={waterPercent} className="h-2 bg-blue-100" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm bg-white/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Protein</CardTitle>
            <Beef className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{current.protein}g / {goals.protein}g</div>
            <Progress value={proteinPercent} className="h-1.5 bg-red-100 mt-2" />
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Carbs</CardTitle>
            <Wheat className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{current.carbs}g / {goals.carbs}g</div>
            <Progress value={carbsPercent} className="h-1.5 bg-yellow-100 mt-2" />
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Fat</CardTitle>
            <Droplets className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{current.fat}g / {goals.fat}g</div>
            <Progress value={fatPercent} className="h-1.5 bg-blue-100 mt-2" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
