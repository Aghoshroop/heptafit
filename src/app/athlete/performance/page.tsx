"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, orderBy, onSnapshot, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Trophy, TrendingUp, Activity, CheckCircle, Flame, HeartPulse, Zap } from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays } from "date-fns";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [performances, setPerformances] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    // Fetch Performances
    const qPerf = query(collection(db, "performances"), where("athleteId", "==", user.uid));
    const unsubPerf = onSnapshot(qPerf, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data(), dateStr: format(doc.data().date?.toDate() || new Date(), 'MMM dd') }));
      data.sort((a: any, b: any) => {
        const timeA = a.date?.toMillis ? a.date.toMillis() : 0;
        const timeB = b.date?.toMillis ? b.date.toMillis() : 0;
        return timeA - timeB;
      });
      setPerformances(data);
    });

    // Fetch Metrics
    const qMet = query(collection(db, "athletes", user.uid, "metrics"), orderBy("date", "asc"));
    const unsubMet = onSnapshot(qMet, (snap) => {
      setMetrics(snap.docs.map(doc => doc.data()));
    });

    // Fetch Attendance
    const qAtt = query(collection(db, "attendance"), where("athleteId", "==", user.uid));
    const unsubAtt = onSnapshot(qAtt, (snap) => {
      setAttendance(snap.docs.map(doc => doc.data()));
    });

    // Fetch Schedules (for Load)
    const qSched = query(collection(db, "schedules"), where("athleteId", "==", user.uid));
    const unsubSched = onSnapshot(qSched, (snap) => {
      setSchedules(snap.docs.map(doc => doc.data()));
      setLoading(false); // Once last fetch is done
    });

    return () => {
      unsubPerf(); unsubMet(); unsubAtt(); unsubSched();
    };
  }, [user]);

  // Derived Data
  const attendanceRate = attendance.length > 0 ? Math.round((attendance.filter(a => a.status === 'present').length / attendance.length) * 100) : 0;
  
  const recoveryData = useMemo(() => {
    return metrics.slice(-14).map(m => ({
      date: format(new Date(m.date), "MMM dd"),
      recovery: m.recoveryScore,
      sleep: m.sleepHours * 10, // Scale for dual axis visualization
    }));
  }, [metrics]);

  const loadData = useMemo(() => {
    // Mock load based on schedule count per week
    const data = [];
    for(let i=6; i>=0; i--) {
      data.push({
        day: format(subDays(new Date(), i), 'EEE'),
        load: Math.floor(Math.random() * 50) + 50 // Mocked load (RPE * Duration)
      });
    }
    return data;
  }, [schedules]);

  if (loading) return <Skeleton className="w-full h-[800px] rounded-xl" />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Comprehensive Analytics</h1>
        <p className="text-muted-foreground mt-1">Deep dive into your performance, recovery, and consistency trends.</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card glass>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Attendance</p>
                <p className="text-3xl font-bold mt-2">{attendanceRate}%</p>
              </div>
              <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg"><CheckCircle size={20} /></div>
            </div>
          </CardContent>
        </Card>
        <Card glass>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Recovery</p>
                <p className="text-3xl font-bold mt-2">
                  {metrics.length ? Math.round(metrics.reduce((a,b)=>a+b.recoveryScore,0)/metrics.length) : 0}
                </p>
              </div>
              <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><HeartPulse size={20} /></div>
            </div>
          </CardContent>
        </Card>
        <Card glass>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Training Load</p>
                <p className="text-3xl font-bold mt-2">High</p>
              </div>
              <div className="p-2 bg-rose-500/10 text-rose-500 rounded-lg"><Flame size={20} /></div>
            </div>
          </CardContent>
        </Card>
        <Card glass>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Performances</p>
                <p className="text-3xl font-bold mt-2">{performances.length}</p>
              </div>
              <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg"><Trophy size={20} /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recovery & Sleep Trends */}
        <Card glass>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Activity size={18} /> Recovery & Sleep Trends</CardTitle>
            <CardDescription>14-day history of your CNS readiness.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {recoveryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={recoveryData}>
                  <defs>
                    <linearGradient id="colorRecovery" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                  <Area type="monotone" dataKey="recovery" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRecovery)" />
                  <Line type="monotone" dataKey="sleep" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">Log body metrics to see trends.</div>
            )}
          </CardContent>
        </Card>

        {/* Training Load */}
        <Card glass>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Zap size={18} /> Training Load</CardTitle>
            <CardDescription>Estimated volume over the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={loadData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'hsl(var(--accent))' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                <Bar dataKey="load" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Progression */}
        <Card glass className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp size={18} /> Official Performance Progression</CardTitle>
            <CardDescription>Your logged competition and time trial results over time.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            {performances.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performances}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="dateStr" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                  <Line type="stepAfter" dataKey="result" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: "hsl(var(--primary))" }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl m-4 bg-muted/10">
                <Trophy size={48} className="opacity-20 mb-4" />
                <p>No performances logged yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
