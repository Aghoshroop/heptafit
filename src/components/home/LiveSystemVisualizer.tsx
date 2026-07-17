"use client";

import { motion } from "framer-motion";
import { Brain, User, LayoutDashboard, Watch, ArrowDown } from "lucide-react";

export function LiveSystemVisualizer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, stiffness: 200, damping: 20 } }
  };

  const nodes = [
    { icon: User, label: "Athlete", desc: "Logs Wellness", color: "text-blue-400" },
    { icon: Watch, label: "Wearable", desc: "Syncs Load", color: "text-indigo-400" },
    { icon: Brain, label: "AI Engine", desc: "Analyzes Risk", color: "text-fuchsia-400" },
    { icon: LayoutDashboard, label: "Coach", desc: "Makes Decision", color: "text-emerald-400" },
  ];

  return (
    <section className="py-32 bg-black relative overflow-hidden">
      {/* Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[radial-gradient(circle,rgba(168,85,247,0.08)_0%,transparent_50%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 text-center mb-24 relative z-20">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white drop-shadow-lg">
          A Living, Breathing Platform
        </h2>
        <p className="text-lg md:text-xl text-white/60 mt-6 font-medium max-w-2xl mx-auto">
          Data flows seamlessly from the field to the AI engine in real-time, instantly surfacing critical insights.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-20">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="relative grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-4"
        >
          {/* Animated Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-[48px] left-[12.5%] right-[12.5%] h-1 bg-white/5 rounded-full overflow-hidden z-0">
            <motion.div 
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
              className="absolute inset-0 bg-gradient-to-r from-blue-500 via-fuchsia-500 to-emerald-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
            />
            {/* Moving pulse dot indicating data flow */}
            <motion.div
              animate={{ x: ["-100%", "400%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1 }}
              className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-white to-transparent opacity-80"
            />
          </div>

          {nodes.map((node, i) => (
            <div key={i} className="flex flex-col items-center relative z-10">
              <motion.div 
                variants={itemVariants} 
                className="relative group cursor-pointer"
              >
                {/* Replaced heavy blur-xl with optimized shadow on parent */}
                <motion.div 
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                  className="will-change-transform w-24 h-24 rounded-3xl bg-black/60 border border-white/10 backdrop-blur-sm flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.5)] group-hover:border-primary/40 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all z-10 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <node.icon strokeWidth={1.5} size={36} className={`${node.color} group-hover:scale-110 transition-transform duration-300 relative z-20 drop-shadow-md`} />
                </motion.div>
                {/* Connecting arrow for mobile */}
                {i < 3 && (
                  <div className="md:hidden flex justify-center my-6 text-white/20">
                    <ArrowDown size={24} className="animate-bounce" />
                  </div>
                )}
              </motion.div>
              <motion.div variants={itemVariants} className="text-center mt-8 hidden md:block">
                <h4 className="font-bold text-lg text-white mb-1 drop-shadow-sm">{node.label}</h4>
                <p className="text-xs text-white/50 font-bold uppercase tracking-[0.15em]">{node.desc}</p>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
