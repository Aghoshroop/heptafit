"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export function InteractiveMap() {
  const pins = [
    { top: "30%", left: "20%", size: "w-4 h-4", delay: 0.1 },
    { top: "45%", left: "25%", size: "w-3 h-3", delay: 0.2 },
    { top: "25%", left: "45%", size: "w-5 h-5", delay: 0.3 },
    { top: "35%", left: "55%", size: "w-4 h-4", delay: 0.4 },
    { top: "65%", left: "35%", size: "w-3 h-3", delay: 0.5 },
    { top: "70%", left: "75%", size: "w-4 h-4", delay: 0.6 },
    { top: "40%", left: "80%", size: "w-5 h-5", delay: 0.7 },
  ];

  return (
    <section className="py-32 bg-black relative overflow-hidden border-t border-border/30">
      <div className="text-center relative z-20 mb-16 px-4">
        <h2 className="text-4xl font-bold tracking-tight text-white mb-4">Trusted Globally</h2>
        <p className="text-xl text-white/60">Academies around the world rely on Heptafit.</p>
      </div>

      <div className="relative max-w-5xl mx-auto h-[400px] flex items-center justify-center">
        {/* Abstract World Map SVG Placeholder */}
        <div className="absolute inset-0 opacity-20 flex items-center justify-center">
           <svg viewBox="0 0 1000 500" className="w-full h-full text-primary" fill="currentColor">
              {/* Very simplified dotted map shape for visual texture */}
              <circle cx="200" cy="150" r="2" />
              <circle cx="210" cy="160" r="2" />
              <circle cx="220" cy="140" r="2" />
              <circle cx="250" cy="220" r="2" />
              <circle cx="260" cy="240" r="2" />
              <circle cx="450" cy="120" r="2" />
              <circle cx="480" cy="140" r="2" />
              <circle cx="500" cy="130" r="2" />
              <circle cx="550" cy="170" r="2" />
              <circle cx="560" cy="190" r="2" />
              <circle cx="750" cy="200" r="2" />
              <circle cx="780" cy="220" r="2" />
              <circle cx="800" cy="210" r="2" />
              <circle cx="350" cy="320" r="2" />
              <circle cx="360" cy="340" r="2" />
              {/* Many more dots would typically go here for a real map */}
           </svg>
        </div>

        {/* Animated Pins */}
        {pins.map((pin, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: pin.delay, type: "spring" }}
            className="absolute z-10 flex flex-col items-center justify-center group"
            style={{ top: pin.top, left: pin.left }}
          >
            <div className={`${pin.size} bg-primary rounded-full shadow-[0_0_15px_rgba(168,85,247,0.8)] relative cursor-pointer`}>
              <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75"></div>
            </div>
            
            {/* Tooltip on hover */}
            <div className="absolute bottom-full mb-2 bg-card border border-border px-3 py-1 rounded text-xs font-bold text-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Active Academy
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Animated Stats Band */}
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center mt-12 relative z-20">
        <div>
          <div className="text-3xl font-black text-white mb-1">99.9%</div>
          <div className="text-xs font-bold text-primary tracking-widest uppercase">Realtime Sync</div>
        </div>
        <div>
          <div className="text-3xl font-black text-white mb-1">AI</div>
          <div className="text-xs font-bold text-fuchsia-500 tracking-widest uppercase">Powered Insights</div>
        </div>
        <div>
          <div className="text-3xl font-black text-white mb-1">Scale</div>
          <div className="text-xs font-bold text-blue-500 tracking-widest uppercase">Multi Academy</div>
        </div>
        <div>
          <div className="text-3xl font-black text-white mb-1">Cloud</div>
          <div className="text-xs font-bold text-emerald-500 tracking-widest uppercase">Based Infra</div>
        </div>
      </div>
    </section>
  );
}
