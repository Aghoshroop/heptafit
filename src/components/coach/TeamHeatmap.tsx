"use client";

import { Users, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { OrganizationEngine } from "@/lib/intelligence/organizationEngine";
import { useAuth } from "@/context/AuthContext";

export function TeamHeatmap() {
  const { userData } = useAuth();
  const [heatmapData, setHeatmapData] = useState<any[]>([]);

  useEffect(() => {
    // Mock HIE output for the Heatmap matrix
    const mockAthletes = [
      {
        id: "1", name: "Rahul Singh", 
        readiness: { deltas: { readiness: -18 }, warnings: [] },
        workload: { metrics: { acwr: 1.1 }, warnings: [] },
        attendanceRate: 95, activeInjuries: 0
      } as any,
      {
        id: "2", name: "Priya Das", 
        readiness: { deltas: { readiness: -2 }, warnings: [] },
        workload: { metrics: { acwr: 1.6 }, warnings: [] }, // overload
        attendanceRate: 75, activeInjuries: 1
      } as any,
      {
        id: "3", name: "Amit Kumar", 
        readiness: { deltas: { readiness: 2 }, warnings: [] },
        workload: { metrics: { acwr: 1.0 }, warnings: [] },
        attendanceRate: 100, activeInjuries: 0
      } as any
    ];

    setHeatmapData(OrganizationEngine.generateTeamHeatmap(mockAthletes));
  }, []);

  const getColorClass = (color: string) => {
    switch (color) {
      case "green": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "yellow": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "orange": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "red": return "bg-rose-500/20 text-rose-400 border-rose-500/30";
      default: return "bg-white/5 text-foreground";
    }
  };

  const getMetricColor = (val: number, good: number, bad: number, inverse = false) => {
    // Simple interpolation for demo
    if (inverse) {
      if (val >= bad) return "bg-rose-500/20 text-rose-400";
      if (val >= good) return "bg-orange-500/20 text-orange-400";
      return "bg-emerald-500/20 text-emerald-400";
    } else {
      if (val <= bad) return "bg-rose-500/20 text-rose-400";
      if (val <= good) return "bg-orange-500/20 text-orange-400";
      return "bg-emerald-500/20 text-emerald-400";
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/5">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
            <Users size={16} className="text-blue-400" />
          </div>
          <h2 className="text-lg font-bold">Team Operational Matrix</h2>
        </div>
        <div className="flex gap-2 text-[10px] font-bold uppercase tracking-wider">
          <div className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400">Optimal</div>
          <div className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-400">Monitor</div>
          <div className="px-2 py-1 rounded bg-orange-500/20 text-orange-400">Warning</div>
          <div className="px-2 py-1 rounded bg-rose-500/20 text-rose-400">Critical</div>
        </div>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-white/5">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg">Athlete</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Readiness Δ</th>
              <th className="px-4 py-3 text-center">Load (ACWR)</th>
              <th className="px-4 py-3 text-center">Attendance</th>
              <th className="px-4 py-3 text-center rounded-tr-lg">Injuries</th>
            </tr>
          </thead>
          <tbody>
            {heatmapData.map((row, i) => (
              <tr key={row.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                <td className="px-4 py-4 font-medium">{row.name}</td>
                <td className="px-4 py-4 text-center">
                  <div className={`w-3 h-3 rounded-full mx-auto ${getColorClass(row.color).split(" ")[0]} shadow-[0_0_10px_currentColor]`} />
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${getMetricColor(row.readinessDelta, -5, -10)}`}>
                    {row.readinessDelta > 0 ? "+" : ""}{row.readinessDelta}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${getMetricColor(row.acwr, 1.3, 1.5, true)}`}>
                    {row.acwr.toFixed(2)}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${getMetricColor(row.attendance, 80, 70)}`}>
                    {row.attendance}%
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${getMetricColor(row.injuries, 1, 2, true)}`}>
                    {row.injuries}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
