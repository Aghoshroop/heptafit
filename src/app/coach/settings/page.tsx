"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Bell, Lock, Shield, Building2 } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, collection, query, where, onSnapshot, addDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export default function CoachSettingsPage() {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Form State
  const [orgName, setOrgName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  
  // Training Groups State
  const [groups, setGroups] = useState<any[]>([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [groupLoading, setGroupLoading] = useState(false);

  useEffect(() => {
    if (!userData?.uid) return;

    setFirstName(userData.firstName || "");
    setLastName(userData.lastName || "");

    const fetchOrg = async () => {
      if (userData.organizationId) {
        const orgDoc = await getDoc(doc(db, "organizations", userData.organizationId));
        if (orgDoc.exists()) {
          setOrgName(orgDoc.data().name);
        } else {
          // Fallback if no org document exists for some reason
          setOrgName("Elite Athletics Academy");
        }
      }
      setInitialLoad(false);
    };

    fetchOrg();

    // Listen to Training Groups
    if (userData.organizationId) {
      const q = query(collection(db, "trainingGroups"), where("organizationId", "==", userData.organizationId));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const loadedGroups = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setGroups(loadedGroups);
      });
      return () => unsubscribe();
    }
  }, [userData]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData?.uid) return;
    
    setLoading(true);
    try {
      // Update User profile
      await updateDoc(doc(db, "users", userData.uid), {
        firstName,
        lastName,
        updatedAt: serverTimestamp()
      });

      // Update Organization
      if (userData.organizationId) {
        // We use setDoc with merge in case the document doesn't exist yet (for dev users)
        const orgRef = doc(db, "organizations", userData.organizationId);
        const orgSnap = await getDoc(orgRef);
        if (orgSnap.exists()) {
          await updateDoc(orgRef, {
            name: orgName,
            updatedAt: serverTimestamp()
          });
        }
      }
      
      toast.success("Academy settings updated successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  const handleAddGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim() || !userData?.organizationId) return;
    
    setGroupLoading(true);
    try {
      await addDoc(collection(db, "trainingGroups"), {
        organizationId: userData.organizationId,
        name: newGroupName.trim(),
        createdAt: serverTimestamp()
      });
      setNewGroupName("");
      toast.success("Training group added");
    } catch (error) {
      console.error("Error adding group:", error);
      toast.error("Failed to add training group");
    } finally {
      setGroupLoading(false);
    }
  };

  const handleRemoveGroup = async (groupId: string) => {
    try {
      await deleteDoc(doc(db, "trainingGroups", groupId));
      toast.success("Training group removed");
    } catch (error) {
      console.error("Error removing group:", error);
      toast.error("Failed to remove training group");
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div>
        <h1 className="text-3xl font-black tracking-tight">System Settings</h1>
        <p className="text-muted-foreground mt-1">Manage academy preferences and system defaults.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="md:col-span-1 space-y-2">
          <Button variant="ghost" className="w-full justify-start bg-accent/50 text-foreground font-medium">
            <Building2 size={18} className="mr-3" /> Academy
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
            <Shield size={18} className="mr-3" /> Permissions
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
            <Bell size={18} className="mr-3" /> Defaults
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
            <Lock size={18} className="mr-3" /> Security
          </Button>
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-6">
          <Card glass hoverEffect>
            <CardHeader>
              <CardTitle>Academy Profile</CardTitle>
              <CardDescription>Update your organization's global settings.</CardDescription>
            </CardHeader>
            <CardContent>
              {initialLoad ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Organization Name</label>
                    <Input 
                      value={orgName} 
                      onChange={(e) => setOrgName(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Head Coach First Name</label>
                      <Input 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Head Coach Last Name</label>
                      <Input 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contact Email</label>
                    <Input defaultValue={userData?.email || ""} disabled />
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          <Card glass hoverEffect>
            <CardHeader>
              <CardTitle>Training Groups</CardTitle>
              <CardDescription>Manage dynamic training groupings for athletes.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  {initialLoad ? (
                    <Skeleton className="h-12 w-full" />
                  ) : groups.length === 0 ? (
                    <EmptyState 
                      compact
                      icon={<Building2 size={20} />}
                      title="No Training Groups"
                      description="Create your first training group below."
                      className="bg-white/5 border-none"
                    />
                  ) : (
                    groups.map((group) => (
                      <div key={group.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-white/5 hover:bg-white/5 transition-colors">
                        <span className="font-semibold">{group.name}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive h-8 px-3 hover:bg-destructive/20"
                          onClick={() => handleRemoveGroup(group.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))
                  )}
                </div>
                
                <form onSubmit={handleAddGroup} className="flex gap-2 pt-2 border-t border-white/10 mt-4">
                  <Input 
                    placeholder="New group name (e.g. Sprinters)..." 
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    required
                  />
                  <Button type="submit" variant="secondary" disabled={groupLoading}>
                    {groupLoading ? "Adding..." : "Add Group"}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
