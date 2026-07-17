"use client";

import { Mail, Bell, Shield, Lock, ChevronRight } from "lucide-react";

export function DreamyAccountQuickSettings() {
  const settings = [
    { name: "Email Preferences", desc: "Manage email notifications", icon: Mail, color: "text-[#34D399]", bg: "bg-[#34D399]/10" },
    { name: "Notification Settings", desc: "Configure push notifications", icon: Bell, color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10" },
    { name: "Privacy Settings", desc: "Manage your privacy options", icon: Shield, color: "text-[#3B82F6]", bg: "bg-[#3B82F6]/10" },
    { name: "Two-Factor Auth", desc: "Add extra security", icon: Lock, color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/10", status: "Enabled" },
  ];

  return (
    <div className="bg-[#11141A] rounded-xl border border-[#1F2937] flex flex-col h-full">
      <div className="p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Account Settings</h3>
        
        <div className="grid grid-cols-4 gap-4">
          {settings.map((setting, i) => (
            <div key={i} className="bg-[#1F2937]/30 border border-[#374151] rounded-xl p-4 flex items-center justify-between group cursor-pointer hover:bg-[#1F2937]/60 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${setting.bg}`}>
                  <setting.icon size={14} className={setting.color} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">{setting.name}</h4>
                  {setting.status ? (
                    <span className="text-[9px] font-medium text-[#34D399]">{setting.status}</span>
                  ) : (
                    <p className="text-[9px] text-[#9CA3AF] mt-0.5">{setting.desc}</p>
                  )}
                </div>
              </div>
              <ChevronRight size={14} className="text-[#6B7280] group-hover:text-white transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
