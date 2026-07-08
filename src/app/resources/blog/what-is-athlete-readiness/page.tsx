import { Metadata } from "next";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";

export const metadata: Metadata = {
  title: "What is Athlete Readiness? | Heptafit Blog",
  description: "A deep dive into athlete readiness, how to monitor it using daily wellness questionnaires and HRV, and how it reduces injury risk.",
};

export default function BlogPostPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "What is Athlete Readiness?",
    "description": "A deep dive into athlete readiness, how to monitor it using daily wellness questionnaires and HRV, and how it reduces injury risk.",
    "author": {
      "@type": "Organization",
      "name": "Heptafit Sports Science Team",
      "url": "https://heptafit.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Heptafit",
      "logo": {
        "@type": "ImageObject",
        "url": "https://heptafit.com/logo.png"
      }
    },
    "datePublished": "2024-10-15T08:00:00+08:00",
    "dateModified": "2024-10-15T08:00:00+08:00"
  };

  return (
    <article className="prose prose-invert prose-lg mx-auto">
      <SchemaMarkup schema={articleSchema} />
      
      <header className="not-prose mb-12">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <time dateTime="2024-10-15">October 15, 2024</time>
          <span>•</span>
          <span>5 min read</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
          What is Athlete Readiness?
        </h1>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            HS
          </div>
          <div>
            <p className="font-bold text-sm text-foreground">Heptafit Sports Science Team</p>
          </div>
        </div>
      </header>

      <p>
        In elite sports, the difference between peak performance and a season-ending injury often comes down to a single concept: <strong>athlete readiness</strong>.
      </p>

      <h2>Defining Athlete Readiness</h2>
      <p>
        Athlete readiness is a holistic measure of an individual's physical, psychological, and neurological preparedness to handle training stress on any given day. It answers one fundamental question for coaches: <em>"How hard can I push this athlete today without breaking them?"</em>
      </p>

      <h2>How to Monitor Readiness</h2>
      <p>
        Traditionally, coaches relied on observation. Today, high-performance academies use athlete management software to aggregate objective and subjective data points:
      </p>
      <ul>
        <li><strong>Daily Wellness Questionnaires:</strong> Self-reported metrics covering sleep quality, muscle soreness, stress, and mood.</li>
        <li><strong>HRV (Heart Rate Variability):</strong> Objective biometric data indicating the state of the autonomic nervous system.</li>
        <li><strong>ACWR (Acute:Chronic Workload Ratio):</strong> The physical strain accumulated over recent training sessions compared to historical fitness.</li>
      </ul>

      <h2>The Cost of Ignoring Readiness</h2>
      <p>
        Pushing an athlete whose readiness score is compromised drastically increases the risk of soft-tissue injuries. Furthermore, training in a state of high fatigue yields diminishing returns in physiological adaptation.
      </p>

      <h2>Automating Insights with Heptafit</h2>
      <p>
        Calculating these variables manually in spreadsheets for a roster of 50 athletes is impossible to do daily. Platforms like Heptafit centralize these inputs, automatically calculating an individualized readiness score every morning so coaches can adapt session plans instantly.
      </p>
    </article>
  );
}
