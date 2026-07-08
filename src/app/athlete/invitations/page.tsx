"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, CheckCircle2, XCircle, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { acceptCoachInvitation, declineCoachInvitation } from "@/lib/services/athlete.service";
import { CoachInvitation } from "@/lib/types";

import { GlassCard } from "@/components/ui/GlassCard";
import { PremiumButton } from "@/components/ui/PremiumButton";

export default function StudentInvitationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [invitations, setInvitations] = useState<CoachInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "coachInvitations"),
      where("studentId", "==", user.uid),
      where("status", "==", "pending")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const invites = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CoachInvitation[];
      
      // Sort in memory as firestore might require an index for multi-field sorting
      invites.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
      
      setInvitations(invites);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching invitations:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAccept = async (invite: CoachInvitation) => {
    setProcessingId(invite.id);
    try {
      await acceptCoachInvitation(invite);
    } catch (error) {
      console.error("Failed to accept:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (inviteId: string) => {
    setProcessingId(inviteId);
    try {
      await declineCoachInvitation(inviteId);
    } catch (error) {
      console.error("Failed to decline:", error);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      
      <div className="flex items-center gap-4">
        <PremiumButton variant="ghost" size="icon" onClick={() => router.push("/athlete")}>
          <ArrowLeft className="w-5 h-5" />
        </PremiumButton>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coach Requests</h1>
          <p className="text-muted-foreground mt-1">Manage who has access to your performance data.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : invitations.length === 0 ? (
        <GlassCard className="p-12 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
            <UserPlus className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No Pending Requests</h2>
          <p className="text-muted-foreground max-w-md">
            When a coach invites you using your Invite Code, their request will appear here.
          </p>
        </GlassCard>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {invitations.map((invite) => (
              <motion.div
                key={invite.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard hoverEffect className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                      <UserPlus className="w-7 h-7 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{invite.coachName}</h3>
                      <p className="text-muted-foreground">Academy ID: <span className="font-medium text-foreground">{invite.academyId}</span></p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Requested on {invite.createdAt?.toDate().toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <PremiumButton
                      variant="outline"
                      className="flex-1 sm:flex-none border-destructive text-destructive hover:bg-destructive hover:text-white"
                      disabled={processingId !== null}
                      onClick={() => handleDecline(invite.id)}
                      leftIcon={<XCircle className="w-4 h-4" />}
                    >
                      Decline
                    </PremiumButton>
                    <PremiumButton
                      className="flex-1 sm:flex-none bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/25"
                      isLoading={processingId === invite.id}
                      onClick={() => handleAccept(invite)}
                      leftIcon={<CheckCircle2 className="w-4 h-4" />}
                    >
                      Accept Request
                    </PremiumButton>
                  </div>
                  
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

    </div>
  );
}
