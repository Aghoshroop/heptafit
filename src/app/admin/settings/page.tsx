"use client";

import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Global Settings</h1>
          <p className="text-muted-foreground mt-1">Configure platform-wide variables and preferences.</p>
        </div>
        <Button variant="primary" className="gap-2">
          <Save size={16} />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card/50 backdrop-blur-md border border-border rounded-2xl p-6 shadow-lg shadow-black/5"
          >
            <h2 className="text-lg font-bold text-foreground mb-4">Platform Identity</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Platform Name</label>
                  <input type="text" defaultValue="High Performance OS" className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Support Email</label>
                  <input type="email" defaultValue="support@highperformanceos.com" className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Platform Logo URL</label>
                <input type="text" defaultValue="https://cdn.example.com/logo.png" className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card/50 backdrop-blur-md border border-border rounded-2xl p-6 shadow-lg shadow-black/5"
          >
            <h2 className="text-lg font-bold text-foreground mb-4">Legal URLs</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Privacy Policy URL</label>
                <input type="text" defaultValue="https://highperformanceos.com/privacy" className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Terms of Service URL</label>
                <input type="text" defaultValue="https://highperformanceos.com/terms" className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Refund Policy URL</label>
                <input type="text" defaultValue="https://highperformanceos.com/refunds" className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card/50 backdrop-blur-md border border-border rounded-2xl p-6 shadow-lg shadow-black/5"
          >
            <h2 className="text-lg font-bold text-foreground mb-4">Localization & Finance</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Default Currency</label>
                <select className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground">
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Global GST/VAT %</label>
                <input type="number" defaultValue="18" className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">System Timezone</label>
                <select className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground">
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">EST</option>
                  <option value="Asia/Kolkata">IST</option>
                </select>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card/50 backdrop-blur-md border border-red-500/20 rounded-2xl p-6 shadow-lg shadow-red-500/5 bg-red-500/5"
          >
            <h2 className="text-lg font-bold text-red-500 mb-2">Maintenance Mode</h2>
            <p className="text-sm text-red-500/80 mb-4">Enabling this will block all non-admin users from accessing the platform.</p>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500 relative"></div>
              <span className="text-sm font-medium text-foreground">Enable Maintenance Mode</span>
            </label>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
