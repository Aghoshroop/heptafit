"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UserCircle, Loader2, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { OnboardingData } from "@/app/get-started/page";

import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, collection, serverTimestamp } from "firebase/firestore";

const coachSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type CoachFormValues = z.infer<typeof coachSchema>;

interface CoachSetupProps {
  orgData: Partial<OnboardingData>;
  onNext: (data: Partial<OnboardingData>) => void;
}

export function CoachSetup({ orgData, onNext }: CoachSetupProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CoachFormValues>({
    resolver: zodResolver(coachSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: CoachFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Create User in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // 2. Generate Organization ID first
      const orgRef = doc(collection(db, "organizations"));
      const orgId = orgRef.id;

      // 3. Create User Document FIRST so that firestore.rules (isHeadCoach) passes
      await setDoc(doc(db, "users", user.uid), {
        email: data.email,
        role: "coach", // legacy
        accountType: "head_coach",
        organizationId: orgId, // Always keep organizationId in the root user doc
        createdAt: serverTimestamp(),
      });

      // 4. Create Organization Document (now that user is a head_coach)
      await setDoc(orgRef, {
        name: orgData.orgName,
        sport: orgData.sport,
        location: {
          country: orgData.country,
          state: orgData.state,
          city: orgData.city,
        },
        plan: orgData.plan || "free",
        createdAt: serverTimestamp(),
        ownerId: user.uid
      });

      // 4. Create Coach Profile
      await setDoc(doc(db, "coaches", user.uid), {
        coachId: `C-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        organizationId: orgId,
        isOwner: true,
        joinedAt: serverTimestamp(),
      });

      // 5. Send Verification Email
      await sendEmailVerification(user);

      // 6. Proceed to Next Step
      onNext({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email
      });

    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError("An account with this email already exists. Please log in.");
      } else {
        console.error("Coach setup error:", err);
        setError("Failed to create account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="text-center mb-10">
        <div className="w-[114px] h-[114px] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Image src="/logo.png" alt="Heptafit Logo" width={114} height={114} className="w-[114px] h-[114px] object-contain drop-shadow-[0_0_20px_rgba(168,85,247,0.5)] animate-shimmer" />
        </div>
        <h2 className="text-3xl font-bold mb-3">Head Coach Profile</h2>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          Create your administrative account to manage {orgData.orgName}.
        </p>
      </div>

      <div className="bg-card/60 backdrop-blur-xl border border-border/50 p-6 sm:p-8 rounded-3xl shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold">First Name</label>
              <Input
                {...register("firstName")}
                className={`h-12 bg-background/50 backdrop-blur-sm border-border/60 focus:border-primary ${errors.firstName ? "border-destructive" : ""}`}
              />
              {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Last Name</label>
              <Input
                {...register("lastName")}
                className={`h-12 bg-background/50 backdrop-blur-sm border-border/60 focus:border-primary ${errors.lastName ? "border-destructive" : ""}`}
              />
              {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Work Email</label>
            <Input
              type="email"
              {...register("email")}
              className={`h-12 bg-background/50 backdrop-blur-sm border-border/60 focus:border-primary ${errors.email ? "border-destructive" : ""}`}
            />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Password</label>
              <Input
                type="password"
                {...register("password")}
                className={`h-12 bg-background/50 backdrop-blur-sm border-border/60 focus:border-primary ${errors.password ? "border-destructive" : ""}`}
              />
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Confirm Password</label>
              <Input
                type="password"
                {...register("confirmPassword")}
                className={`h-12 bg-background/50 backdrop-blur-sm border-border/60 focus:border-primary ${errors.confirmPassword ? "border-destructive" : ""}`}
              />
              {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg">
              {error}
            </div>
          )}
          
          <div className="pt-4">
            <Button 
              type="submit" 
              variant="primary" 
              className={`w-full h-14 text-base font-bold transition-all ${isValid && !isLoading ? 'shadow-[0_0_20px_-5px_rgba(168,85,247,0.4)]' : 'opacity-80'}`}
              disabled={!isValid || isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                <>Create Account <ArrowRight size={18} className="ml-2" /></>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
