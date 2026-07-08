import { Metadata } from "next";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { Activity, Brain, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Athlete Management Software | Heptafit",
  description: "The ultimate athlete management software for elite sports academies. Track readiness, manage training loads, and prevent injuries with our AI-assisted platform.",
};

export default function AthleteManagementSoftwarePage() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Heptafit Athlete Management Software",
    "applicationCategory": "Sports Health Application",
    "operatingSystem": "Web, iOS, Android",
    "description": "Heptafit is the premier athlete management software. It unifies AI-driven insights, medical tracking, training loads, and performance analytics into a single dashboard.",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is athlete management software?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Athlete management software is a centralized digital platform used by coaches, sports scientists, and medical staff to track an athlete's physical readiness, training loads, and medical history."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />
      
      <header className="pt-32 pb-24 px-4 max-w-5xl mx-auto text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-3xl bg-primary/20 blur-[120px] rounded-full -z-10"></div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Elite Athlete <br/>Management Software
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Replace your fragmented spreadsheets with a unified sports performance operating system designed for high-performance academies.
        </p>
      </header>

      <main>
        <section className="px-4 max-w-5xl mx-auto pb-24">
          <article className="prose prose-invert prose-lg mx-auto">
            <h2>Why Academies Need Dedicated Software</h2>
            <p>
              In high-performance sport, margins are razor-thin. Tracking training loads (like ACWR), daily wellness, and medical logs in separate systems leads to data silos. Heptafit's <strong>athlete management software</strong> bridges the gap between the field, the weight room, and the medical bay.
            </p>

            <div className="grid md:grid-cols-3 gap-6 not-prose my-12">
              <div className="bg-card border border-border p-6 rounded-2xl">
                <Activity className="text-primary mb-4" size={32} />
                <h3 className="text-lg font-bold mb-2">Centralized Data</h3>
                <p className="text-sm text-muted-foreground">All performance metrics, sleep logs, and RPE scores in one dashboard.</p>
              </div>
              <div className="bg-card border border-border p-6 rounded-2xl">
                <Brain className="text-purple-500 mb-4" size={32} />
                <h3 className="text-lg font-bold mb-2">AI-Assisted Insights</h3>
                <p className="text-sm text-muted-foreground">Identify hidden fatigue patterns and elevated injury risks automatically.</p>
              </div>
              <div className="bg-card border border-border p-6 rounded-2xl">
                <ShieldCheck className="text-emerald-500 mb-4" size={32} />
                <h3 className="text-lg font-bold mb-2">Medical Security</h3>
                <p className="text-sm text-muted-foreground">Encrypted, role-based access for injury tracking and rehab protocols.</p>
              </div>
            </div>

            <h2>Core Capabilities of Heptafit</h2>
            <h3>1. Athlete Wellness Monitoring</h3>
            <p>
              Athletes complete a rapid daily wellness questionnaire via the mobile app. Coaches instantly see team readiness scores, highlighting athletes who require modified training loads.
            </p>

            <h3>2. Advanced Training Load Management</h3>
            <p>
              Our sports analytics platform automatically calculates the Acute:Chronic Workload Ratio (ACWR). By comparing recent strain to historical capacity, Heptafit helps coaches avoid overtraining.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}
