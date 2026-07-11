"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ComposedChart, Line } from "recharts";
import { Activity, TrendingUp, Users } from "lucide-react";
import { useCoachData } from "@/lib/hooks/useCoachDashboardMetrics";
import { format, subDays, startOfDay } from "date-fns";

export default function AnalyticsPage() {
  const { athletes, wellness, schedules, loading, orgId } = useCoachData();

  const { chartData, avgReadiness, totalLoadThisWeek } = useMemo(() => {
    // 1. Avg Readiness
    const today = startOfDay(new Date());
    const validReadiness = wellness
      .filter((w: any) => {
        if (!w.date || w.readiness === undefined) return false;
        const wDate = startOfDay(new Date(w.date));
        return wDate.getTime() === today.getTime();
      })
      .map((w: any) => w.readiness);

    const avgReadiness = validReadiness.length > 0 
      ? Math.round(validReadiness.reduce((a, b) => a + b, 0) / validReadiness.length)
      : 0;

    // 2. Chart Data: Last 7 Days (Load vs Recovery)
    const chartData = [];
    let totalLoadThisWeek = 0;

    for (let i = 6; i >= 0; i--) {
      const targetDate = subDays(today, i);
      const targetDateStr = format(targetDate, 'yyyy-MM-dd');
      
      // Daily Load
      let dailyLoad = 0;
      schedules.forEach((s: any) => {
        if (s.isCompleted && s.date && s.date.startsWith(targetDateStr)) {
          // Approximate AU (Arbitrary Units) as duration * RPE. If no RPE, use duration
          const rpe = Number(s.rpe) || 5; 
          const duration = Number(s.duration) || 60;
          dailyLoad += (duration * rpe);
        }
      });
      totalLoadThisWeek += dailyLoad;

      // Daily Recovery Avg
      const dailyWellness = wellness.filter((w: any) => w.date && w.date.startsWith(targetDateStr));
      const dailyReadinessArr = dailyWellness.map((w: any) => w.readiness).filter((r: any) => r !== undefined && r !== null);
      const dailyRecovery = dailyReadinessArr.length > 0 
        ? Math.round(dailyReadinessArr.reduce((a: any, b: any) => a + b, 0) / dailyReadinessArr.length)
        : 0;

      chartData.push({
        name: format(targetDate, 'EEE'),
        load: dailyLoad,
        recovery: dailyRecovery
      });
    }

    return { chartData, avgReadiness, totalLoadThisWeek };
  }, [wellness, schedules]);

  if (!orgId) return null;

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-20">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Deep Analytics Center</h1>
        <p className="text-muted-foreground mt-1">Global load and recovery metrics across your roster.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card glass hoverEffect>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 rounded-xl bg-primary/10 text-primary">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Weekly Acute Load</p>
              {loading ? (
                <div className="h-9 w-20 bg-white/10 animate-pulse rounded mt-1"></div>
              ) : (
                <p className="text-3xl font-black">{totalLoadThisWeek}</p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card glass hoverEffect>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Readiness Today</p>
              {loading ? (
                <div className="h-9 w-16 bg-white/10 animate-pulse rounded mt-1"></div>
              ) : (
                <p className="text-3xl font-black">{avgReadiness > 0 ? `${avgReadiness}%` : "--"}</p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card glass hoverEffect>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 rounded-xl bg-amber-500/10 text-amber-500">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Roster Size</p>
              {loading ? (
                <div className="h-9 w-12 bg-white/10 animate-pulse rounded mt-1"></div>
              ) : (
                <p className="text-3xl font-black">{athletes.length}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card glass className="border-primary/20">
        <CardHeader>
          <CardTitle>Load vs Recovery Trend</CardTitle>
          <CardDescription>7-day view of training load (AU) vs average recovery score.</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] pt-4">
          {loading ? (
             <div className="w-full h-full bg-white/5 animate-pulse rounded-xl"></div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                />
                <Bar yAxisId="left" dataKey="load" name="Training Load (AU)" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="recovery" name="Recovery Score" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#0f172a" }} />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}