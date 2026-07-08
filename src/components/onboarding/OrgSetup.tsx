"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { OnboardingData } from "@/app/get-started/page";

const orgSchema = z.object({
  orgName: z.string().min(2, { message: "Organization name is required." }),
  sport: z.string().min(2, { message: "Primary sport is required." }),
  country: z.string().min(2, { message: "Country is required." }),
  state: z.string().optional(),
  city: z.string().min(2, { message: "City is required." }),
});

type OrgFormValues = z.infer<typeof orgSchema>;

interface OrgSetupProps {
  initialData: Partial<OnboardingData>;
  onNext: (data: Partial<OnboardingData>) => void;
}

export function OrgSetup({ initialData, onNext }: OrgSetupProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<OrgFormValues>({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      orgName: initialData.orgName || "",
      sport: initialData.sport || "",
      country: initialData.country || "",
      state: initialData.state || "",
      city: initialData.city || "",
    },
    mode: "onChange",
  });

  const onSubmit = (data: OrgFormValues) => {
    onNext(data);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
          <Building2 size={32} className="text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-3">Setup Organization</h2>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          Tell us about your academy or team. You will be set as the initial Head Coach.
        </p>
      </div>

      <div className="bg-card/60 backdrop-blur-xl border border-border/50 p-6 sm:p-8 rounded-3xl shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Academy / Organization Name</label>
            <Input
              placeholder="e.g. Elite Performance Academy"
              {...register("orgName")}
              className={`h-12 bg-background/50 backdrop-blur-sm border-border/60 focus:border-primary ${errors.orgName ? "border-destructive" : ""}`}
            />
            {errors.orgName && <p className="text-xs text-destructive mt-1">{errors.orgName.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Primary Sport</label>
            <Input
              placeholder="e.g. Track and Field, Soccer, Multi-sport"
              {...register("sport")}
              className={`h-12 bg-background/50 backdrop-blur-sm border-border/60 focus:border-primary ${errors.sport ? "border-destructive" : ""}`}
            />
            {errors.sport && <p className="text-xs text-destructive mt-1">{errors.sport.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Country</label>
              <Input
                placeholder="e.g. USA"
                {...register("country")}
                className={`h-12 bg-background/50 backdrop-blur-sm border-border/60 focus:border-primary ${errors.country ? "border-destructive" : ""}`}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">State/Region</label>
              <Input
                placeholder="Optional"
                {...register("state")}
                className="h-12 bg-background/50 backdrop-blur-sm border-border/60 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">City</label>
              <Input
                placeholder="e.g. Austin"
                {...register("city")}
                className={`h-12 bg-background/50 backdrop-blur-sm border-border/60 focus:border-primary ${errors.city ? "border-destructive" : ""}`}
              />
            </div>
          </div>
          
          <div className="pt-4">
            <Button 
              type="submit" 
              variant="primary" 
              className={`w-full h-14 text-base font-bold transition-all ${isValid ? 'shadow-[0_0_20px_-5px_rgba(168,85,247,0.4)]' : 'opacity-80'}`}
              disabled={!isValid}
            >
              Continue <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
