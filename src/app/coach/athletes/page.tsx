"use client";

import { DreamyAthleteKpiCards } from "@/components/coach/dreamy/DreamyAthleteKpiCards";
import { DreamyAthleteList } from "@/components/coach/dreamy/DreamyAthleteList";
import { InviteAthleteWidget } from "@/components/coach/dreamy/InviteAthleteWidget";
import { PendingInvitationsList } from "@/components/coach/dreamy/PendingInvitationsList";
import { DreamyAthleteQuickActions } from "@/components/coach/dreamy/DreamyAthleteQuickActions";

export default function AthletesPage() {
  return (
    <div className="h-full flex flex-col justify-between overflow-hidden gap-4 -mt-2">
      {/* Header Specific to this page inside the main area since the layout header is global, 
          but the screenshot shows a specific page title here */}
      <div className="shrink-0 mb-2">
        <h2 className="text-2xl font-semibold text-white tracking-tight">Athletes</h2>
        <p className="text-sm text-[#9CA3AF] mt-1">Manage your athletes, track their progress, and monitor their performance.</p>
      </div>

      {/* Scrollable Main Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-4 flex flex-col gap-4">
        
        {/* Top KPI Cards */}
        <div className="shrink-0">
          <DreamyAthleteKpiCards />
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-12 gap-6 flex-1 min-h-[600px]">
          
          {/* Left Column - Athlete List (Span 8) */}
          <div className="col-span-12 lg:col-span-8 flex flex-col h-full">
            <DreamyAthleteList />
          </div>

          {/* Right Column - Invitations (Span 4) */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 h-full">
            <InviteAthleteWidget />
            <PendingInvitationsList />
          </div>

        </div>
      </div>

      {/* Fixed Bottom Dock */}
      <div className="shrink-0 bg-[#0A0C10] pt-2">
        <DreamyAthleteQuickActions />
      </div>
    </div>
  );
}
