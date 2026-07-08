import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, setDoc, serverTimestamp, getDoc, updateDoc, deleteDoc, writeBatch } from "firebase/firestore";
import { StudentProfile, CoachInvitation, CoachProfile, StaffProfile, StaffInvitation, StaffRole } from "@/lib/types";

/**
 * Searches for a student exactly by their Invite Code.
 */
export const searchStudentByInviteCode = async (inviteCode: string): Promise<StudentProfile | null> => {
  if (!inviteCode) return null;
  
  const studentsRef = collection(db, "students");
  // The code should be exact match
  const q = query(studentsRef, where("inviteCode", "==", inviteCode.trim().toUpperCase()));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) return null;
  
  return snapshot.docs[0].data() as StudentProfile;
};

/**
 * Sends an invitation to a student.
 */
export const sendCoachInvitation = async (coach: CoachProfile, student: StudentProfile) => {
  // Check if a pending invite already exists
  const invitesRef = collection(db, "coachInvitations");
  const q = query(
    invitesRef, 
    where("coachId", "==", coach.uid), 
    where("studentId", "==", student.uid),
    where("status", "==", "pending")
  );
  
  const existingInvites = await getDocs(q);
  if (!existingInvites.empty) {
    throw new Error("An invitation is already pending for this athlete.");
  }

  // Check if relationship already exists
  const relId = `${coach.uid}_${student.uid}`;
  const relDoc = await getDoc(doc(db, "coachAthleteRelationships", relId));
  if (relDoc.exists()) {
    throw new Error("You are already managing this athlete.");
  }

  const newInviteRef = doc(collection(db, "coachInvitations"));
  const invitation: CoachInvitation = {
    id: newInviteRef.id,
    coachId: coach.uid,
    coachName: `${coach.firstName} ${coach.lastName}`,
    academyId: coach.academyId || "",
    studentId: student.uid,
    studentName: `${student.firstName} ${student.lastName}`,
    status: "pending",
    createdAt: serverTimestamp() as any,
    updatedAt: serverTimestamp() as any
  };

  await setDoc(newInviteRef, invitation);
  return invitation;
};

/**
 * Fetches all athletes assigned to a coach.
 */
export const getCoachAthletes = async (coachId: string): Promise<StudentProfile[]> => {
  if (!coachId) return [];

  const relRef = collection(db, "coachAthleteRelationships");
  const q = query(relRef, where("coachId", "==", coachId));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return [];

  const studentIds = snapshot.docs.map(doc => doc.data().studentId);
  const athletes: StudentProfile[] = [];

  // Firestore 'in' queries support max 10 values, so we fetch individually or chunk
  // For this implementation, fetching individually via Promise.all is fine for smaller rosters
  await Promise.all(studentIds.map(async (studentId) => {
    const studentDoc = await getDoc(doc(db, "students", studentId));
    if (studentDoc.exists()) {
      athletes.push(studentDoc.data() as StudentProfile);
    }
  }));

  return athletes;
};

/**
 * Searches for a staff member exactly by their Invite Code.
 */
export const searchStaffByInviteCode = async (inviteCode: string): Promise<StaffProfile | null> => {
  if (!inviteCode) return null;
  
  const staffRef = collection(db, "staff");
  const q = query(staffRef, where("inviteCode", "==", inviteCode.trim().toUpperCase()));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) return null;
  
  return snapshot.docs[0].data() as StaffProfile;
};

/**
 * Sends an invitation to a staff member.
 */
export const sendStaffInvitation = async (coach: CoachProfile, staff: StaffProfile, role: StaffRole) => {
  // Check if a pending invite already exists
  const invitesRef = collection(db, "staffInvitations");
  const q = query(
    invitesRef, 
    where("headCoachId", "==", coach.uid), 
    where("staffId", "==", staff.uid),
    where("status", "==", "pending")
  );
  
  const existingInvites = await getDocs(q);
  if (!existingInvites.empty) {
    throw new Error("An invitation is already pending for this staff member.");
  }

  // Check if relationship already exists
  const relRef = collection(db, "staffRelationships");
  const relQ = query(relRef, where("headCoachId", "==", coach.uid), where("staffId", "==", staff.uid), where("status", "==", "active"));
  const existingRel = await getDocs(relQ);
  if (!existingRel.empty) {
    throw new Error("This staff member is already part of your organization.");
  }

  const newInviteRef = doc(collection(db, "staffInvitations"));
  const invitation: StaffInvitation = {
    id: newInviteRef.id,
    headCoachId: coach.uid,
    headCoachName: `${coach.firstName} ${coach.lastName}`,
    organizationId: coach.organizationId || "",
    staffId: staff.uid,
    staffName: `${staff.firstName} ${staff.lastName}`,
    role,
    status: "pending",
    createdAt: serverTimestamp() as any,
    updatedAt: serverTimestamp() as any
  };

  await setDoc(newInviteRef, invitation);
  return invitation;
};

/**
 * Fetches all pending approval requests for a Head Coach's organization.
 */
export const getApprovalRequests = async (headCoachId: string) => {
  const requestsRef = collection(db, "approvalRequests");
  const q = query(requestsRef, where("headCoachId", "==", headCoachId), where("status", "==", "pending"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Approves a join request.
 */
export const approveJoinRequest = async (requestId: string, headCoachId: string, athleteId: string) => {
  const batch = writeBatch(db);

  // 1. Update request status
  const requestRef = doc(db, "approvalRequests", requestId);
  batch.update(requestRef, { status: "approved", updatedAt: serverTimestamp() });

  // 2. Create Relationship
  const relationshipId = `${headCoachId}_${athleteId}`;
  const relationshipRef = doc(db, "coachAthleteRelationships", relationshipId);
  batch.set(relationshipRef, {
    id: relationshipId,
    coachId: headCoachId,
    studentId: athleteId,
    createdAt: serverTimestamp()
  });

  // 3. Notify athlete
  const notificationsRef = doc(collection(db, "notifications"));
  batch.set(notificationsRef, {
    userId: athleteId,
    title: "Join Request Approved",
    message: "Your request to join the organization has been approved!",
    type: "System",
    isRead: false,
    actionUrl: "/athlete",
    createdAt: serverTimestamp()
  });

  await batch.commit();
};

/**
 * Denies a join request.
 */
export const denyJoinRequest = async (requestId: string, athleteId: string) => {
  const batch = writeBatch(db);

  // 1. Update request status
  const requestRef = doc(db, "approvalRequests", requestId);
  batch.update(requestRef, { status: "denied", updatedAt: serverTimestamp() });

  // 2. Notify athlete
  const notificationsRef = doc(collection(db, "notifications"));
  batch.set(notificationsRef, {
    userId: athleteId,
    title: "Join Request Denied",
    message: "Your request to join the organization was declined.",
    type: "System",
    isRead: false,
    actionUrl: "/athlete",
    createdAt: serverTimestamp()
  });

  await batch.commit();
};
