"use client";

import { AlertCircle, Target, Activity, Users } from "lucide-react";
import { OrganizationEngine } from "@/lib/intelligence/organizationEngine";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export function OperationalBriefing() {
  const { userData } = useAuth();
  const [briefing, setBriefing] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData?.organizationId) return;

    // Simulate HIE fetching for demo purposes
    // In production, this would subscribe to the aggregated HIE state
    const fetchHIE = async () => {
      setLoading(true);
      try {
        // Since we don't have all the intelligence generated in firestore yet, we will mock the HIE output format
        // based on the OrganizationEngine rule evaluation.
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
            workload: { metrics: { acwr: 1.4 }, warnings: [] },
            attendanceRate: 75, activeInjuries: 1
          } as any
        ];
        
        const insights = OrganizationEngine.generateOperationalBriefing(mockAthletes);
        setBriefing(insights);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHIE();
  }, [userData?.organizationId]);

  return (
    <div className="glass-card rounded-2xl p-6 h-full flex flex-col border border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Target size={120} />
      </div>
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
          <Activity size={16} className="text-blue-400" />
        </div>
        <h2 className="text-lg font-bold text-foreground tracking-tight">Today's Priorities</h2>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 relative z-10">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-10 bg-white/5 rounded-xl w-full"></div>
            <div className="h-10 bg-white/5 rounded-xl w-3/4"></div>
            <div className="h-10 bg-white/5 rounded-xl w-5/6"></div>
          </div>
        ) : briefing.length > 0 ? (
          briefing.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0 shadow-[0_0_8px_var(--color-blue-500)]"></div>
              <p className="text-sm text-foreground/90 leading-relaxed font-medium">{item}</p>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Users size={32} className="opacity-20 mb-2" />
            <p className="text-sm">All systems optimal.</p>
          </div>
        )}
      </div>
    </div>
  );
}
