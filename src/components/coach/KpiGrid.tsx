"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Users, ClipboardList, CalendarDays, TrendingUp, HeartPulse } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRealtimeData } from "@/lib/hooks/useRealtimeData";
import { where, orderBy } from "firebase/firestore";

export function KpiGrid() {
  const { userData } = useAuth();
  const orgId = userData?.organizationId || "";

  // 1. Total Athletes
  const { data: athletes } = useRealtimeData("students", [
    where("headCoachId", "==", userData?.uid || "")
  ]);

  // 2. Active Plans (mocked for now until trainingPlans collection exists)
  const activePlansCount = 0;

  // 3. Sessions This Week
  const { data: events } = useRealtimeData("calendarEvents", [
    where("organizationId", "==", orgId)
  ]);

  // 4. Injury Concerns (Active Insights)
  const { data: insights } = useRealtimeData("insights", [
    where("organizationId", "==", orgId),
    where("status", "==", "active")
  ]);

  const injuryConcerns = insights.filter((i: any) => i.type === "Injury").length;
  
  // Calculate this week's events
  const sessionsThisWeek = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return events.filter((e: any) => new Date(e.start) >= oneWeekAgo).length;
  }, [events]);

  const kpis = [
    { title: "Total Athletes", value: athletes.length.toString(), trend: "Current roster", icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { title: "Active Plans", value: activePlansCount.toString(), trend: "No active plans", icon: ClipboardList, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Sessions This Week", value: sessionsThisWeek.toString(), trend: "Past 7 days", icon: CalendarDays, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Avg Performance Trend", value: "+8.4%", trend: "vs last month", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Injury Concerns", value: injuryConcerns.toString(), trend: injuryConcerns > 0 ? "Requires attention" : "All healthy", icon: HeartPulse, color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  if (!orgId) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {kpis.map((kpi, i) => (
        <Card key={i} glass hoverEffect className="group cursor-pointer">
          <CardContent className="p-5 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${kpi.bg} ${kpi.color} group-hover:scale-110 transition-transform duration-300`}>
              <kpi.icon size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground line-clamp-1">{kpi.title}</p>
              <p className="text-2xl font-black">{kpi.value}</p>
              <p className={`text-[10px] font-bold ${kpi.trend.includes('↑') || kpi.trend.includes('+') ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                {kpi.trend}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
