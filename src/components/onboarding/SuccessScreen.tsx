"use client";

import { CheckCircle2, ArrowRight, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export function SuccessScreen() {
  const router = useRouter();

  return (
    <div className="w-full max-w-xl mx-auto text-center">
      <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
        <CheckCircle2 size={48} className="text-emerald-500" />
      </div>
      
      <h1 className="text-4xl font-bold mb-4">Welcome to Heptafit</h1>
      
      <p className="text-lg text-muted-foreground mb-12 max-w-md mx-auto leading-relaxed">
        Your organization is now live. Let's start building your high-performance environment.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
        <Button 
          variant="primary" 
          className="h-16 font-bold flex flex-col items-center justify-center gap-1 shadow-[0_0_20px_-5px_rgba(168,85,247,0.4)]"
          onClick={() => router.push("/coach")}
        >
          <span className="flex items-center gap-2">Go to Dashboard <ArrowRight size={16} /></span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-16 font-bold flex flex-col items-center justify-center gap-1 border-white/20 hover:bg-white/5"
          onClick={() => router.push("/coach/invite")}
        >
          <span className="flex items-center gap-2"><UserPlus size={16} /> Invite Athlete</span>
        </Button>
      </div>
    </div>
  );
}
