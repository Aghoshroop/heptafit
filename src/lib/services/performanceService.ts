import { db } from "../firebase";
import { collection, doc, addDoc, query, where, getDocs, orderBy, Timestamp } from "firebase/firestore";
import { PerformanceTimelineLog, StudentProfile } from "../types";
import { PerformanceEngine, RulesEngine } from "../intelligence/performanceEngine";
import { getAllEventsFlat } from "../intelligence/sportMetadata";

/**
 * ---------------------------------------------------------
 * PERFORMANCE SERVICE (PUBLIC API LAYER)
 * ---------------------------------------------------------
 * The UI should never call the Engines or Firestore directly for performance logic.
 * Everything flows through these unified methods.
 */

export const PerformanceService = {
  
  /**
   * Logs a new performance into the Performance Timeline.
   * Automatically handles string parsing, WA point calculation, PB/SB validation, and DB saving.
   */
  async logPerformance(params: {
    athleteId: string;
    organizationId: string;
    headCoachId: string;
    createdBy: string;
    eventId: string;
    formattedPerformance: string;
    context: "training" | "competition" | "target";
    dataSource: "manual_coach" | "manual_athlete" | "competition_result" | "csv_import" | "wearable" | "timing_system" | "gps" | "force_plate";
    date: Date;
    venue?: string;
    weather?: string;
    wind?: number;
    season: string;
    competitionId?: string;
    gender: "Men" | "Women" | "Mixed";
  }): Promise<PerformanceTimelineLog> {
    
    // 1. Fetch metadata
    const eventMetadata = getAllEventsFlat().find(e => e.id === params.eventId);
    if (!eventMetadata) {
      throw new Error(`Event metadata not found for ID: ${params.eventId}`);
    }

    // 2. Engine: Parse raw performance
    const performanceValue = PerformanceEngine.parseFormattedPerformance(params.formattedPerformance, eventMetadata);

    // 3. Engine: Calculate WA Points
    let waPoints = 0;
    if (eventMetadata.capabilities.supportsPoints) {
      waPoints = PerformanceEngine.calculateWAPoints(performanceValue, eventMetadata, params.gender);
    }

    // 4. Fetch historical data to check PB/SB
    const timeline = await this.getPerformanceTimeline(params.athleteId, params.eventId);
    const seasonTimeline = timeline.filter(t => t.season === params.season);
    
    const currentPB = timeline.length > 0 ? (eventMetadata.lowerIsBetter ? Math.min(...timeline.map(t => t.performanceValue)) : Math.max(...timeline.map(t => t.performanceValue))) : null;
    const currentSB = seasonTimeline.length > 0 ? (eventMetadata.lowerIsBetter ? Math.min(...seasonTimeline.map(t => t.performanceValue)) : Math.max(...seasonTimeline.map(t => t.performanceValue))) : null;

    // 5. Rules Engine: Validate PB/SB
    const isPB = RulesEngine.isNewPersonalBest(performanceValue, eventMetadata, currentPB, params.wind);
    const isSB = RulesEngine.isNewSeasonBest(performanceValue, eventMetadata, currentSB, params.wind);

    // 6. Construct DB payload
    const log: Omit<PerformanceTimelineLog, "id"> = {
      organizationId: params.organizationId,
      headCoachId: params.headCoachId,
      athleteId: params.athleteId,
      createdBy: params.createdBy,
      updatedBy: params.createdBy,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      eventId: params.eventId,
      performanceValue,
      formattedPerformance: params.formattedPerformance,
      date: Timestamp.fromDate(params.date),
      context: params.context,
      dataSource: params.dataSource,
      competitionId: params.competitionId,
      venue: params.venue,
      weather: params.weather,
      wind: params.wind,
      season: params.season,
      waPoints,
      isPB,
      isSB
    };

    // 7. Save to Firestore
    const logsRef = collection(db, "performance_timeline");
    const docRef = await addDoc(logsRef, log);

    // 8. Background trigger: KPI Engine recalculation should fire via Cloud Functions or a separate background async call here
    // this.triggerKPIRecalculation(params.athleteId);

    return { id: docRef.id, ...log };
  },

  /**
   * Retrieves the entire performance timeline for an athlete, optionally filtered by event.
   */
  async getPerformanceTimeline(athleteId: string, eventId?: string): Promise<PerformanceTimelineLog[]> {
    const logsRef = collection(db, "performance_timeline");
    let q = query(logsRef, where("athleteId", "==", athleteId));
    
    if (eventId) {
      q = query(q, where("eventId", "==", eventId));
    }

    // Note: Requires composite index in Firestore if using orderBy with where
    const snapshot = await getDocs(q);
    const logs: PerformanceTimelineLog[] = [];
    
    snapshot.forEach(doc => {
      logs.push({ id: doc.id, ...doc.data() } as PerformanceTimelineLog);
    });

    // Sort client-side if no index is present
    return logs.sort((a, b) => b.date.toMillis() - a.date.toMillis());
  },

  /**
   * Generates a "What-If" scenario for Combined Events.
   */
  simulateCombinedEventsScore(performances: { eventId: string, performanceValue: number }[], gender: "Men" | "Women"): number {
    let totalPoints = 0;
    const allEvents = getAllEventsFlat();

    for (const p of performances) {
      const eventMetadata = allEvents.find(e => e.id === p.eventId);
      if (eventMetadata && eventMetadata.capabilities.supportsPoints) {
        totalPoints += PerformanceEngine.calculateWAPoints(p.performanceValue, eventMetadata, gender);
      }
    }
    return totalPoints;
  }
};
