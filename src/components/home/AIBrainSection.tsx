"use client";

import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Spline from "@splinetool/react-spline";

export function AIBrainSection() {
  return (
    <section className="py-32 bg-secondary/10 relative border-y border-border/50 overflow-hidden">
      {/* Background Neural Network Simulation */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="net" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M0 100 L100 0" stroke="rgba(168,85,247,0.2)" strokeWidth="1" fill="none"/>
              <path d="M0 0 L100 100" stroke="rgba(168,85,247,0.2)" strokeWidth="1" fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#net)"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">The Heptafit Brain</h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            A massive neural engine that correlates recovery, nutrition, sleep, HRV, and stress into a single actionable truth.
          </p>

          {/* AI Insight Simulation */}
          <div className="bg-background/80 backdrop-blur-md border border-border/60 rounded-3xl p-8 shadow-[0_0_50px_-15px_rgba(245,158,11,0.2)]">
            <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-4">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
              <span className="font-bold uppercase tracking-wider text-sm text-amber-500">Live AI Insight Generated</span>
            </div>
            
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between border-b border-border/30 pb-2">
                <span className="text-muted-foreground">Athlete:</span> <span className="font-bold">Rahul M.</span>
              </div>
              <div className="flex justify-between border-b border-border/30 pb-2">
                <span className="text-muted-foreground">Sleep:</span> <span className="text-emerald-500 font-bold">7.2h (Optimal)</span>
              </div>
              <div className="flex justify-between border-b border-border/30 pb-2">
                <span className="text-muted-foreground">HRV:</span> <span className="text-emerald-500 font-bold">82ms (High)</span>
              </div>
              <div className="flex justify-between border-b border-border/30 pb-2">
                <span className="text-muted-foreground">Stress:</span> <span className="text-emerald-500 font-bold">Low</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Readiness Score:</span> <span className="text-emerald-500 font-bold text-lg">91</span>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
              <p className="font-bold text-primary mb-1">Recommendation</p>
              <p className="text-sm text-foreground mb-3">Increase sprint intensity by 5% today. Expected adaptation: <span className="text-emerald-500 font-bold">HIGH</span></p>
              <Button variant="primary" className="w-full text-xs h-10 shadow-[0_0_20px_-5px_rgba(168,85,247,0.5)]">Apply to Session</Button>
            </div>
          </div>
        </div>

        {/* 3D Brain Spline Model */}
        <div className="relative w-full h-[500px] lg:h-[700px] translate-x-[30px] flex items-center justify-center">
          <Spline 
            scene="https://prod.spline.design/d-pfYZIDPDAHVFUE/scene.splinecode" 
            className="w-full h-full"
          />
        </div>
      </div>
    </section>
  );
}
