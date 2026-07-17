"use client";

import { ChevronDown, Copy, QrCode, ScanLine, Share2, MessageCircle } from "lucide-react";
import { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCoachData } from "@/lib/hooks/useCoachDashboardMetrics";
import { ATHLETICS_METADATA } from "@/lib/intelligence/sportMetadata";
import { InvitationCreatedModal } from "./InvitationCreatedModal";

const VISUAL_CATEGORIES = [
  { id: "sprints", label: "Sprints", icon: "⚡" },
  { id: "hurdles", label: "Hurdles", icon: "🚧" },
  { id: "middle-distance", label: "Mid Dist", icon: "🏃" },
  { id: "long-distance", label: "Long Dist", icon: "🏃‍♂️" },
  { id: "jumps", label: "Jumps", icon: "🦘" },
  { id: "throws", label: "Throws", icon: "🥏" },
  { id: "combined-events", label: "Combined", icon: "🏆" },
  { id: "race-walk", label: "Walk", icon: "🚶" },
  { id: "relays", label: "Relays", icon: "🔁" }
];

export function InviteAthleteWidget() {
  const { userData } = useAuth();
  const { groups } = useCoachData();
  
  const [copied, setCopied] = useState(false);
  const [athleteName, setAthleteName] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [category, setCategory] = useState("");
  const [primaryEvent, setPrimaryEvent] = useState("");
  
  const [loading, setLoading] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createdInviteData, setCreatedInviteData] = useState<any>(null);

  const events = useMemo(() => {
    if (!category) return [];
    const disciplineObj = ATHLETICS_METADATA.disciplines.find(d => d.name === "Track & Field");
    const catObj = disciplineObj?.categories.find(c => c.id === category);
    return catObj?.events || [];
  }, [category]);

  const generateCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleSendInvite = async () => {
    if (!userData?.organizationId || !category || !primaryEvent) return;
    
    setLoading(true);
    try {
      const code = generateCode();
      
      const groupName = selectedGroupId 
        ? (groups.find((g: any) => g.id === selectedGroupId) as any)?.name || "Unassigned"
        : "Unassigned";

      const selectedEventObj = events.find(e => e.id === primaryEvent);
      const performanceProfile = selectedEventObj?.performanceProfile || "General";

      await addDoc(collection(db, "coachInvitations"), {
        athleteName: athleteName || "Unnamed Athlete",
        email: "",
        groupId: selectedGroupId || null,
        groupName,
        organizationId: userData.organizationId,
        coachId: userData.uid,
        role: "athlete",
        status: "pending",
        invitationCode: code,
        
        // Metadata Intelligence Classification
        sport: "Athletics",
        discipline: "Track & Field",
        category,
        primaryEvent,
        performanceProfile,

        createdAt: serverTimestamp(),
      });
      const inviteUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/join?code=${code}`;

      setCreatedInviteData({
        athleteName: athleteName || "Unnamed Athlete",
        category,
        primaryEvent,
        groupName,
        invitationCode: code,
        inviteUrl,
        status: "pending"
      });
      setIsModalOpen(true);
      
      // Reset form
      setAthleteName("");
      setSelectedGroupId("");
      setCategory("");
      setPrimaryEvent("");
    } catch (error) {
      console.error("Failed to send invite", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-card rounded-xl p-6 border border-border flex flex-col">
      <h3 className="text-base font-semibold text-foreground">Invite New Athlete</h3>
      <p className="text-xs text-muted-foreground mt-1 mb-6">Send an invitation to add a classified athlete to your team.</p>

      <div className="space-y-4">
        {/* Visual Category Selector */}
        <div>
          <label className="block text-[10px] font-medium text-foreground mb-2">Choose Athlete Category</label>
          <div className="grid grid-cols-3 gap-2">
            {VISUAL_CATEGORIES.map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => { setCategory(c.id); setPrimaryEvent(""); }}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                  category === c.id 
                    ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-foreground shadow-[0_0_15px_rgba(139,92,246,0.15)]' 
                    : 'bg-background border-border text-muted-foreground hover:border-[#4B5563]'
                }`}
              >
                <span className="text-lg mb-1">{c.icon}</span>
                <span className="text-[9px] font-medium text-center leading-tight">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Primary Event Dropdown */}
        {category && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200">
            <label className="block text-[10px] font-medium text-foreground mb-1.5">Primary Event</label>
            <div className="relative">
              <select 
                value={primaryEvent}
                onChange={(e) => setPrimaryEvent(e.target.value)}
                className="w-full bg-background border border-[#8B5CF6]/50 rounded-lg pl-3 pr-8 py-2.5 text-xs text-foreground appearance-none focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all cursor-pointer shadow-[0_0_10px_rgba(139,92,246,0.1)]"
              >
                <option value="">Select Primary Event</option>
                {events.map((e: any) => (
                  <option key={e.id} value={e.id} className="text-foreground hover:bg-accent">{(e as any).name}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B5CF6] pointer-events-none" />
            </div>
          </div>
        )}

        <div>
          <label className="block text-[10px] font-medium text-foreground mb-1.5 mt-2">Athlete Name (Optional)</label>
          <input 
            type="text" 
            value={athleteName}
            onChange={(e) => setAthleteName(e.target.value)}
            placeholder="Enter athlete name for reference" 
            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all"
          />
        </div>

        <div>
          <label className="block text-[10px] font-medium text-foreground mb-1.5">Select Group (Optional)</label>
          <div className="relative">
            <select 
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-3 pr-8 py-2.5 text-xs text-muted-foreground appearance-none focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all cursor-pointer"
            >
              <option value="">Choose a training group</option>
              {groups.map((g: any) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
        </div>

          <button 
            onClick={handleSendInvite}
            disabled={loading || !category || !primaryEvent}
            className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed text-foreground rounded-lg py-3 text-xs font-bold transition-all shadow-lg shadow-[#8B5CF6]/25 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? "Generating Invite..." : "Generate Invite"}
          </button>
      </div>

      <InvitationCreatedModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={createdInviteData}
      />
    </div>
  );
}
