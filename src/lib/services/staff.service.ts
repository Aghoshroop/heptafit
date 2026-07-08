import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, writeBatch, serverTimestamp } from "firebase/firestore";
import { StaffInvitation, StaffRelationship } from "@/lib/types";

/**
 * Fetches pending invitations for a specific staff member.
 */
export const getPendingStaffInvitations = async (staffId: string): Promise<StaffInvitation[]> => {
  if (!staffId) return [];

  const invitesRef = collection(db, "staffInvitations");
  const q = query(
    invitesRef, 
    where("staffId", "==", staffId),
    where("status", "==", "pending")
  );
  
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) return [];
  
  return snapshot.docs.map(doc => doc.data() as StaffInvitation);
};

/**
 * Staff accepts an invitation from a head coach.
 */
export const acceptStaffInvitation = async (invitation: StaffInvitation) => {
  const batch = writeBatch(db);
  
  // 1. Update invitation status
  const inviteRef = doc(db, "staffInvitations", invitation.id);
  batch.update(inviteRef, {
    status: "accepted",
    updatedAt: serverTimestamp()
  });

  // 2. Create Relationship
  const relationshipRef = doc(collection(db, "staffRelationships"));
  
  const newRelationship: Partial<StaffRelationship> = {
    id: relationshipRef.id,
    headCoachId: invitation.headCoachId,
    staffId: invitation.staffId,
    organizationId: invitation.organizationId,
    staffRole: invitation.role,
    permissions: {
      viewTraining: true,
      editTraining: false,
      viewMedical: false,
      editMedical: false,
      viewNutrition: false,
      editNutrition: false,
    },
    status: "active",
    assignedBy: invitation.headCoachId,
    assignedAt: serverTimestamp() as any
  };

  batch.set(relationshipRef, newRelationship);
  
  await batch.commit();
};

/**
 * Staff declines an invitation.
 */
export const declineStaffInvitation = async (invitationId: string) => {
  const batch = writeBatch(db);
  const inviteRef = doc(db, "staffInvitations", invitationId);
  batch.update(inviteRef, {
    status: "declined",
    updatedAt: serverTimestamp()
  });
  await batch.commit();
};
