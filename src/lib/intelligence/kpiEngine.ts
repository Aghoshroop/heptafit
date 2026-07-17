import { PerformanceTimelineLog, WellnessLog } from "../types";
import { EventMetadata } from "./sportMetadata";

/**
 * ---------------------------------------------------------
 * KPI ENGINE
 * ---------------------------------------------------------
 * Responsible for computing unified KPIs across the platform so that
 * dashboards and widgets do not compute math independently.
 */

export const KPIEngine = {

  /**
   * Computes a Daily Readiness Score (0-100) based on a WellnessLog.
   * Higher is better.
   */
  calculateReadinessScore(log: WellnessLog): number {
    // Basic heuristics (assuming 1-5 scales where 5 is best for sleep, worst for stress/fatigue)
    // Adjust logic based on actual data scales. Let's assume 1-5 where 5 is optimal for positive, 1 is optimal for negative.
    
    // Fallbacks if data missing
    const sleep = log.sleepQuality || 3; // 1-5 (5 = Excellent)
    const soreness = log.muscleSoreness || 3; // 1-5 (1 = None, 5 = Severe)
    const fatigue = log.fatigue || 3; // 1-5 (1 = None, 5 = Exhausted)
    const stress = log.stressLevel || 3; // 1-5 (1 = None, 5 = High)

    // Invert negative metrics so 5 is "good"
    const invSoreness = 6 - soreness;
    const invFatigue = 6 - fatigue;
    const invStress = 6 - stress;

    // Weighting: Sleep (35%), Fatigue (30%), Soreness (20%), Stress (15%)
    const maxScore = 5;
    const weightedScore = (
      (sleep * 0.35) + 
      (invFatigue * 0.30) + 
      (invSoreness * 0.20) + 
      (invStress * 0.15)
    );

    // Convert 1-5 scale to 0-100
    return Math.max(0, Math.min(100, Math.round((weightedScore / maxScore) * 100)));
  },

  /**
   * Calculates improvement percentage between two periods.
   * Handles track (lower is better) and field (higher is better).
   */
  calculateImprovementPercentage(
    baselinePerformance: number, 
    currentPerformance: number, 
    eventMetadata: EventMetadata
  ): number {
    if (!baselinePerformance || !currentPerformance) return 0;

    let pctChange = ((currentPerformance - baselinePerformance) / baselinePerformance) * 100;

    // For track (time), a negative change (e.g., 10.5 to 10.0) is a POSITIVE improvement.
    if (eventMetadata.lowerIsBetter) {
      pctChange = -pctChange;
    }

    return parseFloat(pctChange.toFixed(2)); // e.g., 2.50 for +2.5%
  },

  /**
   * Calculates the Consistency Score (0-100) based on the Coefficient of Variation (CV).
   * A lower CV means higher consistency. 
   */
  calculateConsistencyScore(logs: PerformanceTimelineLog[]): number {
    if (logs.length < 3) return 0; // Not enough data

    const values = logs.map(l => l.performanceValue);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    const cv = (stdDev / mean) * 100; // CV in percentage

    // Heuristic: <2% CV is Elite consistency (100 score). >10% is Poor (0 score).
    const score = 100 - ((cv - 2) * (100 / 8));
    return Math.max(0, Math.min(100, Math.round(score)));
  },

  /**
   * Calculates how close an athlete is to a qualification standard (0-100%).
   */
  calculateQualificationProgress(
    currentBest: number, 
    qualificationTarget: number, 
    eventMetadata: EventMetadata
  ): number {
    if (!currentBest || !qualificationTarget) return 0;

    let progress = 0;
    if (eventMetadata.lowerIsBetter) {
      // Track: Target is 10.0s, PB is 10.5s. 
      // Progress = (Target / PB) * 100
      progress = (qualificationTarget / currentBest) * 100;
    } else {
      // Field: Target is 7.00m, PB is 6.50m
      // Progress = (PB / Target) * 100
      progress = (currentBest / qualificationTarget) * 100;
    }

    return Math.max(0, Math.min(100, parseFloat(progress.toFixed(1))));
  }
};
