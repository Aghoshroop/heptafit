import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Sports Science Research Hub | Heptafit",
  description: "Summaries of peer-reviewed sports science research regarding training load, recovery, HRV, and injury prevention.",
};

export default function ResearchHubPage() {
  const researchArticles = [
    {
      title: "The Acute:Chronic Workload Ratio in Relation to Injury Risk in Sports",
      author: "Gabbett, T. J.",
      journal: "British Journal of Sports Medicine (2016)",
      summary: "This seminal paper introduces the concept of the 'sweet spot' (ACWR 0.8–1.3) and the 'danger zone' (ACWR ≥ 1.5). It demonstrates that athletes who spike their training loads rapidly are at a significantly higher risk of soft-tissue injuries.",
      link: "#"
    },
    {
      title: "Heart Rate Variability in Sports: A Review of the Literature",
      author: "Buchheit, M.",
      journal: "Frontiers in Physiology (2014)",
      summary: "A comprehensive review of how HRV is used to monitor autonomic nervous system status in elite athletes. The research indicates that suppressed HRV often precedes overtraining syndrome.",
      link: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="pt-24 pb-16 px-4 max-w-4xl mx-auto text-center">
        <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <BookOpen size={32} />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Research Hub</h1>
        <p className="text-xl text-muted-foreground">
          Evidence-based sports science summarized for coaches. We cite original, peer-reviewed sources.
        </p>
      </header>

      <main className="px-4 max-w-4xl mx-auto pb-24 space-y-8">
        {researchArticles.map((article, idx) => (
          <article key={idx} className="bg-card border border-border p-8 rounded-3xl hover:border-primary/50 transition-colors">
            <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
            <div className="text-sm text-muted-foreground mb-6 font-medium">
              <span>{article.author}</span> • <span className="text-primary/80 italic">{article.journal}</span>
            </div>
            <p className="text-foreground/90 leading-relaxed mb-6">
              {article.summary}
            </p>
            <Link href={article.link} className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
              Read Full Original Paper <ExternalLink size={14} />
            </Link>
          </article>
        ))}
      </main>
    </div>
  );
}
