/**
 * ---------------------------------------------------------
 * FEATURE FLAG ENGINE (Pricing Tiers)
 * ---------------------------------------------------------
 * Governs which modules are accessible based on the organization's subscription tier.
 */

export type SubscriptionTier = "Free" | "Pro" | "Team" | "Enterprise";

export const SubscriptionFeatures = {
  Free: {
    maxAthletes: 5,
    hasKPIEngine: false,
    hasCompetitionMode: false,
    hasTeamAnalytics: false,
    hasAIInsights: false,
    hasCustomBranding: false,
  },
  Pro: {
    maxAthletes: 30,
    hasKPIEngine: true,
    hasCompetitionMode: true,
    hasTeamAnalytics: false,
    hasAIInsights: false,
    hasCustomBranding: false,
  },
  Team: {
    maxAthletes: 150,
    hasKPIEngine: true,
    hasCompetitionMode: true,
    hasTeamAnalytics: true,
    hasAIInsights: false,
    hasCustomBranding: false,
  },
  Enterprise: {
    maxAthletes: 99999, // Unlimited
    hasKPIEngine: true,
    hasCompetitionMode: true,
    hasTeamAnalytics: true,
    hasAIInsights: true,
    hasCustomBranding: true,
  }
};

export const FeatureFlags = {
  /**
   * Checks if a specific feature is enabled for the organization's tier.
   */
  canAccessFeature(tier: SubscriptionTier, feature: keyof typeof SubscriptionFeatures["Free"]): boolean {
    return SubscriptionFeatures[tier][feature] as boolean;
  },

  /**
   * Checks if the organization can add another athlete.
   */
  canAddAthlete(tier: SubscriptionTier, currentAthleteCount: number): boolean {
    return currentAthleteCount < SubscriptionFeatures[tier].maxAthletes;
  }
};
