import { AthleteIntelligenceProfile } from "./athleteEngine";

export const OrganizationEngine = {
  generateOperationalBriefing(athletes: AthleteIntelligenceProfile[]): string[] {
    const briefing: string[] = [];
    
    // Readiness Insights
    const readinessDrops = athletes.filter(a => a.readiness.deltas.readiness <= -10);
    if (readinessDrops.length > 0) {
      briefing.push(`${readinessDrops.length} athlete(s) had significant readiness drops today (e.g. ${readinessDrops[0].name}).`);
    }

    // Workload Insights
    const overloaded = athletes.filter(a => a.workload.metrics.acwr > 1.3);
    if (overloaded.length > 0) {
      briefing.push(`${overloaded.length} athlete(s) have rapidly increasing workloads (ACWR > 1.3).`);
    }

    // Attendance Insights
    const lowAttendance = athletes.filter(a => a.attendanceRate < 80);
    if (lowAttendance.length > 0) {
      briefing.push(`${lowAttendance.length} athlete(s) fell below 80% attendance.`);
    }

    // Injury Insights
    const activeInjuries = athletes.filter(a => a.activeInjuries > 0).length;
    if (activeInjuries > 0) {
      briefing.push(`${activeInjuries} athlete(s) are currently managing active injuries.`);
    }

    if (briefing.length === 0) {
      briefing.push("All systems optimal. No critical warnings today.");
    }

    return briefing;
  },

  generateTeamHeatmap(athletes: AthleteIntelligenceProfile[]) {
    // Maps each athlete to a color code: 'green', 'yellow', 'orange', 'red'
    return athletes.map(athlete => {
      let riskScore = 0;
      
      // Readiness
      if (athlete.readiness.deltas.readiness <= -15) riskScore += 3;
      else if (athlete.readiness.deltas.readiness <= -10) riskScore += 2;
      else if (athlete.readiness.deltas.readiness <= -5) riskScore += 1;

      // Workload ACWR
      if (athlete.workload.metrics.acwr > 1.5) riskScore += 3;
      else if (athlete.workload.metrics.acwr > 1.3) riskScore += 2;
      else if (athlete.workload.metrics.acwr < 0.8) riskScore += 1;

      // Attendance
      if (athlete.attendanceRate < 70) riskScore += 2;
      else if (athlete.attendanceRate < 80) riskScore += 1;

      // Injuries
      if (athlete.activeInjuries > 0) riskScore += 3;

      let color: "green" | "yellow" | "orange" | "red" = "green";
      if (riskScore >= 5) color = "red";
      else if (riskScore >= 3) color = "orange";
      else if (riskScore >= 1) color = "yellow";

      return {
        id: athlete.id,
        name: athlete.name,
        color,
        readinessDelta: athlete.readiness.deltas.readiness,
        acwr: athlete.workload.metrics.acwr,
        attendance: athlete.attendanceRate,
        injuries: athlete.activeInjuries
      };
    });
  }
};
