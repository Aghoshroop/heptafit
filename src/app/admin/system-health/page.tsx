"use client";

import { motion } from "framer-motion";
import { Activity, Server, Database, Cloud, Zap, Mail, Bell, CreditCard } from "lucide-react";

// Mock Data
const services = [
  { name: "Authentication", status: "Healthy", uptime: "99.99%", latency: "42ms", icon: Zap, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { name: "Firestore Database", status: "Healthy", uptime: "100%", latency: "12ms", icon: Database, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { name: "Cloud Functions", status: "Warning", uptime: "99.95%", latency: "850ms", icon: Server, color: "text-amber-500", bg: "bg-amber-500/10" },
  { name: "Cloud Storage", status: "Healthy", uptime: "100%", latency: "65ms", icon: Cloud, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { name: "Email Service (SendGrid)", status: "Healthy", uptime: "99.9%", latency: "120ms", icon: Mail, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { name: "Push Notifications", status: "Offline", uptime: "98.2%", latency: "--", icon: Bell, color: "text-red-500", bg: "bg-red-500/10" },
  { name: "Payments (Stripe)", status: "Healthy", uptime: "100%", latency: "85ms", icon: CreditCard, color: "text-emerald-500", bg: "bg-emerald-500/10" },
];

export default function AdminSystemHealthPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">System Health</h1>
          <p className="text-muted-foreground mt-1">Realtime monitoring and status of platform services.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {services.map((service, index) => (
          <motion.div
            key={service.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`
              bg-card/50 backdrop-blur-md border rounded-2xl p-6 shadow-lg transition-colors
              ${service.status === 'Warning' ? 'border-amber-500/50 shadow-amber-500/5' : ''}
              ${service.status === 'Offline' ? 'border-red-500/50 shadow-red-500/5' : 'border-border shadow-black/5'}
            `}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${service.bg} ${service.color}`}>
                <service.icon size={24} />
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${service.bg} ${service.color}`}>
                {service.status}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-foreground mb-4">{service.name}</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Uptime (30d)</span>
                <span className="font-medium text-foreground">{service.uptime}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Latency</span>
                <span className="font-medium text-foreground">{service.latency}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
