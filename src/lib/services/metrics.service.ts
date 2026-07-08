import { bodyMetricsRepository } from "../repositories/metrics.repository";
import { BodyMetric } from "../types";
import { orderBy, limit, where } from "firebase/firestore";

export const addBodyMetric = async (
  athleteId: string, 
  organizationId: string, 
  headCoachId: string,
  data: Partial<BodyMetric>, 
  athleteHeight: number | null,
  userId: string, 
  userName: string
) => {
  // Fetch previous metric to calculate changes
  const prevMetrics = await bodyMetricsRepository.list([
    where("athleteId", "==", athleteId),
    orderBy("date", "desc"),
    limit(1)
  ]);
  const prev = prevMetrics.length > 0 ? prevMetrics[0] : null;

  const weight = data.weight;
  
  // Calculations
  let bmi = undefined;
  if (weight && athleteHeight) {
    const heightInMeters = athleteHeight / 100;
    bmi = Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
  }

  let leanBodyMass = data.leanBodyMass;
  if (!leanBodyMass && weight && data.bodyFatPercentage) {
    leanBodyMass = Math.round((weight * (1 - (data.bodyFatPercentage / 100))) * 10) / 10;
  }

  const weightChange = prev && weight ? Math.round((weight - prev.weight) * 10) / 10 : undefined;
  const bodyFatChange = prev?.bodyFatPercentage && data.bodyFatPercentage ? Math.round((data.bodyFatPercentage - prev.bodyFatPercentage) * 10) / 10 : undefined;
  const muscleChange = prev?.muscleMass && data.muscleMass ? Math.round((data.muscleMass - prev.muscleMass) * 10) / 10 : undefined;

  const newMetric = {
    ...data,
    organizationId,
    headCoachId,
    athleteId,
    bmi,
    leanBodyMass,
    weightChange,
    bodyFatChange,
    muscleChange,
  } as Omit<BodyMetric, "id" | "createdAt" | "updatedAt">;

  return await bodyMetricsRepository.create(newMetric, userId, userName);
};
