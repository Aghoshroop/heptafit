"use client";

import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatDistanceToNow } from "date-fns";
import { InvitationCreatedModal } from "./InvitationCreatedModal";
import { Copy, Link2 } from "lucide-react";

export function PendingInvitationsList() {
  const { userData } = useAuth();
  const [invites, setInvites] = useState<any[]>([]);
  const [selectedInvite, setSelectedInvite] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!userData?.organizationId) return;
    
    const invitesQ = query(
      collection(db, "coachInvitations"), 
      where("organizationId", "==", userData.organizationId),
      where("coachId", "==", userData.uid),
      where("status", "==", "pending")
    );
    
    const unsub = onSnapshot(invitesQ, (snap) => {
      const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort by createdAt desc manually if indexing isn't set up yet
      docs.sort((a: any, b: any) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });
      setInvites(docs);
    }, (error) => {
      console.error("PendingInvitationsList: Error fetching coachInvitations:", error);
    });

    return () => unsub();
  }, [userData?.organizationId]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, "coachInvitations", id));
    } catch (error) {
      console.error("Failed to delete invitation", error);
    }
  };

  const handleOpenInvite = (invite: any) => {
    const inviteUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/join?code=${invite.invitationCode}`;
    setSelectedInvite({
      athleteName: invite.athleteName || invite.email || "Unnamed Athlete",
      category: invite.category || "General",
      primaryEvent: invite.primaryEvent || "General",
      groupName: invite.groupName || "Unassigned",
      invitationCode: invite.invitationCode,
      inviteUrl,
      status: invite.status || "pending"
    });
    setIsModalOpen(true);
  };

  return (
    <div className="bg-[#11141A] rounded-xl border border-[#1F2937] flex flex-col flex-1 min-h-0">
      <div className="p-5 flex items-center justify-between border-b border-[#1F2937]">
        <h3 className="text-sm font-semibold text-white">Pending Invitations</h3>
        <button className="text-[10px] text-[#8B5CF6] hover:text-[#7C3AED] transition-colors">
          View All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
        {invites.length === 0 ? (
          <div className="text-center text-xs text-[#6B7280] py-6">
            No pending invitations.
          </div>
        ) : (
          invites.map((invite) => {
            let timeStr = "Recently";
            if (invite.createdAt?.toMillis) {
              timeStr = formatDistanceToNow(invite.createdAt.toMillis(), { addSuffix: true });
            }
            const nameStr = invite.athleteName || invite.email || "Unknown";
            const initials = nameStr.substring(0, 2).toUpperCase();

            return (
              <div 
                key={invite.id} 
                onClick={() => handleOpenInvite(invite)}
                className="flex items-center gap-3 group p-2 hover:bg-[#1F2937]/30 rounded-lg cursor-pointer transition-colors -mx-2"
              >
                <div className="w-8 h-8 rounded-full bg-[#1F2937] border border-[#374151] flex items-center justify-center shrink-0 text-[10px] font-bold text-[#E5E7EB]">
                  {initials}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-semibold text-white truncate">{nameStr}</h4>
                    <span className="text-[9px] text-[#9CA3AF] bg-[#1F2937] px-1.5 py-0.5 rounded border border-[#374151] truncate hidden xl:inline-block">
                      {invite.groupName || "Unassigned"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    {invite.category && (
                      <span className="text-[10px] text-[#8B5CF6] truncate font-medium">{invite.category} • {invite.primaryEvent}</span>
                    )}
                    {!invite.category && (
                      <p className="text-[10px] text-[#6B7280] truncate">{invite.email}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[9px] font-medium text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded">Pending</span>
                  <span className="text-[9px] text-[#6B7280] hidden 2xl:inline-block">{timeStr}</span>
                  <button 
                    onClick={(e) => handleDelete(e, invite.id)}
                    className="w-7 h-7 flex items-center justify-center rounded border border-[#374151] text-[#6B7280] hover:text-[#EF4444] hover:bg-[#EF4444]/10 hover:border-[#EF4444]/30 transition-colors opacity-0 group-hover:opacity-100"
                    title="Revoke Invitation"
                  >
                    <Trash2 size={12} />
                  </button>
                  <button 
                    className="w-7 h-7 flex items-center justify-center rounded border border-[#374151] text-[#8B5CF6] hover:text-white hover:bg-[#8B5CF6] transition-colors opacity-0 group-hover:opacity-100"
                    title="View Invitation Details"
                  >
                    <Link2 size={12} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="p-4 border-t border-[#1F2937]">
        <button className="text-[10px] text-[#8B5CF6] hover:text-[#7C3AED] transition-colors">
          View All Invitations →
        </button>
      </div>

      <InvitationCreatedModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedInvite}
      />
    </div>
  );
}
