"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Building2 } from "lucide-react";
import Link from "next/link";

import { PlanSelection } from "@/components/onboarding/PlanSelection";
import { OrgSetup } from "@/components/onboarding/OrgSetup";
import { CoachSetup } from "@/components/onboarding/CoachSetup";
import { EmailVerification } from "@/components/onboarding/EmailVerification";
import { SuccessScreen } from "@/components/onboarding/SuccessScreen";

export type OnboardingData = {
  plan: string;
  orgName: string;
  sport: string;
  country: string;
  state: string;
  city: string;
  firstName: string;
  lastName: string;
  email: string;
};

export default function GetStartedPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<OnboardingData>>({});

  const nextStep = () => setStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const updateData = (newData: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <div className="min-h-screen bg-black font-sans text-foreground relative overflow-hidden flex flex-col">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-fuchsia-600/10 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full p-6 sm:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            <span className="text-white font-bold text-sm">H</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-white">Heptafit</span>
        </Link>
        <div className="text-sm font-medium text-muted-foreground">
          Already have an account? <Link href="/login" className="text-white hover:text-primary transition-colors">Log In</Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center p-4 sm:p-6 w-full max-w-5xl mx-auto">
        
        {step > 1 && step < 4 && (
          <button 
            onClick={prevStep}
            className="absolute top-4 left-4 sm:top-0 sm:left-0 flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
        )}

        <div className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full"
            >
              {step === 1 && <PlanSelection onNext={(plan) => { updateData({ plan }); nextStep(); }} />}
              {step === 2 && <OrgSetup initialData={data} onNext={(orgData) => { updateData(orgData); nextStep(); }} />}
              {step === 3 && <CoachSetup orgData={data} onNext={(coachData) => { updateData(coachData); nextStep(); }} />}
              {step === 4 && <EmailVerification email={data.email || ""} onNext={nextStep} />}
              {step === 5 && <SuccessScreen />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
