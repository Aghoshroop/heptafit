"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Activity, Menu, X, LogOut, User as UserIcon, Bell, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
}

export function DashboardLayout({ children, navItems }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const pathname = usePathname();
  const { user, userData, logout } = useAuth();

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "notifications"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a: any, b: any) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });
      setNotifications(data);
    });
    return () => unsubscribe();
  }, [user]);

  // Close sidebar on route change on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground flex relative">
      {/* Ambient Background Glows */}
      <div className="ambient-glow bg-accent/20 w-[600px] h-[600px] top-[-200px] left-[-200px]" />
      <div className="ambient-glow bg-primary/10 w-[800px] h-[800px] bottom-[-400px] right-[-200px]" />

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Glass Sidebar (using CSS transitions for better responsive behavior) */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen lg:h-screen w-72 lg:w-64 glass lg:border-none flex flex-col transition-transform duration-300 ease-in-out overflow-hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-xl font-bold">
            <Image src="/logo.png" alt="Heptafit Logo" width={90} height={90} className="w-[90px] h-[90px] object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] animate-shimmer" />
            <span className="tracking-tight">Heptafit</span>
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden text-muted-foreground" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </Button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-4 relative z-10 no-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            
            return (
              <Link key={item.name} href={item.href} className="block relative">
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent border-l-2 border-primary rounded-r-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 group relative z-10 ${
                    isActive 
                      ? "text-primary font-medium" 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground transition-colors"} />
                  <span className="text-sm">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Integrated Profile Card */}
        <div className="p-4 mt-auto">
          <div className="glass-card rounded-2xl p-1 shadow-2xl">
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent to-primary p-[2px]">
                <div className="w-full h-full bg-card rounded-full flex items-center justify-center text-sm font-bold">
                  {userData?.firstName?.[0]}{userData?.lastName?.[0]}
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate text-foreground group-hover:text-primary transition-colors">{userData?.firstName} {userData?.lastName}</p>
                <p className="text-xs text-muted-foreground capitalize">{(userData as any)?.role || 'Athlete'}</p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground group-hover:text-foreground" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen relative z-10 min-w-0">
        {/* Topbar */}
        <header className="h-20 lg:h-24 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={20} />
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Button variant="ghost" size="icon" className="relative rounded-full glass hover:bg-white/10 transition-colors w-10 h-10">
                <Bell size={18} className="text-muted-foreground group-hover:text-foreground" />
                {notifications.some(n => !n.isRead) && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_var(--primary)]" />
                )}
              </Button>
              <div className="absolute right-0 mt-2 w-80 glass-card rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 p-4 transform translate-y-2 group-hover:translate-y-0">
                <h3 className="text-sm font-semibold mb-3 border-b border-white/10 pb-2 text-foreground">Notifications</h3>
                <div className="space-y-2 max-h-80 overflow-y-auto no-scrollbar">
                  {notifications.length > 0 ? notifications.map(notif => (
                    <div key={notif.id} className={`text-sm p-3 rounded-xl transition-colors ${notif.isRead ? 'hover:bg-white/5' : 'bg-primary/10 border border-primary/20'}`}>
                      <p className="font-medium text-foreground">{notif.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                    </div>
                  )) : (
                    <div className="text-sm text-center text-muted-foreground py-6">No new notifications</div>
                  )}
                </div>
              </div>
            </div>
            
            <Button variant="ghost" size="icon" className="rounded-full glass hover:bg-destructive/20 hover:text-destructive transition-colors w-10 h-10" onClick={logout} title="Sign Out">
              <LogOut size={18} />
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 20 }}
            className="w-full mx-auto max-w-[1600px]"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
