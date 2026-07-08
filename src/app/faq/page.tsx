import { Metadata } from "next";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Heptafit FAQ & Support",
  description: "Comprehensive answers to the most frequently asked questions about Heptafit's features, pricing, security, and athlete management capabilities.",
};

const faqData = [
  {
    category: "Coaches & Academies",
    questions: [
      { q: "Can I manage multiple teams or age groups?", a: "Yes. Heptafit allows you to create unlimited sub-groups within your academy. You can assign specific coaches to oversee different age brackets or specialized teams." },
      { q: "Does Heptafit integrate with GPS trackers?", a: "We currently support CSV imports for most major GPS tracking systems. Direct API integrations for Catapult and STATSports are on our roadmap for Q4." },
      { q: "How long does it take to onboard an academy?", a: "Most academies are fully set up within 48 hours. Our bulk CSV upload feature allows you to import your entire roster in minutes." }
    ]
  },
  {
    category: "Athletes",
    questions: [
      { q: "Is there a mobile app for athletes?", a: "Yes. Athletes access Heptafit via a dedicated mobile app (iOS and Android) designed for quick, 30-second daily wellness entries." },
      { q: "What happens if I miss a daily wellness check?", a: "The system will notify your coach that data is missing. Consistent tracking is required for the AI to accurately predict readiness and injury risks." }
    ]
  },
  {
    category: "Security & Medical",
    questions: [
      { q: "Who can see an athlete's medical records?", a: "Medical records are strictly siloed. Only users with the 'Medical Staff' or 'Head Coach' role can access the Medical Bay. Assistant coaches cannot view injury histories." },
      { q: "Is the data encrypted?", a: "Yes. All data is encrypted at rest using AES-256 and in transit via TLS 1.3. We comply with standard sports data privacy regulations." }
    ]
  }
];

export default function FAQPage() {
  // Generate massive FAQPage schema dynamically
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.flatMap(category => 
      category.questions.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    )
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <SchemaMarkup schema={faqSchema} />
      
      <header className="pt-24 pb-16 px-4 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Frequently Asked Questions</h1>
        <p className="text-xl text-muted-foreground">
          Everything you need to know about the platform.
        </p>
      </header>

      <main className="px-4 max-w-4xl mx-auto pb-24 space-y-16">
        {faqData.map((category, idx) => (
          <section key={idx}>
            <h2 className="text-2xl font-bold mb-6 text-primary border-b border-border/50 pb-2">{category.category}</h2>
            <div className="space-y-4">
              {category.questions.map((faq, i) => (
                <details key={i} className="group bg-card border border-border rounded-2xl overflow-hidden">
                  <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-foreground hover:bg-secondary/30 transition-colors">
                    {faq.q}
                    <span className="transition group-open:rotate-180">
                      <ChevronRight size={20} className="text-muted-foreground" />
                    </span>
                  </summary>
                  <div className="text-muted-foreground text-sm p-6 pt-0 leading-relaxed border-t border-border/50 bg-secondary/10">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
