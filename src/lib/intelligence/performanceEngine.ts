import { EventMetadata, Gender, WAScoringParams } from "./sportMetadata";
import { PerformanceTimelineLog } from "../types";

/**
 * ---------------------------------------------------------
 * PERFORMANCE INTELLIGENCE ENGINE & RULES ENGINE
 * ---------------------------------------------------------
 * Responsible for calculations, PB/SB validations, WA point conversions,
 * and string parsing. Decoupled from the UI components.
 */

// --- 1. Rules Engine ---

export const RulesEngine = {
  /**
   * Determines if a performance is legal for a Personal Best.
   * Wind > +2.0m/s is illegal for PBs and Records in Athletics.
   */
  isLegalWind(wind?: number): boolean {
    if (wind === undefined || wind === null) return true;
    return wind <= 2.0;
  },

  /**
   * Validates if a new performance is a PB.
   */
  isNewPersonalBest(
    newPerformance: number, 
    eventMetadata: EventMetadata, 
    currentPB: number | null,
    wind?: number
  ): boolean {
    if (!this.isLegalWind(wind)) return false;
    if (currentPB === null) return true;

    if (eventMetadata.lowerIsBetter) {
      return newPerformance < currentPB;
    } else {
      return newPerformance > currentPB;
    }
  },

  /**
   * Validates if a new performance is a Season Best (SB).
   * Note: SBs generally have the same wind rules as PBs, but sometimes coaches ignore it. 
   * Officially, wind matters.
   */
  isNewSeasonBest(
    newPerformance: number, 
    eventMetadata: EventMetadata, 
    currentSB: number | null,
    wind?: number
  ): boolean {
    if (!this.isLegalWind(wind)) return false;
    if (currentSB === null) return true;

    if (eventMetadata.lowerIsBetter) {
      return newPerformance < currentSB;
    } else {
      return newPerformance > currentSB;
    }
  }
};

// --- 2. Performance Intelligence Engine ---

export const PerformanceEngine = {
  
  /**
   * Parses a formatted string (e.g., "10.5", "1:45.3", "6.85") into a raw numeric base value.
   * Tracks use seconds (e.g. 10.5, or 105.3 for 1:45.3).
   * Field uses metres (e.g., 6.85).
   * Points use integers.
   */
  parseFormattedPerformance(formattedStr: string, eventMetadata: EventMetadata): number {
    const raw = formattedStr.replace(/[^0-9.:-]/g, "").trim();
    if (!raw) return 0;

    // Handle "MM:SS.ms" or "MM:SS" formats for endurance events
    if (raw.includes(":")) {
      const parts = raw.split(":");
      let totalSeconds = 0;
      if (parts.length === 2) {
        totalSeconds = parseInt(parts[0], 10) * 60 + parseFloat(parts[1]);
      } else if (parts.length === 3) {
        // HH:MM:SS (unlikely for track, but good for marathon)
        totalSeconds = parseInt(parts[0], 10) * 3600 + parseInt(parts[1], 10) * 60 + parseFloat(parts[2]);
      }
      return totalSeconds;
    }

    return parseFloat(raw);
  },

  /**
   * Formats a raw numeric base value into a display string.
   */
  formatPerformance(value: number, eventMetadata: EventMetadata): string {
    if (value === 0 || isNaN(value)) return "-";

    if (eventMetadata.displayUnit === "Minutes:Seconds") {
      const minutes = Math.floor(value / 60);
      const seconds = (value % 60).toFixed(eventMetadata.precision);
      // Pad seconds with 0 if needed (e.g. "05.34")
      const paddedSeconds = Number(seconds) < 10 ? `0${seconds}` : seconds;
      return `${minutes}:${paddedSeconds}`;
    }

    return value.toFixed(eventMetadata.precision);
  },

  /**
   * World Athletics Points Calculation (Combined Events & General)
   * Track Events: Points = a * (b - P)^c
   * Field Events: Points = a * (P - b)^c
   * Where P is the performance in seconds, metres or centimetres depending on the event.
   */
  calculateWAPoints(performanceValue: number, eventMetadata: EventMetadata, gender: Gender): number {
    if (performanceValue <= 0) return 0;
    
    const params: WAScoringParams | undefined = eventMetadata.scoringParams?.[gender === "Men" ? "Men" : "Women"];
    if (!params) return 0;

    const { a, b, c, shift } = params;
    let P = performanceValue;

    // WA points specifically require distances in CM for Jumps, but Metres for Throws.
    // Our DB uses Metres uniformly for field events.
    if (eventMetadata.eventType === "jump") {
      P = P * 100; // Convert Metres to Centimetres for WA formula
    }

    // WA uses seconds for track. Our DB already stores seconds.
    // Some manual timing shift can be applied (e.g. +0.24s for hand timing to FAT)
    if (shift && eventMetadata.eventType === "track") {
      P = P + shift;
    }

    let points = 0;
    if (eventMetadata.lowerIsBetter) {
      // Track formula: a * (b - P)^c
      if (b - P > 0) {
        points = Math.floor(a * Math.pow((b - P), c));
      }
    } else {
      // Field formula: a * (P - b)^c
      if (P - b > 0) {
        points = Math.floor(a * Math.pow((P - b), c));
      }
    }

    return points > 0 ? points : 0;
  },

  /**
   * Calculates target performance needed to achieve a specific WA points score.
   * Reverse engineering the WA formulas.
   */
  calculatePerformanceForWAPoints(targetPoints: number, eventMetadata: EventMetadata, gender: Gender): number {
    if (targetPoints <= 0) return 0;
    
    const params: WAScoringParams | undefined = eventMetadata.scoringParams?.[gender === "Men" ? "Men" : "Women"];
    if (!params) return 0;

    const { a, b, c } = params;
    let P = 0;

    if (eventMetadata.lowerIsBetter) {
      // Reverse Track formula: P = b - (Points / a)^(1/c)
      P = b - Math.pow((targetPoints / a), (1 / c));
    } else {
      // Reverse Field formula: P = b + (Points / a)^(1/c)
      P = b + Math.pow((targetPoints / a), (1 / c));
    }

    // Convert back from WA formula units (CM) to our DB units (Metres) for Jumps
    if (eventMetadata.eventType === "jump") {
      P = P / 100;
    }

    return P;
  }
};
