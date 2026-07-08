"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { PlayCircle } from "lucide-react";

export function CinematicEnding() {
  return (
    <section className="min-h-[80vh] bg-black relative flex items-center justify-center overflow-hidden border-t border-border/10">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/20 blur-[200px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="space-y-4 md:space-y-6 mb-16"
        >
          <h2 className="text-4xl md:text-7xl font-black text-white/50 tracking-tight">One Platform.</h2>
          <h2 className="text-4xl md:text-7xl font-black text-white/70 tracking-tight">Every Athlete.</h2>
          <h2 className="text-4xl md:text-7xl font-black text-white/90 tracking-tight">Every Coach.</h2>
          <h2 className="text-4xl md:text-7xl font-black text-white tracking-tight">Every Session.</h2>
          <h2 className="text-4xl md:text-7xl font-black text-white tracking-tight">Every Decision.</h2>
          <div className="pt-8">
            <h2 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-fuchsia-400 tracking-widest uppercase">
              Powered by Heptafit.
            </h2>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <Button variant="primary" className="h-16 px-10 text-lg font-bold shadow-[0_0_40px_rgba(168,85,247,0.5)] hover:shadow-[0_0_60px_rgba(168,85,247,0.8)] transition-all">
            Start Free Trial
          </Button>
          <Button variant="outline" className="h-16 px-10 text-lg font-bold border-white/20 text-white hover:bg-white/10 gap-2">
            <PlayCircle size={24} /> Book Demo
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
