"use client";

import { Users, ClipboardList, Calendar, TrendingUp, HeartPulse } from "lucide-react";
import { useCoachDashboardMetrics } from "@/lib/hooks/useCoachDashboardMetrics";

export function DreamyKpiCards() {
  const { metrics, loading } = useCoachDashboardMetrics();

  const cards = [
    { 
      title: "Total Athletes", 
      value: metrics.totalAthletes.toString(), 
      subtext: "Active roaster", 
      icon: Users,
      iconColor: "text-[#8B5CF6]",
      iconBg: "bg-[#8B5CF6]/10",
      subtextColor: "text-muted-foreground"
    },
    { 
      title: "Active Training Plans", 
      value: metrics.activePlansCount.toString(), 
      subtext: "Currently assigned", 
      icon: ClipboardList,
      iconColor: "text-[#3B82F6]",
      iconBg: "bg-[#3B82F6]/10",
      subtextColor: "text-muted-foreground"
    },
    { 
      title: "Sessions This Week", 
      value: metrics.sessionsThisWeek.toString(), 
      subtext: "Past 7 days", 
      icon: Calendar,
      iconColor: "text-[#10B981]",
      iconBg: "bg-[#10B981]/10",
      subtextColor: "text-muted-foreground"
    },
    { 
      title: "Training Load Trend", 
      value: metrics.loadTrend, 
      subtext: "vs last month", 
      icon: TrendingUp,
      iconColor: metrics.loadTrendValue >= 0 ? "text-[#34D399]" : "text-[#EF4444]",
      iconBg: metrics.loadTrendValue >= 0 ? "bg-[#34D399]/10" : "bg-[#EF4444]/10",
      subtextColor: metrics.loadTrendValue >= 0 ? "text-[#34D399]" : "text-[#EF4444]"
    },
    { 
      title: "Injury Concerns", 
      value: metrics.injuryConcerns.toString(), 
      subtext: "Active warnings", 
      icon: HeartPulse,
      iconColor: metrics.injuryConcerns > 0 ? "text-[#EF4444]" : "text-[#34D399]",
      iconBg: metrics.injuryConcerns > 0 ? "bg-[#EF4444]/10" : "bg-[#34D399]/10",
      subtextColor: metrics.injuryConcerns > 0 ? "text-[#EF4444]" : "text-[#34D399]"
    }
  ];

  return (
    <div className="grid grid-cols-5 gap-4">
      {cards.map((card, i) => (
        <div key={i} className="bg-card rounded-xl p-5 border border-border flex items-center gap-4 hover:border-border transition-colors">
          <div className={`w-12 h-12 rounded-full ${card.iconBg} flex items-center justify-center shrink-0`}>
            <card.icon className={card.iconColor} size={24} />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-medium text-muted-foreground truncate">{card.title}</h3>
            <div className="text-2xl font-semibold text-foreground mt-0.5">{card.value}</div>
            <p className={`text-[10px] mt-1 truncate ${card.subtextColor}`}>{card.subtext}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
