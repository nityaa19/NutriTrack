"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Mail, Loader2, CheckCircle2, FileText, Calendar as CalendarIcon, History, Trash2, ChartBar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser, useDoc, useCollection, useFirestore } from "@/firebase";
import { doc, collection, query, orderBy, limit } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase/provider";
import { sendEmailAction } from "@/app/actions/send-email";
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { LogEntry } from "@/lib/mock-data";
import { getLocalDateString } from "@/lib/utils";

interface SavedReport {
  id: string;
  generationDate: string;
  reportContent: string;
  type: 'daily' | 'weekly';
  userId: string;
  sentToEmail: boolean;
}

export function WeeklyAIReport() {
  const { user } = useUser();
  const db = useFirestore();
  const [activeReport, setActiveReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { toast } = useToast();
  const today = getLocalDateString();

  // --- DATA FETCHING ---
  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "userProfiles", user.uid);
  }, [db, user]);
  const { data: profile } = useDoc(profileRef);

  const logsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, "userProfiles", user.uid, "foodLogs");
  }, [db, user]);
  
  // FIXED: Destructure isLoading as isLogsLoading to resolve the ReferenceError
  const { data: allLogs, isLoading: isLogsLoading } = useCollection<LogEntry>(logsQuery);

  const reportsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, "userProfiles", user.uid, "aiReports"),
      orderBy("generationDate", "desc"),
      limit(10)
    );
  }, [db, user]);
  const { data: savedReports, isLoading: isReportsLoading } = useCollection<SavedReport>(reportsQuery);

  const isSunday = new Date().getDay() === 0;

  const goalData = useMemo(() => ({
    calories: profile?.targetCalories || 2000,
    protein: profile?.targetProteinGrams || 150,
    carbs: profile?.targetCarbsGrams || 200,
    fat: profile?.targetFatGrams || 65,
    fiber: profile?.targetFiberGrams || 30
  }), [profile]);

  const saveReportToFirestore = (content: string, type: 'daily' | 'weekly') => {
    if (!user || !db) return;
    const reportsRef = collection(db, "userProfiles", user.uid, "aiReports");
    addDocumentNonBlocking(reportsRef, {
      userId: user.uid,
      generationDate: new Date().toISOString(),
      reportContent: content,
      type,
      sentToEmail: false
    });
  };

  const handleGenerateDailyReport = () => {
    if (!user || !allLogs) return;
    setIsGenerating(true);
    
    // Explicitly calculate stats for TODAY from all available logs
    const dailyLogs = allLogs.filter(l => l.date === today);
    const meals = Array.from(new Set(dailyLogs.map(l => l.foodName)));
    const totals = dailyLogs.reduce((acc, log) => ({
      calories: acc.calories + (log.nutrients.calories || 0),
      protein: acc.protein + (log.nutrients.protein || 0),
      carbs: acc.carbs + (log.nutrients.carbs || 0),
      fat: acc.fat + (log.nutrients.fat || 0),
      fiber: acc.fiber + (log.nutrients.fiber || 0),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

    setTimeout(() => {
      const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
      const goals = goalData;

      const reportText = `# 📊 DAILY NUTRITION SNAPSHOT
**Date: ${dateStr}**

### 📈 PERFORMANCE SUMMARY
- **Calories**: ${totals.calories} / ${goals.calories} kcal (${goals.calories > 0 ? Math.round((totals.calories / goals.calories) * 100) : 0}%)
- **Protein**: ${totals.protein}g / ${goals.protein}g (${goals.protein > 0 ? Math.round((totals.protein / goals.protein) * 100) : 0}%)
- **Carbs**: ${totals.carbs}g / ${goals.carbs}g (${goals.carbs > 0 ? Math.round((totals.carbs / goals.carbs) * 100) : 0}%)
- **Fats**: ${totals.fat}g / ${goals.fat}g (${goals.fat > 0 ? Math.round((totals.fat / goals.fat) * 100) : 0}%)
- **Fiber**: ${totals.fiber}g / ${goals.fiber}g (${goals.fiber > 0 ? Math.round((totals.fiber / goals.fiber) * 100) : 0}%)

### 🍴 FOODS LOGGED TODAY
${meals.length > 0 ? meals.map(m => `- ${m}`).join('\n') : '- No specific meals logged yet.'}

### 💡 NUTRITIONIST INSIGHTS
1. ${totals.protein >= goals.protein * 0.8 ? "Great job on hitting your protein target!" : "Try to increase your protein intake with eggs or chicken tomorrow."}
2. ${totals.calories > goals.calories ? "You exceeded your calorie goal today. Try high-volume, low-calorie vegetables for your next meal." : "You are within your caloric limit for today."}
3. Remember to stay consistent with your logging for the best weekly analysis.`;

      setActiveReport(reportText);
      saveReportToFirestore(reportText, 'daily');
      setIsGenerating(false);
      toast({ title: "Daily Report Generated" });
    }, 500);
  };

  const handleGenerateWeeklyReport = () => {
    if (!user || !allLogs) return;
    setIsGenerating(true);

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return getLocalDateString(d);
    });

    const weeklyTotals = allLogs.filter(l => last7Days.includes(l.date)).reduce((acc, log) => ({
      calories: acc.calories + (log.nutrients.calories || 0),
      protein: acc.protein + (log.nutrients.protein || 0),
      carbs: acc.carbs + (log.nutrients.carbs || 0),
      fat: acc.fat + (log.nutrients.fat || 0),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 }) || { calories: 0, protein: 0, carbs: 0, fat: 0 };

    const avg = {
      calories: Math.round(weeklyTotals.calories / 7),
      protein: Math.round(weeklyTotals.protein / 7),
      carbs: Math.round(weeklyTotals.carbs / 7),
      fat: Math.round(weeklyTotals.fat / 7),
    };

    setTimeout(() => {
      const reportText = `# 📈 WEEKLY PROGRESS SUMMARY
**Review of the Last 7 Days**

### 📊 AVERAGE DAILY STATISTICS
- **Avg Calories**: ${avg.calories} kcal / day
- **Avg Protein**: ${avg.protein} g / day
- **Avg Carbs**: ${avg.carbs} g / day
- **Avg Fats**: ${avg.fat} g / day

### 🔍 WEEKLY TRENDS
- You were most consistent with your ${avg.protein > 100 ? "Protein" : "Calorie"} tracking.
- Average daily intake is ${avg.calories > goalData.calories ? "above" : "within"} your maintenance targets.

### 🚀 ACTION PLAN FOR NEXT WEEK
1. Focus on meal prepping your high-protein sources to avoid last-minute calorie spikes.
2. Aim to keep your fiber intake consistent even on weekends.
3. Review your gym activity if your goals include muscle gain.`;

      setActiveReport(reportText);
      saveReportToFirestore(reportText, 'weekly');
      setIsGenerating(false);
      toast({ title: "Weekly Summary Generated" });
    }, 500);
  };

  const handleSendEmail = async () => {
    if (!user?.email || !activeReport) return;
    setIsSendingEmail(true);
    try {
      const result = await sendEmailAction({
        to: user.email,
        subject: `NutriTrack Report - ${new Date().toLocaleDateString()}`,
        text: activeReport,
      });
      if (result.success) {
        setIsEmailSent(true);
        toast({ title: "Report Emailed!" });
        setTimeout(() => setIsEmailSent(false), 5000);
      }
    } catch (error) {
      toast({ title: "Email Failed", variant: "destructive" });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const deleteReport = (id: string) => {
    if (!user || !db) return;
    const reportRef = doc(db, "userProfiles", user.uid, "aiReports", id);
    deleteDocumentNonBlocking(reportRef);
    if (activeReport && savedReports?.find(r => r.id === id)?.reportContent === activeReport) {
      setActiveReport(null);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="border-none shadow-lg bg-gradient-to-br from-primary/5 via-white to-accent/5 overflow-hidden">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <ChartBar className="h-5 w-5 text-primary" />
            <span className="text-sm font-bold text-primary uppercase tracking-wider">Smart Reporting</span>
          </div>
          <CardTitle className="text-2xl font-bold">Nutritional Analysis</CardTitle>
          <CardDescription>
            {isSunday ? "It's Sunday! Time for your weekly summary." : "Generate a structured snapshot of your progress."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="font-bold">Formatting your nutritional data...</p>
            </div>
          ) : activeReport ? (
            <div className="animate-fade-in-up">
              <div className="whitespace-pre-wrap text-sm leading-relaxed p-6 rounded-xl bg-white border shadow-sm prose-slate font-sans">
                {activeReport}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <p className="text-muted-foreground text-sm max-w-xs">
                Select a report type below to see a structured summary based on your live logs.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button onClick={handleGenerateDailyReport} disabled={isGenerating || isLogsLoading} variant="outline" className="w-full sm:w-auto">
            <CalendarIcon className="mr-2 h-4 w-4" /> Daily Report
          </Button>
          <Button onClick={handleGenerateWeeklyReport} disabled={isGenerating || isLogsLoading} className="w-full sm:w-auto">
            <Sparkles className="mr-2 h-4 w-4" /> {isSunday ? "Weekly Report (Sunday)" : "Weekly Snapshot"}
          </Button>
          {activeReport && (
            <Button variant="secondary" onClick={handleSendEmail} disabled={isEmailSent || isSendingEmail} className="w-full sm:w-auto ml-auto">
              {isSendingEmail ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isEmailSent ? <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> : <Mail className="mr-2 h-4 w-4" />}
              {isEmailSent ? "Sent!" : "Send to My Email"}
            </Button>
          )}
        </CardFooter>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <History className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-bold">Report History</h2>
        </div>
        
        {isReportsLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : savedReports && savedReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedReports.map((report) => (
              <Card key={report.id} className="cursor-pointer hover:border-primary transition-colors bg-white/50" onClick={() => setActiveReport(report.reportContent)}>
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-sm font-bold capitalize">{report.type} Analysis</CardTitle>
                      <CardDescription className="text-[10px]">
                        {new Date(report.generationDate).toLocaleString()}
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={(e) => { e.stopPropagation(); deleteReport(report.id); }}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-[11px] line-clamp-2 text-muted-foreground italic">
                    {report.reportContent.substring(0, 100)}...
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
            <p className="text-sm text-muted-foreground">No reports saved yet. Generate your first one above!</p>
          </div>
        )}
      </div>
    </div>
  );
}
