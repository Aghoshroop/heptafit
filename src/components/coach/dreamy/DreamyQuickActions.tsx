"use client";

import { useState } from "react";
import { ClipboardList, Calendar, UserPlus, Activity, HeartPulse, MessageSquare, Plus, X } from "lucide-react";

export function DreamyQuickActions() {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { name: "Create Training Plan", icon: ClipboardList, color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/10" },
    { name: "Schedule Session", icon: Calendar, color: "text-[#3B82F6]", bg: "bg-[#3B82F6]/10" },
    { name: "Add Athlete", icon: UserPlus, color: "text-[#10B981]", bg: "bg-[#10B981]/10" },
    { name: "Log Performance", icon: Activity, color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10" },
    { name: "Injury Report", icon: HeartPulse, color: "text-[#EF4444]", bg: "bg-[#EF4444]/10" },
    { name: "Send Message", icon: MessageSquare, color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/10" },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      {/* Menu Options */}
      <div 
        className={`flex flex-col items-end gap-3 mb-4 transition-all duration-300 origin-bottom ${
          isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-10 pointer-events-none"
        }`}
      >
        {actions.map((action, i) => (
          <button 
            key={i}
            onClick={() => { console.log(`Triggered ${action.name}`); setIsOpen(false); }}
            className="flex items-center gap-3 bg-[#11141A] border border-[#1F2937] rounded-xl px-4 py-3 hover:bg-[#1F2937]/80 transition-colors shadow-lg shadow-black/50 group"
          >
            <span className="text-sm font-medium text-[#E2E8F0] group-hover:text-white transition-colors">{action.name}</span>
            <div className={`w-8 h-8 rounded-lg ${action.bg} flex items-center justify-center shrink-0`}>
              <action.icon size={16} className={action.color} />
            </div>
          </button>
        ))}
      </div>

      {/* Primary FAB */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#8B5CF6] text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:bg-[#7C3AED] hover:shadow-indigo-500/50 hover:scale-105 transition-all active:scale-95 z-50"
      >
        <div className={`transition-transform duration-300 ${isOpen ? "rotate-135" : "rotate-0"}`}>
          {isOpen ? <X size={24} /> : <Plus size={24} />}
        </div>
      </button>

      {/* Invisible overlay for closing when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
