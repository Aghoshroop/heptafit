import { ReadinessAnalysis } from "./readinessEngine";
import { WorkloadAnalysis } from "./workloadEngine";

export interface AthleteIntelligenceProfile {
  id: string;
  name: string;
  readiness: ReadinessAnalysis;
  workload: WorkloadAnalysis;
  attendanceRate: number;
  activeInjuries: number;
  warnings: string[];
}

export const AthleteEngine = {
  compileProfile(
    id: string,
    name: string,
    readiness: ReadinessAnalysis,
    workload: WorkloadAnalysis,
    attendanceRate: number,
    activeInjuries: number
  ): AthleteIntelligenceProfile {
    
    // Aggregate all warnings for this athlete
    const warnings = [
      ...readiness.warnings,
      ...workload.warnings
    ];

    if (attendanceRate < 80) warnings.push(`Low attendance (${attendanceRate}%).`);
    if (activeInjuries > 0) warnings.push(`Active injury.`);

    return {
      id,
      name,
      readiness,
      workload,
      attendanceRate,
      activeInjuries,
      warnings
    };
  }
};
