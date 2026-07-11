"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Users, ClipboardList, CalendarDays, TrendingUp, HeartPulse } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCoachDashboardMetrics } from "@/lib/hooks/useCoachDashboardMetrics";

export function KpiGrid() {
  const { userData } = useAuth();
  const orgId = userData?.organizationId || "";

  const { metrics, loading } = useCoachDashboardMetrics();

  const kpis = [
    { title: "Total Athletes", value: metrics.totalAthletes.toString(), trend: "Current roster", icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { title: "Active Plans", value: metrics.activePlansCount.toString(), trend: metrics.activePlansCount > 0 ? "Active" : "No active plans", icon: ClipboardList, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Sessions This Week", value: metrics.sessionsThisWeek.toString(), trend: "Past 7 days", icon: CalendarDays, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Training Load Trend", value: metrics.loadTrend, trend: "vs last month", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Injury Concerns", value: metrics.injuryConcerns.toString(), trend: metrics.injuryConcerns > 0 ? "Requires attention" : "All healthy", icon: HeartPulse, color: "text-rose-500", bg: "bg-rose-500/10" },
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
              {loading ? (
                <div className="h-8 w-16 bg-white/10 animate-pulse rounded my-1"></div>
              ) : (
                <p className="text-2xl font-black">{kpi.value}</p>
              )}
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
