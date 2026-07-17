"use client";

import { useCoachData } from "@/lib/hooks/useCoachDashboardMetrics";
import { WorkloadEngine } from "@/lib/intelligence/workloadEngine";
import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export function WorkloadBalance() {
  const { schedules } = useCoachData();

  const { acwr, optimalPercent, message, color } = useMemo(() => {
    const analysis = WorkloadEngine.analyzeWorkload(schedules.filter((s: any) => s.isCompleted) as any);
    const acwrVal = analysis.metrics.acwr;
    
    // ACWR Sweet Spot is 0.8 to 1.3
    let percent = 0;
    let msg = "";
    let col = "#10B981";

    if (acwrVal === 0) {
      percent = 0;
      msg = "No recent training load recorded.";
      col = "#9CA3AF";
    } else if (acwrVal < 0.8) {
      percent = Math.round((acwrVal / 0.8) * 100);
      msg = "Low stimulus. Risk of detraining.";
      col = "#F59E0B";
    } else if (acwrVal > 1.5) {
      percent = Math.max(0, 100 - Math.round(((acwrVal - 1.5) / 1.5) * 100));
      msg = "High ACWR. Elevated risk of injury.";
      col = "#EF4444";
    } else {
      percent = 100;
      msg = "Good balance! Keep monitoring workloads.";
      col = "#10B981";
    }

    return { acwr: acwrVal, optimalPercent: percent, message: msg, color: col };
  }, [schedules]);

  const data = [
    { name: "Optimal", value: optimalPercent, color },
    { name: "Empty", value: 100 - optimalPercent, color: "#1F2937" }
  ];

  return (
    <div className="bg-[#11141A] rounded-xl p-5 border border-[#1F2937] flex flex-col h-[150px]">
      <h3 className="text-sm font-semibold text-white mb-2">Workload Balance</h3>
      
      <div className="flex-1 flex items-center justify-between">
        <div className="w-[70px] h-[70px] relative shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={28}
                outerRadius={35}
                startAngle={90}
                endAngle={-270}
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
            <span className="text-[14px] font-bold text-white">{acwr.toFixed(1)}</span>
          </div>
        </div>

        <div className="flex-1 ml-4 flex flex-col">
          <p className="text-[11px] text-[#E5E7EB] leading-relaxed mb-2">
            {message}
          </p>
          <button className="text-[10px] text-[#8B5CF6] hover:text-[#7C3AED] transition-colors self-start">
            View workload report →
          </button>
        </div>
      </div>
    </div>
  );
}
