"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, UserPlus, CheckCircle2, ArrowLeft } from "lucide-react";
import { useAuth, UserData } from "@/context/AuthContext";
import { searchStudentByInviteCode, sendCoachInvitation, searchStaffByInviteCode, sendStaffInvitation } from "@/lib/services/coach.service";
import { StudentProfile, CoachProfile, StaffProfile, StaffRole } from "@/lib/types";

import { Input } from "@/components/ui/Input";
import { GlassCard } from "@/components/ui/GlassCard";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { StatusChip } from "@/components/ui/StatusChip";

export default function InviteAthletePage() {
  const router = useRouter();
  const { userData } = useAuth();
  
  const [inviteType, setInviteType] = useState<"athlete" | "staff">("athlete");
  const [inviteCode, setInviteCode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [foundStudent, setFoundStudent] = useState<StudentProfile | null>(null);
  const [foundStaff, setFoundStaff] = useState<StaffProfile | null>(null);
  const [selectedStaffRole, setSelectedStaffRole] = useState<StaffRole>("Assistant Coach");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    
    setIsSearching(true);
    setError(null);
    setFoundStudent(null);
    setFoundStaff(null);
    setSuccess(false);

    try {
      if (inviteType === "athlete") {
        const student = await searchStudentByInviteCode(inviteCode);
        if (student) {
          setFoundStudent(student);
        } else {
          setError("No athlete found with this Invite Code. Please check and try again.");
        }
      } else {
        const staff = await searchStaffByInviteCode(inviteCode);
        if (staff) {
          setFoundStaff(staff);
        } else {
          setError("No staff member found with this Invite Code. Please check and try again.");
        }
      }
    } catch (err: any) {
      setError(err.message || `Failed to search for ${inviteType}.`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendInvite = async () => {
    if ((!foundStudent && !foundStaff) || !userData || !userData.profile) return;
    
    setIsSending(true);
    setError(null);

    try {
      if (inviteType === "athlete" && foundStudent) {
        await sendCoachInvitation(userData.profile as CoachProfile, foundStudent);
      } else if (inviteType === "staff" && foundStaff) {
        await sendStaffInvitation(userData.profile as CoachProfile, foundStaff, selectedStaffRole);
      }
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to send invitation.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      
      <div className="flex items-center gap-4">
        <PremiumButton variant="ghost" size="icon" onClick={() => router.push("/coach")}>
          <ArrowLeft className="w-5 h-5" />
        </PremiumButton>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invite to Organization</h1>
          <p className="text-muted-foreground mt-1">Connect with athletes or staff using their unique Invite Code.</p>
        </div>
      </div>

      <GlassCard className="p-8">
        <div className="flex gap-4 mb-6">
          <PremiumButton 
            variant={inviteType === "athlete" ? "primary" : "outline"} 
            onClick={() => { setInviteType("athlete"); setFoundStudent(null); setFoundStaff(null); setSuccess(false); setError(null); }}
            className="flex-1"
          >
            Invite Athlete
          </PremiumButton>
          <PremiumButton 
            variant={inviteType === "staff" ? "primary" : "outline"} 
            onClick={() => { setInviteType("staff"); setFoundStudent(null); setFoundStaff(null); setSuccess(false); setError(null); }}
            className="flex-1"
          >
            Invite Staff
          </PremiumButton>
        </div>

        <form onSubmit={handleSearch} className="flex gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">{inviteType === "athlete" ? "Athlete" : "Staff"} Invite Code</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder={inviteType === "athlete" ? "e.g. ATH-7KQ4-91XT" : "e.g. STF-1A2B-3C4D"} 
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                className="pl-10 h-12 text-lg uppercase tracking-wider bg-background/50 backdrop-blur-sm font-mono"
              />
            </div>
          </div>
          <PremiumButton type="submit" isLoading={isSearching} className="h-12 px-8">
            Search
          </PremiumButton>
        </form>

        {error && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm font-medium">
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-emerald-500">Invitation Sent!</h3>
              <p className="text-muted-foreground mt-2">
                An invitation has been sent to {inviteType === "athlete" ? foundStudent?.firstName : foundStaff?.firstName} {inviteType === "athlete" ? foundStudent?.lastName : foundStaff?.lastName}. You will be able to access their profile once they accept.
              </p>
            </div>
            <PremiumButton variant="outline" className="mt-4" onClick={() => { setSuccess(false); setFoundStudent(null); setFoundStaff(null); setInviteCode(""); }}>
              Invite Another {inviteType === "athlete" ? "Athlete" : "Staff Member"}
            </PremiumButton>
          </motion.div>
        )}

        {foundStudent && inviteType === "athlete" && !success && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mt-8 pt-8 border-t border-border"
          >
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Athlete Found</h3>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-background/40 rounded-2xl border border-white/5">
              <div className="w-24 h-24 rounded-full bg-accent/20 border-2 border-accent/50 flex items-center justify-center text-3xl font-bold text-accent">
                {foundStudent.firstName[0]}{foundStudent.lastName[0]}
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <h2 className="text-2xl font-bold">{foundStudent.firstName} {foundStudent.lastName}</h2>
                  <StatusChip status="info" dot={false}>ID: {foundStudent.athleteId}</StatusChip>
                </div>
                <div className="text-muted-foreground mt-2 space-y-1">
                  <p>Sport: <span className="text-foreground font-medium">{foundStudent.sport || 'Not specified'}</span></p>
                  <p>Event: <span className="text-foreground font-medium">{foundStudent.event || 'Not specified'}</span></p>
                </div>
              </div>

              <PremiumButton 
                onClick={handleSendInvite} 
                isLoading={isSending}
                leftIcon={<UserPlus className="w-5 h-5" />}
                className="w-full sm:w-auto mt-4 sm:mt-0"
              >
                Send Request
              </PremiumButton>
            </div>
          </motion.div>
        )}

        {foundStaff && inviteType === "staff" && !success && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mt-8 pt-8 border-t border-border"
          >
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Staff Found</h3>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-background/40 rounded-2xl border border-white/5">
              <div className="w-24 h-24 rounded-full bg-accent/20 border-2 border-accent/50 flex items-center justify-center text-3xl font-bold text-accent">
                {foundStaff.firstName[0]}{foundStaff.lastName[0]}
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <h2 className="text-2xl font-bold">{foundStaff.firstName} {foundStaff.lastName}</h2>
                  <StatusChip status="info" dot={false}>ID: {foundStaff.staffId}</StatusChip>
                </div>
                <div className="mt-4">
                  <label className="text-sm font-medium text-muted-foreground">Assign Role</label>
                  <select 
                    value={selectedStaffRole}
                    onChange={(e) => setSelectedStaffRole(e.target.value as StaffRole)}
                    className="mt-1 block w-full bg-background border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  >
                    <option value="Assistant Coach">Assistant Coach</option>
                    <option value="Sprint Coach">Sprint Coach</option>
                    <option value="Throws Coach">Throws Coach</option>
                    <option value="Jump Coach">Jump Coach</option>
                    <option value="Strength Coach">Strength Coach</option>
                    <option value="Nutritionist">Nutritionist</option>
                    <option value="Physiotherapist">Physiotherapist</option>
                    <option value="Sports Scientist">Sports Scientist</option>
                    <option value="Psychologist">Psychologist</option>
                  </select>
                </div>
              </div>

              <PremiumButton 
                onClick={handleSendInvite} 
                isLoading={isSending}
                leftIcon={<UserPlus className="w-5 h-5" />}
                className="w-full sm:w-auto mt-4 sm:mt-0"
              >
                Send Request
              </PremiumButton>
            </div>
          </motion.div>
        )}

      </GlassCard>
    </div>
  );
}
