import { Metadata } from "next";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "What is ACWR? | Heptafit Glossary",
  description: "Learn about Acute:Chronic Workload Ratio (ACWR), how it is calculated, and why it's critical for injury prevention in sports.",
};

export default function ACWRGlossaryPage() {
  const definedTermSchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "name": "Acute:Chronic Workload Ratio (ACWR)",
    "description": "A metric used in sports science to compare an athlete's recent training load (acute) against their historical training load (chronic) to predict injury risk.",
    "inDefinedTermSet": "https://heptafit.com/glossary"
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <SchemaMarkup schema={definedTermSchema} />
      
      <main className="px-4 max-w-3xl mx-auto py-24">
        <Link href="/glossary" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2 mb-8 w-fit">
          <ArrowLeft size={16} /> Back to Glossary
        </Link>

        <article className="prose prose-invert prose-lg mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            Acute:Chronic Workload Ratio (ACWR)
          </h1>
          
          <div className="bg-secondary/30 p-6 rounded-2xl border border-border mb-8 not-prose">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-2">Definition</h3>
            <p className="text-lg">
              A metric used in sports science to compare an athlete's recent training load (acute) against their historical training load (chronic) to predict injury risk.
            </p>
          </div>

          <h2>How is ACWR Calculated?</h2>
          <p>
            ACWR is typically calculated by dividing the <strong>Acute Workload</strong> (usually a 1-week period) by the <strong>Chronic Workload</strong> (usually a rolling 4-week average).
          </p>
          <ul>
            <li><strong>Acute Load:</strong> The fatigue your body is currently experiencing.</li>
            <li><strong>Chronic Load:</strong> The fitness and resilience your body has built up.</li>
          </ul>

          <h2>The "Sweet Spot" and Danger Zones</h2>
          <p>
            Research suggests that an ACWR between 0.8 and 1.3 is the "sweet spot" where injury risk is lowest and fitness is maintained or improved. 
          </p>
          <p>
            When the ratio spikes above 1.5, the athlete is in the "danger zone", indicating that their recent fatigue heavily outweighs their built-up fitness, drastically increasing the likelihood of soft-tissue injuries.
          </p>

          <h2>Tracking ACWR in Heptafit</h2>
          <p>
            The Heptafit sports performance operating system automatically calculates ACWR for every athlete by aggregating daily RPE scores and session durations. Coaches are immediately alerted when an athlete enters the danger zone.
          </p>
        </article>
      </main>
    </div>
  );
}
