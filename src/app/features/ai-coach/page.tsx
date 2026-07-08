import { Metadata } from "next";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { Brain, Activity, TrendingUp, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Coach Feature | Heptafit",
  description: "Learn about the Heptafit AI Coach. Discover how it analyzes daily wellness and training load to detect fatigue trends and elevate injury risk warnings.",
};

export default function AICoachFeaturePage() {
  const softwareFeatureSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Heptafit AI Coach",
    "applicationCategory": "Sports Analytics Engine",
    "description": "An artificial intelligence engine that analyzes athlete wellness data and acute-to-chronic workload ratios to predict injury risks."
  };

  return (
    <main className="pb-24">
      <SchemaMarkup schema={softwareFeatureSchema} />
      
      {/* Hero */}
      <section className="pt-24 pb-16 px-4 max-w-4xl mx-auto text-center">
        <div className="w-16 h-16 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Brain size={32} />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">The AI Coach</h1>
        <p className="text-xl text-muted-foreground">
          Identify hidden fatigue patterns and prevent injuries before they happen.
        </p>
      </section>

      {/* Semantic Content Structure */}
      <section className="max-w-4xl mx-auto px-4">
        <article className="prose prose-invert prose-lg mx-auto">
          <h2>What is it?</h2>
          <p>
            The Heptafit AI Coach is an intelligent background process that continuously analyzes incoming athlete data. It acts as an assistant to the head coach and medical staff, identifying mathematical correlations between training strain and physical breakdown.
          </p>

          <h2>Why does it matter?</h2>
          <p>
            In an academy with 50+ athletes, it is impossible for a human coach to cross-reference every athlete's daily sleep score, muscle soreness rating, and acute workload against their 4-week chronic average. The AI Coach does this instantly, ensuring no athlete falls through the cracks.
          </p>

          <h2>How does it work?</h2>
          <p>
            The engine aggregates three primary data streams:
          </p>
          <div className="grid md:grid-cols-3 gap-4 not-prose my-8">
            <div className="bg-card border border-border p-4 rounded-xl">
              <Activity className="text-emerald-500 mb-2" size={24} />
              <h3 className="font-bold mb-1">Wellness Logs</h3>
              <p className="text-sm text-muted-foreground">Sleep, mood, and soreness.</p>
            </div>
            <div className="bg-card border border-border p-4 rounded-xl">
              <TrendingUp className="text-primary mb-2" size={24} />
              <h3 className="font-bold mb-1">ACWR Data</h3>
              <p className="text-sm text-muted-foreground">Historical fitness vs current fatigue.</p>
            </div>
            <div className="bg-card border border-border p-4 rounded-xl">
              <AlertTriangle className="text-amber-500 mb-2" size={24} />
              <h3 className="font-bold mb-1">Medical Bay</h3>
              <p className="text-sm text-muted-foreground">Previous injury history.</p>
            </div>
          </div>
          <p>
            If the AI detects that an athlete's acute workload has spiked while their wellness scores have dropped, it triggers an <strong>Elevated Injury Risk Warning</strong> on the coach's dashboard.
          </p>

          <h2>Who benefits?</h2>
          <ul>
            <li><strong>Head Coaches:</strong> Can confidently adjust daily session volume based on objective risk profiles.</li>
            <li><strong>Medical Staff:</strong> Can proactively intervene with physiotherapy or recovery protocols.</li>
            <li><strong>Athletes:</strong> Experience fewer soft-tissue injuries and longer careers.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
