"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { collection, query, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Trash2, Activity, TrendingUp, TrendingDown, Minus, Filter } from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { addBodyMetric } from "@/lib/services/metrics.service";
import { BodyMetric } from "@/lib/types";

const metricsSchema = z.object({
  weight: z.string().min(1, "Weight is required"),
  bodyFatPercentage: z.string().optional(),
  muscleMass: z.string().optional(),
  boneMass: z.string().optional(),
  leanBodyMass: z.string().optional(),
  skeletalMuscle: z.string().optional(),
  
  restingHeartRate: z.string().optional(),
  bloodPressureSys: z.string().optional(),
  bloodPressureDia: z.string().optional(),
  oxygenSaturation: z.string().optional(),
  bodyTemperature: z.string().optional(),

  measurements: z.object({
    waist: z.string().optional(),
    hip: z.string().optional(),
    chest: z.string().optional(),
    arm: z.string().optional(),
    thigh: z.string().optional(),
    calf: z.string().optional(),
  }).optional()
});

type MetricsFormValues = z.infer<typeof metricsSchema>;

export default function BodyMetricsPage() {
  const params = useParams();
  const athleteId = params.id as string;
  const { userData } = useAuth();
  
  const [items, setItems] = useState<BodyMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [athleteHeight, setAthleteHeight] = useState<number | null>(null);
  const [timeRange, setTimeRange] = useState<"all" | "month">("all");

  const form = useForm<MetricsFormValues>({
    resolver: zodResolver(metricsSchema),
    defaultValues: {
      weight: "", bodyFatPercentage: "", muscleMass: "", boneMass: "", leanBodyMass: "", skeletalMuscle: "",
      restingHeartRate: "", bloodPressureSys: "", bloodPressureDia: "", oxygenSaturation: "", bodyTemperature: "",
      measurements: { waist: "", hip: "", chest: "", arm: "", thigh: "", calf: "" }
    }
  });

  useEffect(() => {
    if (!athleteId) return;

    const unsubUser = onSnapshot(doc(db, "users", athleteId), (doc) => {
      if (doc.exists() && doc.data().height) {
        setAthleteHeight(parseFloat(doc.data().height));
      }
    });

    const q = query(
      collection(db, "bodyMetrics"),
      where("athleteId", "==", athleteId),
      orderBy("date", "asc")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const item = doc.data() as BodyMetric;
        const dateObj = item.date?.toDate?.() || new Date();
        return { 
          ...item,
          id: doc.id,
          dateObj,
          formattedDate: dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          timestamp: dateObj.getTime()
        };
      });
      setItems(data as any);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      unsubUser();
    };
  }, [athleteId]);

  const onSubmit = async (data: MetricsFormValues) => {
    setSaving(true);
    try {
      if (!userData?.organizationId || !userData?.uid) {
        throw new Error("Missing user context");
      }
      
      const payload: Partial<BodyMetric> = {
        date: new Date() as any,
        weight: parseFloat(data.weight),
        bodyFatPercentage: data.bodyFatPercentage ? parseFloat(data.bodyFatPercentage) : undefined,
        muscleMass: data.muscleMass ? parseFloat(data.muscleMass) : undefined,
        boneMass: data.boneMass ? parseFloat(data.boneMass) : undefined,
        leanBodyMass: data.leanBodyMass ? parseFloat(data.leanBodyMass) : undefined,
        
        restingHeartRate: data.restingHeartRate ? parseInt(data.restingHeartRate) : undefined,
        bloodPressureSys: data.bloodPressureSys ? parseInt(data.bloodPressureSys) : undefined,
        bloodPressureDia: data.bloodPressureDia ? parseInt(data.bloodPressureDia) : undefined,
        oxygenSaturation: data.oxygenSaturation ? parseFloat(data.oxygenSaturation) : undefined,
        bodyTemperature: data.bodyTemperature ? parseFloat(data.bodyTemperature) : undefined,
        
        waist: data.measurements?.waist ? parseFloat(data.measurements.waist) : undefined,
        chest: data.measurements?.chest ? parseFloat(data.measurements.chest) : undefined,
        arm: data.measurements?.arm ? parseFloat(data.measurements.arm) : undefined,
        thigh: data.measurements?.thigh ? parseFloat(data.measurements.thigh) : undefined,
        calf: data.measurements?.calf ? parseFloat(data.measurements.calf) : undefined,
      };

      const headCoachId = userData.accountType === "head_coach" ? userData.uid : userData.organizationId;
      
      await addBodyMetric(
        athleteId,
        userData.organizationId,
        headCoachId,
        payload,
        athleteHeight,
        userData.uid,
        `${userData.firstName} ${userData.lastName}`
      );
      
      form.reset();
      toast.success("Metrics logged successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to log metrics");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this log?")) {
      await deleteDoc(doc(db, "bodyMetrics", id));
    }
  };

  const chartData = timeRange === "month" 
    ? items.filter((i: any) => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return i.dateObj >= thirtyDaysAgo;
      })
    : items;

  const latestMetrics = items.length > 0 ? items[items.length - 1] : null;
  const previousMetrics = items.length > 1 ? items[items.length - 2] : null;

  const renderTrend = (current: number | undefined, previous: number | undefined, reverseGood = false) => {
    if (current === undefined || previous === undefined) return <Minus size={14} className="text-muted-foreground" />;
    const diff = current - previous;
    if (diff === 0) return <Minus size={14} className="text-muted-foreground" />;
    
    const isGood = reverseGood ? diff < 0 : diff > 0;
    const Icon = diff > 0 ? TrendingUp : TrendingDown;
    const color = isGood ? "text-emerald-500" : "text-amber-500";
    
    return (
      <div className={`flex items-center gap-1 text-xs font-bold ${color}`}>
        <Icon size={14} />
        {Math.abs(diff).toFixed(1)}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Body Metrics</h2>
          <p className="text-muted-foreground">Track physical composition and vital measurements.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card glass className="border-white/5">
          <CardContent className="p-4 flex justify-between items-start">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Weight</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black">{latestMetrics?.weight || '--'}</span>
                <span className="text-[10px] text-muted-foreground">kg</span>
              </div>
            </div>
            {latestMetrics && previousMetrics && renderTrend(latestMetrics.weight, previousMetrics.weight)}
          </CardContent>
        </Card>
        
        <Card glass className="border-white/5">
          <CardContent className="p-4 flex justify-between items-start">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Body Fat</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black">{latestMetrics?.bodyFatPercentage || '--'}</span>
                <span className="text-[10px] text-muted-foreground">%</span>
              </div>
            </div>
            {latestMetrics && previousMetrics && renderTrend(latestMetrics.bodyFatPercentage, previousMetrics.bodyFatPercentage, true)}
          </CardContent>
        </Card>

        <Card glass className="border-white/5">
          <CardContent className="p-4 flex justify-between items-start">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Lean Mass</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black">{latestMetrics?.leanBodyMass || '--'}</span>
                <span className="text-[10px] text-muted-foreground">kg</span>
              </div>
            </div>
            {latestMetrics && previousMetrics && renderTrend(latestMetrics.leanBodyMass, previousMetrics.leanBodyMass)}
          </CardContent>
        </Card>

        <Card glass className="border-white/5">
          <CardContent className="p-4 flex justify-between items-start">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Blood Pressure</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black">{latestMetrics?.bloodPressureSys ? `${latestMetrics.bloodPressureSys}/${latestMetrics.bloodPressureDia}` : '--'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card glass className="border-white/5">
          <CardContent className="p-4 flex justify-between items-start">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">SpO2</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black">{latestMetrics?.oxygenSaturation || '--'}</span>
                <span className="text-[10px] text-muted-foreground">%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card glass className="border-white/5">
          <CardContent className="p-4 flex justify-between items-start">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Resting HR</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black">{latestMetrics?.restingHeartRate || '--'}</span>
                <span className="text-[10px] text-muted-foreground">bpm</span>
              </div>
            </div>
            {latestMetrics && previousMetrics && renderTrend(latestMetrics.restingHeartRate, previousMetrics.restingHeartRate, true)}
          </CardContent>
        </Card>
      </div>

      <Card glass className="border-white/5 overflow-hidden">
        <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex justify-between items-center">
          <h3 className="font-bold text-sm">Composition Trends</h3>
          <div className="flex gap-2">
            <Button size="sm" variant={timeRange === "month" ? "default" : "outline"} onClick={() => setTimeRange("month")} className="h-7 text-xs border-white/10">30 Days</Button>
            <Button size="sm" variant={timeRange === "all" ? "default" : "outline"} onClick={() => setTimeRange("all")} className="h-7 text-xs border-white/10">All Time</Button>
          </div>
        </div>
        <CardContent className="p-6 h-[300px]">
          {loading ? (
            <div className="h-full flex items-center justify-center">Loading chart...</div>
          ) : chartData.length < 2 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <Activity size={32} className="mb-2 opacity-50" />
              <p>Need at least 2 logs to show trends</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="formattedDate" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" stroke="#3b82f6" tick={{ fontSize: 11 }} domain={['dataMin - 1', 'dataMax + 1']} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#10b981" tick={{ fontSize: 11 }} domain={['dataMin - 1', 'dataMax + 1']} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Line yAxisId="left" type="monotone" dataKey="weight" name="Weight (kg)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 3, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" dataKey="bodyFatPercentage" name="Body Fat (%)" stroke="#10b981" strokeWidth={3} dot={{ r: 3, strokeWidth: 0 }} />
                <Line yAxisId="left" type="monotone" dataKey="leanBodyMass" name="Lean Mass (kg)" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 3, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card glass className="border-white/5 xl:col-span-1 h-fit">
          <div className="bg-white/5 px-6 py-4 border-b border-white/5">
            <h3 className="font-bold text-sm">Log Metrics</h3>
          </div>
          <CardContent className="p-5">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">Composition</label>
                <div className="grid grid-cols-2 gap-3">
                  <Input type="number" step="0.1" placeholder="Weight (kg)" {...form.register("weight")} className="bg-background/50 border-white/10 h-8 text-sm" />
                  <Input type="number" step="0.1" placeholder="Body Fat %" {...form.register("bodyFatPercentage")} className="bg-background/50 border-white/10 h-8 text-sm" />
                  <Input type="number" step="0.1" placeholder="Muscle Mass (kg)" {...form.register("muscleMass")} className="bg-background/50 border-white/10 h-8 text-sm" />
                  <Input type="number" step="0.1" placeholder="Lean Mass (kg)" {...form.register("leanBodyMass")} className="bg-background/50 border-white/10 h-8 text-sm" />
                  <Input type="number" step="0.1" placeholder="Bone Mass (kg)" {...form.register("boneMass")} className="bg-background/50 border-white/10 h-8 text-sm" />
                  <Input type="number" step="0.1" placeholder="Skeletal Muscle %" {...form.register("skeletalMuscle")} className="bg-background/50 border-white/10 h-8 text-sm" />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Vitals</label>
                <div className="grid grid-cols-2 gap-3">
                  <Input type="number" placeholder="Resting HR (bpm)" {...form.register("restingHeartRate")} className="bg-background/50 border-white/10 h-8 text-sm" />
                  <Input type="number" step="0.1" placeholder="SpO2 (%)" {...form.register("oxygenSaturation")} className="bg-background/50 border-white/10 h-8 text-sm" />
                  <Input type="number" placeholder="BP Systolic" {...form.register("bloodPressureSys")} className="bg-background/50 border-white/10 h-8 text-sm" />
                  <Input type="number" placeholder="BP Diastolic" {...form.register("bloodPressureDia")} className="bg-background/50 border-white/10 h-8 text-sm" />
                  <Input type="number" step="0.1" placeholder="Temp (°C)" {...form.register("bodyTemperature")} className="bg-background/50 border-white/10 h-8 text-sm" />
                </div>
              </div>
              
              <div className="pt-2 border-t border-white/5">
                <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Measurements (cm)</label>
                <div className="grid grid-cols-3 gap-2">
                  <Input type="number" step="0.5" placeholder="Waist" {...form.register("measurements.waist")} className="bg-background/50 border-white/10 h-8 text-xs" />
                  <Input type="number" step="0.5" placeholder="Chest" {...form.register("measurements.chest")} className="bg-background/50 border-white/10 h-8 text-xs" />
                  <Input type="number" step="0.5" placeholder="Arm" {...form.register("measurements.arm")} className="bg-background/50 border-white/10 h-8 text-xs" />
                  <Input type="number" step="0.5" placeholder="Thigh" {...form.register("measurements.thigh")} className="bg-background/50 border-white/10 h-8 text-xs" />
                  <Input type="number" step="0.5" placeholder="Calf" {...form.register("measurements.calf")} className="bg-background/50 border-white/10 h-8 text-xs" />
                  <Input type="number" step="0.5" placeholder="Hip" {...form.register("measurements.hip")} className="bg-background/50 border-white/10 h-8 text-xs" />
                </div>
              </div>
              
              <Button type="submit" disabled={saving} className="w-full bg-blue-500 hover:bg-blue-600 text-white mt-2">
                {saving ? "Saving..." : "Log Entry"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card glass className="border-white/5 xl:col-span-2 overflow-hidden h-fit">
          <div className="bg-white/5 px-6 py-4 border-b border-white/5">
            <h3 className="font-bold text-sm">History Log</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-[10px] text-muted-foreground uppercase bg-white/5 border-b border-white/5">
                <tr>
                  <th className="px-4 py-3 font-bold">Date</th>
                  <th className="px-4 py-3 font-bold">Weight</th>
                  <th className="px-4 py-3 font-bold">BF %</th>
                  <th className="px-4 py-3 font-bold">LBM</th>
                  <th className="px-4 py-3 font-bold">Vitals</th>
                  <th className="px-4 py-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...items].reverse().map((item: any) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="px-4 py-3 font-medium whitespace-nowrap">{item.formattedDate}</td>
                    <td className="px-4 py-3 font-bold">{item.weight} kg</td>
                    <td className="px-4 py-3">{item.bodyFatPercentage ? `${item.bodyFatPercentage}%` : '--'}</td>
                    <td className="px-4 py-3">{item.leanBodyMass ? `${item.leanBodyMass} kg` : '--'}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {item.restingHeartRate ? `HR: ${item.restingHeartRate} ` : ''}
                      {item.bloodPressureSys ? `BP: ${item.bloodPressureSys}/${item.bloodPressureDia}` : ''}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(item.id)}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all h-6 w-6"
                      >
                        <Trash2 size={12} />
                      </Button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No metrics logged yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
