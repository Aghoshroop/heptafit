"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, Building2, Users, CreditCard, Receipt, 
  Tag, Package, TrendingUp, LifeBuoy, Bell, ToggleLeft, 
  FileText, Activity, Settings, Database, User, Menu, X, LogOut
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Organizations", href: "/admin/organizations", icon: Building2 },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
  { name: "Payments", href: "/admin/payments", icon: Receipt },
  { name: "Coupons", href: "/admin/coupons", icon: Tag },
  { name: "Plans", href: "/admin/plans", icon: Package },
  { name: "Revenue", href: "/admin/revenue", icon: TrendingUp },
  { name: "Support", href: "/admin/support", icon: LifeBuoy },
  { name: "Announcements", href: "/admin/announcements", icon: Bell },
  { name: "Feature Flags", href: "/admin/feature-flags", icon: ToggleLeft },
  { name: "Audit Logs", href: "/admin/audit-logs", icon: FileText },
  { name: "System Health", href: "/admin/system-health", icon: Activity },
  { name: "Global Settings", href: "/admin/settings", icon: Settings },
  { name: "Database Tools", href: "/admin/database-tools", icon: Database },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { userData, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-sans text-foreground">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Heptafit Logo" width={82} height={82} className="w-[82px] h-[82px] object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] animate-shimmer" />
          <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Heptafit Admin</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:sticky top-0 left-0 h-screen w-64 border-r border-border bg-card/30 backdrop-blur-xl z-50
        transition-transform duration-300 ease-in-out flex flex-col
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="p-6 hidden md:flex items-center gap-3">
          <Image src="/logo.png" alt="Heptafit Logo" width={90} height={90} className="w-[90px] h-[90px] object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] animate-shimmer" />
          <div>
            <h1 className="font-bold text-lg tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Heptafit Admin</h1>
            <p className="text-xs text-muted-foreground mt-1">Control Center</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 md:py-2 space-y-1 custom-scrollbar">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => setSidebarOpen(false)}
              >
                <div className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                  ${isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}
                `}>
                  <item.icon size={18} className={isActive ? "text-primary" : "text-muted-foreground"} />
                  <span className="text-sm">{item.name}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabAdmin"
                      className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border mt-auto">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <User size={18} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{userData?.firstName} {userData?.lastName}</p>
              <p className="text-xs text-muted-foreground truncate">{userData?.email}</p>
            </div>
          </div>
          <div className="mt-2 flex gap-2">
            <Link href="/admin/profile" className="flex-1">
              <button className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-secondary/50 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                <Settings size={14} /> Profile
              </button>
            </Link>
            <button 
              onClick={logout}
              className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-red-500/10 text-xs font-medium text-red-500 hover:bg-red-500/20 transition-colors"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden bg-background relative">
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
