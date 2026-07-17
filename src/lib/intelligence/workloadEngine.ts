export interface TrainingSession {
  durationMinutes: number;
  rpe: number; // Rate of Perceived Exertion (1-10)
  date: Date | any;
}

export interface WorkloadMetrics {
  acuteLoad: number; // 7-day rolling avg
  chronicLoad: number; // 28-day rolling avg
  acwr: number; // Acute:Chronic Workload Ratio
  weeklyLoad: number;
  monthlyLoad: number;
}

export interface WorkloadAnalysis {
  metrics: WorkloadMetrics;
  warnings: string[];
}

export const WorkloadEngine = {
  calculateLoad(sessions: TrainingSession[], startDate: Date, endDate: Date): number {
    return sessions
      .filter(s => {
        const d = s.date?.toDate ? s.date.toDate() : new Date(s.date);
        return d >= startDate && d <= endDate;
      })
      .reduce((total, session) => total + (session.durationMinutes * (session.rpe || 5)), 0);
  },

  analyzeWorkload(sessions: TrainingSession[]): WorkloadAnalysis {
    const today = new Date();
    
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    const twentyEightDaysAgo = new Date(today);
    twentyEightDaysAgo.setDate(today.getDate() - 28);

    const acuteLoad = this.calculateLoad(sessions, sevenDaysAgo, today);
    const chronicLoad = this.calculateLoad(sessions, twentyEightDaysAgo, today) / 4; // average weekly load over 4 weeks
    
    const acwr = chronicLoad > 0 ? Number((acuteLoad / chronicLoad).toFixed(2)) : 0;

    const warnings: string[] = [];
    
    if (acwr > 1.5) {
      warnings.push(`High ACWR (${acwr}). Elevated risk of injury.`);
    } else if (acwr > 1.3) {
      warnings.push(`Workload increasing rapidly (ACWR ${acwr}).`);
    } else if (acwr < 0.8 && chronicLoad > 0) {
      warnings.push(`Low training stimulus (ACWR ${acwr}). Risk of detraining.`);
    }

    return {
      metrics: {
        acuteLoad,
        chronicLoad,
        acwr,
        weeklyLoad: acuteLoad,
        monthlyLoad: chronicLoad * 4
      },
      warnings
    };
  }
};
