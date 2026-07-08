"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full bg-card border border-border rounded-3xl p-8 text-center shadow-xl shadow-red-500/5"
      >
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
          <ShieldAlert size={40} className="text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-8">
          You do not have the required permissions to access the Super Admin Control Center. This incident has been logged.
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/login" className="w-full">
            <Button variant="primary" className="w-full">
              Return to Login
            </Button>
          </Link>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full gap-2">
              <ArrowLeft size={16} />
              Go Back Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
