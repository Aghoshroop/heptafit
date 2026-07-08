import { Metadata } from "next";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";

export const metadata: Metadata = {
  title: "About Us | Heptafit",
  description: "Learn about Heptafit, the company building the world's most advanced operating system for high-performance sports and athlete management.",
};

export default function AboutPage() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Heptafit",
    "url": "https://heptafit.com",
    "logo": "https://heptafit.com/logo.png",
    "description": "Heptafit builds the world's most advanced athlete management software for elite sports academies.",
    "foundingDate": "2024"
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <SchemaMarkup schema={organizationSchema} />
      
      <header className="pt-24 pb-16 px-4 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">About Heptafit</h1>
        <p className="text-xl text-muted-foreground">
          We are engineering the future of high-performance sports.
        </p>
      </header>

      <main className="px-4 max-w-4xl mx-auto pb-24">
        <article className="prose prose-invert prose-lg mx-auto">
          <h2>Our Mission</h2>
          <p>
            Heptafit was founded with a singular focus: to equip elite coaches and sports academies with a <strong>sports performance operating system</strong> that eliminates data fragmentation. 
          </p>
          <p>
            For too long, high-performance sports have relied on scattered spreadsheets, disjointed chat apps, and reactive medical tracking. We believe that when you unify training loads, wellness monitoring, and medical data, you unlock unparalleled insights.
          </p>
          
          <h2>Built for the Elite</h2>
          <p>
            Our athlete management software is designed to scale from private high-performance centers to national Olympic federations. We prioritize data security, rapid workflows, and an intuitive coach dashboard that turns raw data into actionable intelligence.
          </p>

          <section className="bg-secondary/20 p-8 rounded-2xl mt-12 border border-border">
            <h3 className="mt-0">Join the Mission</h3>
            <p className="mb-0 text-muted-foreground">
              We are a team of sports scientists, software engineers, and AI researchers. If you are passionate about pushing human performance forward, check out our careers page.
            </p>
          </section>
        </article>
      </main>
    </div>
  );
}
