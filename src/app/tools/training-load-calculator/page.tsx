"use client";

import { useState } from "react";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { Calculator, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function TrainingLoadCalculatorPage() {
  const [acuteLoad, setAcuteLoad] = useState<number>(1500);
  const [chronicLoad, setChronicLoad] = useState<number>(1200);

  const acwr = chronicLoad > 0 ? (acuteLoad / chronicLoad) : 0;
  
  let status = "Optimal";
  let statusColor = "text-emerald-500";
  let statusBg = "bg-emerald-500/10 border-emerald-500/20";
  let Icon = CheckCircle2;
  let message = "Your training load is in the 'sweet spot' (0.8 - 1.3). Injury risk is minimized while fitness improves.";

  if (acwr < 0.8) {
    status = "Under-Trained";
    statusColor = "text-blue-500";
    statusBg = "bg-blue-500/10 border-blue-500/20";
    Icon = Info;
    message = "Your acute load is significantly lower than your chronic average. You may be undertraining, which can also increase injury risk when you return to high intensity.";
  } else if (acwr > 1.3 && acwr <= 1.5) {
    status = "Caution";
    statusColor = "text-amber-500";
    statusBg = "bg-amber-500/10 border-amber-500/20";
    Icon = AlertTriangle;
    message = "Your training load is spiking (1.3 - 1.5). Monitor fatigue closely and consider pulling back volume.";
  } else if (acwr > 1.5) {
    status = "Danger Zone";
    statusColor = "text-red-500";
    statusBg = "bg-red-500/10 border-red-500/20";
    Icon = AlertTriangle;
    message = "Your acute load is spiking dangerously high (>1.5). The risk of soft-tissue injury is significantly elevated. Active recovery is highly recommended.";
  }

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ACWR Training Load Calculator",
    "applicationCategory": "CalculatorApplication",
    "description": "A free interactive tool to calculate Acute:Chronic Workload Ratio (ACWR) and assess injury risk based on training loads.",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <SchemaMarkup schema={softwareSchema} />
      
      <header className="pt-24 pb-16 px-4 max-w-4xl mx-auto text-center">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Calculator size={32} />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">ACWR Training Load Calculator</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Calculate your Acute:Chronic Workload Ratio instantly to predict fatigue spikes and prevent injuries.
        </p>
      </header>

      <main className="px-4 max-w-5xl mx-auto pb-24 grid md:grid-cols-2 gap-12">
        {/* Calculator Form */}
        <section className="bg-card border border-border p-8 rounded-3xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Input Load Data</h2>
          
          <div className="space-y-6">
            <div>
              <label className="flex justify-between text-sm font-medium mb-2">
                <span>Acute Load (Last 7 Days)</span>
                <span className="text-primary font-bold">{acuteLoad} AU</span>
              </label>
              <input 
                type="range" 
                min="0" 
                max="5000" 
                value={acuteLoad}
                onChange={(e) => setAcuteLoad(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <p className="text-xs text-muted-foreground mt-2">Sum of (RPE × Duration) for the last 7 days.</p>
            </div>

            <div>
              <label className="flex justify-between text-sm font-medium mb-2">
                <span>Chronic Load (Rolling 28-Day Avg)</span>
                <span className="text-primary font-bold">{chronicLoad} AU</span>
              </label>
              <input 
                type="range" 
                min="0" 
                max="5000" 
                value={chronicLoad}
                onChange={(e) => setChronicLoad(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <p className="text-xs text-muted-foreground mt-2">The average weekly load over the past 4 weeks.</p>
            </div>
            
            <div className="pt-6 border-t border-border">
              <Button className="w-full" variant="outline" onClick={() => { setAcuteLoad(1500); setChronicLoad(1200); }}>
                Reset Values
              </Button>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="flex flex-col justify-center">
          <div className="text-center mb-8">
            <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Your ACWR Score</p>
            <div className="text-8xl font-black tracking-tighter text-foreground">
              {acwr.toFixed(2)}
            </div>
          </div>

          <div className={`p-6 rounded-2xl border ${statusBg} flex gap-4`}>
            <div className={`mt-1 flex-shrink-0 ${statusColor}`}>
              <Icon size={24} />
            </div>
            <div>
              <h3 className={`font-bold text-lg mb-1 ${statusColor}`}>{status}</h3>
              <p className={`text-sm ${statusColor} opacity-80 leading-relaxed`}>
                {message}
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-secondary/20 rounded-2xl border border-border">
            <h4 className="font-bold mb-2">Automate this with Heptafit</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Stop calculating ACWR manually. Heptafit automatically pulls data from athlete mobile apps to calculate live ACWR scores for your entire roster.
            </p>
            <Button variant="primary" className="w-full text-sm">Start Free Trial</Button>
          </div>
        </section>
      </main>
    </div>
  );
}
