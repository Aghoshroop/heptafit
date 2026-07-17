export interface ReadinessData {
  readinessScore: number;
  sleepHours: number;
  fatigue: number;
  stress: number;
  mood: number;
  muscleSoreness: number;
  hydration: number;
  date: Date | any;
}

export interface ReadinessBaseline {
  avgReadiness: number;
  avgSleep: number;
  avgFatigue: number;
  avgStress: number;
  avgMood: number;
  avgSoreness: number;
  avgHydration: number;
  daysEvaluated: number;
}

export interface ReadinessAnalysis {
  baseline: ReadinessBaseline;
  current: ReadinessData | null;
  deltas: {
    readiness: number;
    sleep: number;
    fatigue: number;
    stress: number;
    mood: number;
    soreness: number;
    hydration: number;
  };
  warnings: string[];
}

export const ReadinessEngine = {
  calculateBaseline(history: ReadinessData[]): ReadinessBaseline {
    if (!history || history.length === 0) {
      return {
        avgReadiness: 0, avgSleep: 0, avgFatigue: 0,
        avgStress: 0, avgMood: 0, avgSoreness: 0, avgHydration: 0,
        daysEvaluated: 0
      };
    }

    const sum = history.reduce((acc, log) => {
      acc.readiness += log.readinessScore || 0;
      acc.sleep += log.sleepHours || 0;
      acc.fatigue += log.fatigue || 0;
      acc.stress += log.stress || 0;
      acc.mood += log.mood || 0;
      acc.soreness += log.muscleSoreness || 0;
      acc.hydration += log.hydration || 0;
      return acc;
    }, { readiness: 0, sleep: 0, fatigue: 0, stress: 0, mood: 0, soreness: 0, hydration: 0 });

    const count = history.length;
    return {
      avgReadiness: Math.round(sum.readiness / count),
      avgSleep: Number((sum.sleep / count).toFixed(1)),
      avgFatigue: Number((sum.fatigue / count).toFixed(1)),
      avgStress: Number((sum.stress / count).toFixed(1)),
      avgMood: Number((sum.mood / count).toFixed(1)),
      avgSoreness: Number((sum.soreness / count).toFixed(1)),
      avgHydration: Number((sum.hydration / count).toFixed(1)),
      daysEvaluated: count
    };
  },

  analyzeAthlete(history: ReadinessData[], current: ReadinessData | null): ReadinessAnalysis {
    const baseline = this.calculateBaseline(history);
    
    const deltas = {
      readiness: current ? current.readinessScore - baseline.avgReadiness : 0,
      sleep: current ? Number((current.sleepHours - baseline.avgSleep).toFixed(1)) : 0,
      fatigue: current ? Number((current.fatigue - baseline.avgFatigue).toFixed(1)) : 0,
      stress: current ? Number((current.stress - baseline.avgStress).toFixed(1)) : 0,
      mood: current ? Number((current.mood - baseline.avgMood).toFixed(1)) : 0,
      soreness: current ? Number((current.muscleSoreness - baseline.avgSoreness).toFixed(1)) : 0,
      hydration: current ? Number((current.hydration - baseline.avgHydration).toFixed(1)) : 0,
    };

    const warnings: string[] = [];
    
    // Deterministic rules based on personal baselines
    if (deltas.readiness <= -10) {
      warnings.push(`Readiness dropped ${Math.abs(deltas.readiness)} points below normal.`);
    }
    
    if (deltas.sleep <= -1.5) {
      warnings.push(`Sleep is ${Math.abs(deltas.sleep)}h below personal average.`);
    }

    if (deltas.soreness >= 2) {
      warnings.push(`Soreness is significantly higher than usual.`);
    }

    return { baseline, current, deltas, warnings };
  }
};
