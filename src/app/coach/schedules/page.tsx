"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, onSnapshot, addDoc, getDocs, serverTimestamp, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Calendar } from "@/components/Calendar";
import { Skeleton } from "@/components/ui/Skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, Upload, FileSpreadsheet, Plus, X } from "lucide-react";
import { toast } from "sonner";
import Papa from "papaparse";

export default function CoachSchedulesPage() {
  const { user, userData } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [athletes, setAthletes] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);

  // Advanced Builder State
  const [selectedAthleteId, setSelectedAthleteId] = useState("");
  const [planDate, setPlanDate] = useState("");
  const [planTitle, setPlanTitle] = useState("");
  const [planType, setPlanType] = useState("Training");
  const [warmup, setWarmup] = useState("");
  const [mainSession, setMainSession] = useState("");
  const [gym, setGym] = useState("");
  const [conditioning, setConditioning] = useState("");
  const [recovery, setRecovery] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!user || !userData?.organizationId) return;
    
    const q = query(collection(db, "schedules"), where("organizationId", "==", userData.organizationId));
    const unsubscribeSchedules = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate ? doc.data().date.toDate() : new Date(doc.data().date)
      }));
      setEvents(data);
      setLoading(false);
    });

    const fetchAllUsers = async () => {
      const qUsers = query(collection(db, "users"), where("organizationId", "==", userData.organizationId), where("role", "==", "student"));
      const snap = await getDocs(qUsers);
      setAthletes(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchAllUsers();

    return () => unsubscribeSchedules();
  }, [user, userData?.organizationId]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const rows = results.data as any[];
          let successCount = 0;
          let failCount = 0;

          for (const row of rows) {
            const email = row.email?.trim().toLowerCase();
            const athlete = athletes.find(a => a.email?.toLowerCase() === email);
            
            if (athlete) {
              await addDoc(collection(db, "schedules"), {
                athleteId: athlete.id,
                athleteName: `${athlete.firstName} ${athlete.lastName}`,
                title: row.title,
                type: row.type || 'Training',
                date: new Date(row.date),
                content: row.content || "",
                assignedBy: user?.uid
              });
              
              await addDoc(collection(db, "notifications"), {
                userId: athlete.id,
                title: "New Schedule Added",
                message: `You have a new ${row.type || 'Training'} scheduled on ${row.date}.`,
                isRead: false,
                createdAt: serverTimestamp()
              });
              successCount++;
            } else {
              failCount++;
            }
          }
          toast.success(`Successfully added ${successCount} schedules. ${failCount} failed.`);
        } catch (error) {
          toast.error("Failed to process CSV file.");
        } finally {
          setIsUploading(false);
          if (e.target) e.target.value = '';
        }
      },
    });
  };

  const handleBuildPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAthleteId || !planDate || !planTitle || !userData?.organizationId) {
      toast.error("Please fill required fields and ensure you are in an organization.");
      return;
    }

    const athlete = athletes.find(a => a.id === selectedAthleteId);
    
    try {
      await addDoc(collection(db, "training_plans"), {
        organizationId: userData.organizationId,
        coachId: user?.uid,
        athleteId: selectedAthleteId,
        athleteName: `${athlete?.firstName} ${athlete?.lastName}`,
        title: planTitle,
        type: planType,
        date: new Date(planDate),
        warmup,
        mainSession,
        gym,
        conditioning,
        recovery,
        notes,
        assignedBy: user?.uid,
        createdAt: serverTimestamp()
      });

      // Also add to schedules for calendar rendering
      await addDoc(collection(db, "schedules"), {
        organizationId: userData.organizationId,
        coachId: user?.uid,
        athleteId: selectedAthleteId,
        athleteName: `${athlete?.firstName} ${athlete?.lastName}`,
        title: planTitle,
        type: planType,
        date: new Date(planDate),
        content: mainSession || notes,
        isAdvancedPlan: true,
        assignedBy: user?.uid
      });

      await addDoc(collection(db, "notifications"), {
        userId: selectedAthleteId,
        title: "Advanced Training Plan Assigned",
        message: `A detailed training plan for ${planDate} has been created for you.`,
        isRead: false,
        createdAt: serverTimestamp()
      });

      toast.success("Training plan saved successfully!");
      setShowBuilder(false);
      // Reset fields
      setPlanTitle(""); setWarmup(""); setMainSession(""); setGym(""); setConditioning(""); setRecovery(""); setNotes("");
    } catch (err) {
      toast.error("Failed to save plan.");
    }
  };

  if (loading) return <Skeleton className="w-full h-[800px] rounded-xl" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Schedule & Planner</h1>
          <p className="text-muted-foreground mt-1">Manage training blocks and bulk upload schedules.</p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={() => setShowBuilder(!showBuilder)} variant={showBuilder ? "secondary" : "default"}>
            {showBuilder ? <><X className="mr-2 h-4 w-4" /> Close Builder</> : <><Plus className="mr-2 h-4 w-4" /> Advanced Planner</>}
          </Button>

          <label className="cursor-pointer">
            <Button variant="outline" asChild disabled={isUploading}>
              <span>
                {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileSpreadsheet className="mr-2 h-4 w-4" />}
                CSV Upload
              </span>
            </Button>
            <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
          </label>
        </div>
      </div>

      {showBuilder && (
        <Card glass className="border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle>Advanced Training Planner</CardTitle>
            <CardDescription>Build a comprehensive block for a specific athlete.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBuildPlan} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-border/50 pb-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Athlete *</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedAthleteId}
                    onChange={e => setSelectedAthleteId(e.target.value)}
                    required
                  >
                    <option value="">-- Choose Athlete --</option>
                    {athletes.map(a => (
                      <option key={a.id} value={a.id}>{a.firstName} {a.lastName}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date *</label>
                  <Input type="date" value={planDate} onChange={e => setPlanDate(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Session Title *</label>
                  <Input value={planTitle} onChange={e => setPlanTitle(e.target.value)} placeholder="e.g. Max Velocity Block" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-emerald-500">Warm-up</label>
                  <Input value={warmup} onChange={e => setWarmup(e.target.value)} placeholder="Activation, dynamic drills..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">Main Session</label>
                  <Input value={mainSession} onChange={e => setMainSession(e.target.value)} placeholder="Track/Field work..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-rose-500">Gym / Strength</label>
                  <Input value={gym} onChange={e => setGym(e.target.value)} placeholder="Weights, plyos..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-amber-500">Conditioning / Anaerobic</label>
                  <Input value={conditioning} onChange={e => setConditioning(e.target.value)} placeholder="Tempo, core..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-blue-500">Recovery</label>
                  <Input value={recovery} onChange={e => setRecovery(e.target.value)} placeholder="Stretching, ice bath..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Additional Notes</label>
                  <Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Focus cues..." />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" size="lg">Save Training Plan</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Calendar 
        events={events} 
        onEventClick={(event) => alert(`Event: ${event.title}\nAthlete: ${event.athleteName}\nType: ${event.type}\nDetails: ${event.content || 'Detailed Plan'}`)}
      />
      
    </div>
  );
}
