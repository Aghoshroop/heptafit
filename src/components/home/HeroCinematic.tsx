"use client";

import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { HeroSpline } from "@/components/3d/HeroSpline";

export function HeroCinematic() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
      
      {/* Background Layer: Full Screen Spline Scene (z-0) */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto">
        <HeroSpline />
      </div>

      {/* Foreground Content Layer (z-20) */}
      <div className="relative z-20 w-full max-w-[1800px] mx-auto px-6 md:px-10 lg:px-[50px] pointer-events-none mt-16 md:mt-0">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-start text-left max-w-[500px] pointer-events-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-[0.2em] uppercase text-primary mb-6 shadow-[0_0_15px_rgba(168,85,247,0.3)] backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Heptafit OS 2.0
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-[80px] font-black tracking-tighter mb-6 text-white drop-shadow-2xl leading-[1.05]">
            The Operating <br />System <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-blue-400 drop-shadow-lg">
              for Elite Sport
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed font-medium drop-shadow-md pr-4">
            Train athletes. Monitor readiness. Prevent injuries. Manage your academy—all in one AI-powered platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 w-full sm:w-auto">
            <Link href="/get-started" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full h-14 px-8 text-base font-bold shadow-[0_0_30px_-5px_rgba(168,85,247,0.6)] hover:shadow-[0_0_40px_-5px_rgba(168,85,247,0.8)] hover:scale-105 transition-all">
                Start Free Trial <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Button variant="outline" className="w-full sm:w-auto h-14 px-8 text-base border-white/20 hover:bg-white/10 font-bold group bg-black/20 backdrop-blur-sm">
              <PlayCircle size={18} className="mr-2 text-white/70 group-hover:text-white transition-colors" /> Watch Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center gap-4 opacity-80">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/90">
              <ShieldCheck size={16} className="text-primary" /> SOC2 Compliant
            </div>
            <div className="w-1 h-1 rounded-full bg-white/30" />
            <div className="text-xs font-semibold uppercase tracking-widest text-white/90">
              500+ Academies
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Bottom fade into the next section (z-20) */}
      <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none" />
    </section>
  );
}
