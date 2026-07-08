"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Import new modular cinematic components
import { HeroCinematic } from "@/components/home/HeroCinematic";
import { LiveSystemVisualizer } from "@/components/home/LiveSystemVisualizer";
import { AIBrainSection } from "@/components/home/AIBrainSection";
import { DayInTheLife } from "@/components/home/DayInTheLife";
import { DashboardExplosion } from "@/components/home/DashboardExplosion";
import { FeatureGalaxy } from "@/components/home/FeatureGalaxy";
import { InteractiveMap } from "@/components/home/InteractiveMap";
import { ArchitectureIntegrations } from "@/components/home/ArchitectureIntegrations";
import { CinematicEnding } from "@/components/home/CinematicEnding";
import { PremiumFooter } from "@/components/home/PremiumFooter";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black font-sans text-foreground selection:bg-primary/30 relative overflow-x-hidden">
      
      {/* Navigation - Dark/Cinematic style */}
      <header className="absolute top-0 w-full z-50 bg-transparent border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)]">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Heptafit</span>
          </div>
          
          <nav className="hidden md:flex gap-8 text-sm font-medium text-white/70">
            <a href="#platform" className="hover:text-white transition-colors">Features</a>
            <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#resources" className="hover:text-white transition-colors">Resources</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block">
              <Button variant="outline" className="text-xs border-transparent hover:bg-white/10 text-white font-semibold">
                Login
              </Button>
            </Link>
            <Link href="/get-started">
              <Button variant="primary" className="text-xs gap-2 shadow-[0_0_20px_-5px_rgba(168,85,247,0.8)]">
                Start Free <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="bg-background">
        {/* Stage 1 Components */}
        <HeroCinematic />
        <LiveSystemVisualizer />
        
        {/* Stage 2 Components */}
        <DayInTheLife />
        
        {/* Stage 1 & 2 Interweaved */}
        <AIBrainSection />
        <DashboardExplosion />
        <FeatureGalaxy />
        
        {/* Stage 3 Components */}
        <InteractiveMap />
        <ArchitectureIntegrations />
        <CinematicEnding />
      </main>

      <PremiumFooter />
    </div>
  );
}
