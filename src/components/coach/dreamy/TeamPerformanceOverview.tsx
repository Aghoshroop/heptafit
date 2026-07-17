"use client";

import { ChevronDown } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useCoachData } from "@/lib/hooks/useCoachDashboardMetrics";
import { useMemo, useState } from "react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

export function TeamPerformanceOverview() {
  const { wellness, groups, loading } = useCoachData();
  const [selectedGroup, setSelectedGroup] = useState("All Athletes");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredWellness = useMemo(() => {
    if (selectedGroup === "All Athletes") return wellness;
    const group = groups.find((g: any) => g.name === selectedGroup);
    if (!group || !(group as any).athleteIds) return [];
    return wellness.filter((w: any) => (group as any).athleteIds.includes(w.athleteId));
  }, [wellness, selectedGroup, groups]);

  const { data, avgReadiness, trend, lastMonthAvg } = useMemo(() => {
    const monthlyData = [];
    let currentTotal = 0;
    let currentCount = 0;
    let lastMonthTotal = 0;
    let lastMonthCount = 0;

    for (let i = 5; i >= 0; i--) {
      const targetDate = subMonths(new Date(), i);
      const start = startOfMonth(targetDate);
      const end = endOfMonth(targetDate);
      const monthName = format(targetDate, 'MMM');

      const monthWellness = filteredWellness.filter((w: any) => {
        const d = new Date(w.date);
        return d >= start && d <= end;
      });

      const avg = monthWellness.length > 0 
        ? Math.round(monthWellness.reduce((sum: number, w: any) => sum + (w.readinessScore || 0), 0) / monthWellness.length)
        : 0;

      monthlyData.push({ name: monthName, pts: avg });

      if (i === 0) { // Current month
        currentTotal = monthWellness.reduce((sum: number, w: any) => sum + (w.readinessScore || 0), 0);
        currentCount = monthWellness.length;
      } else if (i === 1) { // Last month
        lastMonthTotal = monthWellness.reduce((sum: number, w: any) => sum + (w.readinessScore || 0), 0);
        lastMonthCount = monthWellness.length;
      }
    }

    const currentAvg = currentCount > 0 ? Math.round(currentTotal / currentCount) : 0;
    const lastAvg = lastMonthCount > 0 ? Math.round(lastMonthTotal / lastMonthCount) : 0;
    
    let trendPercent = 0;
    if (lastAvg > 0) {
      trendPercent = ((currentAvg - lastAvg) / lastAvg) * 100;
    }

    return { 
      data: monthlyData, 
      avgReadiness: currentAvg, 
      trend: trendPercent,
      lastMonthAvg: lastAvg
    };
  }, [filteredWellness]);
  return (
    <div className="bg-card rounded-xl p-5 border border-border flex flex-col h-[320px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Team Performance Overview</h3>
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary hover:bg-accent transition-colors px-2 py-1 rounded"
          >
            <span className="max-w-[100px] truncate">{selectedGroup}</span> <ChevronDown size={12} />
          </button>
          
          {isDropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
              <div className="absolute right-0 mt-1 w-40 bg-secondary border border-border rounded-lg shadow-xl z-20 py-1 max-h-48 overflow-y-auto no-scrollbar">
                <button
                  onClick={() => {
                    setSelectedGroup("All Athletes");
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-accent transition-colors ${selectedGroup === "All Athletes" ? "text-foreground bg-muted" : "text-muted-foreground"}`}
                >
                  All Athletes
                </button>
                {groups?.map((g: any) => (
                  <button
                    key={g.id}
                    onClick={() => {
                      setSelectedGroup(g.name);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-accent transition-colors ${selectedGroup === g.name ? "text-foreground bg-muted" : "text-muted-foreground"}`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-1">Avg Readiness</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">{avgReadiness || "--"}</span>
            <span className={`text-xs font-semibold ${trend >= 0 ? "text-[#34D399]" : "text-[#EF4444]"}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
            </span>
          </div>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-1">Last Month</p>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground">{lastMonthAvg || "--"}</span>
            <span className="text-[10px] text-muted-foreground">avg readiness</span>
          </div>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-1">Trend Diff</p>
          <div className="flex flex-col">
            <span className={`text-lg font-bold ${trend >= 0 ? "text-[#34D399]" : "text-[#EF4444]"}`}>
              {trend >= 0 ? '+' : '-'}{Math.abs(avgReadiness - lastMonthAvg)} pts
            </span>
            <span className="text-[10px] text-muted-foreground">vs last month</span>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 relative -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="#4B5563" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#4B5563" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px", color: "var(--foreground)" }}
              itemStyle={{ color: "var(--foreground)" }}
            />
            <Area type="monotone" dataKey="pts" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorPts)" dot={{ fill: "#8B5CF6", r: 3 }} activeDot={{ r: 5, fill: "#8B5CF6" }} />
          </AreaChart>
        </ResponsiveContainer>
        {/* Label over last point */}
        <div className="absolute right-6 top-8 bg-[#8B5CF6] text-foreground text-[10px] font-bold px-1.5 py-0.5 rounded">{avgReadiness || "--"}</div>
      </div>

      <div className="mt-2 text-right">
        <button className="text-[10px] text-[#8B5CF6] hover:text-[#7C3AED] transition-colors">
          View detailed analytics →
        </button>
      </div>
    </div>
  );
}
