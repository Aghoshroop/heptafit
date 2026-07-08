"use client";

import { useAuth } from "@/context/AuthContext";
import { HeroCommandCenter } from "@/components/coach/HeroCommandCenter";
import { KpiGrid } from "@/components/coach/KpiGrid";
import { QuickCommandBar } from "@/components/coach/QuickCommandBar";
import { AthleteAttentionCenter } from "@/components/coach/AthleteAttentionCenter";
import { ReadinessCenter } from "@/components/coach/ReadinessCenter";
import { TeamPerformanceChart } from "@/components/coach/TeamPerformanceChart";
import { TodaySchedule } from "@/components/coach/TodaySchedule";
import { AthleteRosterTable } from "@/components/coach/AthleteRosterTable";
import { TeamHierarchyWidget } from "@/components/coach/TeamHierarchyWidget";

export default function CoachOperationsCenter() {
  const { userData } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 space-y-6">
      
      {/* 1. Hero & Global Actions */}
      <HeroCommandCenter coachName={userData?.lastName || "Coach"} />

      {/* 2. Primary KPI Strip */}
      <KpiGrid />

      {/* 3. Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (Wide - Main Analytics & Roster) */}
        <div className="lg:col-span-8 space-y-6">
          <TeamPerformanceChart />
          <AthleteRosterTable />
        </div>

        {/* RIGHT COLUMN (Narrow - Immediate Action & Operations) */}
        <div className="lg:col-span-4 space-y-6">
          <AthleteAttentionCenter />
          <ReadinessCenter />
          <TodaySchedule />
          <TeamHierarchyWidget />
        </div>

      </div>

      {/* Floating Quick Command Bar */}
      <QuickCommandBar />
    </div>
  );
}
