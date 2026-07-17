"use client";

import { User, Users, Settings, Bell, Link as LinkIcon, Shield, CreditCard } from "lucide-react";
import { DreamyProfileSettings } from "@/components/coach/dreamy/DreamyProfileSettings";
import { DreamySecuritySettings } from "@/components/coach/dreamy/DreamySecuritySettings";
import { DreamySubscriptionCard } from "@/components/coach/dreamy/DreamySubscriptionCard";
import { DreamyGroupsManager } from "@/components/coach/dreamy/DreamyGroupsManager";
import { DreamySystemPreferences } from "@/components/coach/dreamy/DreamySystemPreferences";
import { DreamyAccountQuickSettings } from "@/components/coach/dreamy/DreamyAccountQuickSettings";
import { DreamySettingsQuickActions } from "@/components/coach/dreamy/DreamySettingsQuickActions";

export default function SettingsPage() {
  const tabs = [
    { name: "Profile & Account", icon: User, active: true },
    { name: "Team & Groups", icon: Users, active: false },
    { name: "System Preferences", icon: Settings, active: false },
    { name: "Notifications", icon: Bell, active: false },
    { name: "Integrations", icon: LinkIcon, active: false },
    { name: "Security", icon: Shield, active: false },
    { name: "Billing & Plan", icon: CreditCard, active: false },
  ];

  return (
    <div className="h-full flex flex-col justify-between overflow-hidden gap-4 -mt-2">
      {/* Header */}
      <div className="shrink-0 mb-2">
        <h2 className="text-2xl font-semibold text-white tracking-tight">Settings</h2>
        <p className="text-sm text-[#9CA3AF] mt-1">Manage your account, preferences, teams, and system configurations.</p>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-4 pb-4">
        
        {/* Navigation Tabs */}
        <div className="bg-[#11141A] rounded-xl border border-[#1F2937] p-2 flex items-center overflow-x-auto no-scrollbar shrink-0">
          {tabs.map((tab, i) => (
            <button
              key={i}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                tab.active 
                  ? "text-white bg-[#1F2937]/50 border-b-2 border-[#8B5CF6]" 
                  : "text-[#9CA3AF] hover:text-white hover:bg-[#1F2937]/30 border-b-2 border-transparent"
              }`}
            >
              <tab.icon size={14} className={tab.active ? "text-[#8B5CF6]" : "text-[#6B7280]"} />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Dashboard Grid Container */}
        <div className="grid grid-cols-12 gap-4 flex-1">
          
          {/* Top Row */}
          <div className="col-span-12 lg:col-span-4 h-full">
            <DreamyProfileSettings />
          </div>
          <div className="col-span-12 lg:col-span-4 h-full">
            <DreamySecuritySettings />
          </div>
          <div className="col-span-12 lg:col-span-4 h-full">
            <DreamySubscriptionCard />
          </div>

          {/* Middle Row */}
          <div className="col-span-12 lg:col-span-8 h-[400px]">
            <DreamyGroupsManager />
          </div>
          <div className="col-span-12 lg:col-span-4 h-[400px]">
            <DreamySystemPreferences />
          </div>

          {/* Bottom Row */}
          <div className="col-span-12 lg:col-span-8">
            <DreamyAccountQuickSettings />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <DreamySettingsQuickActions />
          </div>

        </div>
      </div>
    </div>
  );
}
