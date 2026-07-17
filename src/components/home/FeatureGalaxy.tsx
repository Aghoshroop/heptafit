"use client";

import { motion } from "framer-motion";

export function FeatureGalaxy() {
  const nodes = [
    { label: "Analytics", angle: 0, radius: 150, color: "bg-blue-500", shadow: "rgba(59,130,246,0.8)" },
    { label: "Recovery", angle: 45, radius: 200, color: "bg-emerald-500", shadow: "rgba(16,185,129,0.8)" },
    { label: "Training", angle: 90, radius: 120, color: "bg-amber-500", shadow: "rgba(245,158,11,0.8)" },
    { label: "Medical", angle: 135, radius: 180, color: "bg-red-500", shadow: "rgba(239,68,68,0.8)" },
    { label: "Calendar", angle: 180, radius: 160, color: "bg-purple-500", shadow: "rgba(168,85,247,0.8)" },
    { label: "Athletes", angle: 225, radius: 220, color: "bg-cyan-500", shadow: "rgba(6,182,212,0.8)" },
    { label: "Coaches", angle: 270, radius: 140, color: "bg-fuchsia-500", shadow: "rgba(217,70,239,0.8)" },
    { label: "Admin", angle: 315, radius: 190, color: "bg-orange-500", shadow: "rgba(249,115,22,0.8)" },
  ];

  return (
    <section className="py-40 bg-black relative overflow-hidden">
      {/* Ambient Radial Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(6,182,212,0.1)_0%,transparent_70%)] pointer-events-none " />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(217,70,239,0.1)_0%,transparent_70%)] pointer-events-none " />

      <div className="text-center relative z-20 mb-20 px-4">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 ">An Interconnected Galaxy</h2>
        <p className="text-xl text-white/70 ">Every module talks to each other. No data silos.</p>
      </div>

      <div className="relative h-[600px] w-full flex items-center justify-center">
        {/* Core */}
        <div className="absolute z-20 flex flex-col items-center justify-center">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary via-purple-600 to-blue-600 flex items-center justify-center  relative border border-white/20">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.4)_0%,transparent_60%)]"></div>
            <span className="text-white font-black tracking-widest z-10 ">CORE</span>
            <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-40"></div>
          </div>
        </div>

        {/* Orbit Rings */}
        <div className="absolute w-[300px] h-[300px] rounded-full border border-white/10 "></div>
        <div className="absolute w-[450px] h-[450px] rounded-full border border-white/5 "></div>

        {/* Orbiting Nodes */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="will-change-transform absolute w-full h-full flex items-center justify-center"
        >
          {nodes.map((node, i) => {
            const rad = (node.angle * Math.PI) / 180;
            const x = Math.cos(rad) * node.radius;
            const y = Math.sin(rad) * node.radius;

            return (
              <div 
                key={i}
                className="absolute flex flex-col items-center gap-2 hover:scale-110 transition-transform cursor-pointer group"
                style={{ transform: `translate(${x}px, ${y}px)` }}
              >
                {/* Counter-rotate the label so it stays upright */}
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                  className="will-change-transform flex flex-col items-center"
                >
                  <div className={`w-4 h-4 rounded-full ${node.color}  group-hover: transition-shadow border border-white/20`}></div>
                  <span className="text-white text-xs font-bold mt-3 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full   group-hover:bg-white/20 transition-colors">
                    {node.label}
                  </span>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
