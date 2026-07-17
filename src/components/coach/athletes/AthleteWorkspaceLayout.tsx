"use client";

import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, User, Activity, Heart, Ruler, Calendar, ClipboardList, Settings, Mail, FileText, Video, CalendarDays, TrendingUp, ShieldAlert, Coffee, Trophy } from "lucide-react";
import { StatusChip } from "@/components/ui/StatusChip";
import { useAthleteWorkspaceMetrics } from "@/lib/hooks/useCoachDashboardMetrics";

const TABS = [
  { name: "Overview", path: "", icon: User },
  { name: "Athlete Card", path: "personal", icon: FileText },
  { name: "Medical", path: "medical", icon: Heart },
  { name: "Body Metrics", path: "metrics", icon: Ruler },
  { name: "Daily Wellness", path: "wellness", icon: Coffee },
  { name: "Performance", path: "performance", icon: TrendingUp },
  { name: "Training", path: "training", icon: Activity },
  { name: "Competitions", path: "competitions", icon: Trophy },
  { name: "Attendance", path: "attendance", icon: CalendarDays },
  { name: "Coach Notes", path: "coach-notes", icon: ClipboardList },
  { name: "Injuries", path: "injuries", icon: ShieldAlert },
  { name: "Documents", path: "documents", icon: FileText },
  { name: "Videos", path: "videos", icon: Video },
  { name: "Reports", path: "reports", icon: FileText },
  { name: "Timeline", path: "timeline", icon: Activity }
];

export function AthleteWorkspaceLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const athleteId = params.id as string;
  
  const [athlete, setAthlete] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { status, readiness } = useAthleteWorkspaceMetrics(athleteId);

  useEffect(() => {
    if (!athleteId) return;
    
    const unsubscribe = onSnapshot(doc(db, "users", athleteId), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setAthlete({
          uid: snapshot.id,
          ...data
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [athleteId]);

  if (loading) {
    return <div className="flex justify-center p-12"><div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" /></div>;
  }

  if (!athlete) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Athlete not found</h2>
        <Button asChild variant="outline">
          <Link href="/coach/athletes">Return to Roster</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center gap-2 mb-4">
        <Link href="/coach/athletes" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 text-sm font-medium">
          <ArrowLeft size={16} />
          Back to Roster
        </Link>
      </div>

      {/* Athlete Header Card */}
      <Card glass className="border-white/5 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
        </div>
        <CardContent className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-12">
            <div className="flex items-end gap-6">
              <div className="w-24 h-24 rounded-2xl bg-card border-4 border-background shadow-2xl flex items-center justify-center relative z-10 overflow-hidden">
                {athlete.photoURL || athlete.profilePhotoUrl ? (
                  <img src={athlete.photoURL || athlete.profilePhotoUrl} alt="Athlete" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-foreground text-3xl font-black">
                    {athlete.firstName?.[0] || 'A'}{athlete.lastName?.[0]}
                  </div>
                )}
              </div>
              
              <div className="mb-2">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl font-black">{athlete.firstName} {athlete.lastName}</h1>
                  <StatusChip status={status === "Active" ? "active" : status === "Injured" ? "danger" : status === "Restricted" ? "warning" : "neutral"}>
                    {status}
                  </StatusChip>
                </div>
                <p className="text-muted-foreground text-sm font-medium">
                  {athlete.sport || "General Athletics"} {athlete.competitionCategory ? `• ${athlete.competitionCategory}` : ""}
                  <span className="mx-2 opacity-50">|</span>
                  ID: <span className="font-mono">{athlete.athleteNumber || "No ID"}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-2 justify-start md:justify-end">
              <div className="bg-background/50 border border-white/5 rounded-xl p-2.5 text-center min-w-[90px]">
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-bold mb-0.5">Readiness</p>
                <p className={`text-sm font-black ${readiness && readiness >= 80 ? 'text-emerald-500' : readiness && readiness >= 70 ? 'text-blue-500' : readiness ? 'text-amber-500' : 'text-muted-foreground'}`}>
                  {readiness !== null ? `${readiness}%` : '--'}
                </p>
              </div>
              <div className="bg-background/50 border border-white/5 rounded-xl p-2.5 text-center min-w-[90px]">
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-bold mb-0.5">Attendance</p>
                <p className="text-sm font-bold text-muted-foreground text-[11px] leading-tight mt-1">No Attendance<br/>Data</p>
              </div>
              <div className="bg-background/50 border border-white/5 rounded-xl p-2.5 text-center min-w-[90px]">
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-bold mb-0.5">Phase</p>
                <p className="text-sm font-black text-blue-400">{athlete.competitionPhase || "--"}</p>
              </div>
              <div className="bg-background/50 border border-white/5 rounded-xl p-2.5 text-center min-w-[90px]">
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-bold mb-0.5">Current Plan</p>
                <p className="text-sm font-bold text-muted-foreground text-[11px] leading-tight mt-1">No Active<br/>Plan</p>
              </div>
              <div className="bg-background/50 border border-white/5 rounded-xl p-2.5 text-center min-w-[90px]">
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-bold mb-0.5">Next Session</p>
                <p className="text-sm font-bold text-muted-foreground text-[11px] leading-tight mt-1">No Upcoming<br/>Session</p>
              </div>
              <div className="bg-background/50 border border-white/5 rounded-xl p-2.5 text-center min-w-[90px]">
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-bold mb-0.5">Active Injury</p>
                <p className="text-sm font-bold text-muted-foreground text-[11px] leading-tight mt-1">No Injury<br/>Reported</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workspace Tabs */}
      <div className="bg-card/40 border border-white/5 rounded-2xl overflow-hidden glass">
        <div className="flex overflow-x-auto no-scrollbar border-b border-white/5 p-1">
          {TABS.map((tab) => {
            const tabPath = `/coach/athletes/${athleteId}${tab.path ? `/${tab.path}` : ''}`;
            // Exact match for Overview (which is empty string), prefix match for others
            const isActive = tab.path === "" 
              ? pathname === `/coach/athletes/${athleteId}`
              : pathname.startsWith(`/coach/athletes/${athleteId}/${tab.path}`);
              
            const Icon = tab.icon;

            return (
              <Link 
                key={tab.name} 
                href={tabPath}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all rounded-xl relative ${
                  isActive 
                    ? "text-blue-400 bg-blue-500/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <Icon size={16} />
                {tab.name}
              </Link>
            );
          })}
        </div>
        
        {/* Tab Content */}
        <div className="p-6 min-h-[400px]">
          {children}
        </div>
      </div>
    </div>
  );
}
