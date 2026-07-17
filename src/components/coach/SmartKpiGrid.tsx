"use client";

import { Activity, Battery, CheckSquare, Dumbbell } from "lucide-react";

export function SmartKpiGrid() {
  const kpis = [
    {
      title: "Readiness",
      icon: Battery,
      value: "82",
      baseline: "93",
      delta: -11,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20"
    },
    {
      title: "Team Sleep",
      icon: Activity,
      value: "6.8h",
      baseline: "7.2h",
      delta: -5,
      deltaSuffix: "%",
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20"
    },
    {
      title: "Workload (ACWR)",
      icon: Dumbbell,
      value: "1.2",
      baseline: "1.0",
      delta: 20,
      deltaSuffix: "%",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      title: "Attendance",
      icon: CheckSquare,
      value: "96%",
      baseline: "94%",
      delta: 2,
      deltaSuffix: "pt",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 h-full">
      {kpis.map((kpi, i) => (
        <div key={i} className="glass-card rounded-2xl p-4 flex flex-col justify-between border border-white/5 hover:border-white/10 transition-colors relative group overflow-hidden">
          {/* Subtle background glow */}
          <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity ${kpi.bg}`} />
          
          <div className="flex items-center gap-3 text-muted-foreground mb-4">
            <div className={`w-8 h-8 rounded-lg ${kpi.bg} ${kpi.border} border flex items-center justify-center`}>
              <kpi.icon size={16} className={kpi.color} />
            </div>
            <span className="text-sm font-semibold uppercase tracking-wider">{kpi.title}</span>
          </div>
          
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold tracking-tighter text-foreground mb-1">{kpi.value}</div>
              <div className="text-xs text-muted-foreground font-medium">Avg: {kpi.baseline}</div>
            </div>
            
            <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full border ${
              kpi.delta > 0 ? (kpi.title === "Team Sleep" || kpi.title === "Readiness" || kpi.title === "Attendance" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-rose-400 bg-rose-500/10 border-rose-500/20") 
              : (kpi.title === "Team Sleep" || kpi.title === "Readiness" || kpi.title === "Attendance" ? "text-rose-400 bg-rose-500/10 border-rose-500/20" : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20")
            }`}>
              {kpi.delta > 0 ? "↑" : "↓"} {Math.abs(kpi.delta)}{kpi.deltaSuffix || ""}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
