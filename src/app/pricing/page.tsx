"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, Zap, Shield, Crown, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { PremiumFooter } from "@/components/home/PremiumFooter";
import { SmartNavbar } from "@/components/layout/SmartNavbar";

const tiers = [
  {
    name: "Starter",
    subtitle: "Trial Plan",
    description: "Perfect for testing the platform with a single athlete.",
    price: "$0",
    interval: "forever",
    icon: Zap,
    color: "text-slate-300",
    bgIcon: "bg-slate-500/10",
    gradient: "from-slate-400 to-gray-600",
    glowLine: "via-slate-400",
    glowShadow: "hover:shadow-[0_30px_60px_-15px_rgba(148,163,184,0.3)] hover:border-slate-500/50",
    buttonVariant: "outline",
    features: ["1 Coach Account", "1 Athlete Profile", "Basic Wellness Logging", "Standard Analytics"],
    missing: ["No AI Insights", "No Wearable Sync"]
  },
  {
    name: "Platinum",
    subtitle: "Beginner",
    description: "Ideal for independent coaches starting their roster.",
    price: "$49",
    interval: "/month",
    icon: Shield,
    color: "text-cyan-400",
    bgIcon: "bg-cyan-500/10",
    gradient: "from-cyan-400 to-blue-600",
    glowLine: "via-cyan-400",
    glowShadow: "hover:shadow-[0_30px_60px_-15px_rgba(34,211,238,0.4)] hover:border-cyan-500/50",
    buttonVariant: "outline",
    popular: false,
    features: ["1 Coach Account", "Up to 5 Athletes", "Wearable Integrations", "Advanced Analytics", "Email Support"],
    missing: []
  },
  {
    name: "Diamond",
    subtitle: "Intermediate",
    description: "The sweet spot for growing teams and serious coaches.",
    price: "$129",
    interval: "/month",
    icon: Sparkles,
    color: "text-fuchsia-400",
    bgIcon: "bg-fuchsia-500/10",
    gradient: "from-fuchsia-400 to-purple-600",
    glowLine: "via-fuchsia-400",
    glowShadow: "hover:shadow-[0_30px_60px_-15px_rgba(192,38,211,0.5)] hover:border-fuchsia-500/60",
    buttonVariant: "primary",
    popular: true,
    features: ["1 Coach Account", "Up to 15 Athletes", "Full AI Risk Analysis", "Advanced Wearable Sync", "Priority 24/7 Support"],
    missing: []
  },
  {
    name: "Elite",
    subtitle: "Expert",
    description: "For high-performance academies and professional rosters.",
    price: "Custom",
    interval: "",
    icon: Crown,
    color: "text-amber-400",
    bgIcon: "bg-amber-500/10",
    gradient: "from-amber-400 to-orange-600",
    glowLine: "via-amber-400",
    glowShadow: "hover:shadow-[0_30px_60px_-15px_rgba(251,191,36,0.4)] hover:border-amber-500/50",
    buttonVariant: "outline",
    features: ["Unlimited Coaches", "Unlimited Athletes", "Custom API Access", "Dedicated Success Manager", "White-glove Onboarding", "Custom AI Models"],
    missing: []
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black font-sans text-foreground selection:bg-primary/30 relative overflow-x-hidden">
      
      {/* Smart Navbar */}
      <SmartNavbar />

      <main className="pt-40 pb-32 relative">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-[radial-gradient(ellipse,rgba(168,85,247,0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute top-[20%] left-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(6,182,212,0.08)_0%,transparent_60%)] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(245,158,11,0.05)_0%,transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 pointer-events-none [mask-image:linear-gradient(to_bottom,black,transparent)]" />

        <div className="max-w-7xl mx-auto px-4 relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-[0.2em] uppercase text-primary mb-6 shadow-[0_0_15px_rgba(168,85,247,0.3)] backdrop-blur-sm">
              Simple, Transparent Pricing
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-white drop-shadow-2xl">
              Scale Your Academy. <br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-fuchsia-400 to-cyan-400 drop-shadow-lg">
                Without Limits.
              </span>
            </h1>
            <p className="text-xl text-white/60 font-medium">
              From independent coaches to enterprise organizations, we have a plan built for your exact roster size.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {tiers.map((tier, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ 
                  y: -20, 
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 400, damping: 25 }
                }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className={`group relative bg-black/60 backdrop-blur-sm border ${tier.popular ? 'border-primary/50 shadow-[0_0_30px_rgba(168,85,247,0.15)]' : 'border-white/10'} rounded-3xl p-8 flex flex-col transition-colors duration-500 ${tier.glowShadow}`}
              >
                {/* Inner container to clip the animated glow without clipping the badge */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none z-0">
                  {/* Magical rotating color background on hover */}
                  <div className={`absolute -inset-x-20 -inset-y-20 bg-gradient-to-tr ${tier.gradient} opacity-0 group-hover:opacity-10 blur-2xl rounded-full animate-spin-slow transition-opacity duration-700`} />
                  
                  {/* Glowing top border accent on hover */}
                  <div className="absolute top-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className={`absolute inset-0 bg-gradient-to-r from-transparent ${tier.glowLine} to-transparent opacity-80`} />
                  </div>
                </div>

                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-fuchsia-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.5)] z-10">
                    Most Popular
                  </div>
                )}

                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tier.bgIcon} border border-white/5`}>
                    <tier.icon size={24} className={tier.color} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white leading-none mb-1">{tier.name}</h3>
                    <p className={`text-xs font-bold uppercase tracking-widest ${tier.color} opacity-80`}>{tier.subtitle}</p>
                  </div>
                </div>

                <div className="mb-6 flex items-end gap-1 relative z-10">
                  <span className="text-4xl font-black text-white">{tier.price}</span>
                  {tier.interval && <span className="text-white/50 font-medium mb-1">{tier.interval}</span>}
                </div>

                <p className="text-sm text-white/60 mb-8 min-h-[40px] relative z-10">
                  {tier.description}
                </p>

                <Link href={tier.price === "Custom" ? "/contact" : `/get-started?plan=${tier.name.toLowerCase()}`} className="w-full relative z-10 mb-8 block">
                  <Button 
                    variant={tier.buttonVariant as any} 
                    className={`w-full font-bold h-12 ${tier.buttonVariant === 'outline' ? 'border-white/20 bg-white/5 hover:bg-white/10 text-white' : 'shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]'}`}
                  >
                    {tier.price === "Custom" ? "Contact Sales" : "Get Started"}
                  </Button>
                </Link>

                <div className="flex flex-col gap-4 mt-auto relative z-10">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/40 border-b border-white/10 pb-2">Included</p>
                  {tier.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 group/feature">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/feature:bg-emerald-500/40 transition-colors">
                        <Check size={12} className="text-emerald-400" />
                      </div>
                      <span className="text-sm text-white/80 font-medium group-hover/feature:text-white transition-colors">{feature}</span>
                    </div>
                  ))}
                  
                  {tier.missing && tier.missing.length > 0 && (
                    <div className="flex flex-col gap-4 mt-2">
                      {tier.missing.map((feature, idx) => (
                        <div key={`missing-${idx}`} className="flex items-start gap-3 opacity-40 hover:opacity-70 transition-opacity">
                          <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <X size={12} className="text-red-400" />
                          </div>
                          <span className="text-sm text-white/80 font-medium line-through">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <PremiumFooter />
    </div>
  );
}
