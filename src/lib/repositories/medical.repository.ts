import { BaseRepository } from "./base.repository";
import { MedicalProfile } from "../types";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export class MedicalRepository extends BaseRepository<MedicalProfile> {
  constructor() {
    super("medicalProfiles", "medical"); 
  }

  async getByAthleteId(athleteId: string): Promise<MedicalProfile | null> {
    const q = query(
      collection(db, this.collectionName),
      where("athleteId", "==", athleteId)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as MedicalProfile;
  }
}

export const medicalRepository = new MedicalRepository();
