"use client";

import { useCoachAthletesWithMetrics } from "@/lib/hooks/useCoachDashboardMetrics";
import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export function AthleteReadinessOverview() {
  const { athletes, loading } = useCoachAthletesWithMetrics();
  
  const data = useMemo(() => {
    const counts = { "Ready": 0, "Moderate": 0, "Fatigued": 0, "At Risk": 0 };
    athletes.forEach((a: any) => {
      if (a.readiness in counts) counts[a.readiness as keyof typeof counts]++;
    });

    return [
      { name: "Ready", value: counts["Ready"], color: "#10B981" },
      { name: "Moderate", value: counts["Moderate"], color: "#3B82F6" },
      { name: "Fatigued", value: counts["Fatigued"], color: "#F59E0B" },
      { name: "At Risk", value: counts["At Risk"], color: "#EF4444" }
    ];
  }, [athletes]);

  const total = athletes.length;

  return (
    <div className="bg-[#11141A] rounded-xl p-5 border border-[#1F2937] flex flex-col h-[220px]">
      <h3 className="text-sm font-semibold text-white mb-4">Athlete Readiness Overview</h3>
      
      <div className="flex-1 flex items-center justify-between">
        <div className="w-[120px] h-[120px] relative shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={60}
                paddingAngle={2}
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
            <span className="text-2xl font-bold text-white">{total}</span>
            <span className="text-[9px] text-[#9CA3AF]">Athletes</span>
          </div>
        </div>

        <div className="flex-1 ml-6 space-y-2">
          {data.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: item.color }} />
                <span className="text-[#E5E7EB]">{item.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white font-medium">{item.value}</span>
                <span className="text-[#6B7280] text-[10px] w-8 text-right">({total > 0 ? Math.round((item.value / total) * 100) : 0}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 text-left">
        <button className="text-[10px] text-[#8B5CF6] hover:text-[#7C3AED] transition-colors">
          View readiness report →
        </button>
      </div>
    </div>
  );
}
