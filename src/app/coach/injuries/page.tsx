"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { useRealtimeData } from "@/lib/hooks/useRealtimeData";
import { where } from "firebase/firestore";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusChip } from "@/components/ui/StatusChip";
import { Activity, Stethoscope, AlertTriangle, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function InjuriesPage() {
  const { userData } = useAuth();
  const orgId = userData?.organizationId || "";

  const { data: insights, loading } = useRealtimeData("insights", [
    where("organizationId", "==", orgId)
  ]);

  const injuryInsights = useMemo(() => {
    return insights
      .filter((i: any) => i.type === "Injury" && i.status === "active")
      .sort((a: any, b: any) => b.severity - a.severity);
  }, [insights]);

  if (!orgId) return null;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-rose-500 flex items-center gap-3">
          <Stethoscope size={32} />
          Medical Bay
        </h1>
        <p className="text-muted-foreground mt-1">Track and manage active roster injuries and rehabilitation timelines.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card glass hoverEffect>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 rounded-xl bg-rose-500/10 text-rose-500">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Injuries</p>
              <p className="text-3xl font-black">{injuryInsights.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold">Current Cases</h2>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : injuryInsights.length === 0 ? (
          <EmptyState 
            icon={<Activity size={32} />}
            title="All Clear"
            description="There are currently no active injuries reported in your roster."
          />
        ) : (
          <div className="grid gap-4">
            {injuryInsights.map((insight: any) => (
              <Card key={insight.id} glass hoverEffect className="border-rose-500/20">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold">{insight.title || "Injury Report"}</h3>
                        <StatusChip 
                          status={insight.severity >= 80 ? "danger" : insight.severity >= 50 ? "warning" : "info"} 
                        >
                          {insight.severity >= 80 ? "Severe" : insight.severity >= 50 ? "Moderate" : "Mild"}
                        </StatusChip>
                      </div>
                      <p className="text-muted-foreground">{insight.description}</p>
                      <div className="text-sm text-muted-foreground pt-2">
                        Reported: {insight.createdAt ? format(new Date(insight.createdAt.toDate ? insight.createdAt.toDate() : insight.createdAt), "MMM dd, yyyy") : "Unknown"}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Link href={`/coach/athletes/${insight.athleteId}/medical`}>
                        <Button variant="secondary" className="gap-2">
                          View Medical Profile <ArrowRight size={16} />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}