"use client";

import { useCoachData } from "@/lib/hooks/useCoachDashboardMetrics";
import { formatDistanceToNow } from "date-fns";
import { useMemo } from "react";
import { FileText, Download } from "lucide-react";

export function RecentReportsList() {
  const { wellness, athletes } = useCoachData();

  const reports = useMemo(() => {
    return [...wellness]
      .sort((a: any, b: any) => new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime())
      .slice(0, 4)
      .map((w: any) => {
        const athlete = athletes.find((a: any) => a.uid === w.athleteId || a.id === w.athleteId);
        const name = athlete ? `${(athlete as any).firstName || ''} ${(athlete as any).lastName || ''}`.trim() : "Unknown Athlete";
        
        let timeStr = "recently";
        try {
          const d = w.date?.toDate ? w.date.toDate() : new Date(w.date || w.createdAt);
          if (!isNaN(d.getTime())) {
            timeStr = formatDistanceToNow(d, { addSuffix: true });
          }
        } catch (e) {}

        return {
          title: `Wellness Report - ${name}`,
          time: `Submitted ${timeStr}`
        };
      });
  }, [wellness, athletes]);

  return (
    <div className="bg-card rounded-xl p-5 border border-border flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Recent Reports</h3>
        <button className="text-[10px] text-[#8B5CF6] hover:text-[#7C3AED] transition-colors">
          View All
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {reports.length === 0 ? (
          <div className="text-center text-muted-foreground text-xs py-6">No recent reports found.</div>
        ) : (
          reports.map((report, i) => (
            <div key={i} className="flex gap-3 items-center group cursor-pointer hover:bg-accent p-2 rounded-lg -mx-2 transition-colors">
              <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center shrink-0">
                <FileText size={14} className="text-[#F59E0B]" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-foreground truncate group-hover:text-[#8B5CF6] transition-colors">{report.title}</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">{report.time}</p>
              </div>
              <button className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all">
                <Download size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
