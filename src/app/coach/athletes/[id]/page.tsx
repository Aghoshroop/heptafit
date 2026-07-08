"use client";

import { useEffect, useState } from "react";
import { doc, collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams } from "next/navigation";
import { Activity, Flame, Trophy, TrendingUp, Moon, Droplet, Brain, Clock, ShieldAlert, FileText, CheckCircle2, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function AthleteOverviewPage() {
  const params = useParams();
  const athleteId = params.id as string;
  
  const [athlete, setAthlete] = useState<any>(null);
  const [latestWellness, setLatestWellness] = useState<any>(null);
  const [latestMetrics, setLatestMetrics] = useState<any>(null);
  const [recentNotes, setRecentNotes] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!athleteId) return;
    
    // Subscribe to athlete user doc
    const unsubUser = onSnapshot(doc(db, "users", athleteId), (doc) => {
      if (doc.exists()) setAthlete({ id: doc.id, ...doc.data() });
    });

    // Subscribe to latest wellness
    const qWellness = query(collection(db, "users", athleteId, "wellness"), orderBy("createdAt", "desc"), limit(1));
    const unsubWellness = onSnapshot(qWellness, (snap) => {
      if (!snap.empty) {
        const item = snap.docs[0].data();
        item.date = item.createdAt?.toDate?.() || new Date();
        setLatestWellness(item);
      } else {
        setLatestWellness(null);
      }
    });

    // Subscribe to latest metrics
    const qMetrics = query(collection(db, "users", athleteId, "metrics"), orderBy("createdAt", "desc"), limit(1));
    const unsubMetrics = onSnapshot(qMetrics, (snap) => {
      if (!snap.empty) setLatestMetrics(snap.docs[0].data());
      else setLatestMetrics(null);
    });

    // Subscribe to recent notes
    const qNotes = query(collection(db, "users", athleteId, "coach_notes"), orderBy("createdAt", "desc"), limit(2));
    const unsubNotes = onSnapshot(qNotes, (snap) => {
      setRecentNotes(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Subscribe to recent activities (Timeline)
    const qActivities = query(collection(db, "users", athleteId, "activities"), orderBy("createdAt", "desc"), limit(4));
    const unsubActivities = onSnapshot(qActivities, (snap) => {
      setRecentActivities(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => {
      unsubUser();
      unsubWellness();
      unsubMetrics();
      unsubNotes();
      unsubActivities();
    };
  }, [athleteId]);

  if (loading) {
    return <div className="flex justify-center p-12"><div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" /></div>;
  }

  // Determine readiness status text
  const getReadinessText = (score: number) => {
    if (score >= 80) return "Prime to Perform";
    if (score >= 60) return "Proceed with Caution";
    return "Prioritize Recovery";
  };
  const getReadinessColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-2xl font-bold">Command Center</h2>
          <p className="text-muted-foreground text-sm">Real-time overview of athlete performance and status.</p>
        </div>
      </div>
      
      {/* Top Priority Grid - 6 Items */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card glass className="border-white/5">
          <CardContent className="p-4 relative overflow-hidden group">
            <div className="flex flex-col h-full justify-between">
              <div className="flex items-center gap-1.5 mb-1">
                <div className={`w-2 h-2 rounded-full ${athlete?.status === 'Injured' ? 'bg-red-500' : athlete?.status === 'Rehabilitation' ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`}></div>
                <h3 className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Status</h3>
              </div>
              <p className="text-lg font-black">{athlete?.status || 'Active'}</p>
            </div>
          </CardContent>
        </Card>

        <Card glass className="border-white/5">
          <CardContent className="p-4 relative overflow-hidden group">
            <div className="flex flex-col h-full justify-between">
              <div className="flex items-center gap-1.5 mb-1">
                <Flame size={12} className="text-amber-500" />
                <h3 className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Readiness</h3>
              </div>
              {latestWellness ? (
                <p className={`text-xl font-black ${getReadinessColor(latestWellness.readinessScore)}`}>
                  {latestWellness.readinessScore}/100
                </p>
              ) : (
                <p className="text-xl font-black text-muted-foreground">--</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card glass className="border-white/5">
          <CardContent className="p-4 relative overflow-hidden group">
            <div className="flex flex-col h-full justify-between">
              <div className="flex items-center gap-1.5 mb-1">
                <Activity size={12} className="text-blue-500" />
                <h3 className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Phase</h3>
              </div>
              <p className="text-lg font-black truncate">{athlete?.competitionPhase || 'Off Season'}</p>
            </div>
          </CardContent>
        </Card>

        <Card glass className="border-white/5">
          <CardContent className="p-4 relative overflow-hidden group">
            <div className="flex flex-col h-full justify-between">
              <div className="flex items-center gap-1.5 mb-1">
                <Trophy size={12} className="text-purple-500" />
                <h3 className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Countdown</h3>
              </div>
              <p className="text-lg font-black">12 Days</p>
            </div>
          </CardContent>
        </Card>

        <Card glass className="border-white/5">
          <CardContent className="p-4 relative overflow-hidden group">
            <div className="flex flex-col h-full justify-between">
              <div className="flex items-center gap-1.5 mb-1">
                <CheckCircle2 size={12} className="text-emerald-400" />
                <h3 className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Attendance</h3>
              </div>
              <p className="text-lg font-black">94%</p>
            </div>
          </CardContent>
        </Card>

        <Card glass className="border-white/5">
          <CardContent className="p-4 relative overflow-hidden group">
            <div className="flex flex-col h-full justify-between">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp size={12} className="text-indigo-400" />
                <h3 className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Load</h3>
              </div>
              <p className="text-lg font-black">1.1 <span className="text-xs text-muted-foreground font-normal">A:C</span></p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* Main Column (Left) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Insights & Wellness */}
          <Card glass className="border-white/5">
            <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-bold text-sm">Today's Readiness</h3>
              <Link href={`/coach/athletes/${athleteId}/wellness`} className="text-[10px] uppercase font-bold text-blue-400 hover:underline tracking-wider">View Details</Link>
            </div>
            <CardContent className="p-6">
              {latestWellness ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className={`text-4xl font-black leading-none ${getReadinessColor(latestWellness.readinessScore)}`}>
                        {latestWellness.readinessScore}
                      </span>
                      <span className="text-sm font-bold text-muted-foreground">/ 100</span>
                    </div>
                    <p className="font-bold mb-3">{getReadinessText(latestWellness.readinessScore)}</p>
                    
                    <div className="bg-background/50 border border-white/5 rounded-lg p-3 text-xs text-muted-foreground leading-relaxed flex gap-2">
                      <ShieldAlert size={14} className="text-amber-500 shrink-0 mt-0.5" />
                      <p>{latestWellness.insights || "No specific insights generated for today."}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                      <span className="text-muted-foreground flex items-center gap-1.5"><Moon size={12}/> Sleep</span>
                      <span className="font-bold">{latestWellness.sleepHours}h ({latestWellness.sleepQuality}/10)</span>
                    </div>
                    <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                      <span className="text-muted-foreground flex items-center gap-1.5"><Activity size={12}/> Soreness</span>
                      <span className="font-bold text-amber-500">{latestWellness.muscleSoreness}/10</span>
                    </div>
                    <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                      <span className="text-muted-foreground flex items-center gap-1.5"><Droplet size={12}/> Hydration</span>
                      <span className="font-bold">{latestWellness.hydration}/10</span>
                    </div>
                    <div className="flex justify-between items-center text-xs pb-1">
                      <span className="text-muted-foreground flex items-center gap-1.5"><Brain size={12}/> Stress</span>
                      <span className="font-bold">{latestWellness.stress}/10</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  <p>No wellness data logged today.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Coach Notes & Priority */}
          <Card glass className="border-white/5">
            <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-bold text-sm">Recent Assessments</h3>
              <Link href={`/coach/athletes/${athleteId}/coach-notes`} className="text-[10px] uppercase font-bold text-blue-400 hover:underline tracking-wider">Feed</Link>
            </div>
            <CardContent className="p-4 sm:p-6">
              {recentNotes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentNotes.map((note) => (
                    <div key={note.id} className={`p-4 rounded-xl border ${note.isPinned ? "bg-amber-500/5 border-amber-500/20 shadow-[0_0_15px_-3px_rgba(245,158,11,0.1)]" : "bg-background/50 border-white/5"}`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                          note.category === 'medical' ? 'bg-rose-500/20 text-rose-500' :
                          note.category === 'tactical' ? 'bg-blue-500/20 text-blue-500' :
                          note.category === 'technical' ? 'bg-indigo-500/20 text-indigo-500' :
                          'bg-slate-500/20 text-slate-400'
                        }`}>
                          {note.category}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {note.createdAt?.toDate?.().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div 
                        className="prose prose-invert text-xs max-w-none prose-p:leading-snug line-clamp-3 text-foreground/90 mt-2"
                        dangerouslySetInnerHTML={{ __html: note.content }}
                      />
                      {note.attachments && note.attachments.length > 0 && (
                        <div className="mt-3 flex items-center gap-1 text-[10px] text-blue-400 font-bold">
                          <FileText size={10} /> {note.attachments.length} Attachment(s)
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <p>No assessments have been added yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar Column (Right) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Latest Metrics summary */}
          <Card glass className="border-white/5">
            <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-bold text-sm">Body Composition</h3>
              <Link href={`/coach/athletes/${athleteId}/metrics`} className="text-[10px] uppercase font-bold text-blue-400 hover:underline tracking-wider">Metrics</Link>
            </div>
            <CardContent className="p-4">
              {latestMetrics ? (
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-background/50 border border-white/5 rounded-lg p-2.5">
                    <p className="text-[9px] uppercase font-bold text-muted-foreground mb-0.5">Weight</p>
                    <p className="text-lg font-bold">{latestMetrics.weight} <span className="text-[10px] font-normal text-muted-foreground">kg</span></p>
                  </div>
                  <div className="bg-background/50 border border-white/5 rounded-lg p-2.5">
                    <p className="text-[9px] uppercase font-bold text-muted-foreground mb-0.5">Body Fat</p>
                    <p className="text-lg font-bold">{latestMetrics.bodyFatPercentage || '--'} <span className="text-[10px] font-normal text-muted-foreground">%</span></p>
                  </div>
                  <div className="bg-background/50 border border-white/5 rounded-lg p-2.5">
                    <p className="text-[9px] uppercase font-bold text-muted-foreground mb-0.5">LBM</p>
                    <p className="text-lg font-bold">{latestMetrics.leanBodyMass || '--'} <span className="text-[10px] font-normal text-muted-foreground">kg</span></p>
                  </div>
                  <div className="bg-background/50 border border-white/5 rounded-lg p-2.5">
                    <p className="text-[9px] uppercase font-bold text-muted-foreground mb-0.5">RHR</p>
                    <p className="text-lg font-bold">{latestMetrics.restingHR || '--'} <span className="text-[10px] font-normal text-muted-foreground">bpm</span></p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground text-xs">
                  <p>No metrics available.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity (Timeline Mini) */}
          <Card glass className="border-white/5">
            <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-bold text-sm">Recent Activity</h3>
              <Link href={`/coach/athletes/${athleteId}/timeline`} className="text-[10px] uppercase font-bold text-blue-400 hover:underline tracking-wider">Timeline</Link>
            </div>
            <CardContent className="p-4">
              {recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((act) => {
                    const date = act.createdAt?.toDate?.() || new Date();
                    return (
                      <div key={act.id} className="flex gap-3 items-start">
                        <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                          {act.type.includes('wellness') ? <Heart size={10} className="text-emerald-500"/> :
                           act.type.includes('metrics') ? <Activity size={10} className="text-blue-500"/> :
                           act.type.includes('note') ? <FileText size={10} className="text-amber-500"/> :
                           <Clock size={10} className="text-muted-foreground"/>}
                        </div>
                        <div>
                          <p className="text-xs font-bold leading-none mb-1">{act.title}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {date.toLocaleDateString(undefined, {month:'short', day:'numeric'})} at {date.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground text-xs">
                  <p>No recent activity.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Goals Progress Placeholder */}
          <Card glass className="border-white/5">
            <div className="bg-white/5 px-4 py-3 border-b border-white/5">
              <h3 className="font-bold text-sm">Goals Progress</h3>
            </div>
            <CardContent className="p-4 text-center text-muted-foreground text-xs">
              <p className="py-4">Goals module not yet configured.</p>
            </CardContent>
          </Card>
          
        </div>
      </div>
    </div>
  );
}
