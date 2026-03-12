
"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth, useUser, useFirestore } from "@/firebase";
import { initiateEmailSignIn } from "@/firebase/non-blocking-login";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { doc } from "firebase/firestore";
import { Loader2, Activity, ArrowLeft, ChevronRight, ChevronLeft, Sparkles, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateTargets, getActivityMultiplier } from "@/lib/nutrition-utils";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  // Profile data for registration
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("170");
  const [age, setAge] = useState("25");
  const [gender, setGender] = useState("male");
  const [goal, setGoal] = useState("maintain");
  const [gym, setGym] = useState("3");

  useEffect(() => {
    if (!isUserLoading && user && !user.isAnonymous) {
      router.push("/dashboard");
    }
  }, [user, isUserLoading, router]);

  // Live Suggestion based on registration inputs
  const suggestedTargets = useMemo(() => {
    const w = Number(weight);
    const h = Number(height);
    const a = Number(age);
    if (!w || !h || !a) return null;

    const multiplier = getActivityMultiplier(Number(gym), 10000); // Default step count
    return calculateTargets({
      weightKg: w,
      heightCm: h,
      age: a,
      gender: gender as any,
      activityLevel: multiplier,
      goal: goal as any
    });
  }, [weight, height, age, gender, gym, goal]);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    initiateEmailSignIn(auth, email, password);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const registeredUser = userCredential.user;

      // Set Display Name
      await updateProfile(registeredUser, { displayName: name });

      // Create Profile in Firestore
      if (suggestedTargets) {
        const profileRef = doc(db, "userProfiles", registeredUser.uid);
        const profileData = {
          id: registeredUser.uid,
          name,
          email,
          weightKg: Number(weight),
          heightCm: Number(height),
          age: Number(age),
          gender,
          fitnessGoal: goal,
          weeklyGymActivityHours: Number(gym),
          dailyStepsGoal: 10000,
          targetCalories: suggestedTargets.calories,
          targetProteinGrams: suggestedTargets.protein,
          targetCarbsGrams: suggestedTargets.carbs,
          targetFatGrams: suggestedTargets.fat,
          targetFiberGrams: suggestedTargets.fiber,
          targetWaterLiters: suggestedTargets.water,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setDocumentNonBlocking(profileRef, profileData, { merge: true });
      }

      toast({
        title: "Welcome to NutriTrack!",
        description: "Your account has been created successfully.",
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during sign up.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
          <Activity className="h-7 w-7 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-primary">NutriTrack</h1>
        <p className="text-sm text-muted-foreground">Your journey to a healthier you begins here.</p>
      </div>

      <Card className="w-full max-w-md border-none shadow-xl bg-white overflow-hidden">
        <Tabs defaultValue="login" onValueChange={() => setStep(1)}>
          <CardHeader className="space-y-1 pb-2">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <CardTitle className="text-2xl text-center">
              {step === 1 ? "Welcome" : "Tell us about yourself"}
            </CardTitle>
          </CardHeader>
          
          <TabsContent value="login">
            <form onSubmit={handleSignIn}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="name@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Sign In
                </Button>
              </CardFooter>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleSignUp}>
              <CardContent className="space-y-4 pt-4 min-h-[350px]">
                {step === 1 ? (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-name">Full Name</Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="reg-name" placeholder="John Doe" required className="pl-10" value={name} onChange={(e) => setName(e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email</Label>
                      <Input id="reg-email" type="email" placeholder="name@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <Input id="reg-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <Button type="button" className="w-full mt-4" onClick={() => name && email && password && setStep(2)}>
                      Next: Your Body Stats <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Weight (kg)</Label>
                        <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Height (cm)</Label>
                        <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Age</Label>
                        <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
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
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <Label>Gym (hrs/wk)</Label>
                         <Input type="number" value={gym} onChange={(e) => setGym(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Goal</Label>
                        <Select value={goal} onValueChange={setGoal}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lose">Lose Weight</SelectItem>
                            <SelectItem value="maintain">Maintain</SelectItem>
                            <SelectItem value="gain">Gain Weight</SelectItem>
                            <SelectItem value="muscle">Muscle Gain</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {suggestedTargets && (
                      <div className="bg-primary/5 p-3 rounded-lg border border-primary/20 text-center">
                         <div className="flex items-center justify-center gap-1 text-[10px] text-primary font-bold uppercase tracking-wider mb-1">
                           <Sparkles className="h-3 w-3" />
                           Your Suggested Target
                         </div>
                         <div className="text-lg font-bold text-primary">{suggestedTargets.calories} kcal / day</div>
                         <p className="text-[10px] text-muted-foreground">Protein focus: {suggestedTargets.protein}g</p>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button type="button" variant="outline" onClick={() => setStep(1)}>
                        <ChevronLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                      <Button type="submit" className="flex-1" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Complete Signup
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </form>
          </TabsContent>
        </Tabs>
      </Card>

      <Link href="/dashboard" className="mt-8 text-sm text-muted-foreground hover:text-primary flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Continue as Guest
      </Link>
    </div>
  );
}
