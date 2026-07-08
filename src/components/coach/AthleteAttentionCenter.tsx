"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { AlertCircle, FileWarning, BatteryWarning } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRealtimeData } from "@/lib/hooks/useRealtimeData";
import { where, orderBy } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";

export function AthleteAttentionCenter() {
  const { userData } = useAuth();
  const orgId = userData?.organizationId || "";

  const { data: insights, loading: insightsLoading } = useRealtimeData("insights", [
    where("organizationId", "==", orgId),
    where("status", "==", "active"),
    orderBy("createdAt", "desc")
  ]);

  const { data: athletes } = useRealtimeData("students", [
    where("headCoachId", "==", userData?.uid || "")
  ]);

  const alerts = useMemo(() => {
    return insights.map((insight: any) => {
      const athlete: any = athletes.find((u: any) => u.id === insight.athleteId);
      const athleteName = athlete ? `${athlete.firstName} ${athlete.lastName}` : "Unknown Athlete";
      
      let icon = AlertCircle;
      let color = "text-rose-500";
      let bg = "bg-rose-500/10";

      if (insight.type === "Overtraining Risk") {
        icon = BatteryWarning;
        color = "text-amber-500";
        bg = "bg-amber-500/10";
      } else if (insight.type === "Wellness") {
        icon = FileWarning;
        color = "text-blue-500";
        bg = "bg-blue-500/10";
      }

      let time = "Just now";
      if (insight.createdAt) {
        try {
          const date = insight.createdAt.toDate ? insight.createdAt.toDate() : new Date(insight.createdAt);
          time = formatDistanceToNow(date, { addSuffix: true });
        } catch(e) {}
      }

      return {
        id: insight.id,
        name: athleteName,
        reason: insight.title || insight.type,
        time,
        icon,
        color,
        bg
      };
    }).slice(0, 5); // Limit to top 5
  }, [insights, athletes]);

  if (!orgId) return null;

  return (
    <Card glass hoverEffect className="border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]">
      <CardHeader className="pb-3 border-b border-rose-500/10 bg-rose-500/5">
        <div className="flex justify-between items-center">
          <CardTitle className="text-rose-500 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
            <AlertCircle size={16} /> Requires Attention
          </CardTitle>
          <span className="text-xs text-rose-500 font-bold bg-rose-500/20 px-2 py-0.5 rounded-full">
            {insights.length}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {insightsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-3 p-3 rounded-xl bg-background/50 border border-white/5">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <div className="flex-1 space-y-2 py-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <EmptyState 
            compact
            icon={<AlertCircle className="text-emerald-500" size={20} />}
            title="All Clear"
            description="No active alerts or injuries reported."
            className="border-none bg-emerald-500/5 min-h-[150px]"
          />
        ) : (
          alerts.map((alert, i) => (
            <div key={alert.id || i} className="flex gap-3 p-3 rounded-xl bg-background/50 hover:bg-white/5 transition-colors border border-white/5 cursor-pointer">
              <div className={`p-2 rounded-lg shrink-0 ${alert.bg} ${alert.color}`}>
                <alert.icon size={16} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="font-bold text-sm text-foreground leading-none">{alert.name}</p>
                  <p className="text-[10px] text-muted-foreground">{alert.time}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{alert.reason}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
