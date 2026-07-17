"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Import new modular cinematic components
import { HeroCinematic } from "@/components/home/HeroCinematic";
import dynamic from "next/dynamic";
const LiveSystemVisualizer = dynamic(() => import("@/components/home/LiveSystemVisualizer").then(mod => mod.LiveSystemVisualizer), { ssr: false });
import { AIBrainSection } from "@/components/home/AIBrainSection";
import { DayInTheLife } from "@/components/home/DayInTheLife";
import { DashboardExplosion } from "@/components/home/DashboardExplosion";
import { FeatureGalaxy } from "@/components/home/FeatureGalaxy";
import { InteractiveMap } from "@/components/home/InteractiveMap";
import { ArchitectureIntegrations } from "@/components/home/ArchitectureIntegrations";
import { CinematicEnding } from "@/components/home/CinematicEnding";
import { PremiumFooter } from "@/components/home/PremiumFooter";
import { SmartNavbar } from "@/components/layout/SmartNavbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-black font-sans text-foreground selection:bg-primary/30 relative overflow-x-hidden">
      
      {/* Navigation - Smart Scroll/Reveal */}
      <SmartNavbar />

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
