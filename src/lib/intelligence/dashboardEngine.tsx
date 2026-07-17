import React from "react";
import { PerformanceProfile } from "./sportMetadata";
import {
  ReadinessWidget,
  SprintKineticsWidget,
  AerobicBaseWidget,
  JumpMechanicsWidget,
  ThrowKineticsWidget,
  DecathlonRadarWidget,
  PointsTargetWidget,
  ConsistencyWidget,
  AIInsightsWidget,
  PowerOutputWidget,
  PacingAnalysisWidget,
  // New Event Specific Overrides
  StartMechanicsWidget,
  LactateToleranceWidget,
  MiddleDistancePacingWidget,
  VerticalJumpMechanicsWidget,
  HorizontalJumpMechanicsWidget
} from "../../components/widgets";

/**
 * ---------------------------------------------------------
 * WIDGET REGISTRY
 * ---------------------------------------------------------
 * Maps string identifiers to actual React components.
 */
const WidgetRegistry: Record<string, React.FC<any>> = {
  ReadinessWidget,
  SprintKineticsWidget,
  AerobicBaseWidget,
  JumpMechanicsWidget,
  ThrowKineticsWidget,
  DecathlonRadarWidget,
  PointsTargetWidget,
  ConsistencyWidget,
  AIInsightsWidget,
  PowerOutputWidget,
  PacingAnalysisWidget,
  StartMechanicsWidget,
  LactateToleranceWidget,
  MiddleDistancePacingWidget,
  VerticalJumpMechanicsWidget,
  HorizontalJumpMechanicsWidget
};

/**
 * ---------------------------------------------------------
 * PROFILE WIDGET CONFIGURATION (Base)
 * ---------------------------------------------------------
 * Defines which widgets load universally for a Performance Profile.
 */
export const ProfileWidgetConfig: Record<PerformanceProfile, string[]> = {
  "Speed": ["ReadinessWidget", "PowerOutputWidget"],
  "Endurance": ["ReadinessWidget", "AerobicBaseWidget"],
  "Power": ["ReadinessWidget", "PowerOutputWidget", "ConsistencyWidget"],
  "Jump": ["ReadinessWidget", "PowerOutputWidget"],
  "Throw": ["ReadinessWidget", "ThrowKineticsWidget", "PowerOutputWidget"],
  "Combined Events": ["ReadinessWidget", "DecathlonRadarWidget", "PointsTargetWidget"], // Fully specialized
  "Race Walk": ["ReadinessWidget", "AerobicBaseWidget"],
  "General": ["ReadinessWidget", "ConsistencyWidget", "AIInsightsWidget"],
};

/**
 * ---------------------------------------------------------
 * EVENT WIDGET OVERRIDES (Specific)
 * ---------------------------------------------------------
 * Injects highly specific event widgets into the base profile.
 */
export const EventWidgetOverrides: Record<string, string[]> = {
  "60m": ["StartMechanicsWidget", "SprintKineticsWidget"],
  "100m": ["StartMechanicsWidget", "SprintKineticsWidget"],
  "200m": ["StartMechanicsWidget", "SprintKineticsWidget"],
  "400m": ["LactateToleranceWidget", "SprintKineticsWidget"],
  "800m": ["MiddleDistancePacingWidget", "PacingAnalysisWidget"],
  "1500m": ["MiddleDistancePacingWidget", "PacingAnalysisWidget"],
  "high-jump": ["VerticalJumpMechanicsWidget", "JumpMechanicsWidget"],
  "pole-vault": ["VerticalJumpMechanicsWidget", "JumpMechanicsWidget"],
  "long-jump": ["HorizontalJumpMechanicsWidget", "JumpMechanicsWidget"],
  "triple-jump": ["HorizontalJumpMechanicsWidget", "JumpMechanicsWidget"],
};

/**
 * ---------------------------------------------------------
 * DASHBOARD ENGINE (Dynamic Assembly)
 * ---------------------------------------------------------
 * Takes an athlete's profile and primary event to dynamically render the dashboard.
 */
interface DashboardEngineProps {
  performanceProfile: PerformanceProfile | string;
  primaryEvent?: string;
  athleteId: string;
}

export const DashboardEngine: React.FC<DashboardEngineProps> = ({ performanceProfile, primaryEvent, athleteId }) => {
  // Fallback to General if profile is missing or invalid
  const profileKey = Object.keys(ProfileWidgetConfig).includes(performanceProfile as string) 
    ? (performanceProfile as PerformanceProfile) 
    : "General";

  const baseWidgets = ProfileWidgetConfig[profileKey];
  const overrideWidgets = primaryEvent && EventWidgetOverrides[primaryEvent] ? EventWidgetOverrides[primaryEvent] : [];
  
  // Combine, deduplicate, and preserve order (Overrides first, then base)
  const activeWidgets = Array.from(new Set([...overrideWidgets, ...baseWidgets]));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {activeWidgets.map((widgetKey) => {
        const WidgetComponent = WidgetRegistry[widgetKey];
        if (!WidgetComponent) {
          console.warn(`Widget ${widgetKey} not found in registry.`);
          return null;
        }

        return <WidgetComponent key={widgetKey} athleteId={athleteId} />;
      })}
    </div>
  );
};
