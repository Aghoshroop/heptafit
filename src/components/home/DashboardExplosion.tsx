"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Smartphone, BarChart3, ActivitySquare, CalendarDays, Brain, MessageSquare, ShieldCheck } from "lucide-react";

export function DashboardExplosion() {
  const cards = [
    { title: "Coach Dashboard", desc: "Command center for the entire academy.", icon: LayoutDashboard, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", delay: 0.1 },
    { title: "Athlete App", desc: "Daily wellness & readiness tracking.", icon: Smartphone, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", delay: 0.2 },
    { title: "Deep Analytics", desc: "Identify trends before injuries happen.", icon: BarChart3, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20", delay: 0.3 },
    { title: "Medical Bay", desc: "Rehab protocols and physio notes.", icon: ActivitySquare, color: "text-rose-400", bg: "bg-rose-400/10", border: "border-rose-400/20", delay: 0.4 },
    { title: "Smart Calendar", desc: "Periodized training macrocycles.", icon: CalendarDays, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20", delay: 0.5 },
    { title: "Heptafit AI", desc: "Automated risk flagging & insights.", icon: Brain, color: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-400/20", delay: 0.6 },
  ];

  return (
    <section className="py-32 bg-black relative border-t border-white/5 overflow-hidden">
      {/* Premium Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none transform-gpu opacity-50" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none transform-gpu" />

      <div className="max-w-6xl mx-auto px-6 relative z-20">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-sm font-semibold tracking-wider uppercase text-white/80">The Complete OS</span>
          </motion.div>
          
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-white">
            Everything You Need. <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-emerald-400">
              Nothing You Don't.
            </span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
            We rebuilt the sports academy software stack from the ground up. Stop paying for 5 separate subscriptions that don't talk to each other.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: card.delay, type: "spring", bounce: 0.4 }}
            >
              <div className="group relative h-full bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:bg-white/[0.06] hover:border-white/20 transition-all duration-500 cursor-pointer overflow-hidden">
                {/* Hover Gradient Effect */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${card.bg} to-transparent transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl ${card.bg} ${card.border} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                    <card.icon size={28} className={card.color} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all">
                    {card.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed font-light">
                    {card.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
