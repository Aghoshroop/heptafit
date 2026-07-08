"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, Zap, Target, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PlanSelectionProps {
  onNext: (plan: string) => void;
}

export function PlanSelection({ onNext }: PlanSelectionProps) {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
          Build Your High Performance Organization
        </h1>
        <p className="text-lg text-white/60 max-w-2xl mx-auto">
          Start free with one Head Coach and one Athlete. Upgrade anytime as your team grows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        
        {/* Free Plan */}
        <div className="bg-card/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl flex flex-col relative group hover:bg-card/60 transition-colors">
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity">
            <Target size={24} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-bold text-white">$0</span>
            <span className="text-white/50 text-sm">/forever</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start gap-3 text-sm text-white/80">
              <Check size={18} className="text-primary mt-0.5" />
              1 Head Coach Account
            </li>
            <li className="flex items-start gap-3 text-sm text-white/80">
              <Check size={18} className="text-primary mt-0.5" />
              1 Athlete Account
            </li>
            <li className="flex items-start gap-3 text-sm text-white/80">
              <Check size={18} className="text-primary mt-0.5" />
              Core Platform Features
            </li>
            <li className="flex items-start gap-3 text-sm text-white/80">
              <Check size={18} className="text-primary mt-0.5" />
              Community Support
            </li>
          </ul>
          <Button 
            variant="outline" 
            className="w-full h-12 border-white/20 hover:bg-white hover:text-black font-bold transition-all"
            onClick={() => onNext("free")}
          >
            Start Free <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>

        {/* Professional Plan (Highlighted) */}
        <div className="bg-gradient-to-b from-primary/20 to-card/40 backdrop-blur-xl border border-primary/50 p-8 rounded-3xl flex flex-col relative transform md:-translate-y-4 shadow-[0_0_40px_rgba(168,85,247,0.15)]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg flex items-center gap-1">
            <Zap size={12} /> MOST POPULAR
          </div>
          <h3 className="text-2xl font-bold text-white mb-2 mt-2">Professional</h3>
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-bold text-white">$99</span>
            <span className="text-white/50 text-sm">/month</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start gap-3 text-sm text-white/80">
              <Check size={18} className="text-white mt-0.5" />
              Up to 10 Coaches
            </li>
            <li className="flex items-start gap-3 text-sm text-white/80">
              <Check size={18} className="text-white mt-0.5" />
              Up to 100 Athletes
            </li>
            <li className="flex items-start gap-3 text-sm text-white/80">
              <Check size={18} className="text-white mt-0.5" />
              Advanced AI Analytics
            </li>
            <li className="flex items-start gap-3 text-sm text-white/80">
              <Check size={18} className="text-white mt-0.5" />
              Priority Email Support
            </li>
          </ul>
          <Button 
            variant="primary" 
            className="w-full h-12 font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]"
            onClick={() => onNext("professional")}
          >
            Choose Professional
          </Button>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-card/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl flex flex-col relative group hover:bg-card/60 transition-colors">
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity">
            <Star size={24} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-bold text-white">Custom</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start gap-3 text-sm text-white/80">
              <Check size={18} className="text-primary mt-0.5" />
              Unlimited Coaches
            </li>
            <li className="flex items-start gap-3 text-sm text-white/80">
              <Check size={18} className="text-primary mt-0.5" />
              Unlimited Athletes
            </li>
            <li className="flex items-start gap-3 text-sm text-white/80">
              <Check size={18} className="text-primary mt-0.5" />
              Custom API Integrations
            </li>
            <li className="flex items-start gap-3 text-sm text-white/80">
              <Check size={18} className="text-primary mt-0.5" />
              Dedicated Success Manager
            </li>
          </ul>
          <Button 
            variant="outline" 
            className="w-full h-12 border-white/20 hover:bg-white/10 font-bold transition-all"
            onClick={() => window.location.href = "mailto:sales@heptafit.com"}
          >
            Contact Sales
          </Button>
        </div>
      </div>
    </div>
  );
}
