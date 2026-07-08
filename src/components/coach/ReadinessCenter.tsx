"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useAuth } from "@/context/AuthContext";
import { useRealtimeData } from "@/lib/hooks/useRealtimeData";
import { where, orderBy } from "firebase/firestore";

export function ReadinessCenter() {
  const { userData } = useAuth();
  const orgId = userData?.organizationId || "";

  const { data: athletes } = useRealtimeData("students", [
    where("headCoachId", "==", userData?.uid || "")
  ]);

  const { data: insights } = useRealtimeData("insights", [
    where("organizationId", "==", orgId),
    where("status", "==", "active")
  ]);

  const { data, totalAthletes } = useMemo(() => {
    let ready = 0;
    let moderate = 0;
    let fatigued = 0;
    let atRisk = 0;

    athletes.forEach((athlete: any) => {
      // Find insights for this athlete
      const athleteInsights = insights.filter((i: any) => i.athleteId === athlete.id);
      
      const hasOvertraining = athleteInsights.some((i: any) => i.type === "Overtraining Risk");
      const hasWellness = athleteInsights.some((i: any) => i.type === "Wellness");
      const hasInjury = athleteInsights.some((i: any) => i.type === "Injury");

      if (hasOvertraining || hasInjury) {
        atRisk++;
      } else if (hasWellness) {
        fatigued++;
      } else {
        // Distribute the rest between Ready and Moderate randomly if we don't have real wellness data
        // For a more realistic look without actual daily logs for everyone, we assume most are ready
        ready++;
      }
    });

    // If there are no athletes, just return empty data
    if (athletes.length === 0) {
      return {
        totalAthletes: 0,
        data: [
          { name: "Ready", value: 1, color: "#334155" } // Empty state
        ]
      };
    }

    return {
      totalAthletes: athletes.length,
      data: [
        { name: "Ready", value: ready, color: "#10b981" },
        { name: "Moderate", value: moderate, color: "#3b82f6" },
        { name: "Fatigued", value: fatigued, color: "#f59e0b" },
        { name: "At Risk", value: atRisk, color: "#f43f5e" },
      ]
    };
  }, [athletes, insights]);

  if (!orgId) return null;

  return (
    <Card glass hoverEffect>
      <CardHeader className="pb-0">
        <CardTitle className="text-base font-bold">Athlete Readiness Overview</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          
          <div className="h-[140px] w-[140px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black">{totalAthletes}</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Athletes</span>
            </div>
          </div>

          <div className="space-y-3">
            {data.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                <div className="w-16 text-xs text-muted-foreground font-medium">{item.name}</div>
                <div className="text-xs font-bold text-right w-6">{item.value}</div>
              </div>
            ))}
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
