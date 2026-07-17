"use client";

import { UserPlus, UsersIcon, Download, Layers, ClipboardList, MessageSquare } from "lucide-react";

export function DreamyAthleteQuickActions() {
  const actions = [
    { name: "Invite Athlete", icon: UserPlus, color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/10" },
    { name: "Create Group", icon: UsersIcon, color: "text-[#3B82F6]", bg: "bg-[#3B82F6]/10" },
    { name: "Import Athletes", icon: Download, color: "text-[#10B981]", bg: "bg-[#10B981]/10" },
    { name: "Bulk Actions", icon: Layers, color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10" },
    { name: "Assign Plan", icon: ClipboardList, color: "text-[#EF4444]", bg: "bg-[#EF4444]/10" },
    { name: "Send Message", icon: MessageSquare, color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/10" },
  ];

  return (
    <div>
      <h3 className="text-sm font-semibold text-white mb-3">Quick Actions</h3>
      <div className="flex items-center gap-4">
        {actions.map((action, i) => (
          <button 
            key={i}
            className="flex items-center gap-3 bg-[#11141A] border border-[#1F2937] rounded-xl px-4 py-3 hover:bg-[#1F2937]/50 transition-colors"
          >
            <div className={`w-8 h-8 rounded-lg ${action.bg} flex items-center justify-center`}>
              <action.icon size={16} className={action.color} />
            </div>
            <span className="text-sm font-medium text-[#E2E8F0]">{action.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
