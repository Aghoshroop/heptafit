"use client";

import { Database, CloudLightning, Activity, Smartphone, Laptop, FileText } from "lucide-react";

export function ArchitectureIntegrations() {
  return (
    <section className="py-32 bg-black relative overflow-hidden">
      {/* Ambient Radial Glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(59,130,246,0.1)_0%,transparent_70%)] pointer-events-none " />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(168,85,247,0.1)_0%,transparent_70%)] pointer-events-none " />

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        
        {/* Architecture Section */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4 text-white ">Enterprise Architecture</h2>
            <p className="text-xl text-white/70 ">Built for scale, security, and realtime synchronization.</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm font-mono text-white/70">
            <div className="bg-white/5  border border-white/10 p-4 rounded-xl flex flex-col items-center ">
              <Smartphone size={24} className="text-primary mb-2 " /> Athlete App
            </div>
            <div className="h-8 w-[2px] md:w-8 md:h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div className="bg-white/10  border border-primary/40 p-4 rounded-xl flex flex-col items-center ">
              <Database size={24} className="text-fuchsia-400 mb-2 " /> Firebase Realtime
            </div>
            <div className="h-8 w-[2px] md:w-8 md:h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div className="bg-white/5  border border-white/10 p-4 rounded-xl flex flex-col items-center ">
              <CloudLightning size={24} className="text-blue-400 mb-2 " /> Cloud Functions
            </div>
            <div className="h-8 w-[2px] md:w-8 md:h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div className="bg-white/5  border border-white/10 p-4 rounded-xl flex flex-col items-center ">
              <Activity size={24} className="text-emerald-400 mb-2 " /> AI Engine
            </div>
            <div className="h-8 w-[2px] md:w-8 md:h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div className="bg-white/5  border border-white/10 p-4 rounded-xl flex flex-col items-center ">
              <Laptop size={24} className="text-primary mb-2 " /> Coach Dashboard
            </div>
          </div>
          
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-center text-xs font-bold uppercase tracking-widest text-white/50">
            <div className="">Encrypted</div>
            <div className="">Realtime</div>
            <div className="">Cloud Backups</div>
            <div className="">Role Permissions</div>
          </div>
        </div>

        {/* Integrations Section */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4 text-white ">Integrations</h2>
            <p className="text-xl text-white/70 ">Connect with the tools you already use.</p>
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
                    ? "bg-white/5 border-white/10 hover:border-primary/50 text-white cursor-pointer  hover: hover:bg-white/10 " 
                    : "bg-black/50 border-white/5 text-white/30 cursor-not-allowed"
                }`}
              >
                <div className="font-bold text-sm md:text-base ">{integration.name}</div>
                {!integration.active && <span className="text-[10px] mt-1 uppercase tracking-wider opacity-50">Coming Soon</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
