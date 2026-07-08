"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Calendar } from "@/components/Calendar";
import { Skeleton } from "@/components/ui/Skeleton";

export default function StudentSchedulesPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    // We assume 'schedules' collection holds events.
    const q = query(
      collection(db, "schedules"),
      where("athleteId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate ? doc.data().date.toDate() : new Date(doc.data().date)
      }));
      setEvents(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return <Skeleton className="w-full h-[800px] rounded-xl" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Schedule</h1>
        <p className="text-muted-foreground mt-1">Your upcoming training, competitions, and camps.</p>
      </div>

      <Calendar 
        events={events} 
        onEventClick={(event) => alert(`Event: ${event.title}\nType: ${event.type}\nDetails: ${event.content || 'None'}`)}
      />
    </div>
  );
}
