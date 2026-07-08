import { Metadata } from "next";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Heptafit vs Spreadsheets | Athlete Management Comparison",
  description: "Discover why elite sports academies are switching from manual spreadsheets to Heptafit's automated athlete management software.",
};

export default function CompareSpreadsheetsPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="pt-24 pb-16 px-4 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Heptafit vs. Spreadsheets</h1>
        <p className="text-xl text-muted-foreground">
          Why high-performance academies are abandoning manual data entry.
        </p>
      </header>

      <main className="px-4 max-w-5xl mx-auto pb-24">
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl mb-16">
          <table className="w-full text-left">
            <thead className="bg-secondary/50">
              <tr>
                <th className="p-6 font-bold text-foreground w-1/3">Feature / Workflow</th>
                <th className="p-6 font-bold text-muted-foreground w-1/3 border-l border-border">Spreadsheets (Excel/Sheets)</th>
                <th className="p-6 font-bold text-primary w-1/3 border-l border-border bg-primary/5">Heptafit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { 
                  feature: "Data Collection", 
                  spread: "Manual entry or generic forms. Prone to errors and missed days.", 
                  hepta: "Automated via native mobile apps. Push notifications ensure high compliance." 
                },
                { 
                  feature: "ACWR Calculation", 
                  spread: "Requires complex, brittle formulas that break when an athlete is added/removed.", 
                  hepta: "Calculated instantly in real-time. Visualized on the coach dashboard." 
                },
                { 
                  feature: "Injury Risk Alerts", 
                  spread: "Non-existent. Coaches must manually spot trends across hundreds of rows.", 
                  hepta: "AI-assisted proactive alerts trigger immediately when risk parameters are met." 
                },
                { 
                  feature: "Medical Security", 
                  spread: "Often shared via email or unencrypted drives. HIPAA/GDPR risks.", 
                  hepta: "Encrypted Medical Bay with strict role-based access control (RBAC)." 
                },
                { 
                  feature: "Athlete Experience", 
                  spread: "View-only links or generic PDFs. No engagement.", 
                  hepta: "Interactive mobile app showing their own progress, readiness, and schedule." 
                }
              ].map((row, i) => (
                <tr key={i}>
                  <td className="p-6 font-bold text-foreground">
                    {row.feature}
                  </td>
                  <td className="p-6 text-muted-foreground border-l border-border flex items-start gap-3 h-full">
                    <X className="text-red-500/50 flex-shrink-0 mt-1" size={16} /> <span>{row.spread}</span>
                  </td>
                  <td className="p-6 text-foreground font-medium border-l border-border bg-primary/5 flex items-start gap-3 h-full">
                    <Check className="text-emerald-500 flex-shrink-0 mt-1" size={16} /> <span>{row.hepta}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to upgrade your workflow?</h2>
          <Button variant="primary" className="h-14 px-8 text-lg">Start your free trial today</Button>
        </div>
      </main>
    </div>
  );
}
