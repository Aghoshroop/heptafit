"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { 
  Activity, Menu, X, LogOut, Bell, ChevronRight,
  Home, Users, ClipboardList, Calendar, CheckSquare, 
  Heart, ShieldAlert, Trophy, MessageSquare, FileText, 
  CalendarDays, FolderOpen, BarChart, Settings, Shield
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

const coachNavItems = [
  { name: "Mission Control", href: "/coach", icon: Home },
  { name: "Athletes", href: "/coach/athletes", icon: Users },
  { name: "Team", href: "/coach/team", icon: Shield },
  { name: "Training Plans", href: "/coach/training", icon: ClipboardList },
  { name: "Sessions", href: "/coach/sessions", icon: Calendar },
  { name: "Attendance", href: "/coach/attendance", icon: CheckSquare },
  { name: "Performance", href: "/coach/performance", icon: Activity },
  { name: "Wellness", href: "/coach/wellness", icon: Heart },
  { name: "Injury Management", href: "/coach/injuries", icon: ShieldAlert },
  { name: "Competitions", href: "/coach/competitions", icon: Trophy },
  { name: "Messages", href: "/coach/messages", icon: MessageSquare },
  { name: "Reports", href: "/coach/reports", icon: FileText },
  { name: "Calendar", href: "/coach/calendar", icon: CalendarDays },
  { name: "Documents", href: "/coach/documents", icon: FolderOpen },
  { name: "Analytics", href: "/coach/analytics", icon: BarChart },
  { name: "Settings", href: "/coach/settings", icon: Settings },
];

export function CoachAppLayout({ children }: { children: React.ReactNode }) {
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
    }, (error) => {
      console.error("CoachAppLayout notifications onSnapshot error:", error);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("devRole");
    logout();
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex relative">
      {/* Ambient Background Glows tailored for Coach */}
      <div className="ambient-glow bg-blue-500/10 w-[600px] h-[600px] top-[-200px] left-[-200px]" />
      <div className="ambient-glow bg-indigo-500/10 w-[800px] h-[800px] bottom-[-400px] right-[-200px]" />

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

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen lg:h-screen w-72 lg:w-64 glass lg:border-none flex flex-col transition-transform duration-300 ease-in-out overflow-hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-6 flex items-center justify-between">
          <Link href="/coach" className="flex items-center gap-3 text-xl font-bold">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Activity size={20} strokeWidth={2.5} />
            </div>
            <span className="tracking-tight">CoachOS</span>
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden text-muted-foreground" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </Button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-4 relative z-10 no-scrollbar">
          {coachNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            
            return (
              <Link key={item.name} href={item.href} className="block relative">
                {isActive && (
                  <motion.div
                    layoutId="coach-active-nav"
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent border-l-2 border-blue-500 rounded-r-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 group relative z-10 ${
                    isActive 
                      ? "text-blue-500 font-medium" 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-blue-500" : "text-muted-foreground group-hover:text-foreground transition-colors"} />
                  <span className="text-sm">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="glass-card rounded-2xl p-1 shadow-2xl">
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 p-[2px]">
                <div className="w-full h-full bg-card rounded-full flex items-center justify-center text-sm font-bold">
                  {userData?.firstName?.[0] || "C"}{userData?.lastName?.[0]}
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate text-foreground group-hover:text-blue-500 transition-colors">
                  {userData?.firstName || "Head"} {userData?.lastName || "Coach"}
                </p>
                <p className="text-xs text-muted-foreground capitalize">Head Coach</p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground group-hover:text-foreground" />
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen relative z-10 min-w-0">
        <header className="h-20 lg:h-24 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={20} />
            </Button>
            <h2 className="text-xl font-bold hidden md:block">Command Center</h2>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Button variant="ghost" size="icon" className="relative rounded-full glass hover:bg-white/10 transition-colors w-10 h-10">
                <Bell size={18} className="text-muted-foreground group-hover:text-foreground" />
                {notifications.some(n => !n.isRead) && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_var(--color-blue-500)]" />
                )}
              </Button>
              <div className="absolute right-0 mt-2 w-80 glass-card rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 p-4 transform translate-y-2 group-hover:translate-y-0">
                <h3 className="text-sm font-semibold mb-3 border-b border-white/10 pb-2 text-foreground">Coach Alerts</h3>
                <div className="space-y-2 max-h-80 overflow-y-auto no-scrollbar">
                  {notifications.length > 0 ? notifications.map(notif => (
                    <div key={notif.id} className={`text-sm p-3 rounded-xl transition-colors ${notif.isRead ? 'hover:bg-white/5' : 'bg-blue-500/10 border border-blue-500/20'}`}>
                      <p className="font-medium text-foreground">{notif.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                    </div>
                  )) : (
                    <div className="text-sm text-center text-muted-foreground py-6">No new alerts</div>
                  )}
                </div>
              </div>
            </div>
            
            <Button variant="ghost" size="icon" className="rounded-full glass hover:bg-destructive/20 hover:text-destructive transition-colors w-10 h-10" onClick={handleLogout} title="Sign Out">
              <LogOut size={18} />
            </Button>
          </div>
        </header>

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
