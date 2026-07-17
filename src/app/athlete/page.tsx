"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc, limit } from "firebase/firestore";
import { format, differenceInDays, subDays, addDays, isSameDay } from "date-fns";
import { 
  Activity, Calendar, ChevronRight, Zap, Target, ArrowUpRight, Flame, Heart, Droplets, Moon, CheckCircle2, Dumbbell, TrendingUp, AlertTriangle, ArrowRight, ArrowUp
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/Skeleton";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { getPendingInvitations, acceptCoachInvitation, declineCoachInvitation } from "@/lib/services/athlete.service";
import { CoachInvitation } from "@/lib/types";
import Script from "next/script";
import { DashboardEngine } from "@/lib/intelligence/dashboardEngine";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': any;
    }
  }
}

// Subcomponents: CircularProgress
const CircularProgress = ({ value, max, label, target, colorClass }: any) => {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  
  // For things like 100m sprint where lower is better, we invert the percent logic for progress bar
  let percent = 0;
  if (label.includes('Sprint')) {
    // arbitrary max for visual
    percent = Math.max(0, Math.min(((20 - value) / (20 - target)) * 100, 100));
  } else {
    percent = Math.min((value / max) * 100, 100);
  }
  
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/5">
      <div className="relative w-14 h-14 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle className="text-white/10" strokeWidth="3" stroke="currentColor" fill="transparent" r={radius} cx="28" cy="28" />
          <circle 
            className={`${colorClass} transition-all duration-1000 ease-in-out`}
            strokeWidth="3" strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" stroke="currentColor" fill="transparent" r={radius} cx="28" cy="28" 
          />
        </svg>
        <div className="absolute flex items-center justify-center inset-0 text-[10px] font-bold">{Math.round(percent)}%</div>
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-semibold mb-1">{label}</p>
        <p className="text-lg font-black leading-none mb-1">{value.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">{label.includes('Score') ? 'pts' : label.includes('Sprint') ? 'sec' : label.includes('Jump') ? 'm' : '%'}</span></p>
        <p className="text-[10px] text-muted-foreground">Target: {target.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default function StudentDashboard() {
  const { user, userData } = useAuth();
  
  const [schedules, setSchedules] = useState<any[]>([]);
  const [latestWellness, setLatestWellness] = useState<any>(null);
  const [pendingInvites, setPendingInvites] = useState<CoachInvitation[]>([]);
  const [metricsHistory, setMetricsHistory] = useState<any[]>([]);
  
  // States for calculated data
  const [readiness, setReadiness] = useState<number>(0);
  const [weeklyLoad, setWeeklyLoad] = useState<number>(0);
  const [trainingStreak, setTrainingStreak] = useState<number>(0);
  const [completionRate, setCompletionRate] = useState<number>(0);
  const [fatigueLevel, setFatigueLevel] = useState<string>("Optimal");

  useEffect(() => {
    if (!user?.uid) return;

    // 1. Listen to past 30 days and next 7 days of schedules
    const thirtyDaysAgo = subDays(new Date(), 30);
    const scheduleQ = query(
      collection(db, "schedules"), 
      where("athleteId", "==", user.uid)
    );
    
    const unsubSchedule = onSnapshot(scheduleQ, (snap) => {
      const allSchedules = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      
      // Filter out schedules way too far in the past/future client-side
      const relevantSchedules = allSchedules.filter((s:any) => new Date(s.date) >= thirtyDaysAgo);
      
      relevantSchedules.sort((a:any, b:any) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setSchedules(relevantSchedules);

      // Calculate Metrics
      const today = new Date();
      const sevenDaysAgo = subDays(today, 7);
      
      // Load
      const recentSchedules = relevantSchedules.filter((s:any) => new Date(s.date) >= sevenDaysAgo && new Date(s.date) <= today && s.isCompleted);
      const load = recentSchedules.reduce((acc: number, s: any) => acc + (s.duration * (s.rpe || 5)), 0);
      setWeeklyLoad(load);

      // Completion Rate for last 7 days
      const last7DaysSchedules = relevantSchedules.filter((s:any) => new Date(s.date) >= sevenDaysAgo && new Date(s.date) <= today);
      const completedLast7 = last7DaysSchedules.filter((s: any) => s.isCompleted).length;
      setCompletionRate(last7DaysSchedules.length > 0 ? Math.round((completedLast7 / last7DaysSchedules.length) * 100) : 0);

      // Streak
      let streak = 0;
      for (let i = 0; i < 30; i++) {
        const d = subDays(today, i);
        const daySchedules = relevantSchedules.filter((s: any) => isSameDay(new Date(s.date), d));
        if (daySchedules.length > 0 && daySchedules.some((s: any) => s.isCompleted)) {
          streak++;
        } else if (daySchedules.length > 0 && !daySchedules.some((s: any) => s.isCompleted)) {
          break; // Missed a day
        }
      }
      setTrainingStreak(streak);

    }, (err) => console.error(err));

    // 2. Listen to Wellness Logs
    const wellnessQ = query(
      collection(db, "wellness"),
      where("athleteId", "==", user.uid)
    );
    const unsubWellness = onSnapshot(wellnessQ, (snap) => {
      if (!snap.empty) {
        const docsData = snap.docs.map(d => d.data());
        docsData.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const latest = docsData[0];
        setLatestWellness(latest);
        setReadiness(latest.readinessScore || 87); // fallback to 87 for UI test
        
        // Derive fatigue
        if (latest.muscleSoreness === 1 || latest.energyLevel === 1) setFatigueLevel("High");
        else if (latest.muscleSoreness === 2 || latest.energyLevel === 2) setFatigueLevel("Moderate");
        else setFatigueLevel("Optimal");
      } else {
        setReadiness(87);
        setFatigueLevel("Moderate");
      }
    }, (err) => console.error(err));

    // 3. Mock Performance History
    setMetricsHistory([
      { month: 'Dec', pts: 4500 },
      { month: 'Jan', pts: 4800 },
      { month: 'Feb', pts: 4750 },
      { month: 'Mar', pts: 5100 },
      { month: 'Apr', pts: 5300 },
      { month: 'May', pts: 5500 },
    ]);

    // 4. Fetch Invites
    getPendingInvitations(user.uid).then(setPendingInvites).catch(console.error);

    return () => { 
      unsubSchedule(); 
      unsubWellness();
    };
  }, [user]);

  // Derived lists
  const today = new Date();
  const todaysPlan = schedules.filter((s: any) => isSameDay(new Date(s.date), today));
  const upcomingPlan = schedules.filter((s: any) => new Date(s.date) > today && new Date(s.date) <= addDays(today, 3));

  const handleToggleComplete = async (scheduleId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "schedules", scheduleId), { isCompleted: !currentStatus });
    } catch (error) {
      console.error(error);
    }
  };

  const readinessColor = readiness >= 80 ? "text-emerald-500" : readiness >= 60 ? "text-amber-500" : "text-rose-500";
  const readinessBg = readiness >= 80 ? "bg-emerald-500/10 border-emerald-500/20" : readiness >= 60 ? "bg-amber-500/10 border-amber-500/20" : "bg-rose-500/10 border-rose-500/20";

  return (
    <div className="max-w-[1600px] mx-auto text-foreground pb-20 space-y-6">
      
      {/* HEADER & NAV */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1 flex items-center gap-2">
            Good morning, {userData?.firstName || "Athlete"} <span className="wave">👋</span>
          </h1>
          <p className="text-muted-foreground text-sm">Stay focused. Stay consistent. Become your best.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search sessions, plans, documents..." 
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm w-64 focus:outline-none focus:border-primary/50"
            />
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-muted-foreground">
            <Calendar size={16} />
            {format(new Date(), "MMM dd, yyyy")}
          </div>
        </div>
      </div>

      <div className="flex gap-8 border-b border-white/10 overflow-x-auto no-scrollbar">
        {["Overview", "My Plan", "Sessions", "Performance", "Wellness", "Progress", "Calendar", "Documents"].map((tab, i) => (
          <button key={tab} className={`pb-3 whitespace-nowrap font-medium text-sm transition-colors relative ${i === 0 ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
            {tab}
            {i === 0 && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full shadow-[0_-2px_10px_var(--color-primary)]" />}
          </button>
        ))}
      </div>

      <div className="pt-6">
        <DashboardEngine 
          performanceProfile={(userData?.profile as any)?.performanceProfile || 'General'} 
          primaryEvent={(userData?.profile as any)?.primaryEvent || ''}
          athleteId={user?.uid || ''} 
        />
      </div>

    </div>
  );
}
