"use client";

import { useCoachData } from "@/lib/hooks/useCoachDashboardMetrics";
import { format } from "date-fns";
import { useMemo } from "react";

export function TodaysScheduleTimeline() {
  const { schedules } = useCoachData();

  const sessions = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todays = schedules.filter((s: any) => s.date && s.date.startsWith(today));
    
    // Sort by time
    todays.sort((a: any, b: any) => {
      const timeA = a.time || "00:00";
      const timeB = b.time || "00:00";
      return timeA.localeCompare(timeB);
    });

    if (todays.length === 0) return [];

    return todays.map((s: any) => {
      // Create a nice time string
      let timeStr = "TBD";
      if (s.time) {
        const [h, m] = s.time.split(":");
        const hour = parseInt(h, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        timeStr = `${hour12}:${m} ${ampm}`;
      }

      const type = s.type || "Training";
      let tagColor = "bg-[#8B5CF6]/20 text-[#8B5CF6]";
      let dotColor = "bg-[#8B5CF6]";
      if (type.toLowerCase().includes("strength") || type.toLowerCase().includes("gym")) {
        tagColor = "bg-[#10B981]/20 text-[#10B981]";
        dotColor = "bg-[#10B981]";
      } else if (type.toLowerCase().includes("recovery")) {
        tagColor = "bg-[#3B82F6]/20 text-[#3B82F6]";
        dotColor = "bg-[#3B82F6]";
      } else if (type.toLowerCase().includes("match") || type.toLowerCase().includes("competition")) {
        tagColor = "bg-[#F59E0B]/20 text-[#F59E0B]";
        dotColor = "bg-[#F59E0B]";
      }

      return {
        time: timeStr,
        title: s.title || `${type} Session`,
        attendees: s.athleteId ? "1 Athlete" : (s.groupId ? "Group Session" : "Session"),
        tag: type,
        tagColor,
        dotColor
      };
    });
  }, [schedules]);

  return (
    <div className="bg-card rounded-xl p-5 border border-border flex flex-col h-[320px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-foreground">Today's Schedule</h3>
        <button className="text-[10px] text-[#8B5CF6] hover:text-[#7C3AED] transition-colors">
          View Calendar
        </button>
      </div>

      <div className="mt-4 relative pl-3">
        {/* Timeline line */}
        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-secondary" />

        <div className="space-y-6">
          {sessions.length === 0 ? (
            <div className="text-center text-muted-foreground text-xs py-10">No sessions scheduled for today.</div>
          ) : (
            sessions.map((session, i) => (
              <div key={i} className="flex gap-4 relative">
                <div className="w-14 text-[10px] font-medium text-muted-foreground shrink-0 pt-0.5">
                  {session.time}
                </div>
                
                <div className={`w-2 h-2 rounded-full ${session.dotColor} absolute left-[15px] top-1.5 shadow-[0_0_8px_var(--tw-shadow-color)] shadow-${session.dotColor.split('-')[1]}`} />
                
                <div className="flex-1 flex items-start justify-between bg-muted/50 rounded-lg p-3 ml-2 border border-border/50 hover:bg-accent transition-colors cursor-pointer">
                  <div>
                    <h4 className="text-xs font-semibold text-foreground mb-0.5">{session.title}</h4>
                    <p className="text-[10px] text-muted-foreground">{session.attendees}</p>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${session.tagColor}`}>
                    {session.tag}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <button className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          <span className="text-[#8B5CF6]">+</span> Add Session
        </button>
      </div>
    </div>
  );
}
