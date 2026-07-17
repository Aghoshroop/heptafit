"use client";

import { Check, Mail, Eye, UserPlus } from "lucide-react";
import { motion } from "framer-motion";

interface TimelineProps {
  status: "pending" | "viewed" | "joined" | "expired";
}

export function InvitationStatusTimeline({ status }: TimelineProps) {
  const steps = [
    { id: "pending", label: "Sent", icon: Mail },
    { id: "viewed", label: "Viewed", icon: Eye },
    { id: "joined", label: "Joined", icon: UserPlus },
  ];

  const getStepStatus = (stepId: string, currentStatus: string) => {
    if (currentStatus === "expired") return stepId === "pending" ? "completed" : "pending";
    
    const statuses = ["pending", "viewed", "joined"];
    const currentIndex = statuses.indexOf(currentStatus);
    const stepIndex = statuses.indexOf(stepId);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "pending";
  };

  return (
    <div className="relative flex items-center justify-between w-full px-4">
      {/* Connecting Line */}
      <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-[2px] bg-secondary z-0"></div>
      
      {/* Active Connecting Line */}
      <div 
        className="absolute left-10 top-1/2 -translate-y-1/2 h-[2px] bg-[#8B5CF6] z-0 transition-all duration-500 ease-in-out"
        style={{ 
          width: status === 'joined' ? 'calc(100% - 5rem)' : status === 'viewed' ? 'calc(50% - 2.5rem)' : '0%' 
        }}
      ></div>

      {steps.map((step, index) => {
        const stepStatus = getStepStatus(step.id, status);
        const Icon = step.icon;
        
        return (
          <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                stepStatus === "completed" 
                  ? "bg-[#8B5CF6] border-[#8B5CF6] text-foreground shadow-[0_0_15px_rgba(139,92,246,0.3)]" 
                  : stepStatus === "current"
                    ? "bg-secondary border-[#8B5CF6] text-[#8B5CF6] shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                    : "bg-card border-border text-muted-foreground"
              }`}
            >
              {stepStatus === "completed" ? <Check size={16} strokeWidth={3} /> : <Icon size={16} />}
            </motion.div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${
              stepStatus === "completed" || stepStatus === "current" ? "text-foreground" : "text-muted-foreground"
            }`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
