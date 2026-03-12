"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Loader2, Lightbulb, Send } from "lucide-react";
import { getDietaryTips, DietaryTipsOutput } from "@/ai/flows/get-dietary-tips-flow";
import { useToast } from "@/hooks/use-toast";

interface AISuggestionsProps {
  userName: string;
  current: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  goals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  recentMeals: string[];
}

export function AISuggestions({ userName, current, goals, recentMeals }: AISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<DietaryTipsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const { toast } = useToast();

  const handleGetTips = async (userQuery?: string) => {
    setIsLoading(true);
    try {
      const result = await getDietaryTips({
        userName,
        current,
        goals,
        recentMeals,
        userQuestion: userQuery || undefined
      });
      setSuggestions(result);
      if (userQuery) setQuestion(""); // Clear question on success
    } catch (error) {
      toast({
        title: "Could not get AI response",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-primary/10 via-white to-accent/10 overflow-hidden relative">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">AI Nutritionist</span>
        </div>
        <CardTitle className="text-lg font-bold">
          {suggestions ? suggestions.headline : "Personalized Tips & Q&A"}
        </CardTitle>
        <CardDescription className="text-xs">
          Ask me anything about your diet or get daily insights.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions && (
          <div className="space-y-3 animate-fade-in-up">
            {suggestions.tips.map((tip, idx) => (
              <div key={idx} className="flex gap-3 p-3 rounded-lg bg-white/60 border border-white/40 shadow-sm">
                <Lightbulb className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        )}

        {!suggestions && (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground px-4">
              I've analyzed your {recentMeals.length} logs for today. Want some advice on how to hit your targets?
            </p>
            <Button onClick={() => handleGetTips()} disabled={isLoading} size="sm">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get AI Suggestions
                </>
              )}
            </Button>
          </div>
        )}

        <div className="pt-4 border-t border-white/40 mt-2">
          <div className="relative">
            <Input
              placeholder="Ask a question... (e.g. 'Is this too much fat?')"
              className="pr-10 bg-white/50 text-xs h-9"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && question.trim()) {
                  handleGetTips(question);
                }
              }}
              disabled={isLoading}
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-0 top-0 h-9 w-9 text-primary hover:bg-transparent"
              onClick={() => question.trim() && handleGetTips(question)}
              disabled={isLoading || !question.trim()}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
      <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-primary/5 rounded-full blur-2xl" />
    </Card>
  );
}
