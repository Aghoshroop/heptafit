"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { LayoutDashboard, Smartphone, Brain, BarChart3, ActivitySquare, HeartPulse, MessageSquare, CalendarDays } from "lucide-react";
import Image from "next/image";

const features = [
  { icon: LayoutDashboard, title: "Coach Dashboard", desc: "Manage your entire academy from a single pane of glass." },
  { icon: Smartphone, title: "Athlete App", desc: "Seamless mobile experience for your high-performance athletes." },
  { icon: Brain, title: "AI Coach", desc: "Predict injury risks and automate your daily training load." },
  { icon: BarChart3, title: "Analytics", desc: "Deep dive into performance metrics and ACWR trends." },
  { icon: ActivitySquare, title: "Medical Bay", desc: "Track rehabilitations, clearances, and medical history." },
  { icon: HeartPulse, title: "Wellness Matrix", desc: "Monitor daily readiness, sleep quality, and stress levels." },
  { icon: MessageSquare, title: "Messages", desc: "Secure communication between coaches, athletes, and staff." },
  { icon: CalendarDays, title: "Calendar", desc: "Master scheduling for sessions, matches, and recovery days." },
];

export function CinematicShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex flex-col justify-between p-12">
      {/* Ambient Lighting & Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-primary/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-fuchsia-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      {/* Top Branding */}
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Heptafit Logo" width={90} height={90} className="w-[90px] h-[90px] object-contain drop-shadow-[0_0_20px_rgba(168,85,247,0.5)] animate-shimmer" />
          <span className="font-bold text-2xl tracking-tight text-white">Heptafit</span>
        </div>
      </div>

      {/* Animated Feature Showcase */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="w-full max-w-md relative h-64">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
            >
              <div className="mb-8 relative group">
                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl group-hover:bg-primary/40 transition-colors duration-500"></div>
                <div className="w-24 h-24 bg-card/40 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl relative z-10">
                  {(() => {
                    const Icon = features[currentIndex].icon;
                    return <Icon size={48} className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />;
                  })()}
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">
                {features[currentIndex].title}
              </h3>
              <p className="text-lg text-white/60 leading-relaxed">
                {features[currentIndex].desc}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Progress Indicators */}
          <div className="absolute bottom-0 left-0 w-full flex justify-center gap-2">
            {features.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === currentIndex ? "w-8 bg-primary shadow-[0_0_10px_rgba(168,85,247,0.8)]" : "w-2 bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Legal/Social Proof */}
      <div className="relative z-10 flex justify-between items-center text-xs text-white/40 font-medium">
        <p>© {new Date().getFullYear()} Heptafit Technologies.</p>
        <p className="tracking-widest uppercase">The Operating System for Elite Sport</p>
      </div>
    </div>
  );
}
