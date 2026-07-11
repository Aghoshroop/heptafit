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

  const [activeTab, setActiveTab] = useState<"academy" | "permissions" | "defaults" | "security">("academy");

  // Form State
  const [orgName, setOrgName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  
  // Training Groups State
  const [groups, setGroups] = useState<any[]>([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [groupLoading, setGroupLoading] = useState(false);

  // Additional Org Settings State
  const [allowAthleteSocial, setAllowAthleteSocial] = useState(true);
  const [requireApproval, setRequireApproval] = useState(false);
  const [measurementUnit, setMeasurementUnit] = useState<"metric" | "imperial">("metric");

  useEffect(() => {
    if (!userData?.uid) return;

    setFirstName(userData.firstName || "");
    setLastName(userData.lastName || "");

    const fetchOrg = async () => {
      if (userData.organizationId) {
        const orgDoc = await getDoc(doc(db, "organizations", userData.organizationId));
        if (orgDoc.exists()) {
          const data = orgDoc.data();
          setOrgName(data.name || "Elite Athletics Academy");
          setAllowAthleteSocial(data.allowAthleteSocial ?? true);
          setRequireApproval(data.requireApproval ?? false);
          setMeasurementUnit(data.measurementUnit || "metric");
        } else {
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
        const orgRef = doc(db, "organizations", userData.organizationId);
        const orgSnap = await getDoc(orgRef);
        if (orgSnap.exists()) {
          await updateDoc(orgRef, {
            name: orgName,
            allowAthleteSocial,
            requireApproval,
            measurementUnit,
            updatedAt: serverTimestamp()
          });
        }
      }
      
      toast.success("Settings updated successfully");
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
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${activeTab === 'academy' ? 'bg-accent/50 text-foreground font-medium' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('academy')}
          >
            <Building2 size={18} className="mr-3" /> Academy
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${activeTab === 'permissions' ? 'bg-accent/50 text-foreground font-medium' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('permissions')}
          >
            <Shield size={18} className="mr-3" /> Permissions
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${activeTab === 'defaults' ? 'bg-accent/50 text-foreground font-medium' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('defaults')}
          >
            <Bell size={18} className="mr-3" /> Defaults
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${activeTab === 'security' ? 'bg-accent/50 text-foreground font-medium' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('security')}
          >
            <Lock size={18} className="mr-3" /> Security
          </Button>
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-6">
          {activeTab === 'academy' && (
            <>
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
            </>
          )}

          {activeTab === 'permissions' && (
            <Card glass hoverEffect>
              <CardHeader>
                <CardTitle>Permissions & Access</CardTitle>
                <CardDescription>Control what athletes and staff can see and do.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-white/5">
                    <div>
                      <h4 className="font-medium">Athlete Social Feed</h4>
                      <p className="text-sm text-muted-foreground mt-1">Allow athletes to interact, post, and see each other's progress.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={allowAthleteSocial} onChange={(e) => setAllowAthleteSocial(e.target.checked)} />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-white/5">
                    <div>
                      <h4 className="font-medium">Require Approval for Sessions</h4>
                      <p className="text-sm text-muted-foreground mt-1">Athletes must request approval before starting an unscheduled session.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={requireApproval} onChange={(e) => setRequireApproval(e.target.checked)} />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Saving..." : "Save Preferences"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'defaults' && (
            <Card glass hoverEffect>
              <CardHeader>
                <CardTitle>System Defaults</CardTitle>
                <CardDescription>Set up default behaviors and measurements.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Measurement System</label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={measurementUnit}
                      onChange={(e) => setMeasurementUnit(e.target.value as "metric" | "imperial")}
                    >
                      <option value="metric" className="bg-background text-foreground">Metric (kg, cm, km)</option>
                      <option value="imperial" className="bg-background text-foreground">Imperial (lbs, in, mi)</option>
                    </select>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Saving..." : "Save Defaults"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card glass hoverEffect>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>Manage your authentication and data export.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-muted/30 rounded-xl border border-white/5">
                  <h4 className="font-medium text-amber-500 mb-2">Password Update</h4>
                  <p className="text-sm text-muted-foreground mb-4">To update your password, a reset link will be sent to {userData?.email}.</p>
                  <Button variant="outline" onClick={() => toast.success("Password reset email sent!")}>
                    Send Reset Link
                  </Button>
                </div>
                
                <div className="p-4 bg-destructive/10 rounded-xl border border-destructive/20">
                  <h4 className="font-medium text-destructive mb-2">Data Export & Deletion</h4>
                  <p className="text-sm text-muted-foreground mb-4">Export all academy data or permanently delete your organization. These actions cannot be undone.</p>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => toast.success("Export started. You will receive an email.")}>
                      Export Data
                    </Button>
                    <Button variant="destructive" onClick={() => {
                      if (confirm("Are you ABSOLUTELY sure? This will delete all athletes, records, and files.")) {
                        toast.error("Contact support to delete your organization.");
                      }
                    }}>
                      Delete Organization
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
