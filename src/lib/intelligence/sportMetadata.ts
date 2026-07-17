export type Sport = "Athletics";
export type Discipline = "Track & Field";
export type Gender = "Men" | "Women" | "Mixed";
export type AgeGroup = "U18" | "U20" | "Senior" | "Masters";
export type EventUnit = "Seconds" | "Minutes:Seconds" | "Metres" | "Points";
export type EventType = "track" | "jump" | "throw" | "combined" | "road" | "race_walk";
export type MeasurementType = "time" | "distance" | "height" | "points";
export type PerformanceProfile = "Speed" | "Endurance" | "Power" | "Jump" | "Throw" | "Combined Events" | "Race Walk" | "General";

export interface WAScoringParams {
  a: number;
  b: number;
  c: number;
  shift?: number; // For manual timing shift or specific adjustments
}

export interface EventMetadata {
  id: string;
  name: string;
  eventType: EventType;
  performanceProfile: PerformanceProfile;
  measurementType: MeasurementType;
  displayUnit: EventUnit;
  precision: number; // e.g., 2 decimal places
  lowerIsBetter: boolean; // True for track (faster is better), false for jumps/throws
  worldAthleticsEventCode?: string;
  
  // Future-proof environment flags
  isIndoor: boolean;
  isOutdoor: boolean;
  
  // Support flags for UI/Analytics rendering (Event Capability System)
  capabilities: {
    supportsWind: boolean;
    supportsReactionTime: boolean;
    supportsSplits: boolean;
    supportsAttempts: boolean; // True for throws/jumps (e.g., 3/6 attempts)
    supportsLaps: boolean;
    supportsHeights: boolean;
    supportsImplements: boolean;
    supportsPoints: boolean; // True if it can be scored in combined events
  };
  
  scoringParams?: {
    Men?: WAScoringParams;
    Women?: WAScoringParams;
  };
}

export interface CategoryMetadata {
  id: string;
  name: string;
  events: EventMetadata[];
}

export interface DisciplineMetadata {
  id: string;
  name: Discipline;
  categories: CategoryMetadata[];
}

export interface SportMetadata {
  id: string;
  name: Sport;
  metadataVersion: string;
  disciplines: DisciplineMetadata[];
}

// Helper to construct a track event easily
const createTrackEvent = (
  id: string, name: string, unit: EventUnit, code: string, 
  profile: PerformanceProfile,
  scoringParams?: { Men?: WAScoringParams; Women?: WAScoringParams },
  isHurdles: boolean = false
): EventMetadata => ({
  id, name, eventType: "track", performanceProfile: profile, measurementType: "time", displayUnit: unit, precision: 2, lowerIsBetter: true,
  worldAthleticsEventCode: code, isIndoor: true, isOutdoor: true, 
  capabilities: {
    supportsWind: id.includes("100") || id.includes("200") || isHurdles, 
    supportsReactionTime: true, 
    supportsSplits: id !== "60m" && id !== "100m" && !isHurdles, 
    supportsAttempts: false,
    supportsLaps: id === "800m" || id === "1500m" || id === "3000m" || id === "5000m" || id === "10000m",
    supportsHeights: false,
    supportsImplements: false,
    supportsPoints: !!scoringParams,
  },
  scoringParams
});

// Helper to construct a jump event
const createJumpEvent = (
  id: string, name: string, code: string, isVertical: boolean,
  scoringParams?: { Men?: WAScoringParams; Women?: WAScoringParams }
): EventMetadata => ({
  id, name, eventType: "jump", performanceProfile: "Jump", measurementType: isVertical ? "height" : "distance", displayUnit: "Metres", precision: 2, lowerIsBetter: false,
  worldAthleticsEventCode: code, isIndoor: true, isOutdoor: true, 
  capabilities: {
    supportsWind: !isVertical, 
    supportsReactionTime: false, 
    supportsSplits: false, 
    supportsAttempts: true,
    supportsLaps: false,
    supportsHeights: isVertical,
    supportsImplements: false,
    supportsPoints: !!scoringParams,
  },
  scoringParams
});

// Helper to construct a throw event
const createThrowEvent = (
  id: string, name: string, code: string,
  scoringParams?: { Men?: WAScoringParams; Women?: WAScoringParams }
): EventMetadata => ({
  id, name, eventType: "throw", performanceProfile: "Throw", measurementType: "distance", displayUnit: "Metres", precision: 2, lowerIsBetter: false,
  worldAthleticsEventCode: code, isIndoor: false, isOutdoor: true, 
  capabilities: {
    supportsWind: false, 
    supportsReactionTime: false, 
    supportsSplits: false, 
    supportsAttempts: true,
    supportsLaps: false,
    supportsHeights: false,
    supportsImplements: true,
    supportsPoints: !!scoringParams,
  },
  scoringParams
});

