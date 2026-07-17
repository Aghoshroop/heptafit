"use client";

import { DreamyKpiCards } from "@/components/coach/dreamy/DreamyKpiCards";
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
    <div className="flex flex-col gap-4 pb-10">
      
      {/* Top 5 KPI Cards */}
        <div className="shrink-0">
          <DreamyKpiCards />
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-12 gap-4">
          
          {/* Left Column (Span 5) */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
            <TeamPerformanceOverview />
            <AthleteOverviewTable />
          </div>

          {/* Center Column (Span 3) */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
            <AthleteReadinessOverview />
            <WorkloadBalance />
            <TrainingPlanSummary />
          </div>

          {/* Right Column (Span 4) */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
            <TodaysScheduleTimeline />
            <AlertsAndNotificationsList />
            <RecentReportsList />
          </div>

        </div>
    </div>
  );
}
