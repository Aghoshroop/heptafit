"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent } from "@/components/ui/Card";
import { User, Phone, Trophy, Hash, Copy, Check, Activity } from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/Button";

export default function PersonalPage() {
  const params = useParams();
  const athleteId = params.id as string;
  
  const [athlete, setAthlete] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!athleteId) return;
    
    const unsubscribe = onSnapshot(doc(db, "users", athleteId), (snapshot) => {
      if (snapshot.exists()) {
        setAthlete({ id: snapshot.id, ...snapshot.data() });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [athleteId]);

  const handleCopyInvite = () => {
    if (!athlete?.inviteCode) return;
    navigator.clipboard.writeText(athlete.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Invite code copied to clipboard");
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      await updateDoc(doc(db, "users", athleteId), { status: e.target.value });
      toast.success("Status updated");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handlePhaseChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      await updateDoc(doc(db, "users", athleteId), { competitionPhase: e.target.value });
      toast.success("Phase updated");
    } catch (error) {
      toast.error("Failed to update phase");
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" /></div>;
  }

  if (!athlete) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Athlete Card</h2>
        <p className="text-muted-foreground">Quick reference for athlete identity and status.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Sidebar: Photo & QR Code */}
        <div className="space-y-6">
          <Card glass className="border-white/5 overflow-hidden flex flex-col items-center p-6 text-center">
            <div className="w-32 h-32 rounded-full border-4 border-white/10 overflow-hidden bg-white/5 flex items-center justify-center mb-4">
              {athlete.profilePhotoUrl ? (
                <img src={athlete.profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-muted-foreground opacity-50" />
              )}
            </div>
            
            <h3 className="font-bold text-xl">{athlete.firstName} {athlete.lastName}</h3>
            <p className="text-muted-foreground text-sm mb-4">{athlete.sport || "General Athletics"} {athlete.primaryEvent ? `• ${athlete.primaryEvent}` : ""}</p>
            
            <div className="w-full bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center">
              <p className="text-xs font-bold uppercase text-muted-foreground mb-3">Athlete Passport QR</p>
              <div className="bg-white p-2 rounded-lg mb-3">
                <QRCodeSVG value={`athlete:${athleteId}`} size={120} />
              </div>
              
              {athlete.inviteCode && (
                <div className="w-full mt-2">
                  <p className="text-[10px] uppercase text-muted-foreground mb-1 text-left">Invite Code</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-black/50 py-1.5 px-3 rounded text-sm tracking-wider font-mono text-blue-400 border border-white/10">
                      {athlete.inviteCode}
                    </code>
                    <Button variant="outline" size="icon" onClick={handleCopyInvite} className="h-8 w-8 border-white/10 shrink-0">
                      {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Status & Phase - Editable by coach */}
          <Card glass className="border-white/5 overflow-hidden">
            <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex items-center gap-2">
              <Activity size={16} className="text-emerald-400" />
              <h3 className="font-bold text-sm">Status & Phase</h3>
            </div>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Current Status</label>
                <select value={athlete.status || "Active"} onChange={handleStatusChange} className="w-full h-9 rounded-md border bg-background/50 px-3 text-sm border-white/10 focus:ring-1 focus:ring-blue-500 font-bold">
                  <option value="Active" className="text-emerald-500">Active</option>
                  <option value="Injured" className="text-red-500">Injured</option>
                  <option value="Rehabilitation" className="text-amber-500">Rehabilitation</option>
                  <option value="Inactive" className="text-slate-500">Inactive</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Competition Phase</label>
                <select value={athlete.competitionPhase || "Off Season"} onChange={handlePhaseChange} className="w-full h-9 rounded-md border bg-background/50 px-3 text-sm border-white/10 focus:ring-1 focus:ring-blue-500">
                  <option value="Off Season">Off Season</option>
                  <option value="Pre Season">Pre Season</option>
                  <option value="In Season">In Season</option>
                  <option value="Taper">Taper (Peaking)</option>
                  <option value="Transition">Transition</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Content: Read Only Info */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Identity & Demographics */}
          <Card glass className="border-white/5 overflow-hidden">
            <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex items-center gap-2">
              <Hash size={18} className="text-blue-400" />
              <h3 className="font-bold text-lg">Identity Details</h3>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Date of Birth</p>
                  <p className="font-bold">{athlete.dob ? new Date(athlete.dob).toLocaleDateString() : "--"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Gender</p>
                  <p className="font-bold">{athlete.gender || "--"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Blood Group</p>
                  <p className="font-bold">{athlete.bloodGroup || "--"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Athlete Number</p>
                  <p className="font-bold">{athlete.athleteNumber || "--"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sports Profile */}
          <Card glass className="border-white/5 overflow-hidden">
            <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex items-center gap-2">
              <Trophy size={18} className="text-amber-400" />
              <h3 className="font-bold text-lg">Sports Profile</h3>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Sport</p>
                  <p className="font-bold">{athlete.sport || "--"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Category</p>
                  <p className="font-bold">{athlete.competitionCategory || "--"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Federation ID</p>
                  <p className="font-bold">{athlete.federationId || "--"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Academy/Club</p>
                  <p className="font-bold">{athlete.academy || "--"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Information - Collapsed */}
          <details className="group border border-rose-500/20 rounded-2xl bg-rose-500/5 overflow-hidden open:bg-rose-500/10 transition-colors">
            <summary className="px-6 py-4 flex items-center gap-2 cursor-pointer outline-none">
              <Phone size={18} className="text-rose-500" />
              <h3 className="font-bold text-lg text-rose-500 flex-1">Emergency Information</h3>
              <div className="text-rose-500/50 group-open:rotate-180 transition-transform">▼</div>
            </summary>
            <div className="px-6 pb-6 pt-2 border-t border-rose-500/10">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <p className="text-xs font-medium text-rose-500/70 mb-1">Parent/Guardian</p>
                  <p className="font-bold">{athlete.parentGuardianName || "--"} {athlete.parentGuardianPhone ? `(${athlete.parentGuardianPhone})` : ""}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-rose-500/70 mb-1">Emergency Contact</p>
                  <p className="font-bold">{athlete.emergencyContactName || "--"} {athlete.emergencyContactPhone ? `(${athlete.emergencyContactPhone})` : ""}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-rose-500/70 mb-1">Blood Group</p>
                  <p className="font-bold">{athlete.bloodGroup || "--"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-rose-500/70 mb-1">Allergies</p>
                  <p className="font-bold">{athlete.allergies || "None reported"}</p>
                </div>
              </div>
            </div>
          </details>

        </div>
      </div>
    </div>
  );
}
