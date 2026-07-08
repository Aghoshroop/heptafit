"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy, limit, doc, updateDoc } from "firebase/firestore";
import { format, differenceInDays } from "date-fns";
import { Card, CardContent } from "@/components/ui/Card";
import { 
  Activity, Calendar, ChevronRight, Zap, Target, ArrowUpRight, Flame, Heart, Droplets, Moon
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { MyTeamWidget } from "@/components/student/MyTeamWidget";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { getPendingInvitations, acceptCoachInvitation, declineCoachInvitation } from "@/lib/services/athlete.service";
import { CoachInvitation } from "@/lib/types";

export default function StudentDashboard() {
  const { user, userData } = useAuth();
  
  // Real-time states
  const [schedules, setSchedules] = useState<any[]>([]);
  const [coachPriority, setCoachPriority] = useState<any>(null);
  const [nextComp, setNextComp] = useState<any>(null);
  const [readiness, setReadiness] = useState<number | null>(null);
  const [latestWellness, setLatestWellness] = useState<any>(null);
  const [pendingInvites, setPendingInvites] = useState<CoachInvitation[]>([]);
  
  useEffect(() => {
    if (!user?.uid) return;
    const todayStr = format(new Date(), "yyyy-MM-dd");

    // 1. Listen to Today's Schedules
    const scheduleQ = query(collection(db, "schedules"), where("athleteId", "==", user.uid), where("date", "==", todayStr));
    const unsubSchedule = onSnapshot(scheduleQ, (snap) => {
      setSchedules(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.error("unsubSchedule error:", err));

    // 2. Listen to Coach Notes/Priorities (Client-side sorted)
    const notesQ = query(collection(db, "notes"), where("athleteId", "==", user.uid));
    const unsubNotes = onSnapshot(notesQ, (snap) => {
      if (!snap.empty) {
        const notes = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        notes.sort((a: any, b: any) => {
          const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
          const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
          return bTime - aTime;
        });
        setCoachPriority(notes[0]);
      }
    }, (err) => console.error("unsubNotes error:", err));

    // 3. Listen to Next Competition
    if (userData?.organizationId) {
      const compQ = query(
        collection(db, "competitions"), 
        where("organizationId", "==", userData.organizationId),
        orderBy("date", "asc")
      );
      const unsubComp = onSnapshot(compQ, (snap) => {
        const futureComps = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter((c:any) => new Date(c.date) >= new Date());
        if (futureComps.length > 0) setNextComp(futureComps[0]);
      }, (err) => console.error("unsubComp error:", err));
      // Cleanup will be tricky if we nest, so we just declare let and assign
      // but to keep it simple we'll just handle it
      (window as any).unsubComp = unsubComp;
    }

    // 4. Listen to Wellness Logs for Readiness
    const wellnessQ = query(
      collection(db, "wellness"),
      where("athleteId", "==", user.uid)
    );
    const unsubWellness = onSnapshot(wellnessQ, (snap) => {
      if (!snap.empty) {
        const docsData = snap.docs.map(d => d.data());
        // Sort client-side to avoid requiring a composite index in Firestore
        docsData.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        const latest = docsData[0];
        setLatestWellness(latest);
        setReadiness(latest.readinessScore || null);
      }
    }, (err) => console.error("unsubWellness error:", err));

    // 4. Fetch Pending Invites
    const fetchInvites = async () => {
      try {
        const invites = await getPendingInvitations(user.uid);
        setPendingInvites(invites);
      } catch (err) {
        console.error("Error fetching invites:", err);
      }
    };
    fetchInvites();

    return () => { 
      unsubSchedule(); 
      unsubNotes(); 
      if ((window as any).unsubComp) (window as any).unsubComp(); 
      unsubWellness();
    };
  }, [user, userData?.organizationId]);

  const handleAcceptInvite = async (invitation: CoachInvitation) => {
    if (!userData?.profile) return;
    try {
      await acceptCoachInvitation(invitation);
      setPendingInvites(prev => prev.filter(i => i.id !== invitation.id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeclineInvite = async (invitationId: string) => {
    try {
      await declineCoachInvitation(invitationId);
      setPendingInvites(prev => prev.filter(i => i.id !== invitationId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleComplete = async (scheduleId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "schedules", scheduleId), { isCompleted: !currentStatus });
    } catch (error) {
      console.error("Error updating schedule:", error);
    }
  };

  const getCompletionPercentage = () => {
    if (schedules.length === 0) return 0;
    const completed = schedules.filter(s => s.isCompleted).length;
    return Math.round((completed / schedules.length) * 100);
  };

  const readinessColor = readiness && readiness > 80 ? "text-primary" : readiness && readiness > 60 ? "text-amber-500" : "text-rose-500";
  const daysToComp = nextComp ? differenceInDays(new Date(nextComp.date), new Date()) : null;

  return (
    <div className="space-y-6 pb-20 max-w-[1600px] mx-auto text-foreground">
      
      {/* INVITATION BANNER */}
      {pendingInvites.length > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 shadow-xl mb-6">
          <h2 className="text-xl font-bold mb-4">Pending Coach Invitations</h2>
          <div className="space-y-4">
            {pendingInvites.map(invite => (
              <div key={invite.id} className="flex items-center justify-between bg-background/50 p-4 rounded-xl border border-white/5">
                <div>
                  <p className="font-bold text-lg">{invite.coachName}</p>
                  <p className="text-sm text-muted-foreground">Wants to add you to their roster.</p>
                </div>
                <div className="flex gap-3">
                  <PremiumButton variant="outline" onClick={() => handleDeclineInvite(invite.id)}>
                    Decline
                  </PremiumButton>
                  <PremiumButton onClick={() => handleAcceptInvite(invite)}>
                    Accept
                  </PremiumButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 1. HERO SECTION (Daily Command Center) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2.5rem] p-8 lg:p-12 shadow-2xl bg-card/60 backdrop-blur-2xl border border-white/10"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/20 blur-[100px] rounded-full pointer-events-none transform -translate-x-1/2 translate-y-1/2" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-end justify-between gap-8">
          
          {/* Identity & Status */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-[2rem] overflow-hidden border-2 border-white/20 shadow-2xl relative z-10 bg-card">
                {userData?.profile?.profilePhotoUrl ? (
                  <Image src={userData.profile.profilePhotoUrl} alt="" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold bg-gradient-to-br from-primary to-accent text-primary-foreground">
                    {userData?.firstName?.[0]}{userData?.lastName?.[0]}
                  </div>
                )}
              </div>
              {readiness && readiness > 80 && (
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: "spring" }}
                  className="absolute -bottom-3 -right-3 w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_var(--primary)] z-20 border-2 border-background text-primary-foreground"
                >
                  <Flame size={20} />
                </motion.div>
              )}
            </div>

            <div className="text-center sm:text-left">
              <p className="text-primary font-bold uppercase tracking-[0.2em] text-xs mb-2">Prime Status</p>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-2">
                Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Perform.</span>
              </h1>
              <p className="text-muted-foreground text-lg">Let's crush today's objectives, {userData?.firstName || "Athlete"}.</p>
            </div>
          </div>

          {/* Invite Code & Quick Metrics */}
          <div className="flex flex-col gap-4 w-full lg:w-auto">
            {(userData?.profile as any)?.inviteCode && (
              <div className="bg-background/40 backdrop-blur-md border border-white/10 px-6 py-4 rounded-2xl flex items-center justify-between gap-6 shadow-xl">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Invite Code</p>
                  <p className="font-mono text-xl font-black tracking-[0.2em] text-primary">{(userData?.profile as any).inviteCode}</p>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText((userData?.profile as any)?.inviteCode || "");
                    // Ideally use a toast here
                  }}
                  className="px-4 py-2 bg-accent/20 text-accent font-semibold rounded-lg hover:bg-accent/30 transition-colors text-sm"
                >
                  Copy
                </button>
              </div>
            )}
            
            <div className="flex gap-4">
              <div className="flex-1 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex flex-col items-center justify-center shadow-lg">
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">Readiness</p>
                {readiness !== null ? (
                  <p className={`text-4xl font-black ${readinessColor}`}>{readiness}</p>
                ) : (
                  <p className="text-xl font-black text-muted-foreground mt-2">--</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* =======================================================================
            MAIN COLUMN (8/12)
            ======================================================================= */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Row 1: Today's Action Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass rounded-[2rem] p-6 lg:p-8 hover:-translate-y-1 transition-transform duration-300 shadow-xl border border-white/20"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-1">Action Plan</h2>
                <p className="text-muted-foreground text-sm">Your scheduled sessions for today</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-black text-primary">{getCompletionPercentage()}%</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Completed</p>
              </div>
            </div>

            <div className="space-y-4">
              {schedules.length === 0 ? (
                <EmptyState 
                  compact
                  icon={<Calendar size={24} className="text-emerald-500" />}
                  title="No Sessions Today"
                  description="Rest up! You have no training scheduled for today."
                  className="bg-emerald-500/5 border-none"
                />
              ) : (
                schedules.map((schedule, idx) => (
                  <motion.div 
                    key={schedule.id}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + (idx * 0.1) }}
                    className={`relative p-5 rounded-2xl border transition-all duration-300 ${
                      schedule.isCompleted ? 'bg-primary/5 border-primary/20' : 'bg-white/5 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => handleToggleComplete(schedule.id, schedule.isCompleted)}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                            schedule.isCompleted 
                              ? 'bg-primary text-primary-foreground shadow-[0_0_15px_var(--primary)]' 
                              : 'bg-white/10 text-muted-foreground hover:bg-white/20'
                          }`}
                        >
                          <Zap size={20} className={schedule.isCompleted ? 'fill-current' : ''} />
                        </button>
                        <div>
                          <h3 className={`text-lg font-bold transition-colors ${schedule.isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                            {schedule.title}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1"><Calendar size={14} /> {schedule.type}</span>
                            <span>•</span>
                            <span>{schedule.duration} mins</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-muted-foreground opacity-50" />
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Row 2: Recovery Intelligence */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Coach Priority */}
            <div className="glass rounded-[2rem] p-6 lg:p-8 bg-gradient-to-br from-accent/10 to-transparent border-accent/20 hover:-translate-y-1 transition-transform duration-300 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-primary-foreground shadow-[0_0_15px_var(--accent)]">
                  <Target size={20} />
                </div>
                <h2 className="text-xl font-bold tracking-tight">Coach Priority</h2>
              </div>
              
              {coachPriority ? (
                <div className="space-y-4">
                  <p className="text-lg leading-relaxed font-medium">"{coachPriority.content}"</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    Active Focus
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground">No specific notes from coach today.</p>
              )}
            </div>

            {/* Smart Insights */}
            <div className="glass rounded-[2rem] p-6 lg:p-8 hover:-translate-y-1 transition-transform duration-300 shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold tracking-tight">Recovery Intel</h2>
                <Heart size={20} className="text-primary" />
              </div>
              {latestWellness ? (
                <>
                  <p className="text-sm text-muted-foreground mb-6">
                    <strong className="text-foreground">Optimal State:</strong> Based on your latest log, your readiness is {latestWellness.readinessScore || "--"}/100.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-2 uppercase tracking-widest font-semibold">
                        <span className="text-muted-foreground flex items-center gap-1"><Moon size={12}/> Sleep</span>
                        <span className="text-emerald-500">{latestWellness.sleepHours || "--"} hours</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full w-[90%] shadow-[0_0_10px_#10b981]" style={{ width: `${Math.min(((latestWellness.sleepHours || 0) / 10) * 100, 100)}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-2 uppercase tracking-widest font-semibold">
                        <span className="text-muted-foreground flex items-center gap-1"><Activity size={12}/> HRV</span>
                        <span className="text-primary">{latestWellness.hrv || "--"} ms</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full w-[85%] shadow-[0_0_10px_var(--primary)]" style={{ width: `${Math.min(((latestWellness.hrv || 0) / 100) * 100, 100)}%` }} />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-6">
                  <EmptyState 
                    compact
                    icon={<Heart size={20} className="text-muted-foreground" />}
                    title="No Wellness Data"
                    description="Log your daily wellness to see your recovery intel."
                    className="bg-white/5 border-none"
                  />
                </div>
              )}
            </div>
          </motion.div>

        </div>

        {/* =======================================================================
            RIGHT COLUMN (4/12)
            ======================================================================= */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Horizon (Competition) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="glass rounded-[2rem] p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 shadow-xl border border-white/20"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/20 transition-colors" />
            
            <h2 className="text-lg font-bold tracking-tight mb-6">The Horizon</h2>
            
            {nextComp ? (
              <div className="space-y-6">
                <div className="flex items-end justify-between">
                  <p className="text-5xl font-black text-primary tracking-tighter">{daysToComp}</p>
                  <p className="text-sm uppercase tracking-widest text-muted-foreground font-semibold mb-1">Days Out</p>
                </div>
                <div>
                  <p className="font-bold text-lg">{nextComp.name}</p>
                  <p className="text-sm text-muted-foreground">{nextComp.location}</p>
                </div>
                <div className="pt-4 border-t border-white/5 flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase tracking-wider">Registered</span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-muted-foreground text-xs font-bold uppercase tracking-wider">A-Race</span>
                </div>
              </div>
            ) : (
              <EmptyState 
                compact
                icon={<Target size={20} className="text-muted-foreground" />}
                title="No Events"
                description="No upcoming competitions."
                className="bg-white/5 border-none mt-4"
              />
            )}
          </motion.div>

          {/* Performance Trend Placeholder */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="glass rounded-[2rem] p-6 hover:-translate-y-1 transition-transform duration-300 shadow-xl border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold tracking-tight">Load Trend</h2>
              <Activity size={18} className="text-muted-foreground" />
            </div>
            
            <EmptyState 
              compact
              icon={<Activity size={20} className="text-muted-foreground" />}
              title="No Data"
              description="No recent activity logged."
              className="bg-white/5 border-none"
            />
          </motion.div>

          {/* Support Team */}
          <MyTeamWidget />

        </div>
      </div>
    </div>
  );
}
