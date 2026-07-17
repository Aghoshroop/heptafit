export interface AttendanceRecord {
  status: "present" | "absent" | "late" | "excused";
  date: Date | any;
}

export const AttendanceEngine = {
  analyzeAttendance(records: AttendanceRecord[]) {
    if (!records || records.length === 0) return { rate: 100, warnings: [] };
    
    const total = records.length;
    const present = records.filter(r => r.status === "present" || r.status === "late").length;
    
    const rate = Math.round((present / total) * 100);
    const warnings: string[] = [];

    const recentAbsences = records
      .sort((a, b) => (b.date?.toDate ? b.date.toDate().getTime() : new Date(b.date).getTime()) - (a.date?.toDate ? a.date.toDate().getTime() : new Date(a.date).getTime()))
      .slice(0, 5)
      .filter(r => r.status === "absent");

    if (recentAbsences.length >= 2) {
      warnings.push(`Missed ${recentAbsences.length} sessions recently.`);
    }

    if (rate < 80) {
      warnings.push(`Overall attendance has dropped to ${rate}%.`);
    }

    return { rate, warnings };
  }
};
