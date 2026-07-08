"use client";

import { useAuth } from "@/context/AuthContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { Loader2 } from "lucide-react";
import { StatusChip } from "@/components/ui/StatusChip";
import { useRealtimeData } from "@/lib/hooks/useRealtimeData";
import { where } from "firebase/firestore";
import { useRouter } from "next/navigation";

export function AthleteRosterTable() {
  const { userData } = useAuth();
  const orgId = userData?.organizationId || "";
  const router = useRouter();

  const { data: athletes, loading } = useRealtimeData("students", [
    where("headCoachId", "==", userData?.uid || "")
  ]);

  return (
    <GlassCard className="overflow-hidden">
      <div className="flex flex-row justify-between items-center p-6 border-b border-white/5">
        <h2 className="text-xl font-bold tracking-tight">Active Roster</h2>
        <span className="text-xs text-accent font-bold cursor-pointer hover:underline uppercase tracking-wider">View All</span>
      </div>
      
      <div className="p-0">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase tracking-wider text-muted-foreground bg-white/5">
                <th className="p-4 font-bold pl-6">Athlete</th>
                <th className="p-4 font-bold">Sport / Event</th>
                <th className="p-4 font-bold">Athlete ID</th>
                <th className="p-4 font-bold text-right pr-6">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-accent" />
                  </td>
                </tr>
              ) : athletes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    No athletes assigned. Use the "Add Athlete" button to create an athlete profile.
                  </td>
                </tr>
              ) : (
                athletes.map((athlete: any) => (
                  <tr 
                    key={athlete.id} 
                    onClick={() => router.push(`/coach/athletes/${athlete.id}`)}
                    className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group cursor-pointer"
                  >
                    <td className="p-4 pl-6 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-accent/20 border border-accent/30 flex flex-shrink-0 items-center justify-center font-bold text-accent overflow-hidden">
                        {(athlete.firstName?.[0] || "")}{(athlete.lastName?.[0] || "")}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground group-hover:text-accent transition-colors">{athlete.firstName} {athlete.lastName}</p>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-medium text-muted-foreground">
                      {athlete.sport || 'Unassigned'} {athlete.event ? `/ ${athlete.event}` : ''}
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded-md">{athlete.athleteId || athlete.id.substring(0, 8)}</span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <StatusChip status="success" dot>Active</StatusChip>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </GlassCard>
  );
}
