"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { useRealtimeData } from "@/lib/hooks/useRealtimeData";
import { where } from "firebase/firestore";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusChip } from "@/components/ui/StatusChip";
import { Calendar as CalendarIcon, Clock, MapPin, Users } from "lucide-react";
import { format, isToday, isFuture, isPast } from "date-fns";
import { Skeleton } from "@/components/ui/Skeleton";

export default function CalendarPage() {
  const { userData } = useAuth();
  const orgId = userData?.organizationId || "";

  const { data: events, loading } = useRealtimeData("calendarEvents", [
    where("organizationId", "==", orgId)
  ]);

  const sortedEvents = useMemo(() => {
    return [...events].sort((a: any, b: any) => new Date(a.start).getTime() - new Date(b.start).getTime());
  }, [events]);

  const upcomingEvents = sortedEvents.filter((e: any) => isFuture(new Date(e.start)) || isToday(new Date(e.start)));
  const pastEvents = sortedEvents.filter((e: any) => isPast(new Date(e.start)) && !isToday(new Date(e.start)));

  if (!orgId) return null;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Master Schedule</h1>
        <p className="text-muted-foreground mt-1">Global view of all team events, sessions, and competitions.</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold">Upcoming Events</h2>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : upcomingEvents.length === 0 ? (
          <EmptyState 
            icon={<CalendarIcon size={32} />}
            title="No upcoming events"
            description="Your master schedule is currently clear."
          />
        ) : (
          <div className="grid gap-4">
            {upcomingEvents.map((event: any) => (
              <Card key={event.id} glass hoverEffect className="transition-all hover:border-primary/50">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row items-stretch">
                    <div className="p-6 md:w-48 bg-primary/5 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-white/10">
                      <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                        {format(new Date(event.start), "MMM")}
                      </span>
                      <span className="text-4xl font-black text-foreground">
                        {format(new Date(event.start), "dd")}
                      </span>
                    </div>
                    <div className="p-6 flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold">{event.title}</h3>
                          <div className="flex items-center gap-2 mt-2 text-muted-foreground text-sm">
                            <Clock size={16} />
                            <span>{format(new Date(event.start), "h:mm a")} - {format(new Date(event.end), "h:mm a")}</span>
                            <span className="mx-2">•</span>
                            <MapPin size={16} />
                            <span>{event.location || "TBD"}</span>
                          </div>
                        </div>
                        <StatusChip 
                          status={event.type === "competition" ? "active" : "neutral"} 
                        >
                          {event.type}
                        </StatusChip>
                      </div>
                      {event.description && (
                        <p className="text-muted-foreground text-sm">{event.description}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {pastEvents.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-white/5">
          <h2 className="text-xl font-bold text-muted-foreground">Past Events</h2>
          <div className="grid gap-4 opacity-60">
            {pastEvents.map((event: any) => (
              <Card key={event.id} glass className="border-none bg-white/5">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{event.title}</h4>
                    <span className="text-xs text-muted-foreground">{format(new Date(event.start), "MMM dd, yyyy")}</span>
                  </div>
                  <StatusChip status="neutral">Completed</StatusChip>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
