"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Smartphone, BarChart3, ActivitySquare, CalendarDays, Brain, MessageSquare, ShieldCheck } from "lucide-react";

export function DashboardExplosion() {
  const cards = [
    { title: "Coach Dashboard", icon: LayoutDashboard, position: "md:-translate-x-40 md:-translate-y-20", delay: 0.1 },
    { title: "Athlete App", icon: Smartphone, position: "md:translate-x-40 md:-translate-y-16", delay: 0.2 },
    { title: "Analytics", icon: BarChart3, position: "md:-translate-x-60 md:translate-y-10", delay: 0.3 },
    { title: "Medical Bay", icon: ActivitySquare, position: "md:translate-x-60 md:translate-y-16", delay: 0.4 },
    { title: "Calendar", icon: CalendarDays, position: "md:-translate-x-20 md:translate-y-32", delay: 0.5 },
    { title: "AI Coach", icon: Brain, position: "md:translate-x-20 md:translate-y-40", delay: 0.6 },
  ];

  return (
    <section className="py-40 bg-black relative border-t border-white/10 overflow-hidden">
      {/* Background Ambient Starfield / Grid could go here, but a massive glow works best */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[radial-gradient(circle,rgba(168,85,247,0.15)_0%,transparent_50%)] pointer-events-none " />

      <div className="text-center relative z-20 mb-24 px-4">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white ">
          Everything You Need. <br/><span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">Nothing You Don't.</span>
        </h2>
        <p className="text-xl text-white/70 max-w-2xl mx-auto ">
          We rebuilt the sports academy software stack from the ground up, eliminating the need for 5 separate subscriptions.
        </p>
      </div>

      <div className="relative h-[600px] max-w-5xl mx-auto flex items-center justify-center">
        {/* Core Center Pulse */}
        <div className="absolute w-[300px] h-[300px] rounded-full bg-primary/20  animate-pulse pointer-events-none"></div>
        <div className="absolute w-[150px] h-[150px] rounded-full bg-blue-500/20  pointer-events-none"></div>
        
        <div className="absolute z-10 font-black text-3xl tracking-[0.3em] text-white  flex items-center justify-center">
          <span className="relative z-10">HEPTAFIT OS</span>
          <div className="absolute inset-0 bg-primary/30  animate-ping rounded-full -z-10"></div>
        </div>

        {/* Floating Modules */}
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8, x: 0, y: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: card.delay, type: "spring", stiffness: 40 }}
            className={`absolute z-20 ${card.position}`}
          >
            <motion.div 
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: card.delay }}
              className="will-change-transform bg-white/5 backdrop- border border-white/10 p-4 pr-8 rounded-2xl  flex items-center gap-4 hover:border-primary/50 hover: hover:bg-white/10 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center group-hover:bg-primary transition-colors shadow-inner">
                <card.icon size={24} className="text-white " />
              </div>
              <span className="font-bold text-sm whitespace-nowrap text-white ">{card.title}</span>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
