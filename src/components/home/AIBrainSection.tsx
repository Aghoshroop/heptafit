"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/Button";
import dynamic from "next/dynamic";

const Spline = dynamic(() => import("@splinetool/react-spline"), { 
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center text-primary/50 text-sm tracking-widest uppercase">Loading Brain Model...</div>
});

export function AIBrainSection() {
  const [loadSpline, setLoadSpline] = useState(false);

  return (
    <section className="py-32 bg-black relative border-y border-white/10 overflow-hidden">
      {/* Ambient Radial Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(6,182,212,0.15)_0%,transparent_60%)] pointer-events-none " />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(168,85,247,0.15)_0%,transparent_60%)] pointer-events-none " />

      {/* Background Neural Network Simulation */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="net" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M0 100 L100 0" stroke="rgba(168,85,247,0.3)" strokeWidth="1" fill="none"/>
              <path d="M0 0 L100 100" stroke="rgba(168,85,247,0.3)" strokeWidth="1" fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#net)"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white ">
            The <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">Heptafit Brain</span>
          </h2>
          <p className="text-xl text-white/70 mb-8 leading-relaxed ">
            A massive neural engine that correlates recovery, nutrition, sleep, HRV, and stress into a single actionable truth.
          </p>

          {/* AI Insight Simulation */}
          <motion.div 
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="bg-white/5 backdrop- border border-white/10 rounded-3xl p-8  relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4 relative z-10">
              <div className="relative flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-amber-500 absolute animate-ping opacity-75"></div>
                <div className="w-2 h-2 rounded-full bg-amber-500 relative z-10 "></div>
              </div>
              <span className="font-bold uppercase tracking-wider text-sm text-amber-500 ">Live AI Insight Generated</span>
            </div>
            
            <div className="space-y-4 mb-6 text-sm relative z-10">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/50">Athlete:</span> <span className="font-bold text-white">Rahul M.</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/50">Sleep:</span> <span className="text-emerald-400 font-bold ">7.2h (Optimal)</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/50">HRV:</span> <span className="text-emerald-400 font-bold ">82ms (High)</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/50">Stress:</span> <span className="text-emerald-400 font-bold ">Low</span>
              </div>
              <div className="flex justify-between mt-4">
                <span className="text-white/50">Readiness Score:</span> <span className="text-emerald-400 font-black text-2xl ">91</span>
              </div>
            </div>

            <div className="bg-primary/20 border border-primary/30 rounded-xl p-4 relative z-10 ">
              <p className="font-bold text-primary mb-1 ">Recommendation</p>
              <p className="text-sm text-white/90 mb-3">Increase sprint intensity by 5% today. Expected adaptation: <span className="text-emerald-400 font-bold ">HIGH</span></p>
              <Button variant="primary" className="w-full text-xs h-10  hover: transition-shadow border border-white/10">Apply to Session</Button>
            </div>
          </motion.div>
        </div>

        {/* 3D Brain Spline Model */}
        <motion.div 
          onViewportEnter={() => setLoadSpline(true)}
          viewport={{ once: true, margin: "200px" }}
          className="relative w-full h-[500px] lg:h-[700px] translate-x-[30px] flex items-center justify-center pointer-events-none"
        >
          {loadSpline ? (
            <Spline 
              scene="https://prod.spline.design/d-pfYZIDPDAHVFUE/scene.splinecode" 
              className="w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-primary/50 text-sm tracking-widest uppercase">Initializing AI Engine...</div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
