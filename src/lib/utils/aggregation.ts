import { format, subMonths, subWeeks, subYears, startOfMonth, startOfWeek, startOfYear } from "date-fns";

export type AggregationPeriod = "weekly" | "monthly" | "quarterly" | "yearly";

export interface AggregationResult {
  label: string;
  value: number;
}

/**
 * Aggregates a metric from an array of objects based on a date field.
 * @param data Array of objects to aggregate
 * @param dateField The field name containing the date (e.g., 'date', 'createdAt')
 * @param valueExtractor Function to extract the numeric value to sum. If null, counts the items.
 * @param period The aggregation period (monthly, weekly, etc.)
 * @param lookback The number of periods to look back
 * @returns Array of aggregated results ordered chronologically
 */
export function aggregateTimeSeriesData(
  data: any[],
  dateField: string,
  valueExtractor: ((item: any) => number) | null,
  period: AggregationPeriod = "monthly",
  lookback: number = 6
): AggregationResult[] {
  const dataMap: Record<string, number> = {};
  const now = new Date();
  const results: AggregationResult[] = [];

  // Initialize the periods
  for (let i = lookback - 1; i >= 0; i--) {
    let d: Date;
    let label = "";

    switch (period) {
      case "weekly":
        d = subWeeks(now, i);
        label = `W${format(d, "w")}`; // e.g. W42
        break;
      case "monthly":
        d = subMonths(now, i);
        label = format(d, "MMM"); // e.g. Jan
        break;
      case "yearly":
        d = subYears(now, i);
        label = format(d, "yyyy"); // e.g. 2024
        break;
      case "quarterly":
        // Simple quarterly approximation
        d = subMonths(now, i * 3);
        label = `Q${Math.floor(d.getMonth() / 3) + 1} ${format(d, "yy")}`;
        break;
    }
    
    dataMap[label] = 0;
    results.push({ label, value: 0 });
  }

  // Aggregate data
  data.forEach((item) => {
    try {
      const dateVal = item[dateField];
      if (!dateVal) return;
      
      const date = dateVal?.toDate ? dateVal.toDate() : new Date(dateVal);
      let label = "";
      
      switch (period) {
        case "weekly":
          label = `W${format(date, "w")}`;
          break;
        case "monthly":
          label = format(date, "MMM");
          break;
        case "yearly":
          label = format(date, "yyyy");
          break;
        case "quarterly":
          label = `Q${Math.floor(date.getMonth() / 3) + 1} ${format(date, "yy")}`;
          break;
      }

      if (dataMap[label] !== undefined) {
        const val = valueExtractor ? valueExtractor(item) : 1;
        dataMap[label] += val;
      }
    } catch (err) {
      console.error("Aggregation error", err);
    }
  });

  // Re-map the results array with the accumulated values
  return results.map(r => ({
    label: r.label,
    value: dataMap[r.label]
  }));
}
