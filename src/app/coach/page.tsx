"use client";

import { DreamyKpiCards } from "@/components/coach/dreamy/DreamyKpiCards";
import { DreamyQuickActions } from "@/components/coach/dreamy/DreamyQuickActions";
import { TeamPerformanceOverview } from "@/components/coach/dreamy/TeamPerformanceOverview";
import { AthleteOverviewTable } from "@/components/coach/dreamy/AthleteOverviewTable";
import { AthleteReadinessOverview } from "@/components/coach/dreamy/AthleteReadinessOverview";
import { WorkloadBalance } from "@/components/coach/dreamy/WorkloadBalance";
import { TrainingPlanSummary } from "@/components/coach/dreamy/TrainingPlanSummary";
import { TodaysScheduleTimeline } from "@/components/coach/dreamy/TodaysScheduleTimeline";
import { AlertsAndNotificationsList } from "@/components/coach/dreamy/AlertsAndNotificationsList";
import { RecentReportsList } from "@/components/coach/dreamy/RecentReportsList";

export default function CoachOSDashboard() {
  return (
    <div className="h-full flex flex-col justify-between overflow-hidden gap-4">
      {/* Scrollable Main Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-4 flex flex-col gap-4">
        
        {/* Top 5 KPI Cards */}
        <div className="shrink-0">
          <DreamyKpiCards />
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-12 gap-4 flex-1 min-h-[600px]">
          
          {/* Left Column (Span 5) */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-4 h-full">
            <TeamPerformanceOverview />
            <AthleteOverviewTable />
          </div>

          {/* Center Column (Span 3) */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 h-full">
            <AthleteReadinessOverview />
            <WorkloadBalance />
            <TrainingPlanSummary />
          </div>

          {/* Right Column (Span 4) */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 h-full">
            <TodaysScheduleTimeline />
            <AlertsAndNotificationsList />
            <RecentReportsList />
          </div>

        </div>
      </div>

      {/* Floating Action Button (FAB) */}
      <DreamyQuickActions />
    </div>
  );
}
