import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";

export interface AuditLog {
  id?: string;
  action: "LOGIN" | "INVITATION_SENT" | "INVITATION_ACCEPTED" | "TRAINING_CREATED" | "COMPETITION_CREATED" | "MEDICAL_EDIT" | "ROLE_CHANGE" | "SUBSCRIPTION_CHANGE";
  description: string;
  userId: string;
  organizationId: string;
  metadata?: any;
  createdAt?: any;
}

/**
 * Creates an immutable audit log entry in Firestore.
 */
export async function createAuditLog(log: Omit<AuditLog, "id" | "createdAt">): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "auditLogs"), {
      ...log,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Failed to create audit log:", error);
    throw error;
  }
}

/**
 * Fetches recent audit logs for an organization.
 * Used by Super Admins and Head Coaches.
 */
export async function getOrganizationAuditLogs(organizationId: string, maxResults: number = 50): Promise<AuditLog[]> {
  try {
    const logsQuery = query(
      collection(db, "auditLogs"),
      where("organizationId", "==", organizationId),
      orderBy("createdAt", "desc"),
      limit(maxResults)
    );
    
    const snapshot = await getDocs(logsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as AuditLog[];
  } catch (error) {
    console.error("Failed to fetch audit logs:", error);
    throw error;
  }
}
