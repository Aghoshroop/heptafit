"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { Loader2, Plus, Users, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

export default function CoachGroupsPage() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<any[]>([]);
  const [athletes, setAthletes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isCreating, setIsCreating] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    // Fetch Athletes
    const fetchAthletes = async () => {
      const usersSnap = await getDocs(collection(db, "athletes"));
      setAthletes(usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchAthletes();

    // Listen to Groups
    const q = query(collection(db, "groups"), where("coachId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setGroups(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newGroupName.trim()) return;
    
    setIsCreating(true);
    try {
      await addDoc(collection(db, "groups"), {
        name: newGroupName,
        description: newGroupDesc,
        coachId: user.uid,
        athleteIds: [],
        createdAt: new Date()
      });
      setNewGroupName("");
      setNewGroupDesc("");
      toast.success("Group created successfully");
    } catch (err) {
      toast.error("Failed to create group");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteGroup = async (id: string) => {
    if (!confirm("Are you sure you want to delete this group?")) return;
    try {
      await deleteDoc(doc(db, "groups", id));
      toast.success("Group deleted");
    } catch (err) {
      toast.error("Failed to delete group");
    }
  };

  const toggleAthleteInGroup = async (groupId: string, currentAthleteIds: string[], athleteId: string) => {
    try {
      const newAthleteIds = currentAthleteIds.includes(athleteId)
        ? currentAthleteIds.filter(id => id !== athleteId)
        : [...currentAthleteIds, athleteId];
        
      await updateDoc(doc(db, "groups", groupId), {
        athleteIds: newAthleteIds
      });
    } catch (err) {
      toast.error("Failed to update group members");
    }
  };

  if (loading) return <Skeleton className="w-full h-[600px] rounded-xl" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Training Groups</h1>
        <p className="text-muted-foreground mt-1">Organize athletes into groups for bulk scheduling and filtering.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Create Group Form */}
        <Card glass className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Create New Group</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Group Name</label>
                <Input 
                  value={newGroupName} 
                  onChange={e => setNewGroupName(e.target.value)} 
                  placeholder="e.g. Sprinters, U18"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description (Optional)</label>
                <Input 
                  value={newGroupDesc} 
                  onChange={e => setNewGroupDesc(e.target.value)} 
                  placeholder="Short description..."
                />
              </div>
              <Button type="submit" disabled={isCreating} className="w-full">
                {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Create Group
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Groups List */}
        <div className="lg:col-span-2 space-y-4">
          {groups.length === 0 ? (
            <div className="text-center p-12 border-2 border-dashed rounded-xl text-muted-foreground">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p>No training groups created yet.</p>
            </div>
          ) : (
            groups.map(group => (
              <Card key={group.id} glass className="overflow-hidden">
                <CardHeader className="bg-muted/30 border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{group.name}</CardTitle>
                      {group.description && <CardDescription className="mt-1">{group.description}</CardDescription>}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditingGroupId(editingGroupId === group.id ? null : group.id)}>
                        {editingGroupId === group.id ? "Done" : "Manage Athletes"}
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDeleteGroup(group.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {editingGroupId === group.id ? (
                    <div className="p-4 bg-card max-h-[300px] overflow-y-auto">
                      <p className="text-sm font-medium mb-3">Select athletes to include in this group:</p>
                      <div className="space-y-2">
                        {athletes.map(athlete => {
                          const isMember = (group.athleteIds || []).includes(athlete.id);
                          return (
                            <div key={athlete.id} className="flex items-center justify-between p-2 rounded hover:bg-muted/50 border">
                              <span className="text-sm font-medium">{athlete.firstName || "Unknown"} {athlete.lastName || ""}</span>
                              <Button 
                                size="sm" 
                                variant={isMember ? "default" : "outline"} 
                                onClick={() => toggleAthleteInGroup(group.id, group.athleteIds || [], athlete.id)}
                              >
                                {isMember ? "Remove" : "Add"}
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="p-6">
                      <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                        <Users size={16} />
                        Members ({(group.athleteIds || []).length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {(group.athleteIds || []).length === 0 ? (
                          <span className="text-sm text-muted-foreground italic">No members assigned</span>
                        ) : (
                          athletes.filter(a => (group.athleteIds || []).includes(a.id)).map(athlete => (
                            <span key={athlete.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                              {athlete.firstName || "Unknown"} {athlete.lastName || ""}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
