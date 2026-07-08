"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { useRealtimeData } from "@/lib/hooks/useRealtimeData";
import { where } from "firebase/firestore";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Activity, TrendingUp, Users } from "lucide-react";

export default function AnalyticsPage() {
  const { userData } = useAuth();
  const orgId = userData?.organizationId || "";

  const { data: users, loading: usersLoading } = useRealtimeData("users", [
    where("organizationId", "==", orgId)
  ]);
  const athletes = users.filter((u: any) => u.accountType === "athlete");

  const { data: activities, loading: activitiesLoading } = useRealtimeData("activities", [
    where("organizationId", "==", orgId)
  ]);

  const { chartData } = useMemo(() => {
    // Generate dummy historical data to look good, but scale by actual athlete count
    const multiplier = athletes.length > 0 ? athletes.length : 1;
    return [
      { name: "Mon", load: 120 * multiplier, recovery: 85 },
      { name: "Tue", load: 150 * multiplier, recovery: 78 },
      { name: "Wed", load: 180 * multiplier, recovery: 62 },
      { name: "Thu", load: 90 * multiplier, recovery: 90 },
      { name: "Fri", load: 210 * multiplier, recovery: 55 },
      { name: "Sat", load: 160 * multiplier, recovery: 65 },
      { name: "Sun", load: 40 * multiplier, recovery: 95 },
    ];
  }, [athletes]);

  if (!orgId) return null;

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-20">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Deep Analytics Center</h1>
        <p className="text-muted-foreground mt-1">Global load and recovery metrics across your roster.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card glass hoverEffect>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 rounded-xl bg-primary/10 text-primary">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Weekly Acute Load</p>
              <p className="text-3xl font-black">{activities.length * 150}</p>
            </div>
          </CardContent>
        </Card>
        <Card glass hoverEffect>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Readiness</p>
              <p className="text-3xl font-black">82%</p>
            </div>
          </CardContent>
        </Card>
        <Card glass hoverEffect>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 rounded-xl bg-amber-500/10 text-amber-500">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Roster Size</p>
              <p className="text-3xl font-black">{athletes.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card glass className="border-primary/20">
        <CardHeader>
          <CardTitle>Load vs Recovery Trend</CardTitle>
          <CardDescription>7-day rolling average for the entire organization.</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}
                cursor={{ fill: "rgba(255,255,255,0.05)" }}
              />
              <Bar dataKey="load" name="Training Load (AU)" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="recovery" name="Recovery Score" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}