"use client";

import { Trophy, Clock } from "lucide-react";
import { CompetitionEngine } from "@/lib/intelligence/competitionEngine";
import { useEffect, useState } from "react";

export function CompetitionCountdown() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Mock HIE output
    const mockCompetitions = [
      { name: "National Championships", date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12), priority: "A" }
    ];
    setData(CompetitionEngine.analyzeCompetitions(mockCompetitions as any));
  }, []);

  if (!data || !data.nextCompetition) return null;

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
      <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity">
        <Trophy size={160} />
      </div>

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
          <Trophy size={16} className="text-amber-400" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Next Competition</h2>
      </div>

      <div className="relative z-10">
        <h3 className="text-xl font-bold text-foreground mb-1">{data.nextCompetition.name}</h3>
        <p className="text-sm text-amber-400 font-bold uppercase tracking-wider mb-4">
          Priority {data.nextCompetition.priority}
        </p>

        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-4xl font-black tracking-tighter text-foreground">
              {data.daysToCompetition}
            </span>
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Days Away</span>
          </div>
        </div>

        {data.warnings.length > 0 && (
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2">
            <Clock size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-200/80 font-medium leading-relaxed">
              {data.warnings[0]}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
