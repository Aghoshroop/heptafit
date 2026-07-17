"use client";

import { Eye } from "lucide-react";

export function DreamySecuritySettings() {
  return (
    <div className="bg-[#11141A] rounded-xl p-6 border border-[#1F2937] flex flex-col h-full">
      <h3 className="text-sm font-semibold text-white mb-6">Change Password</h3>
      
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-medium text-[#9CA3AF] mb-1.5">Current Password</label>
            <div className="relative">
              <input 
                type="password" 
                placeholder="Enter current password" 
                className="w-full bg-transparent border border-[#374151] rounded-lg pl-3 pr-10 py-2 text-xs text-white placeholder:text-[#6B7280] focus:outline-none focus:border-[#8B5CF6] transition-colors"
              />
              <Eye size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] cursor-pointer hover:text-[#9CA3AF]" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#9CA3AF] mb-1.5">New Password</label>
            <div className="relative">
              <input 
                type="password" 
                placeholder="Enter new password" 
                className="w-full bg-transparent border border-[#374151] rounded-lg pl-3 pr-10 py-2 text-xs text-white placeholder:text-[#6B7280] focus:outline-none focus:border-[#8B5CF6] transition-colors"
              />
              <Eye size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] cursor-pointer hover:text-[#9CA3AF]" />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] text-[#9CA3AF]">Password strength:</span>
              <div className="flex gap-1">
                <div className="h-1 w-6 bg-[#34D399] rounded-full"></div>
                <div className="h-1 w-6 bg-[#34D399] rounded-full"></div>
                <div className="h-1 w-6 bg-[#34D399] rounded-full"></div>
                <div className="h-1 w-6 bg-[#34D399] rounded-full"></div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#9CA3AF] mb-1.5">Confirm New Password</label>
            <div className="relative">
              <input 
                type="password" 
                placeholder="Confirm new password" 
                className="w-full bg-transparent border border-[#374151] rounded-lg pl-3 pr-10 py-2 text-xs text-white placeholder:text-[#6B7280] focus:outline-none focus:border-[#8B5CF6] transition-colors"
              />
              <Eye size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] cursor-pointer hover:text-[#9CA3AF]" />
            </div>
          </div>
        </div>

        <button className="w-full mt-6 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-lg py-2 text-xs font-medium transition-colors shadow-lg shadow-indigo-500/20">
          Update Password
        </button>
      </div>
    </div>
  );
}
