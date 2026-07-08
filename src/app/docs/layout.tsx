import Link from "next/link";
import { BookOpen, Activity, HeartPulse, Target } from "lucide-react";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col md:flex-row">
      {/* Docs Sidebar */}
      <aside className="w-full md:w-64 border-r border-border/50 bg-card/50 flex-shrink-0 p-6">
        <div className="flex items-center gap-2 mb-8">
          <BookOpen className="text-primary" size={24} />
          <span className="font-bold text-lg">Documentation</span>
        </div>

        <nav className="space-y-6">
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3">Core Concepts</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/docs/readiness-score" className="text-foreground hover:text-primary flex items-center gap-2">
                  <Activity size={14} /> Readiness Score
                </Link>
              </li>
              <li>
                <Link href="/docs/wellness" className="text-muted-foreground hover:text-primary flex items-center gap-2">
                  <HeartPulse size={14} /> Wellness Matrix
                </Link>
              </li>
              <li>
                <Link href="/docs/training-load" className="text-muted-foreground hover:text-primary flex items-center gap-2">
                  <Target size={14} /> Training Load
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Docs Content */}
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}
