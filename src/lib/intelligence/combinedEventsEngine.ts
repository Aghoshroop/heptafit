import { PerformanceEngine } from "./performanceEngine";
import { getAllEventsFlat, Gender } from "./sportMetadata";

/**
 * ---------------------------------------------------------
 * COMBINED EVENTS ENGINE
 * ---------------------------------------------------------
 * Handles Day 1 / Day 2 event grouping, totals calculation, 
 * target tracking, and "What-If" scenario simulation.
 */

// Define the official World Athletics event order for Combined Events
export const CombinedEventSchedules = {
  "decathlon": {
    Day1: ["100m", "long-jump", "shot-put", "high-jump", "400m"],
    Day2: ["110mH", "discus", "pole-vault", "javelin", "1500m"]
  },
  "heptathlon": {
    Day1: ["100mH", "high-jump", "shot-put", "200m"],
    Day2: ["long-jump", "javelin", "800m"]
  }
};

export interface CombinedEventPerformance {
  eventId: string;
  rawPerformanceValue?: number; // e.g. 10.5
  formattedPerformance?: string; // e.g. "10.50s"
}

export const CombinedEventsEngine = {

  /**
   * Calculates the Day 1, Day 2, and Final total points for a given set of performances.
   */
  calculateTotals(
    combinedEventType: "decathlon" | "heptathlon", 
    gender: Gender, 
    performances: CombinedEventPerformance[]
  ) {
    const allEvents = getAllEventsFlat();
    const schedule = CombinedEventSchedules[combinedEventType];
    
    let day1Total = 0;
    let day2Total = 0;
    
    const detailedScores = performances.map(p => {
      let points = 0;
      if (p.rawPerformanceValue && p.rawPerformanceValue > 0) {
        const metadata = allEvents.find(e => e.id === p.eventId);
        if (metadata) {
          points = PerformanceEngine.calculateWAPoints(p.rawPerformanceValue, metadata, gender);
        }
      }

      if (schedule.Day1.includes(p.eventId)) {
        day1Total += points;
      } else if (schedule.Day2.includes(p.eventId)) {
        day2Total += points;
      }

      return { eventId: p.eventId, points };
    });

    return {
      day1Total,
      day2Total,
      finalTotal: day1Total + day2Total,
      detailedScores
    };
  },

  /**
   * Generates a "What-If" target list. Given a target total score, 
   * this naive implementation splits the points equally among all events 
   * and calculates the exact performance needed in each event.
   */
  generateWhatIfScenarioEqualSplit(
    combinedEventType: "decathlon" | "heptathlon", 
    gender: Gender, 
    targetTotalScore: number
  ) {
    const schedule = CombinedEventSchedules[combinedEventType];
    const allEventIds = [...schedule.Day1, ...schedule.Day2];
    const pointsPerEvent = Math.floor(targetTotalScore / allEventIds.length);
    
    const allEvents = getAllEventsFlat();

    return allEventIds.map(eventId => {
      const metadata = allEvents.find(e => e.id === eventId);
      let requiredPerformance = 0;
      let formatted = "-";

      if (metadata) {
        requiredPerformance = PerformanceEngine.calculatePerformanceForWAPoints(pointsPerEvent, metadata, gender);
        formatted = PerformanceEngine.formatPerformance(requiredPerformance, metadata);
      }

      return {
        eventId,
        targetPoints: pointsPerEvent,
        requiredPerformance,
        formatted
      };
    });
  },

  /**
   * Advanced What-If: Re-calculates total score dynamically when a single performance is changed.
   * Useful for the What-If UI Calculator.
   */
  simulateScoreChange(
    currentPerformances: CombinedEventPerformance[],
    changedEventId: string,
    newRawPerformanceValue: number,
    combinedEventType: "decathlon" | "heptathlon",
    gender: Gender
  ) {
    const updatedPerformances = currentPerformances.map(p => 
      p.eventId === changedEventId ? { ...p, rawPerformanceValue: newRawPerformanceValue } : p
    );

    // If the changed event wasn't in the list, add it
    if (!currentPerformances.find(p => p.eventId === changedEventId)) {
      updatedPerformances.push({ eventId: changedEventId, rawPerformanceValue: newRawPerformanceValue });
    }

    return this.calculateTotals(combinedEventType, gender, updatedPerformances);
  }
};
