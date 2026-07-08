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
    <section className="py-40 bg-secondary/10 relative border-t border-border/50 overflow-hidden">
      <div className="text-center relative z-20 mb-24 px-4">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Everything You Need. <br/>Nothing You Don't.</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We rebuilt the sports academy software stack from the ground up, eliminating the need for 5 separate subscriptions.
        </p>
      </div>

      <div className="relative h-[600px] max-w-5xl mx-auto flex items-center justify-center">
        {/* Core Center Pulse */}
        <div className="absolute w-32 h-32 rounded-full bg-primary/20 blur-xl animate-pulse"></div>
        <div className="absolute z-10 font-bold text-2xl tracking-widest text-primary drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">
          HEPTAFIT OS
        </div>

        {/* Floating Modules */}
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8, x: 0, y: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: card.delay, type: "spring", stiffness: 40 }}
            className={`absolute z-20 ${card.position}`}
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: card.delay }}
              className="bg-card/80 backdrop-blur-md border border-border/60 p-4 pr-8 rounded-2xl shadow-xl flex items-center gap-4 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-colors cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                <card.icon size={20} className="text-primary group-hover:text-white transition-colors" />
              </div>
              <span className="font-bold text-sm whitespace-nowrap">{card.title}</span>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
