"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useCoachData } from "@/lib/hooks/useCoachDashboardMetrics";
import { useMemo } from "react";

export function TrainingPlanSummary() {
  const { trainingPlans } = useCoachData();

  const data = useMemo(() => {
    const counts = { "Preparatory": 0, "Competition Prep": 0, "Competition": 0, "Transition": 0 };
    trainingPlans.forEach((p: any) => {
      const phase = p.phase || "Preparatory";
      if (phase in counts) counts[phase as keyof typeof counts]++;
      else counts["Preparatory"]++; // fallback
    });

    return [
      { name: "Preparatory", value: counts["Preparatory"], color: "#10B981" },
      { name: "Competition Prep", value: counts["Competition Prep"], color: "#3B82F6" },
      { name: "Competition", value: counts["Competition"], color: "#F59E0B" },
      { name: "Transition", value: counts["Transition"], color: "#8B5CF6" }
    ];
  }, [trainingPlans]);

  const total = trainingPlans.length;

  return (
    <div className="bg-[#11141A] rounded-xl p-5 border border-[#1F2937] flex-1 flex flex-col min-h-[220px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Training Plan Summary</h3>
        <button className="text-[10px] text-[#8B5CF6] hover:text-[#7C3AED] transition-colors">
          View All Plans
        </button>
      </div>
      
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
            <span className="text-[9px] text-[#9CA3AF] text-center px-2 leading-tight">Active Plans</span>
          </div>
        </div>

        <div className="flex-1 ml-6 flex flex-col justify-center gap-2">
          <div className="flex items-center justify-between text-[9px] text-[#6B7280] uppercase tracking-wider font-bold mb-1">
            <span>Periodization Phase</span>
            <span>Athletes</span>
          </div>
          {data.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: item.color }} />
                <span className="text-[#E5E7EB] text-[11px] truncate w-24">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">{item.value}</span>
                <span className="text-[#6B7280] text-[10px] w-8 text-right">({total > 0 ? Math.round((item.value / total) * 100) : 0}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 text-left">
        <button className="text-[10px] text-[#8B5CF6] hover:text-[#7C3AED] transition-colors">
          Manage training plans →
        </button>
      </div>
    </div>
  );
}
