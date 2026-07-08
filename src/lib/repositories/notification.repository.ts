import { BaseRepository } from "./base.repository";
import { Notification } from "../types";
import { collection, query, where, getDocs, writeBatch } from "firebase/firestore";
import { db } from "../firebase";

export class NotificationRepository extends BaseRepository<Notification> {
  constructor() {
    super("notifications", "system"); // Using 'system' since notifications span multiple modules
  }

  async markAllAsRead(recipientId: string): Promise<void> {
    const q = query(
      collection(db, this.collectionName),
      where("recipientId", "==", recipientId),
      where("isRead", "==", false)
    );
    
    const snapshot = await getDocs(q);
    if (snapshot.empty) return;
    
    const batch = writeBatch(db);
    snapshot.docs.forEach((docSnap) => {
      batch.update(docSnap.ref, { isRead: true, updatedAt: new Date().toISOString() });
    });
    
    await batch.commit();
  }
}

export const notificationRepository = new NotificationRepository();
