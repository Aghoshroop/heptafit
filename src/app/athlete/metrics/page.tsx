"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

export default function BodyMetricsPage() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (!user) return;
    
    const q = query(
      collection(db, "athletes", user.uid, "metrics"),
      orderBy("date", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        formattedDate: doc.data().date?.toDate ? format(doc.data().date.toDate(), 'MMM dd') : 'Unknown'
      }));
      setMetrics(data);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const onSubmit = async (data: any) => {
    if (!user) return;
    setIsSaving(true);
    try {
      // Clean data
      const payload = {
        date: serverTimestamp(),
        weight: Number(data.weight) || null,
        bodyFat: Number(data.bodyFat) || null,
        muscleMass: Number(data.muscleMass) || null,
        bmi: Number(data.bmi) || null,
        restingHR: Number(data.restingHR) || null,
        bloodPressure: data.bloodPressure || null,
        sleepHours: Number(data.sleepHours) || null,
        hydration: Number(data.hydration) || null,
        recoveryScore: Number(data.recoveryScore) || null,
      };

      await addDoc(collection(db, "athletes", user.uid, "metrics"), payload);
      toast.success("Metrics logged successfully!");
      reset();
    } catch (error) {
      console.error(error);
      toast.error("Failed to log metrics.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[400px] w-full rounded-xl" />
        <Skeleton className="h-[300px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Body Metrics</h1>
        <p className="text-muted-foreground mt-1">Track your daily body stats and recovery.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Log Form */}
        <Card glass className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Log Today</CardTitle>
            <CardDescription>Enter your morning measurements.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Weight (kg)</label>
                  <Input type="number" step="0.1" {...register("weight")} placeholder="75.5" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Body Fat (%)</label>
                  <Input type="number" step="0.1" {...register("bodyFat")} placeholder="12.5" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sleep (hrs)</label>
                  <Input type="number" step="0.5" {...register("sleepHours")} placeholder="8" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Resting HR</label>
                  <Input type="number" {...register("restingHR")} placeholder="55" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hydration (L)</label>
                  <Input type="number" step="0.1" {...register("hydration")} placeholder="3.5" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Recovery (0-100)</label>
                  <Input type="number" {...register("recoveryScore")} placeholder="90" />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">Blood Pressure</label>
                  <Input {...register("bloodPressure")} placeholder="120/80" />
                </div>
              </div>
              <Button type="submit" className="w-full mt-4" disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                Log Metrics
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="lg:col-span-2 space-y-8">
          <Card glass>
            <CardHeader>
              <CardTitle>Weight Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {metrics.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="formattedDate" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                    <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">No data yet.</div>
              )}
            </CardContent>
          </Card>

          <Card glass>
            <CardHeader>
              <CardTitle>Recovery & Sleep</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {metrics.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="formattedDate" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[0, 12]} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                    <Line yAxisId="left" type="monotone" dataKey="recoveryScore" name="Recovery" stroke="#10b981" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="sleepHours" name="Sleep" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">No data yet.</div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
