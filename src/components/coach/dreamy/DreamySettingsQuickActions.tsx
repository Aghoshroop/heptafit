"use client";

import { Download, Upload, Database, RotateCcw, ChevronRight } from "lucide-react";

export function DreamySettingsQuickActions() {
  const actions = [
    { name: "Import Athletes", desc: "Import athletes from CSV or spreadsheets", icon: Download, color: "text-[#10B981]", bg: "bg-[#10B981]/10" },
    { name: "Export Team Data", desc: "Download your team data and reports", icon: Upload, color: "text-[#3B82F6]", bg: "bg-[#3B82F6]/10" },
    { name: "Backup Data", desc: "Create a backup of all your data", icon: Database, color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10" },
    { name: "Reset Dashboard", desc: "Reset dashboard to default settings", icon: RotateCcw, color: "text-[#EF4444]", bg: "bg-[#EF4444]/10" },
  ];

  return (
    <div className="bg-card rounded-xl border border-border flex flex-col h-full">
      <div className="p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Quick Actions</h3>
        
        <div className="space-y-2">
          {actions.map((action, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors group">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${action.bg}`}>
                  <action.icon size={14} className={action.color} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">{action.name}</h4>
                  <p className="text-[10px] text-muted-foreground">{action.desc}</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
