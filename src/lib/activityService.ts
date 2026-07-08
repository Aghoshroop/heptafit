import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export type ActivityModule = 
  | "wellness" 
  | "metrics" 
  | "notes" 
  | "profile" 
  | "competition" 
  | "training" 
  | "attendance"
  | "nutrition"
  | "medical"
  | "staff"
  | "system"
  | "documents"
  | "messaging";

export type ActivityAction = 
  | "created"
  | "updated"
  | "deleted"
  | "assigned"
  | "completed";

export interface LogActivityParams {
  actorId: string;
  actorName: string;
  actorRole: string; // e.g., "Head Coach", "Nutritionist", "Athlete"
  organizationId?: string;
  athleteId: string;
  module: ActivityModule;
  action: ActivityAction;
  title: string;
  description?: string;
  metadata?: any;
}

/**
 * Global Activity Engine
 * Logs events to a centralized subcollection under the athlete's document.
 * This powers the Athlete Timeline, Coach Activity Feed, and Audit Logs.
 */
export const logActivity = async ({
  actorId,
  actorName,
  actorRole,
  organizationId,
  athleteId,
  module,
  action,
  title,
  description = "",
  metadata = {}
}: LogActivityParams) => {
  try {
    const activityRef = collection(db, "activities");
    await addDoc(activityRef, {
      actorId,
      actorName,
      actorRole,
      organizationId: organizationId || null,
      athleteId, // Explicitly stored for global organization feeds
      module,
      action,
      title,
      description,
      metadata,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
    // We intentionally don't throw here to prevent disrupting the main action
  }
};
