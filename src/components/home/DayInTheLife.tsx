"use client";

import { motion } from "framer-motion";
import { Sunrise, Smartphone, BrainCircuit, Dumbbell, Moon, CheckCircle2 } from "lucide-react";

export function DayInTheLife() {
  const events = [
    { time: "6:00 AM", title: "Athlete Wakes Up", desc: "David completes his 30-second daily wellness check via the Heptafit mobile app. Sleep, soreness, and stress are logged.", icon: Sunrise, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20" },
    { time: "7:00 AM", title: "AI Calculates Readiness", desc: "The Heptafit Engine cross-references David's wellness data against his 4-week ACWR. His Readiness Score drops to 52 (High Risk).", icon: BrainCircuit, color: "text-primary", bg: "bg-primary/10 border-primary/20" },
    { time: "8:00 AM", title: "Coach Adjusts Plan", desc: "Coach Sarah sees the automated 'Elevated Risk' warning on her dashboard and reduces David's sprint volume by 15% for the afternoon session.", icon: Smartphone, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { time: "4:00 PM", title: "Safe Session Completed", desc: "David completes the modified session. He avoids a soft-tissue injury that historically would have occurred due to fatigue spiking.", icon: Dumbbell, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" },
    { time: "9:00 PM", title: "AI Plans Tomorrow", desc: "Based on today's safe load, the AI automatically suggests an optimal training block for tomorrow's macrocycle.", icon: Moon, color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20" },
  ];

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">A Day in the Life</h2>
          <p className="text-xl text-muted-foreground">How the Heptafit OS protects athletes from morning to night.</p>
        </div>

        <div className="relative border-l-2 border-border/50 ml-6 md:ml-0 md:border-l-0">
          {/* Central Line for Desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-border/50 -translate-x-1/2"></div>
          
          <div className="space-y-16">
            {events.map((event, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`relative flex flex-col md:flex-row items-center justify-between group ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-[-2.5rem] md:left-1/2 w-8 h-8 rounded-full bg-background border-4 border-primary -translate-x-1/2 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(168,85,247,0.5)] group-hover:scale-125 transition-transform duration-300">
                  <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
                </div>

                <div className={`w-full md:w-[45%] pl-8 md:pl-0 ${i % 2 === 0 ? "md:text-left" : "md:text-right"}`}>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4 border ${event.bg} ${event.color}`}>
                    <event.icon size={14} /> {event.time}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{event.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{event.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-emerald-500 font-bold text-lg mb-2">
            <CheckCircle2 /> Result: Injury Prevented
          </div>
          <p className="text-emerald-500/80">Proactive decisions beat reactive rehabilitation every time.</p>
        </motion.div>
      </div>
    </section>
  );
}
