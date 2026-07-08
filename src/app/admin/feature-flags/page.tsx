"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ToggleLeft, ToggleRight, Sparkles, Brain, Activity, Apple, Video } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Mock Data
const flags = [
  { id: "ai_coach", name: "AI Coach Insights", description: "Enable AI generated insights for athlete wellness.", icon: Brain, enabled: true },
  { id: "medical_module", name: "Medical Module", description: "Enable the injury tracking and rehab module.", icon: Activity, enabled: true },
  { id: "gps_sync", name: "GPS Tracking Sync", description: "Allow integration with external GPS trackers (Beta).", icon: Sparkles, enabled: false },
  { id: "nutrition", name: "Nutrition Planning", description: "Enable meal planning and macro tracking features.", icon: Apple, enabled: true },
  { id: "video_analysis", name: "Video Analysis", description: "Allow coaches to upload and draw on videos.", icon: Video, enabled: false },
];

export default function AdminFeatureFlagsPage() {
  const [featureFlags, setFeatureFlags] = useState(flags);

  const toggleFlag = (id: string) => {
    setFeatureFlags(flags => flags.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Feature Flags</h1>
          <p className="text-muted-foreground mt-1">Enable or disable platform features globally without deploying code.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {featureFlags.map((flag, index) => (
          <motion.div
            key={flag.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`
              bg-card/50 backdrop-blur-md border rounded-2xl p-6 shadow-lg transition-colors
              ${flag.enabled ? 'border-primary/50 shadow-primary/5' : 'border-border shadow-black/5'}
            `}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${flag.enabled ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                <flag.icon size={24} />
              </div>
              <button 
                onClick={() => toggleFlag(flag.id)}
                className={`transition-colors ${flag.enabled ? 'text-primary' : 'text-muted-foreground'}`}
              >
                {flag.enabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
              </button>
            </div>
            
            <h3 className="text-lg font-bold text-foreground mb-2">{flag.name}</h3>
            <p className="text-sm text-muted-foreground min-h-[40px]">{flag.description}</p>
            
            <div className="mt-4 pt-4 border-t border-border/50 flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-mono bg-secondary px-2 py-1 rounded-md">{flag.id}</span>
              <span className={flag.enabled ? 'text-emerald-500 font-medium' : 'text-muted-foreground'}>
                {flag.enabled ? 'Active Globally' : 'Disabled'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
