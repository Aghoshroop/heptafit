"use client";

import { Database, CloudLightning, Activity, Smartphone, Laptop, FileText } from "lucide-react";

export function ArchitectureIntegrations() {
  return (
    <section className="py-32 bg-secondary/10 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Architecture Section */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Enterprise Architecture</h2>
            <p className="text-xl text-muted-foreground">Built for scale, security, and realtime synchronization.</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm font-mono text-muted-foreground">
            <div className="bg-card border border-border p-4 rounded-xl flex flex-col items-center">
              <Smartphone size={24} className="text-primary mb-2" /> Athlete App
            </div>
            <div className="h-8 w-px md:w-8 md:h-px bg-border"></div>
            <div className="bg-card border border-border p-4 rounded-xl flex flex-col items-center shadow-[0_0_15px_rgba(168,85,247,0.2)] border-primary/30">
              <Database size={24} className="text-fuchsia-500 mb-2" /> Firebase Realtime
            </div>
            <div className="h-8 w-px md:w-8 md:h-px bg-border"></div>
            <div className="bg-card border border-border p-4 rounded-xl flex flex-col items-center">
              <CloudLightning size={24} className="text-blue-500 mb-2" /> Cloud Functions
            </div>
            <div className="h-8 w-px md:w-8 md:h-px bg-border"></div>
            <div className="bg-card border border-border p-4 rounded-xl flex flex-col items-center">
              <Activity size={24} className="text-emerald-500 mb-2" /> AI Engine
            </div>
            <div className="h-8 w-px md:w-8 md:h-px bg-border"></div>
            <div className="bg-card border border-border p-4 rounded-xl flex flex-col items-center">
              <Laptop size={24} className="text-primary mb-2" /> Coach Dashboard
            </div>
          </div>
          
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <div>Encrypted</div>
            <div>Realtime</div>
            <div>Cloud Backups</div>
            <div>Role Permissions</div>
          </div>
        </div>

        {/* Integrations Section */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Integrations</h2>
            <p className="text-xl text-muted-foreground">Connect with the tools you already use.</p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-5 gap-6">
            {[
              { name: "Garmin", active: true },
              { name: "Polar", active: true },
              { name: "WHOOP", active: true },
              { name: "CSV Export", active: true },
              { name: "API", active: true },
              { name: "Apple Health", active: false },
              { name: "Google Cal", active: false },
              { name: "Stripe", active: false },
              { name: "Fitbit", active: false },
              { name: "Oura", active: false },
            ].map((integration, i) => (
              <div 
                key={i} 
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all ${
                  integration.active 
                    ? "bg-card border-border hover:border-primary/50 text-foreground cursor-pointer shadow-sm hover:shadow-md" 
                    : "bg-background border-border/30 text-muted-foreground/50 grayscale cursor-not-allowed"
                }`}
              >
                <div className="font-bold text-sm md:text-base">{integration.name}</div>
                {!integration.active && <span className="text-[10px] mt-1 uppercase tracking-wider">Coming Soon</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
