"use client";

import { motion } from "framer-motion";
import { TeamPerformanceChart } from "@/components/coach/TeamPerformanceChart";
import { EmptyState } from "@/components/ui/EmptyState";
import { Activity, Target, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

export default function PerformancePage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Performance Center</h1>
          <p className="text-muted-foreground mt-1">
            Track and analyze team and individual performance metrics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TeamPerformanceChart />
        </div>
        
        <div className="space-y-6">
          <Card glass hoverEffect>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Target size={24} className="text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Goal Tracking</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Set and monitor performance benchmarks for the entire roster.
              </p>
              <EmptyState 
                compact
                icon={<Activity size={20} />}
                title="No Active Goals"
                description="Create team goals to start tracking progress."
                className="bg-white/5 border-none"
              />
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-6">Athlete Leaderboard</h2>
        <EmptyState 
          icon={<Zap size={32} className="text-amber-500" />}
          title="Insufficient Data"
          description="Log more training sessions to generate performance leaderboards."
        />
      </div>
    </div>
  );
}
