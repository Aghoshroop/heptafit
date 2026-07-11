"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { collection, query, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { WellnessLog } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/Card";
import { AlertCircle, Activity } from "lucide-react";
export default function WellnessPage() {
  const params = useParams();
  const athleteId = params.id as string;
  const { userData } = useAuth();
  
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!athleteId) return;

    const q = query(
      collection(db, "wellnessLogs"),
      where("athleteId", "==", athleteId),
      orderBy("date", "asc")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const item = doc.data() as WellnessLog;
        const dateObj = item.date?.toDate?.() || new Date();
        return { 
          ...item,
          id: doc.id,
          dateObj,
          formattedDate: dateObj.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' }),
        } as WellnessLog & { dateObj: Date, formattedDate: string };
      });
      setItems(data as any);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [athleteId]);



  // Calculate compliance over last 7 days
  const calculateCompliance = () => {
    if (items.length === 0) return 0;
    
    let daysLogged = 0;
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const targetDate = new Date(now);
      targetDate.setDate(targetDate.getDate() - i);
      const targetDateString = targetDate.toLocaleDateString();
      
      const hasLog = items.some(item => item.dateObj && item.dateObj.toLocaleDateString() === targetDateString);
      if (hasLog) daysLogged++;
    }
    return Math.round((daysLogged / 7) * 100);
  };

  const latestLog = items.length > 0 ? items[items.length - 1] : null;
  const recent7 = items.slice(-7);
  const compliance = calculateCompliance();

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };
  
  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Daily Wellness</h2>
          <p className="text-muted-foreground">Monitor readiness, recovery, and lifestyle factors.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Readiness Ring & Compliance */}
        <div className="md:col-span-4 flex flex-col gap-4">
          <Card glass className="border-white/5 flex flex-col items-center justify-center py-6 relative overflow-hidden flex-1">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-0"></div>
            <div className="relative z-10 text-center w-full px-6">
              <div className="flex justify-between items-center w-full mb-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Latest Score</p>
                {latestLog && (
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">{latestLog.logType}</span>
                )}
              </div>
              
              {latestLog ? (
                <>
                  <div className="relative inline-flex items-center justify-center my-4">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="56" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                      <circle 
                        cx="64" cy="64" r="56" 
                        fill="transparent" 
                        stroke={latestLog.readinessScore >= 80 ? '#10b981' : latestLog.readinessScore >= 60 ? '#f59e0b' : '#ef4444'} 
                        strokeWidth="8" 
                        strokeDasharray={351.85} 
                        strokeDashoffset={351.85 - (351.85 * latestLog.readinessScore) / 100}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className={`text-4xl font-black ${getScoreColor(latestLog.readinessScore)}`}>
                        {latestLog.readinessScore}
                      </span>
                    </div>
                  </div>
                  
                    <div className="text-left bg-background/50 border border-white/5 rounded-xl p-3 text-sm flex flex-col gap-2">
                      <div className="flex items-start gap-2">
                        <AlertCircle size={14} className="text-blue-400 mt-0.5 shrink-0" />
                        <p className="text-muted-foreground leading-snug text-xs">{latestLog.todaysRecommendation || 'No recommendation.'}</p>
                      </div>
                      <div className="flex items-start gap-2 pt-2 border-t border-white/5">
                        <Activity size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                        <p className="text-muted-foreground leading-snug text-xs">{latestLog.recoveryRecommendation || 'No specific recovery needed.'}</p>
                      </div>
                    </div>
                </>
              ) : (
                <div className="w-32 h-32 mx-auto rounded-full border-8 border-white/10 flex items-center justify-center my-4">
                  <span className="text-2xl font-black text-muted-foreground">--</span>
                </div>
              )}
            </div>
          </Card>

          <Card glass className="border-white/5 py-4 px-6 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">7-Day Compliance</p>
              <p className="text-xl font-bold">{compliance}%</p>
            </div>
            <div className="flex gap-1">
              {[6,5,4,3,2,1,0].map(i => {
                const targetDate = new Date();
                targetDate.setDate(targetDate.getDate() - i);
                const hasLog = items.some(item => item.dateObj && item.dateObj.toLocaleDateString() === targetDate.toLocaleDateString());
                return (
                  <div key={i} className={`w-2 h-8 rounded-sm ${hasLog ? 'bg-emerald-500' : 'bg-white/10'}`} title={targetDate.toLocaleDateString()} />
                );
              })}
            </div>
          </Card>
        </div>
        
        {/* Readiness Trend Chart */}
        <Card glass className="border-white/5 md:col-span-8 overflow-hidden h-full flex flex-col">
          <div className="bg-white/5 px-6 py-4 border-b border-white/5">
            <h3 className="font-bold text-sm">Readiness Trend</h3>
          </div>
          <CardContent className="p-6 flex-1 min-h-[200px]">
            {recent7.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={recent7} margin={{ top: 5, right: 0, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="formattedDate" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="readinessScore" name="Readiness" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">Not enough data</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
          <h3 className="font-bold text-sm">Recent Logs</h3>
          <div className="space-y-3">
            {[...items].reverse().map(item => (
              <Card key={item.id} glass className="border-white/5 hover:bg-white/5 transition-colors group">
                <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  
                  <div className="flex items-center gap-4 min-w-[140px]">
                    <div className="text-center w-12 shrink-0">
                      <p className="text-[9px] uppercase font-bold text-muted-foreground">Score</p>
                      <p className={`text-2xl font-black ${getScoreColor(item.readinessScore)} leading-none`}>{item.readinessScore}</p>
                    </div>
                    <div className={`w-1 h-10 rounded-full ${getScoreBg(item.readinessScore)}`}></div>
                    <div>
                      <p className="font-bold text-sm">{item.formattedDate}</p>
                      <p className="text-[10px] uppercase text-muted-foreground font-bold bg-white/5 px-1.5 py-0.5 rounded inline-block mt-1">{item.logType || "Morning"}</p>
                    </div>
                  </div>

                  <div className="flex-1 w-full grid grid-cols-4 md:grid-cols-6 gap-2 text-center text-xs">
                    <div className="bg-background/50 rounded-md py-1 border border-white/5">
                      <span className="block text-[8px] uppercase text-muted-foreground font-bold">Sleep</span>
                      <span className="font-bold">{item.sleepHours}h</span>
                    </div>
                    <div className="bg-background/50 rounded-md py-1 border border-white/5">
                      <span className="block text-[8px] uppercase text-muted-foreground font-bold">Fatigue</span>
                      <span className="font-bold">{item.fatigue}/10</span>
                    </div>
                    <div className="bg-background/50 rounded-md py-1 border border-white/5">
                      <span className="block text-[8px] uppercase text-muted-foreground font-bold">Soreness</span>
                      <span className="font-bold">{item.muscleSoreness}/10</span>
                    </div>
                    <div className="bg-background/50 rounded-md py-1 border border-white/5">
                      <span className="block text-[8px] uppercase text-muted-foreground font-bold">Stress</span>
                      <span className="font-bold">{item.stress}/10</span>
                    </div>
                    <div className="hidden md:block bg-background/50 rounded-md py-1 border border-white/5">
                      <span className="block text-[8px] uppercase text-muted-foreground font-bold">Mood</span>
                      <span className="font-bold">{item.mood}/10</span>
                    </div>
                    <div className="hidden md:block bg-background/50 rounded-md py-1 border border-white/5">
                      <span className="block text-[8px] uppercase text-muted-foreground font-bold">Hydration</span>
                      <span className="font-bold">{item.hydration}/10</span>
                    </div>
                  </div>

                </CardContent>
              </Card>
            ))}
            {items.length === 0 && (
              <div className="bg-background/30 border border-white/5 rounded-xl p-8 text-center">
                <p className="text-muted-foreground text-sm">No wellness logs found.</p>
              </div>
            )}
          </div>
      </div>
    </div>
  );
}
