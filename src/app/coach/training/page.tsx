"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, Search, Activity, Calendar, LayoutDashboard } from "lucide-react";
import { StatusChip } from "@/components/ui/StatusChip";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { useAuth } from "@/context/AuthContext";
import { useCoachData } from "@/lib/hooks/useCoachDashboardMetrics";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/Skeleton";

export default function TrainingPage() {
  const { user, userData } = useAuth();
  const { trainingPlans, loading, athletes } = useCoachData();
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("all");

  const { enrichedPlans, activeCount, currentPhase } = useMemo(() => {
    const macrocycles = trainingPlans.filter((p: any) => p.type === "macrocycle");
    const now = new Date();
    
    let activePhase = "None";
    const enriched = macrocycles.map((plan: any) => {
      const sDate = plan.startDate?.toDate ? plan.startDate.toDate() : new Date(plan.startDate);
      const eDate = plan.endDate?.toDate ? plan.endDate.toDate() : new Date(plan.endDate);
      
      let computedStatus = plan.status;
      if (eDate < now) computedStatus = "completed";
      else if (sDate <= now && eDate >= now) {
        computedStatus = "active";
        activePhase = plan.title;
      }
      else if (sDate > now) computedStatus = "upcoming";

      const durationWeeks = Math.max(1, Math.round((eDate.getTime() - sDate.getTime()) / (1000 * 60 * 60 * 24 * 7)));

      return { ...plan, sDate, eDate, computedStatus, durationWeeks };
    });

    // Filter by search
    const filtered = enriched.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Sort so active is first, then upcoming, then completed
    filtered.sort((a, b) => {
      const order = { "active": 0, "upcoming": 1, "completed": 2 };
      return order[a.computedStatus as keyof typeof order] - order[b.computedStatus as keyof typeof order];
    });

    const activeCount = enriched.filter(p => p.computedStatus === "active").length;

    return { enrichedPlans: filtered, activeCount, currentPhase: activePhase };
  }, [trainingPlans, searchQuery]);

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startDate || !endDate || !userData?.organizationId) {
      toast.error("Please fill required fields");
      return;
    }

    try {
      await addDoc(collection(db, "training_plans"), {
        organizationId: userData.organizationId,
        coachId: user?.uid,
        type: "macrocycle",
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        assignedTo,
        status: "active",
        createdAt: serverTimestamp()
      });
      toast.success("Macrocycle Plan created!");
      setIsModalOpen(false);
      setTitle(""); setDescription(""); setStartDate(""); setEndDate(""); setAssignedTo("all");
    } catch (error) {
      toast.error("Failed to create plan");
      console.error(error);
    }
  };

  if (loading) {
    return <div className="p-10 space-y-4 max-w-[1600px] mx-auto"><Skeleton className="h-[200px] w-full rounded-2xl"/><Skeleton className="h-[400px] w-full rounded-2xl"/></div>;
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <LayoutDashboard size={32} />
            Macrocycle Plans
          </h1>
          <p className="text-muted-foreground mt-1">High-level view of active training blocks and global periodization.</p>
        </div>
        <Button className="gap-2 shrink-0" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Create Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card glass hoverEffect>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 rounded-xl bg-primary/10 text-primary">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Plans</p>
              <p className="text-3xl font-black">{activeCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card glass hoverEffect>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Phase</p>
              <p className="text-2xl font-bold truncate max-w-[200px]">{currentPhase}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input 
            className="pl-9 bg-black/20 border-white/10" 
            placeholder="Search macrocycles..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {enrichedPlans.length === 0 ? (
          <EmptyState 
            icon={<LayoutDashboard size={32} />} 
            title="No Macrocycles Found" 
            description={searchQuery ? "Try adjusting your search query." : "You haven't built any overarching training plans yet."}
            action={!searchQuery ? { label: "Create First Plan", onClick: () => setIsModalOpen(true) } : undefined}
          />
        ) : (
          enrichedPlans.map((plan: any) => (
            <Card key={plan.id} glass hoverEffect className={plan.computedStatus === "active" ? "border-primary/30 shadow-[0_0_15px_-3px_rgba(139,92,246,0.1)]" : "border-white/5 opacity-80"}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{plan.title}</CardTitle>
                    <CardDescription className="mt-1">{plan.description}</CardDescription>
                  </div>
                  <StatusChip status={plan.computedStatus === "active" ? "active" : plan.computedStatus === "upcoming" ? "neutral" : "danger"}>
                    {plan.computedStatus === "active" ? "In Progress" : plan.computedStatus.charAt(0).toUpperCase() + plan.computedStatus.slice(1)}
                  </StatusChip>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-black/20 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="font-semibold">{plan.durationWeeks} Weeks</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Athletes Assigned</p>
                    <p className="font-semibold">{plan.assignedTo === 'all' ? 'Whole Team' : 'Selected Athletes'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Start Date</p>
                    <p className="font-semibold">{format(plan.sDate, 'MMM d, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">End Date</p>
                    <p className="font-semibold">{format(plan.eDate, 'MMM d, yyyy')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Macrocycle Plan" width="lg">
        <form onSubmit={handleSavePlan} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Plan Title</label>
            <Input required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Indoor Season 2026-27" className="bg-black/20" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea 
              required 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Primary focus and periodization block description..."
              className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[100px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Input required type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-black/20" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Input required type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-black/20" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Assign To</label>
            <select 
              value={assignedTo} 
              onChange={e => setAssignedTo(e.target.value)}
              className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring appearance-none"
            >
              <option value="all">Whole Team</option>
              {athletes.map((a: any) => (
                <option key={a.id || a.uid} value={a.id || a.uid}>{a.firstName} {a.lastName}</option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create Plan</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}