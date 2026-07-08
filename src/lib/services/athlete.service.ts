import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, writeBatch, serverTimestamp, getDoc, addDoc } from "firebase/firestore";
import { CoachInvitation, CoachAthleteRelationship, StudentProfile } from "@/lib/types";

/**
 * Generates a random alphanumeric string of length N
 */
const generateRandomString = (length: number) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generates a unique Invite Code for a student.
 * Format: ATH-XXXX-XXXX
 */
export const generateInviteCode = async (): Promise<string> => {
  let isUnique = false;
  let code = '';

  while (!isUnique) {
    code = `ATH-${generateRandomString(4)}-${generateRandomString(4)}`;
    const studentsRef = collection(db, "students");
    const q = query(studentsRef, where("inviteCode", "==", code));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      isUnique = true;
    }
  }

  return code;
};

/**
 * Generates a sequential or random Athlete ID.
 * For this implementation, we use a random but shorter prefix.
 */
export const generateAthleteId = async (): Promise<string> => {
  let isUnique = false;
  let id = '';

  while (!isUnique) {
    id = `A${generateRandomString(6)}`;
    const studentsRef = collection(db, "students");
    const q = query(studentsRef, where("athleteId", "==", id));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      isUnique = true;
    }
  }

  return id;
};

/**
 * Fetches pending invitations for a specific athlete.
 */
export const getPendingInvitations = async (athleteId: string): Promise<CoachInvitation[]> => {
  if (!athleteId) return [];

  const invitesRef = collection(db, "coachInvitations");
  const q = query(
    invitesRef, 
    where("studentId", "==", athleteId),
    where("status", "==", "pending")
  );
  
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) return [];
  
  return snapshot.docs.map(doc => doc.data() as CoachInvitation);
};

/**
 * Athlete accepts an invitation from a coach.
 */
export const acceptCoachInvitation = async (invitation: CoachInvitation) => {
  const batch = writeBatch(db);
  
  // 1. Update invitation status
  const inviteRef = doc(db, "coachInvitations", invitation.id);
  batch.update(inviteRef, {
    status: "accepted",
    updatedAt: serverTimestamp()
  });

  // 2. Create Relationship
  const relationshipId = `${invitation.coachId}_${invitation.studentId}`;
  const relationshipRef = doc(db, "coachAthleteRelationships", relationshipId);
  
  const newRelationship: Partial<CoachAthleteRelationship> = {
    id: relationshipId,
    coachId: invitation.coachId,
    studentId: invitation.studentId,
    createdAt: serverTimestamp() as any
  };

  batch.set(relationshipRef, newRelationship);
  
  await batch.commit();
};

/**
 * Athlete declines an invitation from a coach.
 */
export const declineCoachInvitation = async (invitationId: string) => {
  const batch = writeBatch(db);
  const inviteRef = doc(db, "coachInvitations", invitationId);
  batch.update(inviteRef, {
    status: "declined",
    updatedAt: serverTimestamp()
  });
  await batch.commit();
};

/**
 * Athlete enters an invite code to request joining an organization.
 */
export const requestToJoinOrganization = async (inviteCode: string, athleteId: string) => {
  // 1. Verify invite code exists
  const invitesRef = collection(db, "invitations");
  const q = query(invitesRef, where("code", "==", inviteCode));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    throw new Error("Invalid or expired invitation code");
  }

  const inviteData = snapshot.docs[0].data();
  
  // 2. Create Approval Request for Head Coach
  const requestsRef = collection(db, "approvalRequests");
  await addDoc(requestsRef, {
    athleteId,
    organizationId: inviteData.organizationId,
    headCoachId: inviteData.createdBy,
    inviteCode,
    status: "pending",
    createdAt: serverTimestamp()
  });

  // 3. Send Notification to Head Coach
  const notificationsRef = collection(db, "notifications");
  await addDoc(notificationsRef, {
    userId: inviteData.createdBy,
    title: "New Join Request",
    message: "An athlete has requested to join your organization using an invite code.",
    type: "JoinRequest",
    isRead: false,
    actionUrl: "/coach/team",
    createdAt: serverTimestamp()
  });
};
