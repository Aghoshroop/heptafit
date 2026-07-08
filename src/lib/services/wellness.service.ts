import { wellnessRepository } from "../repositories/wellness.repository";
import { WellnessLog } from "../types";

export const addWellnessLog = async (
  athleteId: string, 
  organizationId: string, 
  headCoachId: string,
  data: Partial<WellnessLog>, 
  userId: string, 
  userName: string
) => {
  // Calculations
  const metrics = [
    data.sleepQuality || 3,
    data.stressLevel || 3,
    data.fatigue || 3,
    data.muscleSoreness || 3,
    data.hydration || 3,
    data.nutrition || 3
  ];
  
  // Readiness is average of metrics out of 5, scaled to 100
  const total = metrics.reduce((acc, curr) => acc + curr, 0);
  const readinessScore = Math.round((total / (metrics.length * 5)) * 100);
  
  // Compliance score based on if they filled out all optional fields
  let fieldsFilled = 0;
  if (data.sleepQuality) fieldsFilled++;
  if (data.sleepHours) fieldsFilled++;
  if (data.stressLevel) fieldsFilled++;
  if (data.fatigue) fieldsFilled++;
  if (data.muscleSoreness) fieldsFilled++;
  if (data.hydration) fieldsFilled++;
  if (data.nutrition) fieldsFilled++;
  
  const complianceScore = Math.round((fieldsFilled / 7) * 100);

  // Risk flags
  const riskFlags: string[] = [];
  if ((data.fatigue || 3) <= 2) riskFlags.push("High Fatigue"); // Assuming 1 is bad, 5 is good for these metrics
  if ((data.sleepQuality || 3) <= 2) riskFlags.push("Poor Sleep");
  if ((data.muscleSoreness || 3) <= 2) riskFlags.push("High Soreness");
  if ((data.stressLevel || 3) <= 2) riskFlags.push("High Stress");

  const coachAlert = riskFlags.length >= 2 || readinessScore < 60;

  // Recommendations
  let recoveryRecommendation = "Continue standard recovery protocol.";
  if (readinessScore < 50) {
    recoveryRecommendation = "Active recovery or rest recommended.";
  } else if (riskFlags.includes("High Soreness")) {
    recoveryRecommendation = "Focus on mobility and soft tissue work.";
  } else if (riskFlags.includes("Poor Sleep")) {
    recoveryRecommendation = "Prioritize sleep hygiene tonight.";
  }

  let todaysRecommendation = "Ready for high intensity.";
  if (readinessScore < 60) todaysRecommendation = "Reduce intensity/volume by 20-30%.";
  if (readinessScore < 40) todaysRecommendation = "Rest day highly recommended.";

  const newLog = {
    ...data,
    organizationId,
    headCoachId,
    athleteId,
    readinessScore,
    complianceScore,
    riskFlags,
    coachAlert,
    recoveryRecommendation,
    todaysRecommendation
  } as Omit<WellnessLog, "id" | "createdAt" | "updatedAt">;

  return await wellnessRepository.create(newLog, userId, userName);
};
