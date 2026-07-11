"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Search, Dumbbell, Calendar, Clock, MapPin } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusChip } from "@/components/ui/StatusChip";
import { useAuth } from "@/context/AuthContext";
import { useCoachData } from "@/lib/hooks/useCoachDashboardMetrics";

export default function SessionsPage() {
  const { userData } = useAuth();
  const { trainingPlans, loading } = useCoachData();
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredPlans = trainingPlans.filter((plan: any) => 
    plan.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Dumbbell size={32} />
            Session Library
          </h1>
          <p className="text-muted-foreground mt-1">Create, manage, and template your individual training sessions.</p>
        </div>
        <Button className="gap-2 shrink-0">
          <Plus size={16} /> New Session Template
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input 
            className="pl-9 bg-black/20 border-white/10" 
            placeholder="Search sessions..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10">All Types</Button>
          <Button variant="outline" className="border-white/10">Strength</Button>
          <Button variant="outline" className="border-white/10">Track</Button>
          <Button variant="outline" className="border-white/10">Recovery</Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>
      ) : filteredPlans.length === 0 ? (
        <EmptyState 
          icon={<Dumbbell size={32} />} 
          title="No session templates found" 
          description="Create your first session template to reuse it for your athletes."
          action={{ label: "Create Template", onClick: () => {} }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan: any) => (
            <Card key={plan.id} glass hoverEffect className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{plan.name || "Untitled Session"}</CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">{plan.description || "No description provided."}</CardDescription>
                  </div>
                  <StatusChip status="active">{plan.sport || "General"}</StatusChip>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end">
                <div className="space-y-4 pt-4 mt-auto border-t border-white/5">
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-primary" />
                      <span>{plan.duration || 60} mins</span>
                    </div>
                  </div>
                  <Button variant="secondary" className="w-full">Edit Template</Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card glass hoverEffect className="flex flex-col border-dashed bg-transparent border-white/20 items-center justify-center min-h-[250px] cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
              <Plus size={24} />
            </div>
            <p className="font-semibold mt-4">Create New Template</p>
            <p className="text-sm text-muted-foreground mt-1">Start from scratch</p>
          </Card>
        </div>
      )}
    </div>
  );
}