"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Search, UserPlus, Grid, List, X, Shield, Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusChip } from "@/components/ui/StatusChip";
import { motion, AnimatePresence } from "framer-motion";
import { logActivity } from "@/lib/activityService";

export function TeamClient() {
  const { user, userData } = useAuth();
  const [activeTab, setActiveTab] = useState<"directory" | "groups">("directory");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [staffMembers, setStaffMembers] = useState<any[]>([]);
  const [trainingGroups, setTrainingGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("support_staff");
  const [targetType, setTargetType] = useState("organization");
  const [inviteStatus, setInviteStatus] = useState<"idle" | "searching" | "success" | "error">("idle");
  const [inviteMessage, setInviteMessage] = useState("");

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

  useEffect(() => {
    if (!user || !userData?.organizationId) return;

    // Fetch staff relationships
    const relQuery = query(
      collection(db, "staffRelationships"), 
      where("organizationId", "==", userData.organizationId)
    );
    
    const unsubscribeRel = onSnapshot(relQuery, (snapshot) => {
      const relationships = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const staffIds = relationships.map((rel: any) => rel.staffId);

      if (staffIds.length === 0) {
        setStaffMembers([]);
        setLoading(false);
        return;
      }

      const usersQuery = query(collection(db, "users"));
      const unsubscribeUsers = onSnapshot(usersQuery, (userSnapshot) => {
        const staffDocs = userSnapshot.docs
          .map(d => ({ uid: d.id, ...d.data() }))
          .filter(u => staffIds.includes(u.uid));
        
        const enriched = relationships.map((rel: any) => {
          const staffUser = staffDocs.find(s => s.uid === rel.staffId);
          return { ...rel, staffUser };
        });
        
        setStaffMembers(enriched);
        setLoading(false);
      });

      return () => unsubscribeUsers();
    });

    // Fetch training groups
    const groupsQuery = query(
      collection(db, "trainingGroups"),
      where("organizationId", "==", userData.organizationId)
    );
    const unsubscribeGroups = onSnapshot(groupsQuery, (snapshot) => {
      setTrainingGroups(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeRel();
      unsubscribeGroups();
    };
  }, [user, userData]);

  const handleInviteStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userData?.organizationId) return;
    
    setInviteStatus("searching");
    
    try {
      // Find user by email
      const usersQuery = query(collection(db, "users"), where("email", "==", inviteEmail.toLowerCase()));
      const userSnapshot = await getDocs(usersQuery);
      
      if (userSnapshot.empty) {
        setInviteStatus("error");
        setInviteMessage("No user found with this email. Ensure they have registered first.");
        return;
      }

      const staffUser = userSnapshot.docs[0];
      
      // Create assignment
      await addDoc(collection(db, "staffRelationships"), {
        organizationId: userData.organizationId,
        headCoachId: user.uid,
        staffId: staffUser.id,
        staffRole: inviteRole,
        targetType: targetType,
        status: "pending_acceptance",
        permissions: {
          canViewAthletes: true,
          canEditAthletes: inviteRole === "assistant_coach",
          canViewAnalytics: true,
        },
        assignedBy: user.uid,
        assignedAt: serverTimestamp(),
      });
      
      await logActivity({
        actorId: user.uid,
        actorName: userData?.firstName ? `${userData.firstName} ${userData.lastName}` : "Coach",
        actorRole: "Head Coach",
        organizationId: userData.organizationId,
        athleteId: "system", 
        module: "staff",
        action: "assigned",
        title: "Staff Assignment Created",
        description: `Invited ${staffUser.data().email} as ${inviteRole}`,
      });
      
      setInviteStatus("success");
      setInviteMessage("Invitation sent successfully! Staff will see this on their dashboard.");
      setTimeout(() => {
        setIsInviteModalOpen(false);
        setInviteStatus("idle");
        setInviteEmail("");
      }, 2000);
      
    } catch (err: any) {
      setInviteStatus("error");
      setInviteMessage(err.message || "An error occurred");
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userData?.organizationId) return;
    
    await addDoc(collection(db, "trainingGroups"), {
      organizationId: userData.organizationId,
      name: groupName,
      description: groupDescription,
      athletes: [],
      createdAt: serverTimestamp()
    });
    
    setIsGroupModalOpen(false);
    setGroupName("");
    setGroupDescription("");
  };

  const removeStaff = async (relationshipId: string) => {
    if (!user || !confirm(`Are you sure you want to remove this assignment?`)) return;
    await deleteDoc(doc(db, "staffRelationships", relationshipId));
  };

  const filteredStaff = staffMembers.filter(s => {
    const email = s.staffUser?.email?.toLowerCase() || "";
    return email.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6 relative z-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Team Management</h1>
          <p className="text-muted-foreground mt-1">Manage staff, assignments, and training groups.</p>
        </div>
        <div className="flex gap-2">
          {activeTab === "groups" ? (
            <Button onClick={() => setIsGroupModalOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white rounded-full">
              <Plus size={18} className="mr-2" /> Create Group
            </Button>
          ) : (
            <Button onClick={() => { setInviteStatus("idle"); setIsInviteModalOpen(true); }} className="bg-blue-500 hover:bg-blue-600 text-white rounded-full">
              <UserPlus size={18} className="mr-2" /> Assign Staff
            </Button>
          )}
        </div>
      </div>

      <div className="flex border-b border-white/10 mb-6">
        <button 
          className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === "directory" ? "border-blue-500 text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          onClick={() => setActiveTab("directory")}
        >
          Staff Directory
        </button>
        <button 
          className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === "groups" ? "border-blue-500 text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          onClick={() => setActiveTab("groups")}
        >
          Training Groups
        </button>
      </div>

      {activeTab === "directory" && (
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card/30 p-2 rounded-2xl border border-white/5 backdrop-blur-md">
            <div className="relative w-full sm:w-96">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search staff by email..." 
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
          ) : filteredStaff.length === 0 ? (
            <EmptyState 
              icon={<Shield size={32} />} 
              title="No staff assigned" 
              description={searchQuery ? "No staff match your search." : "Assign staff to your organization to get started."}
              action={!searchQuery ? { label: "Assign Staff", onClick: () => setIsInviteModalOpen(true) } : undefined}
            />
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredStaff.map(staff => (
                <Card key={staff.id} glass className="group border-white/5 transition-all hover:border-blue-500/30">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center font-bold">
                          {staff.staffUser?.email?.[0].toUpperCase() || "S"}
                        </div>
                        <div>
                          <p className="font-bold">{staff.staffUser?.email}</p>
                          <p className="text-xs text-blue-400 font-semibold uppercase">{staff.staffRole.replace("_", " ")}</p>
                        </div>
                      </div>
                      <StatusChip status={staff.status === "pending_acceptance" ? "warning" : "success"}>
                        {staff.status === "pending_acceptance" ? "Pending" : "Active"}
                      </StatusChip>
                    </div>
                    <div className="mt-4 flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Scope: <span className="text-foreground capitalize">{staff.targetType.replace("group:", "Group ")}</span></span>
                      <Button variant="ghost" size="sm" onClick={() => removeStaff(staff.id)} className="text-muted-foreground hover:text-destructive h-8">
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card glass className="border-white/5 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-white/5 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Scope</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map(staff => (
                    <tr key={staff.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="px-6 py-4 font-medium">{staff.staffUser?.email}</td>
                      <td className="px-6 py-4 capitalize">{staff.staffRole.replace("_", " ")}</td>
                      <td className="px-6 py-4 capitalize">{staff.targetType.replace("group:", "Group ")}</td>
                      <td className="px-6 py-4">
                        <StatusChip status={staff.status === "pending_acceptance" ? "warning" : "success"}>
                          {staff.status === "pending_acceptance" ? "Pending" : "Active"}
                        </StatusChip>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => removeStaff(staff.id)}>Remove</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </div>
      )}

      {activeTab === "groups" && (
        <div className="space-y-4">
          {trainingGroups.length === 0 ? (
            <EmptyState 
              icon={<Users size={32} />} 
              title="No training groups" 
              description="Create your first training group to organize athletes and staff."
              action={{ label: "Create Group", onClick: () => setIsGroupModalOpen(true) }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trainingGroups.map(group => (
                <Card key={group.id} glass className="border-white/5 hover:border-white/10 transition-colors">
                  <CardContent className="p-5">
                    <h3 className="font-bold text-lg mb-1">{group.name}</h3>
                    {group.description && <p className="text-sm text-muted-foreground mb-4">{group.description}</p>}
                    <div className="flex justify-between items-center text-sm border-t border-white/5 pt-4">
                      <span className="text-muted-foreground">{group.athletes?.length || 0} Athletes</span>
                      <Button variant="ghost" size="sm" className="h-8 text-blue-400 hover:text-blue-300">Manage</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Invite Modal */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsInviteModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} 
              className="relative w-full max-w-md bg-card border border-white/10 shadow-2xl rounded-2xl overflow-hidden p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Assign Staff</h3>
                <button onClick={() => setIsInviteModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleInviteStaff} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Staff Registered Email</label>
                  <Input 
                    type="email" required
                    placeholder="staff@example.com" 
                    value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)}
                    className="bg-background/50 border-white/10"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Role</label>
                  <select 
                    value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full h-10 rounded-xl border bg-background/50 px-3 text-sm border-white/10 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="assistant_coach">Assistant Coach</option>
                    <option value="doctor">Doctor</option>
                    <option value="physiotherapist">Physiotherapist</option>
                    <option value="nutritionist">Nutritionist</option>
                    <option value="sports_scientist">Sports Scientist</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Access Scope</label>
                  <select 
                    value={targetType} onChange={(e) => setTargetType(e.target.value)}
                    className="w-full h-10 rounded-xl border bg-background/50 px-3 text-sm border-white/10 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="organization">Full Organization</option>
                    {trainingGroups.map(g => (
                      <option key={g.id} value={`group:${g.id}`}>Group: {g.name}</option>
                    ))}
                  </select>
                </div>

                {inviteStatus === "error" && (
                  <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20">
                    {inviteMessage}
                  </div>
                )}
                {inviteStatus === "success" && (
                  <div className="p-3 bg-emerald-500/10 text-emerald-500 text-sm rounded-lg border border-emerald-500/20">
                    {inviteMessage}
                  </div>
                )}

                <Button type="submit" disabled={inviteStatus === "searching" || inviteStatus === "success"} className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-6 mt-4">
                  {inviteStatus === "searching" ? "Searching & Assigning..." : "Assign Staff"}
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Group Modal */}
      <AnimatePresence>
        {isGroupModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsGroupModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} 
              className="relative w-full max-w-md bg-card border border-white/10 shadow-2xl rounded-2xl overflow-hidden p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Create Training Group</h3>
                <button onClick={() => setIsGroupModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Group Name</label>
                  <Input 
                    required placeholder="e.g. Sprint Squad" 
                    value={groupName} onChange={(e) => setGroupName(e.target.value)}
                    className="bg-background/50 border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Description (Optional)</label>
                  <Input 
                    placeholder="Short description..." 
                    value={groupDescription} onChange={(e) => setGroupDescription(e.target.value)}
                    className="bg-background/50 border-white/10"
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-6 mt-4">
                  Create Group
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
