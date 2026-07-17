"use client";

import { Crown } from "lucide-react";

export function DreamySubscriptionCard() {
  return (
    <div className="bg-card rounded-xl p-6 border border-border flex flex-col h-full">
      <h3 className="text-sm font-semibold text-foreground mb-6">Your Plan</h3>
      
      <div className="flex-1 flex flex-col">
        <div className="bg-muted/50 rounded-xl p-4 border border-border flex items-start justify-between">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F59E0B]/10 flex items-center justify-center shrink-0">
              <Crown className="text-[#F59E0B]" size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Pro Coach Plan</h4>
              <p className="text-[10px] text-muted-foreground mt-0.5">Renews on June 30, 2025</p>
            </div>
          </div>
          <span className="text-[10px] font-medium text-[#34D399] bg-[#34D399]/10 px-2 py-0.5 rounded border border-[#34D399]/20">
            Active
          </span>
        </div>

        <div className="flex justify-between mt-6">
          <div>
            <p className="text-[10px] text-muted-foreground mb-1">Athletes</p>
            <p className="text-xs font-semibold text-foreground">28 <span className="text-muted-foreground font-normal">/ 50</span></p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground mb-1">Coaches</p>
            <p className="text-xs font-semibold text-foreground">2 <span className="text-muted-foreground font-normal">/ 5</span></p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground mb-1">Storage</p>
            <p className="text-xs font-semibold text-foreground">12.4 GB <span className="text-muted-foreground font-normal">/ 50 GB</span></p>
          </div>
        </div>

        <div className="mt-auto pt-6">
          <button className="w-full flex items-center justify-center py-2 rounded-lg border border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition-colors text-xs font-medium">
            Manage Subscription
          </button>
        </div>
      </div>
    </div>
  );
}
