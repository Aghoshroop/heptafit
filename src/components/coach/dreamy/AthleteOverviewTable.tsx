"use client";

import { useCoachAthletesWithMetrics, useCoachData } from "@/lib/hooks/useCoachDashboardMetrics";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { useMemo } from "react";
import { subDays, format } from "date-fns";

export function AthleteOverviewTable() {
  const { athletes, loading } = useCoachAthletesWithMetrics();
  const { wellness } = useCoachData();

  // Sort athletes by readiness (At Risk first) and take top 5
  const displayAthletes = useMemo(() => {
    return [...(athletes as any)].sort((a, b) => {
      const order: any = { "At Risk": 0, "Fatigued": 1, "Moderate": 2, "Ready": 3 };
      const aVal = order[a.readiness] ?? 4;
      const bVal = order[b.readiness] ?? 4;
      return aVal - bVal;
    }).slice(0, 5);
  }, [athletes]);

  // Helper to generate trend data for an athlete from last 7 days wellness
  const getTrendData = (athleteId: string) => {
    const last7Days = Array.from({ length: 7 }).map((_, i) => format(subDays(new Date(), 6 - i), 'yyyy-MM-dd'));
    const athleteWellness = wellness.filter((w: any) => w.athleteId === athleteId);
    
    const data = last7Days.map(date => {
      const entry: any = athleteWellness.find((w: any) => w.date === date);
      return { val: entry ? entry.readinessScore || 0 : 50 };
    });
    
    const first = data[0].val;
    const last = data[6].val;
    const trendDiff = last - first;
    const trendText = trendDiff > 0 ? `+ ${trendDiff}` : `- ${Math.abs(trendDiff)}`;
    
    return { data, text: trendText, isPositive: trendDiff >= 0 };
  };

  const getReadinessColor = (status: string) => {
    switch (status) {
      case "Ready": return "text-[#34D399]";
      case "Moderate": return "text-[#3B82F6]";
      case "Fatigued": return "text-[#F59E0B]";
      case "At Risk": return "text-[#EF4444]";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="bg-card rounded-xl p-5 border border-border flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Athlete Overview</h3>
        <button className="text-[10px] text-[#8B5CF6] hover:text-[#7C3AED] transition-colors">
          View All Athletes
        </button>
      </div>

      <div className="mt-4">
        <table className="w-full text-xs text-left">
          <thead className="text-[10px] text-muted-foreground uppercase tracking-wider">
            <tr>
              <th className="pb-3 font-semibold">Athlete</th>
              <th className="pb-3 font-semibold">Event</th>
              <th className="pb-3 font-semibold">Points (Season Best)</th>
              <th className="pb-3 font-semibold text-center">Trend</th>
              <th className="pb-3 font-semibold text-right">Readiness</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1F2937]">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground">Loading athletes...</td>
              </tr>
            ) : displayAthletes.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground">No athletes found in organization.</td>
              </tr>
            ) : displayAthletes.map((athlete) => {
              const name = `${athlete.firstName || ''} ${athlete.lastName || ''}`.trim() || 'Unknown Athlete';
              const eventGroup = athlete.profile?.eventGroup || athlete.profile?.primaryEvent || "Athletics";
              const trend = getTrendData(athlete.uid);

              return (
              <tr key={athlete.uid} className="group hover:bg-accent transition-colors">
                <td className="py-2.5">
                  <div className="flex items-center gap-3">
                    <img 
                      src={athlete.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`} 
                      className="w-7 h-7 rounded-full object-cover" 
                      alt={name} 
                    />
                    <div className="flex flex-col">
                      <span className="text-foreground font-medium">{name}</span>
                      <span className="text-[9px] text-muted-foreground">{eventGroup}</span>
                    </div>
                  </div>
                </td>
                <td className="py-2.5 text-muted-foreground">{eventGroup}</td>
                <td className="py-2.5">
                  <div className="flex flex-col">
                    <span className="text-foreground">{athlete.status || "Unknown"}</span>
                    <span className="text-[9px] text-muted-foreground">Last Active: {athlete.lastActive}</span>
                  </div>
                </td>
                <td className="py-2.5">
                  <div className="flex items-center gap-2 justify-center">
                    <span className={`text-[10px] ${trend.isPositive ? "text-[#34D399]" : "text-[#EF4444]"}`}>
                      {trend.text}
                    </span>
                    <div className="w-12 h-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trend.data}>
                          <Line 
                            type="monotone" 
                            dataKey="val" 
                            stroke={trend.isPositive ? "#34D399" : "#EF4444"} 
                            strokeWidth={1.5} 
                            dot={false} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </td>
                <td className="py-2.5 text-right">
                  <span className={getReadinessColor(athlete.readiness)}>{athlete.readiness}</span>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-3 pt-3 border-t border-border">
        <button className="text-[10px] text-[#8B5CF6] hover:text-[#7C3AED] transition-colors">
          View all athletes →
        </button>
      </div>
    </div>
  );
}
