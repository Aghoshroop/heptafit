"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useCoachAthletesWithMetrics } from "@/lib/hooks/useCoachDashboardMetrics";

export function ReadinessCenter() {
  const { athletes, loading } = useCoachAthletesWithMetrics();

  const { data, totalAthletes } = useMemo(() => {
    let ready = 0;
    let moderate = 0;
    let fatigued = 0;
    let atRisk = 0;

    athletes.forEach((athlete: any) => {
      const status = athlete.status; // "Active", "Recovery", "Injured", "Restricted"
      const readiness = athlete.readiness; // 0-100 or null
      
      if (status === "Injured" || status === "Restricted") {
        atRisk++;
      } else if (readiness !== null && readiness < 60) {
        fatigued++;
      } else if (readiness !== null && readiness < 80) {
        moderate++;
      } else {
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
  }, [athletes]);


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
