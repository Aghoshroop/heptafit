import { db } from "../firebase";
import { collection, doc, addDoc, updateDoc, getDoc, getDocs, query, where, Timestamp, runTransaction } from "firebase/firestore";
import { CompetitionSnapshot, PerformanceTimelineLog } from "../types";
import { PerformanceService } from "./performanceService";

/**
 * ---------------------------------------------------------
 * COMPETITION SERVICE
 * ---------------------------------------------------------
 * Handles creating immutable competition snapshots, live entry,
 * and archiving the competition results into the timeline.
 */

export const CompetitionService = {
  
  /**
   * Initializes a new official competition snapshot.
   */
  async createCompetition(params: {
    name: string;
    organizationId: string;
    headCoachId: string;
    createdBy: string;
    date: Date;
    venue: string;
    season: string;
    isIndoor: boolean;
    athleteIds: string[];
  }): Promise<string> {
    const compRef = collection(db, "competitions");
    const snapshot: Omit<CompetitionSnapshot, "id"> = {
      name: params.name,
      organizationId: params.organizationId,
      headCoachId: params.headCoachId,
      createdBy: params.createdBy,
      updatedBy: params.createdBy,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      date: Timestamp.fromDate(params.date),
      venue: params.venue,
      season: params.season,
      isIndoor: params.isIndoor,
      status: "upcoming",
      athletes: params.athleteIds,
      results: [],
      isOfficial: true
    };

    const docRef = await addDoc(compRef, snapshot);
    return docRef.id;
  },

  /**
   * Logs a live result during the competition. Updates the snapshot array.
   * This DOES NOT immediately add to the performance timeline. It acts as a draft.
   */
  async enterLiveResult(
    competitionId: string, 
    userId: string,
    result: { athleteId: string; eventId: string; performance: string | number; wind?: number; notes?: string }
  ) {
    const docRef = doc(db, "competitions", competitionId);
    
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(docRef);
      if (!snap.exists()) throw new Error("Competition not found");
      
      const data = snap.data() as CompetitionSnapshot;
      if (data.status === "archived") throw new Error("Cannot edit an archived competition");

      // Replace if already exists, else push
      const existingIdx = (data.results || []).findIndex(r => r.athleteId === result.athleteId && r.eventId === result.eventId);
      const newResults = [...(data.results || [])];
      
      if (existingIdx > -1) {
        newResults[existingIdx] = { ...newResults[existingIdx], ...result };
      } else {
        newResults.push(result as any);
      }

      transaction.update(docRef, {
        results: newResults,
        status: "in_progress",
        updatedBy: userId,
        updatedAt: Timestamp.now()
      });
    });
  },

  /**
   * Commits the competition results into the official Performance Timeline for all athletes,
   * then locks the competition snapshot.
   */
  async archiveCompetition(competitionId: string, userId: string) {
    const docRef = doc(db, "competitions", competitionId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) throw new Error("Competition not found");

    const comp = snap.data() as CompetitionSnapshot;
    if (comp.status === "archived") return; // Already archived

    // 1. Commit every result to the immutable performance timeline using the Service layer
    // We run these sequentially or via Promise.all. For safety, let's use a standard loop.
    for (const result of comp.results) {
      // Fetch gender from athlete profile to correctly calculate points
      const athleteSnap = await getDoc(doc(db, "users", result.athleteId));
      if (!athleteSnap.exists()) continue;
      const athlete = athleteSnap.data();

      await PerformanceService.logPerformance({
        athleteId: result.athleteId,
        organizationId: comp.organizationId,
        headCoachId: comp.headCoachId,
        createdBy: userId,
        eventId: result.eventId,
        formattedPerformance: String(result.performance),
        context: "competition",
        dataSource: "competition_result",
        date: comp.date.toDate(),
        venue: comp.venue,
        wind: result.wind,
        season: comp.season,
        competitionId: docRef.id,
        gender: athlete.gender || "Mixed"
      });
    }

    // 2. Lock the competition snapshot
    await updateDoc(docRef, {
      status: "archived",
      updatedBy: userId,
      updatedAt: Timestamp.now()
    });
  }
};
