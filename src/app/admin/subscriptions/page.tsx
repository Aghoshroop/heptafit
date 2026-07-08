"use client";

import { motion } from "framer-motion";
import { CreditCard, Plus, Check, Settings, Archive } from "lucide-react";
import { Button } from "@/components/ui/Button";

const plans = [
  { 
    id: "plan_starter", 
    name: "Starter", 
    price: 49, 
    interval: "month", 
    athletes: 15, 
    coaches: 2, 
    features: ["Basic Training Plans", "Simple Analytics", "Email Support"],
    status: "active"
  },
  { 
    id: "plan_pro", 
    name: "Professional", 
    price: 129, 
    interval: "month", 
    athletes: 50, 
    coaches: 5, 
    features: ["Advanced Analytics", "Video Analysis", "Nutrition Module", "Priority Support"],
    status: "active",
    popular: true
  },
  { 
    id: "plan_elite", 
    name: "Elite", 
    price: 299, 
    interval: "month", 
    athletes: 150, 
    coaches: 15, 
    features: ["GPS Tracking Integration", "Medical & Rehab", "Custom Branding", "24/7 Phone Support"],
    status: "active"
  },
  { 
    id: "plan_enterprise", 
    name: "Enterprise", 
    price: "Custom", 
    interval: "", 
    athletes: "Unlimited", 
    coaches: "Unlimited", 
    features: ["White-label App", "Dedicated Success Manager", "On-premise Deployment Option", "Custom Integrations"],
    status: "active"
  }
];

export default function AdminSubscriptionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Subscriptions & Plans</h1>
          <p className="text-muted-foreground mt-1">Manage platform pricing tiers and capabilities.</p>
        </div>
        <Button variant="primary" className="gap-2">
          <Plus size={16} />
          Create Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
              relative bg-card/50 backdrop-blur-md border rounded-3xl p-6 flex flex-col shadow-lg
              ${plan.popular ? 'border-primary shadow-primary/10' : 'border-border shadow-black/5'}
            `}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-primary to-purple-500 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                Most Popular
              </div>
            )}
            
            <div className="mb-6 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-foreground">
                    {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                  </span>
                  {plan.interval && (
                    <span className="text-sm text-muted-foreground">/{plan.interval}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 py-4 border-y border-border/50 mb-6">
              <div className="flex-1 text-center">
                <p className="text-sm font-bold text-foreground">{plan.athletes}</p>
                <p className="text-xs text-muted-foreground">Athletes</p>
              </div>
              <div className="w-px h-8 bg-border/50" />
              <div className="flex-1 text-center">
                <p className="text-sm font-bold text-foreground">{plan.coaches}</p>
                <p className="text-xs text-muted-foreground">Coaches</p>
              </div>
            </div>

            <div className="flex-1 space-y-3 mb-8">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={10} className="text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-auto">
              <Button variant="outline" className="flex-1 gap-2">
                <Settings size={16} /> Edit
              </Button>
              <Button variant="outline" className="text-red-500 hover:text-red-500 hover:bg-red-500/10 px-3">
                <Archive size={16} />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
