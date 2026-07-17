"use client";

import { useState, Suspense, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Building2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";

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

function OnboardingFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlPlan = searchParams.get("plan") || "starter";

  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<OnboardingData>>({ plan: urlPlan });

  // Update plan if URL changes
  useEffect(() => {
    if (urlPlan && urlPlan !== data.plan) {
      setData(prev => ({ ...prev, plan: urlPlan }));
    }
  }, [urlPlan, data.plan]);

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const updateData = (newData: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const handleBack = () => {
    if (step === 1) {
      router.back();
    } else {
      prevStep();
    }
  };

  return (
    <>
        {step < 4 && (
          <button 
            onClick={handleBack}
            className="absolute top-4 left-4 sm:top-0 sm:left-0 flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors z-20"
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
              {step === 1 && <OrgSetup initialData={data} onNext={(orgData) => { updateData(orgData); nextStep(); }} />}
              {step === 2 && <CoachSetup orgData={data} onNext={(coachData) => { updateData(coachData); nextStep(); }} />}
              {step === 3 && <EmailVerification email={data.email || ""} onNext={nextStep} />}
              {step === 4 && <SuccessScreen />}
            </motion.div>
          </AnimatePresence>
        </div>
    </>
  );
}

export default function GetStartedPage() {
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
          <Image src="/logo.png" alt="Heptafit Logo" width={82} height={82} className="w-[82px] h-[82px] object-contain animate-shimmer" />
          <span className="font-bold text-xl tracking-tight text-white">Heptafit</span>
        </Link>
        <div className="text-sm font-medium text-muted-foreground">
          Already have an account? <Link href="/login" className="text-white hover:text-primary transition-colors">Log In</Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center p-4 sm:p-6 w-full max-w-5xl mx-auto">
        <Suspense fallback={<div className="text-primary font-mono text-sm animate-pulse">Loading setup wizard...</div>}>
          <OnboardingFlow />
        </Suspense>
      </main>
    </div>
  );
}
