"use client";

import { useState, useEffect } from "react";
import { Search, Bell, Mail, Calendar as CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function HeroCommandCenter({ coachName }: { coachName: string }) {
  const { user } = useAuth();
  const [athleteCount, setAthleteCount] = useState(0);
  const [staffCount, setStaffCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const athleteQ = query(collection(db, "coachAthleteRelationships"), where("coachId", "==", user.uid));
    const unsubAthletes = onSnapshot(athleteQ, (snap) => setAthleteCount(snap.docs.length), (error) => {
      console.error("HeroCommandCenter athleteQ onSnapshot error:", error);
    });

    const staffQ = query(collection(db, "staffRelationships"), where("headCoachId", "==", user.uid));
    const unsubStaff = onSnapshot(staffQ, (snap) => {
      setStaffCount(snap.docs.filter((d: any) => d.data().status === "active").length);
    }, (error) => {
      console.error("HeroCommandCenter staffQ onSnapshot error:", error);
    });

    return () => {
      unsubAthletes();
      unsubStaff();
    };
  }, [user]);

  const dateStr = new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
          Good morning, Coach {coachName} <span className="wave-animation">👋</span>
        </h1>
        <p className="text-muted-foreground mt-1 text-sm font-medium">
          {athleteCount} Athletes • {staffCount} Staff
        </p>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input 
            placeholder="Search athletes, sessions..." 
            className="pl-9 glass bg-background/50 h-10 border-white/10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button className="h-10 w-10 glass rounded-full flex items-center justify-center relative hover:bg-white/10 transition-colors">
            <Bell size={18} className="text-muted-foreground" />
            <span className="absolute top-0 right-0 h-3 w-3 bg-rose-500 rounded-full border-2 border-background"></span>
          </button>
          <button className="h-10 w-10 glass rounded-full flex items-center justify-center relative hover:bg-white/10 transition-colors">
            <Mail size={18} className="text-muted-foreground" />
          </button>
          <div className="h-10 px-4 glass rounded-full flex items-center gap-2 border-white/10">
            <CalendarIcon size={16} className="text-muted-foreground" />
            <span className="text-sm font-semibold">{dateStr}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
