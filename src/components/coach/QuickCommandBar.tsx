"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, CalendarPlus, UserPlus, ActivitySquare, FileText, Send } from "lucide-react";
import { ScheduleSessionDialog } from "./dialogs/ScheduleSessionDialog";
import { useRouter } from "next/navigation";

export function QuickCommandBar() {
  const router = useRouter();
  const [showSchedule, setShowSchedule] = useState(false);
  const actions = [
    { label: "Create Plan", icon: Plus, color: "text-primary", action: () => router.push("/coach/training") },
    { label: "Schedule Session", icon: CalendarPlus, color: "text-blue-500", action: () => setShowSchedule(true) },
    { label: "Add Athlete", icon: UserPlus, color: "text-emerald-500", action: () => router.push("/coach/invite") },
    { label: "Log Performance", icon: ActivitySquare, color: "text-amber-500", action: () => router.push("/coach/performance") },
    { label: "Injury Report", icon: FileText, color: "text-rose-500", action: () => router.push("/coach/injuries") },
    { label: "Send Message", icon: Send, color: "text-purple-500", action: () => router.push("/coach/messages") },
  ];

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-2 glass rounded-full border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
    >
      <div className="px-4 text-xs font-bold text-muted-foreground border-r border-white/10 hidden sm:block">
        Quick Actions
      </div>
      {actions.map((action, i) => (
        <button 
          key={i}
          onClick={action.action}
          className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/10 transition-all group"
        >
          <action.icon size={16} className={`${action.color} group-hover:scale-110 transition-transform`} />
          <span className="text-sm font-semibold hidden md:block">{action.label}</span>
        </button>
      ))}
      
      {showSchedule && (
        <ScheduleSessionDialog isOpen={showSchedule} onClose={() => setShowSchedule(false)} />
      )}
    </motion.div>
  );
}
