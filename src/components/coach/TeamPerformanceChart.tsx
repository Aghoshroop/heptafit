"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useCoachDashboardMetrics } from "@/lib/hooks/useCoachDashboardMetrics";
import { useCoachData } from "@/lib/hooks/useCoachDashboardMetrics";
import { aggregateTimeSeriesData, AggregationPeriod } from "@/lib/utils/aggregation";

export function TeamPerformanceChart() {
  const { schedules, loading, orgId } = useCoachData();
  const [period, setPeriod] = useState<AggregationPeriod>("monthly");

  const { chartData, totalPoints, improvement } = useMemo(() => {
    // Only count completed sessions
    const completedSchedules = schedules.filter((s: any) => s.isCompleted);

    // Aggregate Training Volume (Duration in mins)
    const aggregated = aggregateTimeSeriesData(
      completedSchedules,
      "date",
      (item) => Number(item.duration) || 0,
      period,
      6 // Look back 6 periods
    );

    const chartData = aggregated.map((a) => ({
      label: a.label,
      pts: a.value
    }));

    // Calculate total over this window
    const total = chartData.reduce((sum, item) => sum + item.pts, 0);

    // Calculate improvement vs last period
    let improvement = 0;
    if (chartData.length >= 2) {
      const current = chartData[chartData.length - 1].pts;
      const last = chartData[chartData.length - 2].pts;
      improvement = current - last;
    }

    return { chartData, totalPoints: total, improvement };
  }, [schedules, period]);

  if (!orgId) return null;

  return (
    <Card glass hoverEffect className="border-primary/20">
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle className="text-lg font-bold">Training Volume (Mins)</CardTitle>
        <select 
          className="bg-background/50 border border-white/10 rounded-md text-xs px-2 py-1 outline-none text-muted-foreground"
          value={period}
          onChange={(e) => setPeriod(e.target.value as AggregationPeriod)}
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
        </select>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-6">
        
        <div className="grid grid-cols-3 gap-4 border-b border-white/5 pb-4">
          <div>
            <p className="text-xs text-muted-foreground">Total Volume</p>
            <p className="text-3xl font-black text-foreground">
              {totalPoints.toLocaleString()}
              {improvement > 0 && <span className="text-sm text-emerald-500 font-bold ml-2">↑</span>}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Highest Volume</p>
            <p className="text-2xl font-black text-foreground">
              {chartData.length ? Math.max(...chartData.map(d => d.pts)).toLocaleString() : 0}
            </p>
            <p className="text-[10px] text-muted-foreground">in this window</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Trend</p>
            <p className={`text-2xl font-black ${improvement >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
              {improvement > 0 ? "+" : ""}{improvement.toLocaleString()}
            </p>
            <p className="text-[10px] text-muted-foreground">vs last period</p>
          </div>
        </div>

        {loading ? (
          <div className="h-[250px] w-full">
            <Skeleton className="w-full h-full rounded-xl" />
          </div>
        ) : (
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" stroke="#334155" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#334155" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000).toFixed(1)}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "12px" }}
                  itemStyle={{ color: "#8b5cf6", fontWeight: "bold" }}
                  formatter={(value: any) => [`${value} mins`, 'Volume']}
                />
                <Area type="monotone" dataKey="pts" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorPts)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
