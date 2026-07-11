export function getAthleteStatus(
  athleteId: string,
  wellnessData: any[],
  insightsData: any[],
  schedulesData: any[]
): string {
  // Priority 1: Injured
  const activeInjuries = insightsData.filter(
    (i) => i.athleteId === athleteId && i.type === "Injury" && i.status === "active"
  );
  if (activeInjuries.length > 0) return "Injured";

  // Priority 2: Restricted (Overtraining Risk)
  const overtraining = insightsData.filter(
    (i) => i.athleteId === athleteId && i.type === "Overtraining Risk" && i.status === "active"
  );
  if (overtraining.length > 0) return "Restricted";

  // Priority 3: Recovery (Low Readiness)
  // Sort wellness by date desc to get latest
  const athleteWellness = wellnessData
    .filter((w) => w.athleteId === athleteId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  if (athleteWellness.length > 0) {
    const latestWellness = athleteWellness[0];
    if (latestWellness.readinessScore !== undefined && latestWellness.readinessScore < 60) {
      return "Recovery";
    }
  }

  // Priority 4: Active (Has schedule today)
  // We use local date string in YYYY-MM-DD format as commonly used in the app
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  const todaySchedules = schedulesData.filter(
    (s) => s.athleteId === athleteId && s.date === todayStr
  );
  
  if (todaySchedules.length > 0) return "Active";

  // Priority 5: Resting
  return "Resting";
}

export function getAthleteReadiness(athleteId: string, wellnessData: any[]): number | null {
  const athleteWellness = wellnessData
    .filter((w) => w.athleteId === athleteId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
  if (athleteWellness.length > 0) {
    const score = athleteWellness[0].readinessScore;
    return typeof score === 'number' ? score : null;
  }
  return null;
}
