
"use client";

import { useEffect, useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser, useFirestore, useDoc, useAuth } from "@/firebase";
import { doc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { useMemoFirebase } from "@/firebase/provider";
import { Loader2, Save, Sparkles, User as UserIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { calculateTargets, getActivityMultiplier } from "@/lib/nutrition-utils";

export default function SettingsPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  // Profile data state
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [goal, setGoal] = useState("maintain");
  const [steps, setSteps] = useState("10000");
  const [gym, setGym] = useState("3");

  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "userProfiles", user.uid);
  }, [db, user]);

  const { data: profile, isLoading } = useDoc(profileRef);

  useEffect(() => {
    if (profile) {
      setName(profile.name || user?.displayName || "");
      setWeight(profile.weightKg?.toString() || "");
      setHeight(profile.heightCm?.toString() || "");
      setAge(profile.age?.toString() || "");
      setGender(profile.gender || "male");
      setGoal(profile.fitnessGoal || "maintain");
      setSteps(profile.dailyStepsGoal?.toString() || "10000");
      setGym(profile.weeklyGymActivityHours?.toString() || "3");
    }
  }, [profile, user]);

  // Real-time suggested targets based on current local input
  const suggestedTargets = useMemo(() => {
    const w = Number(weight);
    const h = Number(height);
    const a = Number(age);
    const g = Number(gym);
    const s = Number(steps);

    if (!w || !h || !a) return null;

    const multiplier = getActivityMultiplier(g, s);
    return calculateTargets({
      weightKg: w,
      heightCm: h,
      age: a,
      gender: gender as any,
      activityLevel: multiplier,
      goal: goal as any
    });
  }, [weight, height, age, gender, gym, steps, goal]);

  const handleUpdateProfile = async () => {
    if (!user || !db || !suggestedTargets) return;
    setIsUpdating(true);

    try {
      // Update Auth Display Name
      if (name !== user.displayName) {
        await updateProfile(user, { displayName: name });
      }

      const updateData = {
        id: user.uid,
        name,
        email: user.email || "",
        weightKg: Number(weight),
        heightCm: Number(height),
        age: Number(age),
        gender,
        fitnessGoal: goal,
        weeklyGymActivityHours: Number(gym),
        dailyStepsGoal: Number(steps),
        targetCalories: suggestedTargets.calories,
        targetProteinGrams: suggestedTargets.protein,
        targetCarbsGrams: suggestedTargets.carbs,
        targetFatGrams: suggestedTargets.fat,
        targetFiberGrams: suggestedTargets.fiber,
        targetWaterLiters: suggestedTargets.water,
        updatedAt: new Date().toISOString()
      };

      const docRef = doc(db, "userProfiles", user.uid);
      setDocumentNonBlocking(docRef, updateData, { merge: true });
      
      toast({
        title: "Profile Updated",
        description: `Your daily target is now ${suggestedTargets.calories} kcal.`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update profile details.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isUserLoading || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="pb-24 md:pt-20">
      <Navbar />
      <div className="max-w-screen-md mx-auto px-4 md:px-8 pt-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your profile and nutritional goals.</p>
        </header>

        <div className="grid grid-cols-1 gap-6">
          <Card className="border-none shadow-md bg-white">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Your contact details used for reports.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email (Read-only)</Label>
                <Input value={user?.email || "Guest Account"} disabled className="bg-muted/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white">
            <CardHeader>
              <CardTitle>Physical Metrics & Goals</CardTitle>
              <CardDescription>Adjust these to see live suggestions for your nutrition.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Current Weight (kg)</Label>
                  <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="steps">Daily Steps Goal</Label>
                  <Input id="steps" type="number" value={steps} onChange={(e) => setSteps(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gym">Weekly Gym Activity (hours)</Label>
                  <Input id="gym" type="number" value={gym} onChange={(e) => setGym(e.target.value)} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="goal">Fitness Objective</Label>
                  <Select value={goal} onValueChange={setGoal}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lose">Lose Weight (Caloric Deficit)</SelectItem>
                      <SelectItem value="maintain">Maintain Weight (Maintenance)</SelectItem>
                      <SelectItem value="gain">Gain Weight (Bulking)</SelectItem>
                      <SelectItem value="muscle">Muscle Gain (Clean Bulk / Recomp)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {suggestedTargets && (
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <Sparkles className="h-4 w-4" />
                    Suggested Live Targets
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="bg-white p-2 rounded border shadow-sm">
                      <div className="text-[10px] text-muted-foreground uppercase font-bold">Calories</div>
                      <div className="text-lg font-bold">{suggestedTargets.calories} kcal</div>
                    </div>
                    <div className="bg-white p-2 rounded border shadow-sm">
                      <div className="text-[10px] text-muted-foreground uppercase font-bold">Protein</div>
                      <div className="text-lg font-bold">{suggestedTargets.protein} g</div>
                    </div>
                    <div className="bg-white p-2 rounded border shadow-sm">
                      <div className="text-[10px] text-muted-foreground uppercase font-bold">Carbs</div>
                      <div className="text-lg font-bold">{suggestedTargets.carbs} g</div>
                    </div>
                    <div className="bg-white p-2 rounded border shadow-sm">
                      <div className="text-[10px] text-muted-foreground uppercase font-bold">Fat</div>
                      <div className="text-lg font-bold">{suggestedTargets.fat} g</div>
                    </div>
                    <div className="bg-white p-2 rounded border shadow-sm">
                      <div className="text-[10px] text-muted-foreground uppercase font-bold">Fiber</div>
                      <div className="text-lg font-bold">{suggestedTargets.fiber} g</div>
                    </div>
                    <div className="bg-white p-2 rounded border shadow-sm">
                      <div className="text-[10px] text-muted-foreground uppercase font-bold">Water</div>
                      <div className="text-lg font-bold">{suggestedTargets.water} L</div>
                    </div>
                  </div>
                </div>
              )}

              <Button className="w-full" onClick={handleUpdateProfile} disabled={isUpdating || !suggestedTargets}>
                {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Changes & Apply Targets
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
