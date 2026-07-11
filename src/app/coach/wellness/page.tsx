"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { useCoachData } from "@/lib/hooks/useCoachDashboardMetrics";
import { Activity, Battery, Moon, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function WellnessPage() {
  const { userData } = useAuth();
  const orgId = userData?.organizationId || "";

  const { athletes, wellness, loading } = useCoachData();

  const wellnessData = useMemo(() => {
    return athletes.map((athlete: any) => {
      // Find latest wellness log for this athlete
      const athleteWellness: any = wellness
        .filter((w: any) => w.athleteId === athlete.uid || w.athleteId === athlete.id)
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      
      const sleep = athleteWellness?.sleep || "--";
      const hrv = athleteWellness?.hrv || "--";
      const stress = athleteWellness?.stress || "--";
      const readiness = athleteWellness?.readiness !== undefined ? athleteWellness.readiness : null;
      
      let status = "low";
      if (readiness !== null) {
        if (readiness >= 80) status = 'optimal';
        else if (readiness >= 60) status = 'moderate';
      }
      
      return {
        athlete,
        sleep,
        hrv,
        stress,
        readiness,
        status
      };
    }).sort((a, b) => {
      if (a.readiness === null) return 1;
      if (b.readiness === null) return -1;
      return a.readiness - b.readiness;
    });
  }, [athletes, wellness]);

  if (!orgId) return null;

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Battery size={32} />
            Readiness Matrix
          </h1>
          <p className="text-muted-foreground mt-1">Daily wellness logs, HRV, and sleep tracking for the entire roster.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10 gap-2">
            <SlidersHorizontal size={16} /> Filters
          </Button>
        </div>
      </div>

      <div className="flex gap-4 items-center mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input className="pl-9 bg-black/20 border-white/10" placeholder="Search athletes..." />
        </div>
      </div>

      <Card glass className="border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/20">
                <th className="p-4 font-semibold text-muted-foreground">Athlete</th>
                <th className="p-4 font-semibold text-muted-foreground">Readiness</th>
                <th className="p-4 font-semibold text-muted-foreground">Sleep (hrs)</th>
                <th className="p-4 font-semibold text-muted-foreground">HRV (ms)</th>
                <th className="p-4 font-semibold text-muted-foreground">Stress (1-5)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {wellnessData.map((row: any) => (
                <tr key={row.athlete.uid} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                      {row.athlete.firstName?.[0] || ""}{row.athlete.lastName?.[0] || ""}
                    </div>
                    <span className="font-semibold">{row.athlete.firstName} {row.athlete.lastName}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full max-w-[100px] h-2 bg-black/40 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            row.readiness === null ? 'bg-transparent' :
                            row.status === 'optimal' ? 'bg-emerald-500' : 
                            row.status === 'moderate' ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${row.readiness || 0}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold">{row.readiness !== null ? row.readiness : "--"}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Moon size={16} className={row.sleep !== "--" && row.sleep < 7 ? "text-amber-500" : row.sleep !== "--" ? "text-emerald-500" : "text-muted-foreground"} />
                      <span>{row.sleep}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Activity size={16} className="text-primary" />
                      <span>{row.hrv}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      row.stress === "--" ? 'bg-white/5 text-muted-foreground' :
                      row.stress > 3 ? 'bg-rose-500/20 text-rose-500' : 
                      row.stress > 2 ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'
                    }`}>
                      {row.stress !== "--" ? `${row.stress} / 5` : "--"}
                    </span>
                  </td>
                </tr>
              ))}
              {wellnessData.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No athletes found in your organization.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}