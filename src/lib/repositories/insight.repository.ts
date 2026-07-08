import { BaseRepository } from "./base.repository";
import { IntelligenceInsight } from "../types";

export class InsightRepository extends BaseRepository<IntelligenceInsight> {
  constructor() {
    super("insights", "system"); 
  }
}

export const insightRepository = new InsightRepository();
