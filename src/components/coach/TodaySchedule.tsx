"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusChip } from "@/components/ui/StatusChip";
import { Clock, Calendar as CalendarIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRealtimeData } from "@/lib/hooks/useRealtimeData";
import { where, orderBy } from "firebase/firestore";
import { format, isToday } from "date-fns";

export function TodaySchedule() {
  const { userData } = useAuth();
  const orgId = userData?.organizationId || "";

  // Removed orderBy to prevent requiring a composite index in Firebase
  const { data: events, loading } = useRealtimeData("calendarEvents", [
    where("organizationId", "==", orgId)
  ]);

  const todayEvents = useMemo(() => {
    return events
      .filter((e: any) => {
        try {
          const date = new Date(e.start);
          return isToday(date);
        } catch {
          return false;
        }
      })
      .sort((a: any, b: any) => {
        const timeA = new Date(a.start).getTime();
        const timeB = new Date(b.start).getTime();
        return timeA - timeB;
      })
      .map((e: any) => {
        let time = "Unknown";
        try {
          time = format(new Date(e.start), "hh:mm a");
        } catch(err) {}

        return {
          id: e.id,
          time,
          title: e.title || "Session",
          athletes: e.participants?.length ? `${e.participants.length} Athletes` : "No participants",
          tag: e.eventType || "Training",
          color: "text-primary",
          bg: "bg-primary/20",
          dot: "bg-primary"
        };
      });
  }, [events]);

  if (!orgId) return null;

  return (
    <Card glass hoverEffect className="flex flex-col">
      <CardHeader className="flex flex-row justify-between items-center pb-4">
        <CardTitle className="text-base font-bold">Today's Schedule</CardTitle>
        <span className="text-xs text-primary font-bold cursor-pointer hover:underline">View Calendar</span>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {loading ? (
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[34px] before:-translate-x-px before:h-full before:w-0.5 before:bg-white/5">
            {[1, 2, 3].map((i) => (
               <div key={i} className="relative flex items-start gap-4">
                 <Skeleton className="w-[50px] h-4 mt-1" />
                 <div className="w-3 h-3 rounded-full bg-white/10 mt-1.5 z-10 shrink-0" />
                 <Skeleton className="flex-1 h-16 rounded-xl" />
               </div>
            ))}
          </div>
        ) : todayEvents.length === 0 ? (
          <EmptyState 
            compact
            icon={<CalendarIcon size={20} />}
            title="No Events"
            description="Your schedule is clear for today."
            className="border-none"
          />
        ) : (
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[34px] before:-translate-x-px before:h-full before:w-0.5 before:bg-white/5">
            {todayEvents.map((item, i) => (
              <div key={item.id || i} className="relative flex items-start gap-4 group cursor-pointer">
                <div className="w-[50px] shrink-0 text-right mt-1">
                  <span className="text-[10px] font-bold text-muted-foreground group-hover:text-foreground transition-colors">{item.time}</span>
                </div>
                
                <div className={`w-3 h-3 rounded-full border-2 border-background shadow-sm ${item.dot} mt-1.5 z-10 shrink-0 group-hover:scale-125 transition-transform`} />
                
                <div className="flex-1 bg-background/50 border border-white/5 p-3 rounded-xl group-hover:bg-white/10 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold text-foreground leading-tight">{item.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1"><Clock size={10}/> {item.athletes}</p>
                    </div>
                    <StatusChip status="info" size="sm" dot={false}>
                      {item.tag}
                    </StatusChip>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
