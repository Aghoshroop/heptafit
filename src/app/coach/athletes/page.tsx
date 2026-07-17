"use client";

import { DreamyAthleteKpiCards } from "@/components/coach/dreamy/DreamyAthleteKpiCards";
import { DreamyAthleteList } from "@/components/coach/dreamy/DreamyAthleteList";
import { InviteAthleteWidget } from "@/components/coach/dreamy/InviteAthleteWidget";
import { PendingInvitationsList } from "@/components/coach/dreamy/PendingInvitationsList";
import { DreamyAthleteQuickActions } from "@/components/coach/dreamy/DreamyAthleteQuickActions";

export default function AthletesPage() {
  return (
    <div className="flex flex-col gap-4 pb-10 -mt-2">
      {/* Header Specific to this page */}
      <div className="shrink-0 mb-2">
        <h2 className="text-2xl font-semibold text-foreground tracking-tight">Athletes</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your athletes, track their progress, and monitor their performance.</p>
      </div>

      {/* Top KPI Cards */}
      <div className="shrink-0">
        <DreamyAthleteKpiCards />
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Column - Athlete List (Span 8) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col">
          <DreamyAthleteList />
        </div>

        {/* Right Column - Invitations (Span 4) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <InviteAthleteWidget />
          <PendingInvitationsList />
        </div>

      </div>
    </div>
  );
}
