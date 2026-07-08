"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Shield, Check, X, Building, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { useRouter } from "next/navigation";
import { logActivity } from "@/lib/activityService";
import { getPendingStaffInvitations, acceptStaffInvitation, declineStaffInvitation } from "@/lib/services/staff.service";
import { StaffInvitation } from "@/lib/types";

export function StaffPortalClient() {
  const { user, userData, logout } = useAuth();
  const [invitations, setInvitations] = useState<any[]>([]);
  const [activeOrgs, setActiveOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const fetchPendingInvites = async () => {
      try {
        const pending = await getPendingStaffInvitations(user.uid);
        
        // Enrich with organization names
        const enrichWithOrgName = async (rels: any[]) => {
          return Promise.all(rels.map(async (rel) => {
            try {
              const orgDoc = await getDoc(doc(db, "organizations", rel.organizationId));
              return {
                ...rel,
                organizationName: orgDoc.exists() ? orgDoc.data().name : "Unknown Organization"
              };
            } catch {
              return { ...rel, organizationName: "Unknown Organization" };
            }
          }));
        };

        setInvitations(await enrichWithOrgName(pending));
      } catch (err) {
        console.error("Error fetching staff invites", err);
      }
    };

    fetchPendingInvites();

    // Fetch active assignments where staffId == user.uid
    const q = query(
      collection(db, "staffRelationships"), 
      where("staffId", "==", user.uid),
      where("status", "==", "active")
    );
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const active = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      
      const enrichWithOrgName = async (rels: any[]) => {
        return Promise.all(rels.map(async (rel) => {
          try {
            const orgDoc = await getDoc(doc(db, "organizations", rel.organizationId));
            return {
              ...rel,
              organizationName: orgDoc.exists() ? orgDoc.data().name : "Unknown Organization"
            };
          } catch {
            return { ...rel, organizationName: "Unknown Organization" };
          }
        }));
      };

      setActiveOrgs(await enrichWithOrgName(active));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAccept = async (invitation: any) => {
    if (!user) return;

    await acceptStaffInvitation(invitation);

    // Update user's coach doc with this organizationId 
    // (If they are in multiple orgs, they might need a way to switch, but for now we set it as primary)
    const userDocRef = doc(db, "coaches", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (!userDocSnap.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        organizationId: invitation.organizationId,
        firstName: userData?.firstName || "Staff",
        lastName: userData?.lastName || "Member",
        createdAt: serverTimestamp(),
      });
    } else {
      await updateDoc(userDocRef, {
        organizationId: invitation.organizationId
      });
    }

    await logActivity({
      actorId: user.uid,
      actorName: userData?.firstName ? `${userData.firstName} ${userData.lastName}` : "Staff Member",
      actorRole: invitation.staffRole,
      athleteId: "system", 
      module: "staff",
      action: "assigned",
      title: "Staff Assignment Accepted",
      description: `Accepted invitation to join ${invitation.organizationName}`,
    });

    // After accepting, if they have active orgs, route them to coach dashboard
    router.push("/coach");
  };

  const handleDecline = async (invitationId: string) => {
    if (!confirm("Are you sure you want to decline this invitation?")) return;
    await declineStaffInvitation(invitationId);
    setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
  };

  const handleEnterOrg = async (org: any) => {
    // If they have multiple orgs, this switches their active org
    const userDocRef = doc(db, "coaches", user?.uid!);
    await updateDoc(userDocRef, {
      organizationId: org.organizationId
    });
    router.push("/coach");
  };

  if (loading) {
    return <div className="flex justify-center p-12"><div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
          <Shield size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-black tracking-tight">Staff Portal</h1>
        <p className="text-muted-foreground mt-2">Manage your organization assignments and invitations.</p>
      </div>

      {invitations.length > 0 && (
        <Card glass className="border-emerald-500/20 shadow-[0_0_30px_-5px_rgba(16,185,129,0.1)]">
          <CardHeader>
            <CardTitle className="text-emerald-500 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              Pending Invitations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {invitations.map(inv => (
              <div key={inv.id} className="p-4 rounded-xl bg-background/50 border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-bold text-lg">{inv.organizationName || "Unknown Organization"}</h3>
                  <p className="text-sm text-muted-foreground">Invited you as <span className="font-semibold text-foreground capitalize">{inv.role?.replace("_", " ") || "Staff Member"}</span></p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button variant="outline" className="flex-1 sm:flex-none border-white/10 hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDecline(inv.id)}>
                    <X size={16} className="mr-1" /> Decline
                  </Button>
                  <Button className="flex-1 sm:flex-none bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => handleAccept(inv)}>
                    <Check size={16} className="mr-1" /> Accept
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-xl font-bold mb-4 px-2">Your Organizations</h2>
        {activeOrgs.length === 0 ? (
          <EmptyState 
            icon={<Building size={32} />} 
            title="No Active Organizations" 
            description="You haven't joined any organizations yet. Wait for a Head Coach to invite you."
          />
        ) : (
          <div className="grid gap-4">
            {activeOrgs.map(org => (
              <Card key={org.id} glass className="group border-white/5 hover:border-emerald-500/30 transition-colors cursor-pointer" onClick={() => handleEnterOrg(org)}>
                <CardContent className="p-5 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center font-bold text-xl">
                      {org.organizationName[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-emerald-500 transition-colors">{org.organizationName}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{org.staffRole?.replace("_", " ")}</p>
                    </div>
                  </div>
                  <Button variant="ghost" className="group-hover:bg-emerald-500/10 group-hover:text-emerald-500">
                    Enter Portal
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="pt-8 text-center">
        <Button variant="ghost" onClick={logout} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
          <LogOut size={16} className="mr-2" /> Sign Out
        </Button>
      </div>
    </div>
  );
}
