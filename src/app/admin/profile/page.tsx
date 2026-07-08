"use client";

import { useAuth } from "@/context/AuthContext";
import { User, Mail, Shield, Key } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminProfilePage() {
  const { userData } = useAuth();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Super Admin Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your administrative credentials.</p>
      </div>

      <div className="bg-card/50 backdrop-blur-md border border-border rounded-2xl p-8 shadow-lg shadow-black/5">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center flex-shrink-0 shadow-xl shadow-primary/20">
            <span className="text-3xl font-bold text-white">S</span>
          </div>
          
          <div className="flex-1 space-y-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5 flex items-center gap-2">
                  <User size={14} /> Name
                </label>
                <p className="text-lg font-bold text-foreground">{userData?.firstName} {userData?.lastName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5 flex items-center gap-2">
                  <Mail size={14} /> Email Address
                </label>
                <p className="text-lg font-bold text-foreground">{userData?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5 flex items-center gap-2">
                  <Shield size={14} /> Role
                </label>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20 inline-block">
                  System Super Admin
                </span>
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <h3 className="text-sm font-bold text-foreground mb-4">Security</h3>
              <div className="space-y-3">
                <Button variant="outline" className="gap-2">
                  <Key size={16} /> Change Password
                </Button>
                <p className="text-xs text-muted-foreground">
                  As the Super Admin, changing your password will revoke all active sessions immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
