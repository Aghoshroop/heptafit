"use client";

import { Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EmailVerificationProps {
  email: string;
  onNext: () => void;
}

export function EmailVerification({ email, onNext }: EmailVerificationProps) {
  return (
    <div className="w-full max-w-xl mx-auto text-center">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8 border border-primary/20 shadow-[0_0_40px_rgba(168,85,247,0.3)]">
        <Mail size={40} className="text-primary" />
      </div>
      
      <h2 className="text-3xl font-bold mb-4">Verify Your Email</h2>
      
      <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
        We've sent a verification link to <span className="text-white font-semibold">{email}</span>. Please check your inbox and click the link to activate your organization.
      </p>

      <div className="space-y-4 max-w-sm mx-auto">
        <Button 
          variant="primary" 
          className="w-full h-14 font-bold shadow-[0_0_20px_-5px_rgba(168,85,247,0.4)]"
          onClick={onNext}
        >
          I've Verified My Email
        </Button>
        <Button 
          variant="outline" 
          className="w-full h-12"
          onClick={() => {
            // In a real app, trigger sendEmailVerification(auth.currentUser) again
            alert("Verification email resent!");
          }}
        >
          Resend Email
        </Button>
      </div>
    </div>
  );
}