export const ATHLETICS_METADATA: SportMetadata = {
  id: "athletics",
  name: "Athletics",
  metadataVersion: "v1_WA2026",
  disciplines: [
    {
      id: "track-and-field",
      name: "Track & Field",
      categories: [
        {
          id: "sprints",
          name: "Sprints",
          events: [
            createTrackEvent("60m", "60m", "Seconds", "60", "Speed", { Men: { a: 58.015, b: 11.5, c: 1.81 }, Women: { a: 46.0849, b: 13.0, c: 1.81 } }),
            createTrackEvent("100m", "100m", "Seconds", "100", "Speed", { Men: { a: 25.4347, b: 18.0, c: 1.81 }, Women: { a: 17.857, b: 21.0, c: 1.81 } }),
            createTrackEvent("200m", "200m", "Seconds", "200", "Speed", { Men: { a: 5.8425, b: 38.0, c: 1.81 }, Women: { a: 4.99087, b: 42.5, c: 1.81 } }),
            createTrackEvent("400m", "400m", "Seconds", "400", "Speed", { Men: { a: 1.53775, b: 82.0, c: 1.81 }, Women: { a: 1.34285, b: 91.7, c: 1.81 } }),
          ],
        },
        {
          id: "hurdles",
          name: "Hurdles",
          events: [
            createTrackEvent("60mH", "60m Hurdles", "Seconds", "60H", "Speed", { Men: { a: 20.5173, b: 15.5, c: 1.92 }, Women: { a: 20.0479, b: 17.0, c: 1.835 } }, true),
            createTrackEvent("100mH", "100m Hurdles", "Seconds", "100H", "Speed", { Women: { a: 9.23076, b: 26.7, c: 1.835 } }, true),
            createTrackEvent("110mH", "110m Hurdles", "Seconds", "110H", "Speed", { Men: { a: 5.74352, b: 28.5, c: 1.92 } }, true),
            createTrackEvent("400mH", "400m Hurdles", "Seconds", "400H", "Speed", undefined, true),
          ],
        },
        {
          id: "middle-distance",
          name: "Middle Distance",
          events: [
            createTrackEvent("800m", "800m", "Minutes:Seconds", "800", "Endurance", { Men: { a: 0.13279, b: 235.0, c: 1.85 }, Women: { a: 0.11193, b: 254.0, c: 1.88 } }),
            createTrackEvent("1500m", "1500m", "Minutes:Seconds", "1500", "Endurance", { Men: { a: 0.03768, b: 480.0, c: 1.85 } }),
          ],
        },
        {
          id: "jumps",
          name: "Jumps",
          events: [
            createJumpEvent("high-jump", "High Jump", "HJ", true, { Men: { a: 0.8465, b: 75.0, c: 1.42 }, Women: { a: 1.84523, b: 75.0, c: 1.348 } }),
            createJumpEvent("pole-vault", "Pole Vault", "PV", true, { Men: { a: 0.2797, b: 100.0, c: 1.35 } }),
            createJumpEvent("long-jump", "Long Jump", "LJ", false, { Men: { a: 0.14354, b: 220.0, c: 1.4 }, Women: { a: 0.188807, b: 210.0, c: 1.41 } }),
            createJumpEvent("triple-jump", "Triple Jump", "TJ", false),
          ],
        },
        {
          id: "throws",
          name: "Throws",
          events: [
            createThrowEvent("shot-put", "Shot Put", "SP", { Men: { a: 51.39, b: 1.5, c: 1.05 }, Women: { a: 56.0211, b: 1.5, c: 1.05 } }),
            createThrowEvent("discus", "Discus Throw", "DT", { Men: { a: 12.91, b: 4.0, c: 1.1 } }),
            createThrowEvent("hammer", "Hammer Throw", "HT"),
            createThrowEvent("javelin", "Javelin Throw", "JT", { Men: { a: 10.14, b: 7.0, c: 1.08 }, Women: { a: 15.9803, b: 3.8, c: 1.04 } }),
          ],
        },
        {
          id: "combined-events",
          name: "Combined Events",
          events: [
            {
              id: "decathlon", name: "Decathlon", eventType: "combined", performanceProfile: "Combined Events", measurementType: "points", displayUnit: "Points", precision: 0, lowerIsBetter: false,
              worldAthleticsEventCode: "DEC", isIndoor: false, isOutdoor: true, 
              capabilities: { supportsWind: false, supportsReactionTime: false, supportsSplits: false, supportsAttempts: false, supportsLaps: false, supportsHeights: false, supportsImplements: false, supportsPoints: false }
            },
            {
              id: "heptathlon", name: "Heptathlon", eventType: "combined", performanceProfile: "Combined Events", measurementType: "points", displayUnit: "Points", precision: 0, lowerIsBetter: false,
              worldAthleticsEventCode: "HEP", isIndoor: true, isOutdoor: true, 
              capabilities: { supportsWind: false, supportsReactionTime: false, supportsSplits: false, supportsAttempts: false, supportsLaps: false, supportsHeights: false, supportsImplements: false, supportsPoints: false }
            },
          ]
        }
      ],
    },
  ],
};

export const getAllEventsFlat = (): EventMetadata[] => {
  const events: EventMetadata[] = [];
  ATHLETICS_METADATA.disciplines.forEach(d => {
    d.categories.forEach(c => {
      events.push(...c.events);
    });
  });
  return events;
};

export const getCategoryForEvent = (eventId: string): CategoryMetadata | undefined => {
  for (const d of ATHLETICS_METADATA.disciplines) {
    for (const c of d.categories) {
      if (c.events.some(e => e.id === eventId)) {
        return c;
      }
    }
  }
  return undefined;
};
