"use client";

import { motion } from "framer-motion";
import { Download, Upload, RefreshCw, Trash2, Database, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminDatabaseToolsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Database Tools</h1>
          <p className="text-muted-foreground mt-1">Super Admin utilities for managing Firestore data.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        
        {/* Import / Export */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/50 backdrop-blur-md border border-border rounded-2xl p-6 shadow-lg shadow-black/5"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-4">
            <Database size={24} />
          </div>
          <h2 className="text-lg font-bold text-foreground mb-2">Import / Export</h2>
          <p className="text-sm text-muted-foreground mb-6">Backup or restore specific collections via CSV or JSON formats.</p>
          
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-3">
              <Download size={16} /> Export Users to CSV
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3">
              <Download size={16} /> Export Orgs to JSON
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 border-dashed">
              <Upload size={16} /> Import Data
            </Button>
          </div>
        </motion.div>

        {/* Maintenance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card/50 backdrop-blur-md border border-border rounded-2xl p-6 shadow-lg shadow-black/5"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center mb-4">
            <RefreshCw size={24} />
          </div>
          <h2 className="text-lg font-bold text-foreground mb-2">Maintenance</h2>
          <p className="text-sm text-muted-foreground mb-6">Perform routine maintenance and clear caches to optimize performance.</p>
          
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-3">
              <RefreshCw size={16} /> Clear Redis Cache
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3">
              <RefreshCw size={16} /> Sync Auth with Firestore
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3">
              <RefreshCw size={16} /> Recalculate MRR
            </Button>
          </div>
        </motion.div>

        {/* Destructive Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card/50 backdrop-blur-md border border-red-500/20 rounded-2xl p-6 shadow-lg shadow-red-500/5 bg-red-500/5"
        >
          <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-500 flex items-center justify-center mb-4">
            <ShieldAlert size={24} />
          </div>
          <h2 className="text-lg font-bold text-red-500 mb-2">Danger Zone</h2>
          <p className="text-sm text-red-500/80 mb-6">Destructive actions. These cannot be undone. Use with extreme caution.</p>
          
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-3 text-red-500 border-red-500/20 hover:bg-red-500/10">
              <Trash2 size={16} /> Delete Test Data (DEV_*)
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 text-red-500 border-red-500/20 hover:bg-red-500/10">
              <Trash2 size={16} /> Purge Inactive Users
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 text-red-500 border-red-500/20 hover:bg-red-500/10">
              <Trash2 size={16} /> Factory Reset DB
            </Button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
