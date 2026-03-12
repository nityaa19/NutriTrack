'use client';

import { Navbar } from "@/components/layout/Navbar";
import { WeeklyAIReport } from "@/components/reports/WeeklyAIReport";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const WEEKLY_DATA = [
  { day: 'Mon', calories: 2100 },
  { day: 'Tue', calories: 1950 },
  { day: 'Wed', calories: 2200 },
  { day: 'Thu', calories: 2050 },
  { day: 'Fri', calories: 1800 },
  { day: 'Sat', calories: 2400 },
  { day: 'Sun', calories: 2000 },
];

export default function ReportsPage() {
  return (
    <div className="pb-24 md:pt-20">
      <Navbar />
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 pt-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Progress & Reports</h1>
          <p className="text-muted-foreground">Analyze your weekly trends and get AI-powered insights.</p>
        </header>

        <div className="grid grid-cols-1 gap-8">
          <Card className="border-none shadow-md bg-white">
            <CardHeader>
              <CardTitle>Caloric Trend (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WEEKLY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f8f9fa'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                  />
                  <Bar dataKey="calories" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <WeeklyAIReport />
        </div>
      </div>
    </div>
  );
}
