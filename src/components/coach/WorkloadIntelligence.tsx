"use client";

import { Dumbbell, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const data = [
  { name: "Mon", load: 300, chronic: 250 },
  { name: "Tue", load: 450, chronic: 260 },
  { name: "Wed", load: 200, chronic: 265 },
  { name: "Thu", load: 500, chronic: 270 },
  { name: "Fri", load: 400, chronic: 280 },
  { name: "Sat", load: 600, chronic: 300 },
  { name: "Sun", load: 150, chronic: 310 }
];

export function WorkloadIntelligence() {
  return (
    <div className="glass-card rounded-2xl p-6 border border-white/5 h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <TrendingUp size={16} className="text-indigo-400" />
          </div>
          <h2 className="text-lg font-bold">Team Workload</h2>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: "#18181b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
              itemStyle={{ color: "#e4e4e7" }}
            />
            <ReferenceLine y={250} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />
            <Line type="monotone" dataKey="load" name="Acute Load" stroke="#818cf8" strokeWidth={3} dot={{ r: 4, fill: "#818cf8" }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="chronic" name="Chronic Load" stroke="#34d399" strokeWidth={2} strokeDasharray="5 5" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/5 flex gap-4 text-xs font-medium text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-1 bg-indigo-400 rounded-full"></div>
          Acute (7d)
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-1 bg-emerald-400 rounded-full border border-dashed border-emerald-400 bg-transparent"></div>
          Chronic (28d)
        </div>
      </div>
    </div>
  );
}
