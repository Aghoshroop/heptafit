export interface Competition {
  name: string;
  date: Date | any;
  priority: "A" | "B" | "C";
}

export const CompetitionEngine = {
  analyzeCompetitions(competitions: Competition[]) {
    if (!competitions || competitions.length === 0) return { nextCompetition: null, daysToCompetition: null, warnings: [] };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = competitions
      .map(c => ({
        ...c,
        parsedDate: c.date?.toDate ? c.date.toDate() : new Date(c.date)
      }))
      .filter(c => c.parsedDate >= today)
      .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime());

    if (upcoming.length === 0) return { nextCompetition: null, daysToCompetition: null, warnings: [] };

    const next = upcoming[0];
    const diffTime = Math.abs(next.parsedDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    const warnings: string[] = [];
    if (diffDays <= 14 && next.priority === "A") {
      warnings.push(`"A" Priority Competition (${next.name}) is ${diffDays} days away. Tapering recommended.`);
    }

    return {
      nextCompetition: next,
      daysToCompetition: diffDays,
      warnings
    };
  }
};
