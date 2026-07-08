"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, Search, Activity, Calendar, LayoutDashboard } from "lucide-react";
import { StatusChip } from "@/components/ui/StatusChip";
import { EmptyState } from "@/components/ui/EmptyState";

export default function TrainingPage() {
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
        <Button className="gap-2 shrink-0">
          <Plus size={16} /> Create Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card glass hoverEffect>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 rounded-xl bg-primary/10 text-primary">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Plans</p>
              <p className="text-3xl font-black">2</p>
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
              <p className="text-2xl font-bold">SPP</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input className="pl-9 bg-black/20 border-white/10" placeholder="Search macrocycles..." />
        </div>
      </div>

      <div className="space-y-4">
        <Card glass hoverEffect>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">Indoor Season 2026-27</CardTitle>
                <CardDescription className="mt-1">Specific Preparatory Phase (SPP) focusing on max velocity and power.</CardDescription>
              </div>
              <StatusChip status="active">In Progress</StatusChip>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-black/20 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="font-semibold">8 Weeks</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Athletes Assigned</p>
                <p className="font-semibold">12 Sprinters</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Start Date</p>
                <p className="font-semibold">Jul 1, 2026</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">End Date</p>
                <p className="font-semibold">Aug 31, 2026</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-6">
              <Button variant="ghost">View Details</Button>
              <Button variant="secondary">Edit Plan</Button>
            </div>
          </CardContent>
        </Card>

        <Card glass hoverEffect>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">Base Phase 2026</CardTitle>
                <CardDescription className="mt-1">General physical preparedness and aerobic base building.</CardDescription>
              </div>
              <StatusChip status="neutral">Completed</StatusChip>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-black/20 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="font-semibold">12 Weeks</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Athletes Assigned</p>
                <p className="font-semibold">Whole Team</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Start Date</p>
                <p className="font-semibold">Apr 1, 2026</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">End Date</p>
                <p className="font-semibold">Jun 30, 2026</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}