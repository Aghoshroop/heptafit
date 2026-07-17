"use client";

import { useCoachData } from "@/lib/hooks/useCoachDashboardMetrics";
import { formatDistanceToNow } from "date-fns";
import { useMemo } from "react";
import { AlertTriangle, Info } from "lucide-react";

export function AlertsAndNotificationsList() {
  const { insights } = useCoachData();

  const alerts = useMemo(() => {
    return insights
      .filter((i: any) => i.status === "active" || i.type === "Warning" || i.type === "Injury")
      .sort((a: any, b: any) => new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime())
      .slice(0, 5)
      .map((i: any) => {
        let icon = Info;
        let color = "text-[#3B82F6]";
        let bg = "bg-[#3B82F6]/10";

        if (i.type === "Injury" || i.severity === "high") {
          icon = AlertTriangle;
          color = "text-[#EF4444]";
          bg = "bg-[#EF4444]/10";
        } else if (i.type === "Warning" || i.severity === "medium") {
          icon = AlertTriangle;
          color = "text-[#F59E0B]";
          bg = "bg-[#F59E0B]/10";
        }

        let timeStr = "recently";
        try {
          const d = i.date?.toDate ? i.date.toDate() : new Date(i.date || i.createdAt);
          if (!isNaN(d.getTime())) {
            timeStr = formatDistanceToNow(d, { addSuffix: true });
          }
        } catch (e) {}

        return {
          title: i.title || i.type,
          desc: i.description || i.message || "New insight generated.",
          time: timeStr,
          icon,
          color,
          bg
        };
      });
  }, [insights]);

  return (
    <div className="bg-[#11141A] rounded-xl p-5 border border-[#1F2937] flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Alerts & Notifications</h3>
        <button className="text-[10px] text-[#8B5CF6] hover:text-[#7C3AED] transition-colors">
          View All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
        {alerts.length === 0 ? (
          <div className="text-center text-[#6B7280] text-xs py-6">No active alerts.</div>
        ) : (
          alerts.map((alert, i) => (
            <div key={i} className="flex gap-3 items-start group cursor-pointer">
              <div className={`w-8 h-8 rounded-full ${alert.bg} flex items-center justify-center shrink-0`}>
                <alert.icon size={14} className={alert.color} />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <h4 className="text-xs font-semibold text-white truncate">{alert.title}</h4>
                <p className="text-[10px] text-[#9CA3AF] mt-0.5 line-clamp-1">{alert.desc}</p>
              </div>
              <span className="text-[10px] text-[#6B7280] shrink-0 pt-0.5">{alert.time}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
