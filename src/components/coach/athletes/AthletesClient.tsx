"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCoachAthletesWithMetrics } from "@/lib/hooks/useCoachDashboardMetrics";
import { Search, UserPlus, Grid, List, MoreVertical, X, Copy, Check, Trash2, ChevronRight, Users, Link as LinkIcon, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusChip } from "@/components/ui/StatusChip";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

export function AthletesClient() {
  const { user, userData } = useAuth();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [invitations, setInvitations] = useState<any[]>([]);
  
  const { athletes, loading: athletesLoading } = useCoachAthletesWithMetrics();
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [inviteName, setInviteName] = useState("");

  useEffect(() => {
    if (!user) return;

    setLoading(athletesLoading);

    // Fetch pending invitations
    const invQuery = query(
      collection(db, "coachInvitations"), 
      where("coachId", "==", user.uid),
      where("status", "==", "pending")
    );
    const unsubscribeInv = onSnapshot(invQuery, (snapshot) => {
      setInvitations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("AthletesClient: Error fetching coachInvitations:", error);
    });

    return () => {
      unsubscribeInv();
    };
  }, [user, athletesLoading]);

  const generateInviteCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userData) return;
    
    // Strict Validation
    if (!userData.organizationId) {
      console.error("Missing organizationId on user profile:", userData);
      alert("Missing organization context. Please complete your profile setup or contact support.");
      return;
    }

    if (!user.uid) {
      console.error("Missing coachId on authenticated user:", user);
      alert("Authentication error. Please log out and log back in.");
      return;
    }
    
    // Generate a secure random code
    const array = new Uint32Array(2);
    crypto.getRandomValues(array);
    const code = Array.from(array, dec => dec.toString(36)).join('').substring(0, 8).toUpperCase();
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration
    
    const payload = {
      invitationCode: code,
      coachId: user.uid,
      organizationId: userData.organizationId,
      role: 'athlete',
      status: "pending",
      targetName: inviteName,
      createdAt: serverTimestamp(),
      expiresAt: expiresAt.toISOString(),
    };

    console.log("Current UID:", user.uid);
    console.log("Current Coach Profile:", userData);
    console.log("organizationId:", userData.organizationId);
    console.log("Invitation payload:", payload);

    try {
      await addDoc(collection(db, "coachInvitations"), payload);
      setGeneratedCode(code);
      setInviteName("");
    } catch (error) {
      console.error("Error creating invitation:", error);
      alert("Failed to generate invitation. Please try again.");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const copyLinkToClipboard = () => {
    const link = `${window.location.origin}/invite/${generatedCode}`;
    navigator.clipboard.writeText(link);
    setIsLinkCopied(true);
    setTimeout(() => setIsLinkCopied(false), 2000);
  };

  const downloadQRCode = () => {
    const svg = document.getElementById("invite-qr-code");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `Heptafit-Invite-${generatedCode}.png`;
        downloadLink.href = `${pngFile}`;
        downloadLink.click();
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const revokeInvitation = async (id: string) => {
    await deleteDoc(doc(db, "coachInvitations", id));
  };

  const removeAthlete = async (studentId: string) => {
    if (!user || !confirm("Are you sure you want to remove this athlete?")) return;
    
    const relQuery = query(
      collection(db, "coachAthleteRelationships"), 
      where("coachId", "==", user.uid),
      where("studentId", "==", studentId)
    );
    const snap = await getDocs(relQuery);
    snap.forEach(async (d) => {
      await deleteDoc(doc(db, "coachAthleteRelationships", d.id));
    });
  };

  const filteredAthletes = athletes.filter(a => {
    const fullName = `${a.firstName || ''} ${a.lastName || ''}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6 relative z-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Athletes</h1>
          <p className="text-muted-foreground mt-1">Manage your roster, track readiness, and invite new athletes.</p>
        </div>
        <Button onClick={() => { setGeneratedCode(""); setIsInviteModalOpen(true); }} className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20 rounded-full px-6">
          <UserPlus size={18} className="mr-2" />
          Invite Athlete
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card/30 p-2 rounded-2xl border border-white/5 backdrop-blur-md">
        <div className="relative w-full sm:w-96">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search athletes..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background/50 border-white/10 rounded-xl"
          />
        </div>
        <div className="flex bg-background/50 p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Grid size={18} />
          </button>
          <button 
            onClick={() => setViewMode("table")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "table" ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" /></div>
      ) : filteredAthletes.length === 0 ? (
        <EmptyState 
          icon={<Users size={32} />} 
          title="No athletes found" 
          description={searchQuery ? "Try adjusting your search query." : "You haven't added any athletes yet."}
          action={!searchQuery ? { label: "Invite Athlete", onClick: () => setIsInviteModalOpen(true) } : undefined}
        />
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAthletes.map(athlete => (
                <Card key={athlete.uid} glass className="group overflow-hidden border-white/5 hover:border-blue-500/30 transition-all hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]">
                  <CardContent className="p-0">
                    <Link href={`/coach/athletes/${athlete.uid}`} className="block p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 p-[2px] shadow-lg">
                          <div className="w-full h-full bg-card rounded-full flex items-center justify-center font-bold text-lg">
                            {athlete.firstName?.[0] || 'A'}{athlete.lastName?.[0]}
                          </div>
                        </div>
                        <StatusChip status={athlete.status === "Active" ? "active" : athlete.status === "Injured" ? "danger" : "neutral"}>
                          {athlete.status}
                        </StatusChip>
                      </div>
                      <h3 className="font-bold text-lg mb-1 group-hover:text-blue-400 transition-colors">{athlete.firstName} {athlete.lastName}</h3>
                      <p className="text-xs text-muted-foreground mb-4">Active: {athlete.lastActive}</p>
                      
                      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/5">
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-1">Readiness</p>
                          <div className="flex items-center gap-2">
                            <span className={`font-black ${athlete.readiness && athlete.readiness >= 80 ? 'text-emerald-500' : athlete.readiness && athlete.readiness >= 70 ? 'text-blue-500' : athlete.readiness ? 'text-amber-500' : 'text-muted-foreground'}`}>
                              {athlete.readiness !== null ? `${athlete.readiness}%` : '--'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-1">Next Comp</p>
                          <p className="text-sm font-medium">In 12 Days</p>
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card glass className="border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-white/5 border-b border-white/5">
                    <tr>
                      <th className="px-6 py-4 font-bold tracking-wider">Athlete</th>
                      <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                      <th className="px-6 py-4 font-bold tracking-wider">Readiness</th>
                      <th className="px-6 py-4 font-bold tracking-wider">Last Active</th>
                      <th className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAthletes.map(athlete => (
                      <tr key={athlete.uid} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                          <Link href={`/coach/athletes/${athlete.uid}`} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 p-[2px]">
                              <div className="w-full h-full bg-background rounded-full flex items-center justify-center font-bold text-xs">
                                {athlete.firstName?.[0] || 'A'}{athlete.lastName?.[0]}
                              </div>
                            </div>
                            <div className="font-semibold group-hover:text-blue-400 transition-colors">
                              {athlete.firstName} {athlete.lastName}
                            </div>
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <StatusChip status={athlete.status === "Active" ? "active" : athlete.status === "Injured" ? "danger" : "neutral"}>
                            {athlete.status}
                          </StatusChip>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-black ${athlete.readiness && athlete.readiness >= 80 ? 'text-emerald-500' : athlete.readiness && athlete.readiness >= 70 ? 'text-blue-500' : athlete.readiness ? 'text-amber-500' : 'text-muted-foreground'}`}>
                            {athlete.readiness !== null ? `${athlete.readiness}%` : '--'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {athlete.lastActive}
                        </td>
                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                           <Button variant="ghost" size="sm" onClick={() => removeAthlete(athlete.uid)} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}

      {/* Pending Invitations Section */}
      {invitations.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Pending Invitations</h2>
          <Card glass className="border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-white/5 border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4 font-bold tracking-wider">Code</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Athlete Name (Optional)</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                    <th className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invitations.map(inv => (
                    <tr key={inv.id} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                      <td className="px-6 py-4 font-mono font-bold tracking-widest text-blue-400">
                        {inv.code}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {inv.targetName || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-amber-500/20 text-amber-500 px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider">Pending</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => revokeInvitation(inv.id)} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                          Revoke
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Invite Modal */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsInviteModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative w-full max-w-md bg-card border border-white/10 shadow-2xl rounded-2xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Invite Athlete</h3>
                  <button onClick={() => setIsInviteModalOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X size={20} />
                  </button>
                </div>

                {!generatedCode ? (
                  <form onSubmit={generateInviteCode} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Athlete Name (Optional)</label>
                      <Input 
                        placeholder="e.g. Michael Phelps" 
                        value={inviteName}
                        onChange={(e) => setInviteName(e.target.value)}
                        className="bg-background/50 border-white/10"
                      />
                      <p className="text-xs text-muted-foreground mt-2">Generate a unique code to give to your athlete so they can link to your roster.</p>
                    </div>
                    <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-6">
                      Generate Invite Code
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-6 text-center py-4">
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Check size={32} strokeWidth={3} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-1">Invitation Created!</h4>
                      <p className="text-sm text-muted-foreground">Share this code or link with your athlete.</p>
                    </div>

                    <div className="flex justify-center bg-white p-4 rounded-xl mx-auto w-fit">
                      <QRCodeSVG 
                        id="invite-qr-code" 
                        value={`${window.location.origin}/invite/${generatedCode}`} 
                        size={150} 
                        level="M" 
                        includeMargin={false} 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-background/80 border border-white/10 p-3 rounded-xl flex flex-col items-center justify-center col-span-2">
                        <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Invite Code</span>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-2xl font-black tracking-[0.2em] text-blue-400">{generatedCode}</span>
                          <Button variant="ghost" size="icon" onClick={copyToClipboard} className="h-8 w-8 hover:bg-white/10">
                            {isCopied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                          </Button>
                        </div>
                      </div>

                      <Button variant="outline" onClick={copyLinkToClipboard} className="w-full flex items-center justify-center border-white/10">
                        {isLinkCopied ? <Check size={16} className="text-emerald-500 mr-2" /> : <LinkIcon size={16} className="mr-2" />}
                        Copy Link
                      </Button>
                      
                      <Button variant="outline" onClick={downloadQRCode} className="w-full flex items-center justify-center border-white/10">
                        <Download size={16} className="mr-2" />
                        Save QR
                      </Button>
                    </div>

                    <Button onClick={() => setIsInviteModalOpen(false)} variant="ghost" className="w-full rounded-xl hover:bg-white/5">
                      Done
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
