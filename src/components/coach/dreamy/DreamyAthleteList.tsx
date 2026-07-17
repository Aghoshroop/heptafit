"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useMemo } from "react";
import { ChevronDown, Filter, Eye, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { useCoachAthletesWithMetrics, useCoachData } from "@/lib/hooks/useCoachDashboardMetrics";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

export function DreamyAthleteList() {
  const { userData } = useAuth();
  const router = useRouter();
  const { athletes, loading: athletesLoading } = useCoachAthletesWithMetrics();
  const { groups } = useCoachData();
  
  const [selectedGroupId, setSelectedGroupId] = useState<string>("all");
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "inactive" | "graduated">("all");

  const getStatusStyle = (status: string) => {
    if (status === "At Risk") return { text: "At Risk", style: "text-[#EF4444]" };
    if (status === "Fatigued") return { text: "Fatigued", style: "text-[#F59E0B]" };
    if (status === "Moderate") return { text: "Moderate", style: "text-[#3B82F6]" };
    if (status === "Unknown") return { text: "Unknown", style: "text-[#9CA3AF]" };
    return { text: "Ready", style: "text-[#34D399]" };
  };

  const getProgressStyle = (readiness: number) => {
    if (readiness < 40) return { val: readiness, color: "text-[#EF4444]", stroke: "#EF4444" };
    if (readiness < 70) return { val: readiness, color: "text-[#F59E0B]", stroke: "#F59E0B" };
    if (readiness < 85) return { val: readiness, color: "text-[#3B82F6]", stroke: "#3B82F6" };
    return { val: readiness, color: "text-[#34D399]", stroke: "#34D399" };
  };

  const filteredAthletes = useMemo(() => {
    const selectedGroupData = groups.find((g: any) => g.id === selectedGroupId) as any;
    
    return athletes.filter((a: any) => {
      if (activeTab === "active" && a.status === "Unknown") return false;
      if (activeTab === "inactive" && a.status !== "Unknown") return false;
      
      if (selectedGroupId !== "all") {
        return selectedGroupData?.athleteIds?.includes(a.id || a.uid || "");
      }
      return true;
    });
  }, [athletes, activeTab, selectedGroupId, groups]);

  const selectedGroupName = (groups.find((g: any) => g.id === selectedGroupId) as any)?.name || "All Groups";

  return (
    <div className="bg-[#11141A] rounded-xl border border-[#1F2937] flex-1 flex flex-col h-full min-h-0">
      
      {/* Header */}
      <div className="p-5 border-b border-[#1F2937]">
        <h3 className="text-base font-semibold text-white mb-4">Athlete List</h3>
        
        <div className="flex items-center justify-between">
          {/* Tabs */}
          <div className="flex gap-6 text-sm">
            <button onClick={() => setActiveTab("all")} className={`pb-2 font-medium transition-colors ${activeTab === 'all' ? 'text-white border-b-2 border-[#8B5CF6]' : 'text-[#9CA3AF] hover:text-white'}`}>All Athletes ({athletes.length})</button>
            <button onClick={() => setActiveTab("active")} className={`pb-2 font-medium transition-colors ${activeTab === 'active' ? 'text-white border-b-2 border-[#8B5CF6]' : 'text-[#9CA3AF] hover:text-white'}`}>Active ({athletes.filter(a => a.status !== 'Unknown').length})</button>
            <button onClick={() => setActiveTab("inactive")} className={`pb-2 font-medium transition-colors ${activeTab === 'inactive' ? 'text-white border-b-2 border-[#8B5CF6]' : 'text-[#9CA3AF] hover:text-white'}`}>Inactive ({athletes.filter(a => a.status === 'Unknown').length})</button>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setIsGroupDropdownOpen(!isGroupDropdownOpen)}
                className="flex items-center gap-2 bg-[#1F2937] border border-[#374151] rounded-lg px-3 py-1.5 text-xs text-white hover:bg-[#374151] transition-colors"
              >
                <span className="max-w-[100px] truncate">{selectedGroupName}</span> <ChevronDown size={14} className="text-[#9CA3AF]" />
              </button>
              {isGroupDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsGroupDropdownOpen(false)} />
                  <div className="absolute right-0 mt-1 w-40 bg-[#1F2937] border border-[#374151] rounded-lg shadow-xl z-20 py-1 max-h-48 overflow-y-auto no-scrollbar">
                    <button
                      onClick={() => { setSelectedGroupId("all"); setIsGroupDropdownOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#374151] transition-colors ${selectedGroupId === "all" ? "text-white bg-[#374151]/50" : "text-[#9CA3AF]"}`}
                    >
                      All Groups
                    </button>
                    {groups?.map((g: any) => (
                      <button
                        key={g.id}
                        onClick={() => { setSelectedGroupId(g.id); setIsGroupDropdownOpen(false); }}
                        className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#374151] transition-colors ${selectedGroupId === g.id ? "text-white bg-[#374151]/50" : "text-[#9CA3AF]"}`}
                      >
                        {g.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button className="flex items-center gap-2 bg-[#8B5CF6] text-white rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-[#7C3AED] transition-colors shadow-lg shadow-indigo-500/20">
              <Filter size={12} /> Filter
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto no-scrollbar relative min-h-0 p-5">
        <table className="w-full text-xs text-left">
          <thead className="text-[10px] text-[#6B7280] uppercase tracking-wider sticky top-0 bg-[#11141A] z-10">
            <tr>
              <th className="pb-4 font-semibold px-2">Athlete</th>
              <th className="pb-4 font-semibold">Classification</th>
              <th className="pb-4 font-semibold">Group</th>
              <th className="pb-4 font-semibold">Status</th>
              <th className="pb-4 font-semibold">Last Active</th>
              <th className="pb-4 font-semibold text-center">Progress</th>
              <th className="pb-4 font-semibold text-right px-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1F2937]">
            {filteredAthletes.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#6B7280]">
                  No athletes found.
                </td>
              </tr>
            ) : (
              filteredAthletes.map((athlete: any, i: number) => {
                const status = getStatusStyle(athlete.status || "Unknown");
                const progress = getProgressStyle(athlete.readiness || 0);
                const name = `${athlete.firstName || ''} ${athlete.lastName || ''}`.trim() || 'Unknown Athlete';
                
                let lastActiveStr = "Never";
                if (athlete.lastActive && athlete.lastActive !== "Never") {
                  try {
                    const d = new Date(athlete.lastActive);
                    if (!isNaN(d.getTime())) {
                      lastActiveStr = formatDistanceToNow(d, { addSuffix: true });
                    }
                  } catch (e) {}
                }

                let primaryGroupName = "Unassigned";
                const athleteGroups = groups.filter((g: any) => g.athleteIds?.includes(athlete.id || athlete.uid || ""));
                if (athleteGroups.length > 0) {
                  primaryGroupName = (athleteGroups[0] as any).name;
                }
                
                return (
                  <tr 
                    key={athlete.id} 
                    onClick={() => router.push(`/coach/athletes/${athlete.uid || athlete.id}`)}
                    className="group hover:bg-[#1F2937]/30 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <img 
                          src={athlete.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1F2937&color=fff`} 
                          className="w-8 h-8 rounded-full border border-[#374151] object-cover" 
                          alt={name} 
                        />
                        <div className="flex flex-col">
                          <span className="text-[#E2E8F0] font-semibold">{name}</span>
                          <span className="text-[10px] text-[#6B7280] mt-0.5">{athlete.sport || "Athlete"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-col">
                        <span className="text-[#E2E8F0] text-xs font-medium">{athlete.category || 'Unclassified'}</span>
                        <span className="text-[10px] text-[#9CA3AF] mt-0.5">
                          {athlete.primaryEvent ? `${athlete.primaryEvent} • ${athlete.performanceProfile || 'General'}` : 'No event assigned'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-[#9CA3AF] truncate max-w-[120px]">{primaryGroupName}</td>
                    <td className="py-3">
                      <span className={`text-[10px] font-medium ${status.style}`}>{status.text}</span>
                    </td>
                    <td className="py-3 text-[#9CA3AF] text-[10px]">{lastActiveStr}</td>
                    <td className="py-3 text-center">
                      <div className="relative w-8 h-8 mx-auto flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="16" cy="16" r="14" fill="none" stroke="#1F2937" strokeWidth="2" />
                          <circle cx="16" cy="16" r="14" fill="none" stroke={progress.stroke} strokeWidth="2" strokeDasharray="88" strokeDashoffset={88 - (88 * progress.val) / 100} strokeLinecap="round" />
                        </svg>
                        <span className={`absolute inset-0 flex items-center justify-center text-[8px] font-bold ${progress.color}`}>{progress.val}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-right px-2">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/coach/athletes/${athlete.uid || athlete.id}`);
                          }}
                          className="w-7 h-7 rounded border border-[#374151] flex items-center justify-center text-[#9CA3AF] hover:text-white hover:bg-[#374151] transition-colors"
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          onClick={(e) => e.stopPropagation()}
                          className="w-7 h-7 rounded border border-[#374151] flex items-center justify-center text-[#9CA3AF] hover:text-white hover:bg-[#374151] transition-colors"
                        >
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#1F2937] flex items-center justify-between text-[#6B7280] text-xs">
        <div>Showing 1 to {filteredAthletes.length} of {filteredAthletes.length} athletes</div>
        <div className="flex items-center gap-1">
          <button className="w-6 h-6 flex items-center justify-center rounded hover:text-white transition-colors"><ChevronLeft size={14} /></button>
          <button className="w-6 h-6 flex items-center justify-center rounded bg-[#8B5CF6] text-white font-medium">1</button>
          <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#1F2937] hover:text-white transition-colors">2</button>
          <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#1F2937] hover:text-white transition-colors">3</button>
          <button className="w-6 h-6 flex items-center justify-center rounded hover:text-white transition-colors"><ChevronRight size={14} /></button>
        </div>
      </div>

    </div>
  );
}
