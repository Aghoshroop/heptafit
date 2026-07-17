"use client";

import { useState } from "react";
import { Plus, ClipboardList, Calendar, UserPlus, Activity, ShieldAlert, MessageSquare, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

export function CoachFAB() {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { icon: ClipboardList, label: "Create Plan", onClick: () => {} },
    { icon: Calendar, label: "Schedule Session", onClick: () => {} },
    { icon: UserPlus, label: "Add Athlete", onClick: () => {} },
    { icon: Activity, label: "Log Performance", onClick: () => {} },
    { icon: ShieldAlert, label: "Injury Report", onClick: () => {} },
    { icon: MessageSquare, label: "Message Team", onClick: () => {} },
    { icon: FileText, label: "Generate Report", onClick: () => {} },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="flex flex-col gap-2 items-end mb-2"
          >
            {actions.map((action, i) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.05 }}
              >
                <Button 
                  variant="outline" 
                  className="bg-card/90 backdrop-blur border-white/10 shadow-xl flex items-center gap-3 pr-4 pl-3 py-6 rounded-full hover:bg-white/10 transition-colors"
                  onClick={() => {
                    action.onClick();
                    setIsOpen(false);
                  }}
                >
                  <action.icon size={18} className="text-blue-400" />
                  <span className="font-semibold text-sm">{action.label}</span>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-900/50 flex items-center justify-center border border-white/10 transition-transform hover:scale-105 active:scale-95"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {isOpen ? <Plus size={24} className="text-white" /> : <Plus size={24} className="text-white" />}
        </motion.div>
      </Button>
    </div>
  );
}
