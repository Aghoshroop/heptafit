import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Readiness Score Documentation | Heptafit",
  description: "Learn how the Heptafit Readiness Score is calculated, the inputs required, and how coaches use it to adjust training loads.",
};

export default function ReadinessScoreDocs() {
  return (
    <main className="p-8 max-w-4xl mx-auto py-16">
      <article className="prose prose-invert prose-lg max-w-none">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Readiness Score</h1>
        <p className="text-xl text-muted-foreground mb-12">
          An AI-assisted metric designed to help coaches monitor daily athlete recovery and capacity.
        </p>

        <h2>Purpose</h2>
        <p>
          The Readiness Score provides a single, actionable number (0-100) indicating an athlete's physical and psychological preparedness for training on a given day. It is designed to flag under-recovered athletes before they step onto the field, allowing coaches to proactively modify session intensity.
        </p>

        <h2>Inputs</h2>
        <p>
          The Heptafit engine calculates readiness based on several daily data points logged by the athlete:
        </p>
        <ul>
          <li><strong>Sleep Quality & Duration:</strong> Self-reported or synced via wearables.</li>
          <li><strong>Muscle Soreness:</strong> A 1-10 rating provided in the morning wellness check.</li>
          <li><strong>Stress Levels:</strong> Psychological readiness and general fatigue.</li>
          <li><strong>Previous Day's ACWR:</strong> The physical toll of the preceding training blocks.</li>
        </ul>

        <h2>Outputs</h2>
        <p>
          The platform outputs a score categorized into three actionable zones:
        </p>
        <div className="not-prose grid gap-4 my-8">
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center font-bold text-lg">80+</div>
            <div>
              <h4 className="font-bold text-emerald-500">Optimal (Green)</h4>
              <p className="text-sm text-emerald-500/80">Athlete is fully recovered. Ready for high-intensity loads.</p>
            </div>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center font-bold text-lg">60-79</div>
            <div>
              <h4 className="font-bold text-amber-500">Caution (Yellow)</h4>
              <p className="text-sm text-amber-500/80">Moderate fatigue. Monitor during session, consider volume reduction.</p>
            </div>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center font-bold text-lg">&lt;60</div>
            <div>
              <h4 className="font-bold text-red-500">At Risk (Red)</h4>
              <p className="text-sm text-red-500/80">Severe fatigue or soreness. High injury risk. Recommend active recovery or rest.</p>
            </div>
          </div>
        </div>

        <h2>Limitations</h2>
        <p>
          The Readiness Score relies heavily on subjective self-reporting from the athlete (unless fully integrated with external GPS/HRV monitors). If athletes do not provide honest wellness data, the AI-assisted insights will be less accurate. It should be used as a guiding metric, not a replacement for medical diagnosis or coach intuition.
        </p>
      </article>
    </main>
  );
}
