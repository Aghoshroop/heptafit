import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  QueryConstraint
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BaseMetadata } from "@/lib/types";
import { logActivity, ActivityModule } from "@/lib/activityService";

/**
 * Shared Domain Layer: Base Repository
 * Centralizes metadata injection, activity logging, and basic CRUD operations.
 */
export class BaseRepository<T extends BaseMetadata> {
  constructor(
    public readonly collectionName: string,
    public readonly moduleName: ActivityModule
  ) {}

  /**
   * Retrieves a single document by ID.
   */
  async get(id: string): Promise<T | null> {
    const docRef = doc(db, this.collectionName, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as T;
  }

  /**
   * Lists documents based on an array of QueryConstraints.
   */
  async list(constraints: QueryConstraint[]): Promise<T[]> {
    const q = query(collection(db, this.collectionName), ...constraints);
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
  }

  /**
   * Creates a new document. Injects metadata and logs activity.
   */
  async create(data: Omit<T, "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy">, userId: string, userName: string): Promise<string> {
    const docRef = doc(collection(db, this.collectionName));
    
    const entity = {
      ...data,
      id: docRef.id,
      createdBy: userId,
      updatedBy: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    } as any;

    await setDoc(docRef, entity);

    await logActivity({
      organizationId: data.organizationId,
      athleteId: data.athleteId,
      module: this.moduleName,
      action: "created",
      actorId: userId,
      actorName: userName,
      actorRole: "User",
      title: `Created new record in ${this.collectionName}`,
      metadata: {
        summary: `Created new record in ${this.collectionName}`,
        targetId: docRef.id,
        targetType: this.collectionName
      }
    });

    return docRef.id;
  }

  /**
   * Updates an existing document. Updates metadata and logs activity.
   */
  async update(id: string, updates: Partial<Omit<T, "id" | "createdAt" | "createdBy" | "updatedAt" | "updatedBy">>, userId: string, userName: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    
    const existing = await this.get(id);
    if (!existing) throw new Error("Document not found");

    const entityUpdates = {
      ...updates,
      updatedBy: userId,
      updatedAt: serverTimestamp()
    } as any;

    await updateDoc(docRef, entityUpdates);

    await logActivity({
      organizationId: existing.organizationId,
      athleteId: existing.athleteId,
      module: this.moduleName,
      action: "updated",
      actorId: userId,
      actorName: userName,
      actorRole: "User",
      title: `Updated record in ${this.collectionName}`,
      metadata: {
        summary: `Updated record in ${this.collectionName}`,
        targetId: id,
        targetType: this.collectionName
      }
    });
  }

  /**
   * Deletes a document and logs activity.
   */
  async delete(id: string, userId: string, userName: string): Promise<void> {
    const existing = await this.get(id);
    if (!existing) return;

    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);

    await logActivity({
      organizationId: existing.organizationId,
      athleteId: existing.athleteId,
      module: this.moduleName,
      action: "deleted",
      actorId: userId,
      actorName: userName,
      actorRole: "User",
      title: `Deleted record from ${this.collectionName}`,
      metadata: {
        summary: `Deleted record from ${this.collectionName}`,
        targetId: id,
        targetType: this.collectionName
      }
    });
  }
}
