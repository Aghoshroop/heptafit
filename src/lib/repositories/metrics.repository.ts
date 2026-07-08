import { BaseRepository } from "./base.repository";
import { BodyMetric } from "@/lib/types";

class BodyMetricsRepository extends BaseRepository<BodyMetric> {
  constructor() {
    super("bodyMetrics", "wellness"); // Can be refined to a distinct module if needed
  }
}

export const bodyMetricsRepository = new BodyMetricsRepository();
