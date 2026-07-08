"use client";

import { motion } from "framer-motion";
import { Building2, Users, CreditCard, Activity, TrendingUp, DollarSign } from "lucide-react";

// Mock data for Dashboard
const stats = [
  { name: "Total Organizations", value: "124", change: "+12%", icon: Building2 },
  { name: "Total Users", value: "3,450", change: "+5.4%", icon: Users },
  { name: "Active Subscriptions", value: "89", change: "+2.1%", icon: CreditCard },
  { name: "Monthly Revenue", value: "$45,230", change: "+14%", icon: DollarSign },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your platform's performance.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card/50 backdrop-blur-md border border-border rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <stat.icon size={24} className="text-primary" />
              </div>
              <span className="text-sm font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
              <h3 className="text-3xl font-bold text-foreground mt-1">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-card/50 backdrop-blur-md border border-border rounded-2xl p-6 h-96 flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">Revenue Overview</h2>
            <select className="bg-secondary/50 border border-border rounded-lg text-sm px-3 py-1.5 text-foreground outline-none">
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="flex-1 flex items-center justify-center border border-dashed border-border/50 rounded-xl bg-secondary/20">
            <div className="text-center text-muted-foreground">
              <TrendingUp size={32} className="mx-auto mb-2 opacity-50" />
              <p>Revenue Chart Placeholder</p>
              <p className="text-xs mt-1">Requires Recharts or similar library</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card/50 backdrop-blur-md border border-border rounded-2xl p-6 h-96 flex flex-col"
        >
          <h2 className="text-lg font-bold text-foreground mb-6">System Health</h2>
          <div className="flex-1 space-y-4">
            {[
              { name: "Authentication", status: "Healthy", color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { name: "Firestore DB", status: "Healthy", color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { name: "Cloud Storage", status: "Healthy", color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { name: "Payments (Stripe)", status: "Warning", color: "text-amber-500", bg: "bg-amber-500/10" },
            ].map((service) => (
              <div key={service.name} className="flex items-center justify-between p-3 rounded-xl border border-border bg-secondary/30">
                <div className="flex items-center gap-3">
                  <Activity size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{service.name}</span>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${service.bg} ${service.color}`}>
                  {service.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
