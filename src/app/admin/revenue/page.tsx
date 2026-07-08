"use client";

import { motion } from "framer-motion";
import { TrendingUp, ArrowUpRight, ArrowDownRight, DollarSign, Activity } from "lucide-react";

export default function AdminRevenuePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Revenue Analytics</h1>
        <p className="text-muted-foreground mt-1">Deep dive into financial performance and growth metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: "Monthly Recurring Revenue (MRR)", value: "$45,230", change: "+14.5%", up: true },
          { name: "Annual Run Rate (ARR)", value: "$542,760", change: "+12.1%", up: true },
          { name: "Net Revenue", value: "$42,100", change: "+15.2%", up: true },
          { name: "Refunds", value: "$450", change: "-2.4%", up: false },
        ].map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card/50 backdrop-blur-md border border-border rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stat.up ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                {stat.up ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              </div>
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-2">{stat.value}</h3>
            <span className={`text-sm font-medium ${stat.up ? 'text-emerald-500' : 'text-red-500'}`}>
              {stat.change} <span className="text-muted-foreground">vs last month</span>
            </span>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card/50 backdrop-blur-md border border-border rounded-2xl p-6 h-96 flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">MRR Growth</h2>
          </div>
          <div className="flex-1 flex items-center justify-center border border-dashed border-border/50 rounded-xl bg-secondary/20">
            <div className="text-center text-muted-foreground">
              <TrendingUp size={32} className="mx-auto mb-2 opacity-50" />
              <p>MRR Chart Placeholder</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card/50 backdrop-blur-md border border-border rounded-2xl p-6 h-96 flex flex-col"
        >
          <h2 className="text-lg font-bold text-foreground mb-6">Top Organizations by Revenue</h2>
          <div className="flex-1 space-y-4">
            {[
              { name: "Elite Athletics Academy", rev: "$3,588", plan: "Enterprise" },
              { name: "National Training Center", rev: "$3,588", plan: "Enterprise" },
              { name: "Peak Performance Track", rev: "$1,548", plan: "Professional" },
            ].map((org, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-border bg-secondary/30">
                <div>
                  <p className="font-medium text-foreground">{org.name}</p>
                  <p className="text-xs text-muted-foreground">{org.plan} Plan</p>
                </div>
                <p className="font-bold text-emerald-500">{org.rev}/yr</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
