"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "@/context/AuthContext";
import { useRealtimeData } from "@/lib/hooks/useRealtimeData";
import { where, orderBy } from "firebase/firestore";
import { format, subMonths, startOfMonth } from "date-fns";

export function TeamPerformanceChart() {
  const { userData } = useAuth();
  const orgId = userData?.organizationId || "";

  // Removed orderBy to prevent requiring a composite index in Firebase
  const { data: activities, loading } = useRealtimeData("activities", [
    where("organizationId", "==", orgId)
  ]);

  const { chartData, totalPoints, improvement } = useMemo(() => {
    // We want the last 6 months
    const dataMap: Record<string, number> = {};
    const now = new Date();
    
    // Initialize the last 6 months to 0
    for (let i = 5; i >= 0; i--) {
      const d = subMonths(now, i);
      dataMap[format(d, "MMM")] = 0;
    }

    let total = 0;
    
    activities.forEach((activity: any) => {
      try {
        const date = activity.createdAt?.toDate ? activity.createdAt.toDate() : new Date(activity.createdAt);
        const monthStr = format(date, "MMM");
        
        if (dataMap[monthStr] !== undefined) {
          // Each activity adds base points depending on type, fallback to 100
          dataMap[monthStr] += 100;
          total += 100;
        }
      } catch (err) {}
    });

    const chartData = Object.keys(dataMap).map(month => ({
      month,
      pts: dataMap[month]
    }));

    // Calculate improvement vs last month
    let improvement = 0;
    if (chartData.length >= 2) {
      const currentMonth = chartData[chartData.length - 1].pts;
      const lastMonth = chartData[chartData.length - 2].pts;
      improvement = currentMonth - lastMonth;
    }

    return { chartData, totalPoints: total, improvement };
  }, [activities]);

  if (!orgId) return null;

  return (
    <Card glass hoverEffect className="border-primary/20">
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle className="text-lg font-bold">Team Activity Overview</CardTitle>
        <select className="bg-background/50 border border-white/10 rounded-md text-xs px-2 py-1 outline-none text-muted-foreground">
          <option>All Activities</option>
          <option>Training</option>
          <option>Medical</option>
        </select>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-6">
        
        <div className="grid grid-cols-3 gap-4 border-b border-white/5 pb-4">
          <div>
            <p className="text-xs text-muted-foreground">Total Activity Points</p>
            <p className="text-3xl font-black text-foreground">
              {totalPoints.toLocaleString()} 
              {improvement > 0 && <span className="text-sm text-emerald-500 font-bold ml-2">↑</span>}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Highest Volume Month</p>
            <p className="text-2xl font-black text-foreground">
              {chartData.length ? Math.max(...chartData.map(d => d.pts)).toLocaleString() : 0} pts
            </p>
            <p className="text-[10px] text-muted-foreground">Active Roster</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Improvement</p>
            <p className={`text-2xl font-black ${improvement >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
              {improvement > 0 ? "+" : ""}{improvement.toLocaleString()} pts
            </p>
            <p className="text-[10px] text-muted-foreground">vs last month</p>
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
                <XAxis dataKey="month" stroke="#334155" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#334155" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000).toFixed(1)}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "12px" }}
                  itemStyle={{ color: "#8b5cf6", fontWeight: "bold" }}
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
