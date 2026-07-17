"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SmartNavbar } from "@/components/layout/SmartNavbar";
import { PremiumFooter } from "@/components/home/PremiumFooter";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Shield, Sparkles, Check, CreditCard, Lock, ArrowRight, Loader2 } from "lucide-react";

const planDetails = {
  platinum: {
    name: "Platinum",
    price: "$49",
    interval: "/month",
    description: "Ideal for independent coaches starting their roster.",
    icon: Shield,
    color: "text-cyan-400",
    bgIcon: "bg-cyan-500/10",
    gradient: "from-cyan-400 to-blue-600",
    glowLine: "via-cyan-400",
    shadow: "shadow-[0_0_40px_rgba(34,211,238,0.3)]",
    features: ["1 Coach Account", "Up to 5 Athletes", "Wearable Integrations", "Advanced Analytics"]
  },
  diamond: {
    name: "Diamond",
    price: "$129",
    interval: "/month",
    description: "The sweet spot for growing teams and serious coaches.",
    icon: Sparkles,
    color: "text-fuchsia-400",
    bgIcon: "bg-fuchsia-500/10",
    gradient: "from-fuchsia-400 to-purple-600",
    glowLine: "via-fuchsia-400",
    shadow: "shadow-[0_0_40px_rgba(192,38,211,0.3)]",
    features: ["1 Coach Account", "Up to 15 Athletes", "Full AI Risk Analysis", "Advanced Wearable Sync", "Priority 24/7 Support"]
  }
};

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planKey = searchParams.get("plan") as keyof typeof planDetails | null;
  const plan = planKey && planDetails[planKey] ? planDetails[planKey] : planDetails.platinum;

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    card: "",
    expiry: "",
    cvc: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        router.push("/");
      }, 3000);
    }, 2000);
  };

  const Icon = plan.icon;

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black font-sans text-foreground flex items-center justify-center relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-tr ${plan.gradient} opacity-5 blur-[100px] pointer-events-none`} />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center max-w-md mx-auto p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className={`w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]`}
          >
            <Check className="text-emerald-400" size={40} />
          </motion.div>
          <h2 className="text-3xl font-black text-white mb-4">Payment Successful!</h2>
          <p className="text-white/60 mb-8">
            Welcome to the {plan.name} tier. Your account is being upgraded.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-white/40 animate-pulse">
            <Loader2 className="animate-spin" size={16} />
            Redirecting to dashboard...
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black font-sans text-foreground selection:bg-primary/30 relative overflow-x-hidden flex flex-col">
      <SmartNavbar />
      
      <main className="flex-grow pt-32 pb-20 relative flex items-center">
        {/* Background Gradients matching the plan */}
        <div className={`absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none`} />
        <div className={`absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr ${plan.gradient} opacity-[0.07] blur-[120px] pointer-events-none rounded-full`} />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 pointer-events-none [mask-image:linear-gradient(to_bottom,black,transparent)]" />

        <div className="max-w-6xl mx-auto px-4 w-full relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8 items-start">
            
            {/* Left Column: Plan Summary */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 space-y-8"
            >
              <div>
                <Link href="/pricing" className="inline-flex items-center gap-2 text-sm font-medium text-white/40 hover:text-white transition-colors mb-8">
                  <ArrowRight className="rotate-180" size={16} />
                  Back to pricing
                </Link>
                <h1 className="text-4xl font-black text-white tracking-tight mb-4">Complete your <br/>upgrade</h1>
                <p className="text-white/60">You're one step away from unlocking premium performance tools.</p>
              </div>

              {/* Plan Card */}
              <div className={`relative bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 ${plan.shadow}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-5 rounded-3xl pointer-events-none`} />
                <div className="absolute top-0 left-0 w-full h-[1px] opacity-100">
                  <div className={`absolute inset-0 bg-gradient-to-r from-transparent ${plan.glowLine} to-transparent opacity-80`} />
                </div>
                
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${plan.bgIcon} border border-white/5`}>
                    <Icon size={24} className={plan.color} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white leading-none mb-1">{plan.name}</h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-white/50">Plan Selected</p>
                  </div>
                </div>

                <div className="mb-6 flex items-end gap-1 relative z-10">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-white/50 font-medium mb-1">{plan.interval}</span>
                </div>

                <div className="space-y-4 relative z-10">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={12} className="text-emerald-400" />
                      </div>
                      <span className="text-sm text-white/80">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Column: Checkout Form */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
                
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-white">Payment Details</h2>
                  <div className="flex items-center gap-2 text-white/40">
                    <Lock size={16} />
                    <span className="text-xs font-semibold uppercase tracking-wider">Secure Checkout</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/80">Full Name</label>
                      <Input 
                        required
                        placeholder="John Doe"
                        className="bg-black/50 border-white/10 focus-visible:ring-primary/50 text-white"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/80">Email Address</label>
                      <Input 
                        required
                        type="email"
                        placeholder="john@example.com"
                        className="bg-black/50 border-white/10 focus-visible:ring-primary/50 text-white"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Card Information</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                      <Input 
                        required
                        placeholder="0000 0000 0000 0000"
                        className="pl-10 bg-black/50 border-white/10 focus-visible:ring-primary/50 text-white font-mono"
                        value={formData.card}
                        onChange={e => setFormData({...formData, card: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/80">Expiry Date</label>
                      <Input 
                        required
                        placeholder="MM/YY"
                        className="bg-black/50 border-white/10 focus-visible:ring-primary/50 text-white font-mono"
                        value={formData.expiry}
                        onChange={e => setFormData({...formData, expiry: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/80">CVC</label>
                      <Input 
                        required
                        placeholder="123"
                        type="password"
                        maxLength={4}
                        className="bg-black/50 border-white/10 focus-visible:ring-primary/50 text-white font-mono"
                        value={formData.cvc}
                        onChange={e => setFormData({...formData, cvc: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/10">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-white/60 font-medium">Total Due Today</span>
                      <span className="text-2xl font-black text-white">{plan.price}</span>
                    </div>

                    <Button 
                      type="submit"
                      disabled={isLoading}
                      className={`w-full h-14 text-lg font-bold bg-gradient-to-r ${plan.gradient} hover:opacity-90 text-white shadow-lg ${plan.shadow} border-0 transition-all relative overflow-hidden`}
                    >
                      <span className={`flex items-center gap-2 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                        Complete Purchase
                        <ArrowRight size={20} />
                      </span>
                      {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Loader2 className="animate-spin text-white" size={24} />
                        </div>
                      )}
                    </Button>
                    <p className="text-center text-xs text-white/40 font-medium mt-4 flex items-center justify-center gap-1">
                      <Lock size={12} />
                      Payments are secure and encrypted.
                    </p>
                  </div>
                </form>
              </div>
            </motion.div>

          </div>
        </div>
      </main>
      
      <PremiumFooter />
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
