"use client";

import { motion } from "framer-motion";

export function FeatureGalaxy() {
  const nodes = [
    { label: "Analytics", angle: 0, radius: 150, color: "bg-blue-500" },
    { label: "Recovery", angle: 45, radius: 200, color: "bg-emerald-500" },
    { label: "Training", angle: 90, radius: 120, color: "bg-amber-500" },
    { label: "Medical", angle: 135, radius: 180, color: "bg-red-500" },
    { label: "Calendar", angle: 180, radius: 160, color: "bg-purple-500" },
    { label: "Athletes", angle: 225, radius: 220, color: "bg-cyan-500" },
    { label: "Coaches", angle: 270, radius: 140, color: "bg-fuchsia-500" },
    { label: "Admin", angle: 315, radius: 190, color: "bg-orange-500" },
  ];

  return (
    <section className="py-40 bg-black relative overflow-hidden">
      <div className="text-center relative z-20 mb-20 px-4">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">An Interconnected Galaxy</h2>
        <p className="text-xl text-white/60">Every module talks to each other. No data silos.</p>
      </div>

      <div className="relative h-[600px] w-full flex items-center justify-center">
        {/* Core */}
        <div className="absolute z-20 flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-[0_0_100px_rgba(168,85,247,1)] relative">
            <span className="text-white font-black tracking-widest z-10">CORE</span>
            <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-50"></div>
          </div>
        </div>

        {/* Orbit Rings */}
        <div className="absolute w-[300px] h-[300px] rounded-full border border-white/5"></div>
        <div className="absolute w-[450px] h-[450px] rounded-full border border-white/5"></div>

        {/* Orbiting Nodes */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="absolute w-full h-full flex items-center justify-center"
        >
          {nodes.map((node, i) => {
            const rad = (node.angle * Math.PI) / 180;
            const x = Math.cos(rad) * node.radius;
            const y = Math.sin(rad) * node.radius;

            return (
              <div 
                key={i}
                className="absolute flex flex-col items-center gap-2"
                style={{ transform: `translate(${x}px, ${y}px)` }}
              >
                {/* Counter-rotate the label so it stays upright */}
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                  className="flex flex-col items-center"
                >
                  <div className={`w-3 h-3 rounded-full ${node.color} shadow-[0_0_15px_currentColor]`}></div>
                  <span className="text-white/80 text-xs font-bold mt-2 bg-black/50 px-2 py-1 rounded backdrop-blur-sm">{node.label}</span>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
