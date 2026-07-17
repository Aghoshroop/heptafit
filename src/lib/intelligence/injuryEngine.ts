export interface InjuryRecord {
  status: "active" | "recovering" | "cleared";
  severity: "high" | "medium" | "low";
  dateReported: Date | any;
}

export const InjuryEngine = {
  analyzeInjuries(records: InjuryRecord[]) {
    const activeInjuries = records.filter(r => r.status === "active" || r.status === "recovering");
    const warnings: string[] = [];

    if (activeInjuries.length > 0) {
      const highRisk = activeInjuries.some(r => r.severity === "high");
      if (highRisk) {
        warnings.push(`High severity injury reported. Medical clearance required.`);
      } else {
        warnings.push(`${activeInjuries.length} active injury(s) reported.`);
      }
    }

    return {
      activeCount: activeInjuries.length,
      warnings
    };
  }
};
