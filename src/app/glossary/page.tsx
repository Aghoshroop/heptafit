import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sports Science Glossary | Heptafit",
  description: "A comprehensive glossary of sports science terms, training metrics, and performance analytics concepts.",
};

export default function GlossaryIndexPage() {
  const terms = [
    { slug: "acwr", name: "ACWR (Acute:Chronic Workload Ratio)" },
    { slug: "hrv", name: "HRV (Heart Rate Variability)" },
    { slug: "macrocycle", name: "Macrocycle" },
    { slug: "mesocycle", name: "Mesocycle" },
    { slug: "microcycle", name: "Microcycle" },
    { slug: "periodization", name: "Periodization" },
    { slug: "readiness", name: "Readiness" },
    { slug: "rpe", name: "RPE (Rating of Perceived Exertion)" },
    { slug: "training-load", name: "Training Load" },
  ];

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="pt-24 pb-16 px-4 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Sports Science Glossary</h1>
        <p className="text-xl text-muted-foreground">
          Definitions for core metrics and concepts used in high-performance sports and the Heptafit platform.
        </p>
      </header>

      <main className="px-4 max-w-4xl mx-auto pb-24">
        <div className="grid md:grid-cols-2 gap-4">
          {terms.map((term) => (
            <Link 
              key={term.slug} 
              href={`/glossary/${term.slug}`}
              className="bg-card border border-border p-6 rounded-2xl hover:border-primary/50 transition-colors flex items-center justify-between group"
            >
              <span className="font-bold text-lg">{term.name}</span>
              <span className="text-muted-foreground group-hover:text-primary transition-colors">→</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
