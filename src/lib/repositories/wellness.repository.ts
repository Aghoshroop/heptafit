import { BaseRepository } from "./base.repository";
import { WellnessLog } from "@/lib/types";

class WellnessRepository extends BaseRepository<WellnessLog> {
  constructor() {
    super("wellnessLogs", "wellness");
  }
}

export const wellnessRepository = new WellnessRepository();
