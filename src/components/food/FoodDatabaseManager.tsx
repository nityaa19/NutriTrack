
"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FoodItem, UnitType } from "@/lib/mock-data";
import { Edit3, Plus, Loader2, Camera } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFirestore, useUser, useCollection } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { useMemoFirebase } from "@/firebase/provider";
import { scanNutritionLabel } from "@/ai/flows/scan-nutrition-label-flow";
import { useToast } from "@/hooks/use-toast";

export function FoodDatabaseManager() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch custom foods from Firestore
  const customFoodsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, "userProfiles", user.uid, "customFoodItems");
  }, [db, user]);

  const { data: customFoods, isLoading } = useCollection<FoodItem>(customFoodsQuery);

  const handleSave = () => {
    if (editingFood && user && db) {
      const foodId = editingFood.id.startsWith('new-') 
        ? Math.random().toString(36).substr(2, 9) 
        : editingFood.id;
      
      const foodRef = doc(db, "userProfiles", user.uid, "customFoodItems", foodId);
      const foodData = {
        ...editingFood,
        id: foodId,
        isCustom: true,
        creatorId: user.uid,
        updatedAt: new Date().toISOString()
      };

      setDocumentNonBlocking(foodRef, foodData, { merge: true });
      setEditingFood(null);
      toast({
        title: "Success",
        description: `${editingFood.name} has been saved to your database.`,
      });
    }
  };

  const startNew = () => {
    setEditingFood({
      id: 'new-' + Date.now(),
      name: '',
      unitType: 'g',
      caloriesPer100: 0,
      proteinPer100: 0,
      carbsPer100: 0,
      fatPer100: 0,
      fiberPer100: 0,
      isCustom: true
    });
  };

  const handleProcessImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUri = e.target?.result as string;
      try {
        const result = await scanNutritionLabel({ photoDataUri: dataUri });
        
        setEditingFood(prev => {
          if (!prev) return null;
          return {
            ...prev,
            name: result.name,
            unitType: 'g',
            caloriesPer100: result.caloriesPer100,
            proteinPer100: result.proteinPer100,
            carbsPer100: result.carbsPer100,
            fatPer100: result.fatPer100,
            fiberPer100: result.fiberPer100,
          };
        });
        
        toast({ title: "Scan Successful", description: `Found: ${result.name}` });
      } catch (err: any) {
        const isRateLimit = err.message?.includes('429') || err.message?.includes('RESOURCE_EXHAUSTED');
        toast({ 
          title: "Scan Failed", 
          description: isRateLimit ? "AI Rate limit reached. Please wait a minute before scanning again." : (err.message || "Could not read label. Please try a clearer photo or enter manually."), 
          variant: "destructive" 
        });
      } finally {
        setIsScanning(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card className="border-none shadow-md bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Nutritional Database</CardTitle>
          <CardDescription>Custom nutrition data for your kitchen.</CardDescription>
        </div>
        <Button size="sm" onClick={startNew}>
          <Plus className="h-4 w-4 mr-1" />
          Add New Item
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid gap-3">
            {customFoods && customFoods.length > 0 ? (
              customFoods.map(food => (
                <div key={food.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                  <div>
                    <div className="font-medium text-sm">{food.name}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                      {food.unitType === 'g' ? `Per 100g · ${food.caloriesPer100} kcal` : `Per Unit · ${food.caloriesPerUnit} kcal`}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setEditingFood(food)}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-sm text-muted-foreground italic border-dashed border-2 rounded-xl">
                No custom items yet. Add items like whey, milk, or oats!
              </div>
            )}
          </div>
        )}
      </CardContent>

      <Dialog open={!!editingFood} onOpenChange={(open) => !open && setEditingFood(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center justify-between pr-8">
              <DialogTitle>{editingFood?.id.startsWith('new-') ? 'Add New Food' : `Edit ${editingFood?.name}`}</DialogTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fileInputRef.current?.click()}
                disabled={isScanning}
                className="ml-4"
              >
                {isScanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4 mr-2" />}
                Scan Label
              </Button>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleProcessImage} 
            />
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="db-name">Food Name</Label>
              <Input 
                id="db-name" 
                placeholder="e.g., MuscleBlaze Whey, Amul Milk"
                value={editingFood?.name || ""} 
                onChange={e => setEditingFood(prev => prev ? {...prev, name: e.target.value} : null)} 
              />
            </div>
            <div className="grid gap-2">
              <Label>Measurement Unit</Label>
              <Select 
                value={editingFood?.unitType} 
                onValueChange={(val: UnitType) => setEditingFood(prev => prev ? {...prev, unitType: val} : null)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="g">By Weight (per 100g)</SelectItem>
                  <SelectItem value="unit">By Unit (per piece/scoop)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {editingFood?.unitType === 'g' ? (
                <>
                  <div className="grid gap-2">
                    <Label>Cals / 100g</Label>
                    <Input type="number" value={editingFood.caloriesPer100} onChange={e => setEditingFood({...editingFood, caloriesPer100: Number(e.target.value)})} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Protein / 100g</Label>
                    <Input type="number" value={editingFood.proteinPer100} onChange={e => setEditingFood({...editingFood, proteinPer100: Number(e.target.value)})} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Carbs / 100g</Label>
                    <Input type="number" value={editingFood.carbsPer100} onChange={e => setEditingFood({...editingFood, carbsPer100: Number(e.target.value)})} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Fat / 100g</Label>
                    <Input type="number" value={editingFood.fatPer100} onChange={e => setEditingFood({...editingFood, fatPer100: Number(e.target.value)})} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Fiber / 100g</Label>
                    <Input type="number" value={editingFood.fiberPer100} onChange={e => setEditingFood({...editingFood, fiberPer100: Number(e.target.value)})} />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid gap-2">
                    <Label>Cals / Unit</Label>
                    <Input type="number" value={editingFood?.caloriesPerUnit || 0} onChange={e => setEditingFood(prev => prev ? {...prev, caloriesPerUnit: Number(e.target.value)} : null)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Protein / Unit</Label>
                    <Input type="number" value={editingFood?.proteinPerUnit || 0} onChange={e => setEditingFood(prev => prev ? {...prev, proteinPerUnit: Number(e.target.value)} : null)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Carbs / Unit</Label>
                    <Input type="number" value={editingFood?.carbsPerUnit || 0} onChange={e => setEditingFood(prev => prev ? {...prev, carbsPerUnit: Number(e.target.value)} : null)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Fat / Unit</Label>
                    <Input type="number" value={editingFood?.fatPerUnit || 0} onChange={e => setEditingFood(prev => prev ? {...prev, fatPerUnit: Number(e.target.value)} : null)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Fiber / Unit</Label>
                    <Input type="number" value={editingFood?.fiberPerUnit || 0} onChange={e => setEditingFood(prev => prev ? {...prev, fiberPerUnit: Number(e.target.value)} : null)} />
                  </div>
                </>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave} className="w-full sm:w-auto" disabled={isScanning}>
              {editingFood?.id.startsWith('new-') ? 'Add to Database' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
