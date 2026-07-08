import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">
      {/* Main Feature Content */}
      <div className="flex-1">
        {children}
      </div>

      {/* Shared Topical Clustering / Internal Linking Component */}
      <aside className="bg-secondary/10 border-t border-border/50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-xl font-bold mb-8 text-center">Explore the Heptafit Ecosystem</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-medium">
            <Link href="/features/ai-coach" className="bg-card border border-border p-4 rounded-xl flex items-center justify-between hover:border-primary/50 transition-colors group">
              <span>AI Coach</span>
              <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary" />
            </Link>
            <Link href="/docs/readiness-score" className="bg-card border border-border p-4 rounded-xl flex items-center justify-between hover:border-primary/50 transition-colors group">
              <span>Readiness</span>
              <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary" />
            </Link>
            <Link href="/tools/training-load-calculator" className="bg-card border border-border p-4 rounded-xl flex items-center justify-between hover:border-primary/50 transition-colors group">
              <span>Training Load</span>
              <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary" />
            </Link>
            <Link href="/glossary/acwr" className="bg-card border border-border p-4 rounded-xl flex items-center justify-between hover:border-primary/50 transition-colors group">
              <span>ACWR</span>
              <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary" />
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
