"use client";

import { motion } from "framer-motion";
import { Activity, Brain, User, LayoutDashboard, Watch, ArrowDown } from "lucide-react";

export function LiveSystemVisualizer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.4 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300 } }
  };

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">A Living, Breathing Platform</h2>
        <p className="text-xl text-muted-foreground mt-4">Data flows seamlessly from the field to the AI engine.</p>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0"
        >
          {/* Animated Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-secondary/50 -translate-y-1/2 -z-10">
            <motion.div 
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-primary via-fuchsia-500 to-blue-500"
            />
          </div>

          {[
            { icon: User, label: "Athlete", desc: "Logs Wellness" },
            { icon: Watch, label: "Wearable", desc: "Syncs Load" },
            { icon: Brain, label: "AI Engine", desc: "Analyzes Risk" },
            { icon: LayoutDashboard, label: "Coach", desc: "Makes Decision" },
          ].map((node, i) => (
            <div key={i} className="flex flex-col items-center">
              <motion.div variants={itemVariants} className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-2xl bg-card border border-border flex items-center justify-center shadow-xl group-hover:border-primary/50 group-hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.4)] transition-all z-10 relative bg-background">
                  <node.icon size={36} className="text-foreground group-hover:text-primary transition-colors" />
                </div>
                {/* Connecting arrow for mobile */}
                {i < 3 && (
                  <div className="md:hidden flex justify-center my-4 text-muted-foreground">
                    <ArrowDown size={24} className="animate-bounce" />
                  </div>
                )}
              </motion.div>
              <motion.div variants={itemVariants} className="text-center mt-6 hidden md:block">
                <h4 className="font-bold text-lg">{node.label}</h4>
                <p className="text-sm text-muted-foreground">{node.desc}</p>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
