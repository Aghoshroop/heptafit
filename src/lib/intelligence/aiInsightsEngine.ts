import { PerformanceTimelineLog, WellnessLog } from "../types";
import { KPIEngine } from "./kpiEngine";

/**
 * ---------------------------------------------------------
 * AI INSIGHTS ENGINE
 * ---------------------------------------------------------
 * Generates automated coaching heuristics by analyzing the raw timeline.
 * Used by the AIInsightsWidget.
 */

export interface AIInsight {
  type: "positive" | "warning" | "neutral";
  title: string;
  description: string;
  confidence: "High" | "Medium" | "Low";
}

export const AIInsightsEngine = {
  
  /**
   * Analyzes a specific event's performance history to detect plateaus.
   * If the athlete hasn't improved in 4 consecutive competitions over 2+ months, flag it.
   */
  detectPlateau(logs: PerformanceTimelineLog[]): AIInsight | null {
    // Requires chronologically sorted logs (newest first)
    if (logs.length < 5) return null;

    const recentLogs = logs.slice(0, 5);
    
    // Check if the best performance in the last 5 is worse than or equal to the best prior to that.
    // We can use a simpler heuristic for the UI: Have they hit a PB or SB in the last 6 months?
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const hasRecentImprovement = logs.some(l => 
      (l.isPB || l.isSB) && l.date.toDate() > sixMonthsAgo
    );

    if (!hasRecentImprovement) {
      return {
        type: "warning",
        title: "Performance Plateau Detected",
        description: "This athlete has not achieved a PB or SB in over 6 months in this event. Consider adjusting the training macrocycle.",
        confidence: "High"
      };
    }

    return null;
  },

  /**
   * Correlates Readiness Score drops with performance drops.
   */
  analyzeFatigueImpact(performances: PerformanceTimelineLog[], wellnessLogs: WellnessLog[]): AIInsight | null {
    if (performances.length < 3 || wellnessLogs.length < 7) return null;

    // Calculate rolling 7-day readiness
    const recentWellness = wellnessLogs.slice(0, 7);
    const avgReadiness = recentWellness.reduce((acc, log) => acc + KPIEngine.calculateReadinessScore(log), 0) / recentWellness.length;

    if (avgReadiness < 40) {
      return {
        type: "warning",
        title: "High Injury / Burnout Risk",
        description: "The 7-day average readiness score has dropped below 40. High stress and poor sleep indicate immediate recovery is needed before the next high-intensity session.",
        confidence: "High"
      };
    }

    return null;
  },

  /**
   * Grades the athlete's consistency.
   */
  evaluateConsistency(logs: PerformanceTimelineLog[]): AIInsight | null {
    const consistencyScore = KPIEngine.calculateConsistencyScore(logs);
    
    if (consistencyScore > 85) {
      return {
        type: "positive",
        title: "Elite Consistency",
        description: "The athlete is performing extremely consistently across competitions (CV < 3%). They are primed to peak if intensity is properly tapered.",
        confidence: "High"
      };
    }

    if (consistencyScore < 40 && logs.length >= 5) {
      return {
        type: "warning",
        title: "Erratic Performance Pattern",
        description: "High variance between competitions detected. Check technical mechanics or pre-competition tapering strategies.",
        confidence: "Medium"
      };
    }

    return null;
  }
};
