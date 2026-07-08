import { Metadata } from "next";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { Mail, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Heptafit",
  description: "Get in touch with the Heptafit team for sales, support, and partnership inquiries regarding our athlete management platform.",
};

export default function ContactPage() {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "mainEntity": {
      "@type": "Organization",
      "name": "Heptafit",
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "support@heptafit.com",
        "contactType": "customer support"
      }
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <SchemaMarkup schema={contactSchema} />
      
      <header className="pt-24 pb-16 px-4 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Contact Heptafit</h1>
        <p className="text-xl text-muted-foreground">
          We're here to help you optimize your sports academy.
        </p>
      </header>

      <main className="px-4 max-w-4xl mx-auto pb-24 grid md:grid-cols-2 gap-12">
        <section>
          <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Sales & Support</h3>
                <p className="text-muted-foreground mb-2">Our team typically responds within 24 hours.</p>
                <a href="mailto:support@heptafit.com" className="text-primary hover:underline font-medium">support@heptafit.com</a>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Headquarters</h3>
                <p className="text-muted-foreground">
                  San Francisco, CA<br/>
                  United States
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-card border border-border p-8 rounded-3xl">
          <h2 className="text-xl font-bold mb-6">Send a Message</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">Name</label>
              <input type="text" className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">Email</label>
              <input type="email" className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">Message</label>
              <textarea className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2 h-32 resize-none focus:ring-2 focus:ring-primary/50 outline-none"></textarea>
            </div>
            <button type="button" className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors">
              Send Message
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
