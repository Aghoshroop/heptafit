"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Edit2, Users, Trash2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export function DreamyGroupsManager() {
  const { userData } = useAuth();
  const [groups, setGroups] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: "", type: "Group", desc: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userData?.organizationId) return;
    
    const q = query(
      collection(db, "groups"), 
      where("organizationId", "==", userData.organizationId)
    );
    
    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGroups(docs);
    });

    return () => unsub();
  }, [userData?.organizationId]);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData?.organizationId || !newGroup.name.trim()) return;
    
    setLoading(true);
    try {
      await addDoc(collection(db, "groups"), {
        ...newGroup,
        organizationId: userData.organizationId,
        createdBy: userData.uid,
        createdAt: serverTimestamp(),
        members: 0,
        coaches: 1,
        color: "text-[#3B82F6]",
        bg: "bg-[#3B82F6]/10"
      });
      setIsModalOpen(false);
      setNewGroup({ name: "", type: "Group", desc: "" });
    } catch (err) {
      console.error("Failed to create group", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (id: string) => {
    if (!confirm("Are you sure you want to delete this group?")) return;
    try {
      await deleteDoc(doc(db, "groups", id));
    } catch (err) {
      console.error("Failed to delete group", err);
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border flex flex-col h-full overflow-hidden">
      
      {/* Header */}
      <div className="p-5 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground mb-1">Team & Groups Management</h3>
        <p className="text-[10px] text-muted-foreground mb-4">Organize your athletes and coaches into teams and groups.</p>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-6 text-xs">
            <button className="text-foreground border-b-2 border-[#8B5CF6] pb-2 font-medium">Groups (6)</button>
            <button className="text-muted-foreground hover:text-foreground pb-2 transition-colors">Coaches (2)</button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search groups..." 
                className="bg-transparent border border-border rounded-lg pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8B5CF6] transition-colors w-[200px]"
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 bg-[#8B5CF6] text-foreground rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-[#7C3AED] transition-colors shadow-lg shadow-indigo-500/20"
            >
              <Plus size={14} /> New Group
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto no-scrollbar p-5">
        <table className="w-full text-xs text-left">
          <thead className="text-[9px] text-muted-foreground uppercase tracking-wider sticky top-0 bg-card z-10">
            <tr>
              <th className="pb-3 font-semibold px-2">Group Name</th>
              <th className="pb-3 font-semibold">Type</th>
              <th className="pb-3 font-semibold">Members</th>
              <th className="pb-3 font-semibold">Coaches</th>
              <th className="pb-3 font-semibold">Description</th>
              <th className="pb-3 font-semibold text-right px-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1F2937]">
            {groups.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground">
                  No groups created yet.
                </td>
              </tr>
            ) : (
              groups.map((group) => (
              <tr key={group.id} className="group hover:bg-accent transition-colors">
                <td className="py-2.5 px-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${group.bg || "bg-[#3B82F6]/10"}`}>
                      <Users size={12} className={group.color || "text-[#3B82F6]"} />
                    </div>
                    <div>
                      <span className="text-[#E2E8F0] font-medium block">{group.name}</span>
                      <span className="text-[9px] text-muted-foreground">{group.type === "Team" ? "Primary Team" : "Performance Group"}</span>
                    </div>
                  </div>
                </td>
                <td className="py-2.5">
                  <span className={`text-[9px] font-medium px-2 py-0.5 rounded border border-[#8B5CF6]/30 text-[#8B5CF6] bg-[#8B5CF6]/10`}>
                    {group.type}
                  </span>
                </td>
                <td className="py-2.5">
                  <div className="flex items-center -space-x-1">
                    <div className="w-5 h-5 rounded-full border border-background bg-secondary text-muted-foreground text-[8px] flex items-center justify-center font-bold">
                      {group.members || 0}
                    </div>
                  </div>
                </td>
                <td className="py-2.5">
                  <div className="flex items-center -space-x-1">
                    <div className="w-5 h-5 rounded-full border border-background bg-secondary text-muted-foreground text-[8px] flex items-center justify-center font-bold">
                      {group.coaches || 0}
                    </div>
                  </div>
                </td>
                <td className="py-2.5 text-muted-foreground text-[10px]">{group.desc}</td>
                <td className="py-2.5 text-right px-2">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><Edit2 size={12} /></button>
                    <button className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><Users size={12} /></button>
                    <button 
                      onClick={() => handleDeleteGroup(group.id)}
                      className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-[#EF4444] transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border flex items-center justify-between text-muted-foreground text-[10px]">
        <button className="text-[#8B5CF6] hover:text-[#7C3AED] transition-colors">View archived groups (0)</button>
        <div>Showing 1 to {groups.length} of {groups.length} groups</div>
      </div>

      {/* New Group Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl w-[400px] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-foreground font-semibold text-sm">Create New Group</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={handleCreateGroup} className="p-4 space-y-4">
              <div>
                <label className="block text-[10px] font-medium text-muted-foreground mb-1.5">Group Name</label>
                <input 
                  type="text" 
                  value={newGroup.name}
                  onChange={(e) => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
                  required
                  placeholder="e.g. Sprint Squad"
                  className="w-full bg-transparent border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8B5CF6] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-medium text-muted-foreground mb-1.5">Type</label>
                <select 
                  value={newGroup.type}
                  onChange={(e) => setNewGroup(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full bg-transparent border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8B5CF6] transition-colors"
                >
                  <option value="Team" className="bg-card">Primary Team</option>
                  <option value="Group" className="bg-card">Performance Group</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-muted-foreground mb-1.5">Description (Optional)</label>
                <textarea 
                  value={newGroup.desc}
                  onChange={(e) => setNewGroup(prev => ({ ...prev, desc: e.target.value }))}
                  placeholder="What is this group for?"
                  rows={2}
                  className="w-full bg-transparent border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8B5CF6] transition-colors resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-foreground rounded-lg px-4 py-2 text-xs font-medium transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Group"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
