"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  Users, ClipboardList, Calendar, Activity, BarChart, 
  MessageSquare, ShieldAlert, Heart, Trophy, CalendarDays, 
  FolderOpen, Settings, LayoutDashboard, Search, Bell, Mail, ChevronRight, Menu, X
} from "lucide-react";
import { CommandPalette } from "@/components/coach/CommandPalette";

type NavItem = {
  name: string;
  href: string;
  icon: any;
  badge?: number;
};

type NavSection = {
  title?: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    items: [
      { name: "Dashboard", href: "/coach", icon: LayoutDashboard }
    ]
  },
  {
    title: "COACH PANEL",
    items: [
      { name: "Athletes", href: "/coach/athletes", icon: Users },
      { name: "Training Plans", href: "/coach/training", icon: ClipboardList },
      { name: "Sessions", href: "/coach/sessions", icon: Calendar },
      { name: "Performance", href: "/coach/performance", icon: Activity },
      { name: "Analytics", href: "/coach/analytics", icon: BarChart },
      { name: "Communication", href: "/coach/communication", icon: MessageSquare },
      { name: "Injury Management", href: "/coach/injuries", icon: ShieldAlert },
      { name: "Nutrition", href: "/coach/nutrition", icon: Heart },
      { name: "Competition", href: "/coach/competitions", icon: Trophy },
      { name: "Calendar", href: "/coach/calendar", icon: CalendarDays },
      { name: "Documents", href: "/coach/documents", icon: FolderOpen },
    ]
  },
  {
    title: "SUPPORT",
    items: [
      { name: "Messages", href: "/coach/messages", icon: MessageSquare, badge: 5 },
      { name: "Settings", href: "/coach/settings", icon: Settings },
    ]
  }
];

export function CoachAppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { userData } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on mobile when navigating
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0A0C10] text-[#e2e8f0] flex relative font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative top-0 left-0 z-50 h-screen w-64 bg-[#0F111A] flex flex-col transition-transform duration-300 ease-in-out border-r border-[#1F2937] ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-6 flex items-center justify-between">
          <Link href="/coach" className="flex items-center gap-3">
            <div className="w-[82px] h-[82px] flex items-center justify-center relative">
              <Image src="/logo.png" alt="Heptafit Logo" width={82} height={82} className="w-[82px] h-[82px] object-contain animate-shimmer" />
            </div>
            <div>
              <span className="block text-sm font-bold tracking-widest uppercase text-white leading-tight">Heptafit</span>
              <span className="block text-[8px] tracking-widest text-[#9CA3AF] leading-tight">MANAGEMENT SYSTEM</span>
            </div>
          </Link>
          <button className="lg:hidden text-[#9CA3AF]" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-6 overflow-y-auto py-2 no-scrollbar">
          {navSections.map((section, idx) => (
            <div key={idx}>
              {section.title && (
                <h3 className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/coach" && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  
                  return (
                    <Link 
                      key={item.name} 
                      href={item.href} 
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors group ${
                        isActive 
                          ? "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-lg shadow-indigo-500/20" 
                          : "text-[#9CA3AF] hover:text-white hover:bg-[#1F2937]/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-white" : "text-[#9CA3AF] group-hover:text-white"} />
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="bg-[#4F46E5] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-[#1F2937]/50">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#11141A] border border-[#1F2937] hover:bg-[#1F2937]/50 transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-[#1F2937] overflow-hidden border border-[#374151]">
               <img src={userData?.photoURL || `https://ui-avatars.com/api/?name=Coach+Arindam&background=1F2937&color=fff`} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate text-white">
                Coach {userData?.lastName || "Arindam"}
              </p>
              <p className="text-xs text-[#9CA3AF] capitalize">Head Coach</p>
            </div>
            <ChevronRight size={16} className="text-[#6B7280]" />
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden relative">
        <header className="h-24 px-6 flex items-center justify-between shrink-0 bg-[#0A0C10]">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-[#9CA3AF]" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-white tracking-tight">Good morning, Coach {userData?.lastName || "Arindam"} 👋</h1>
              <p className="text-sm text-[#9CA3AF] mt-1">Here's what's happening with your athletes today.</p>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" size={16} />
              <input 
                type="text" 
                placeholder="Search athletes, sessions..." 
                className="bg-[#11141A] border border-[#1F2937] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#4F46E5] transition-colors text-white placeholder:text-[#6B7280] w-64"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <button className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#11141A] transition-colors border border-transparent hover:border-[#1F2937]">
                <Bell size={20} className="text-[#9CA3AF]" />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#EF4444] rounded-full border-2 border-[#0A0C10]"></span>
              </button>
              <button className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#11141A] transition-colors border border-transparent hover:border-[#1F2937]">
                <Mail size={20} className="text-[#9CA3AF]" />
                <span className="absolute top-2 right-2 w-4 h-4 bg-[#EF4444] rounded-full text-[9px] font-bold flex items-center justify-center border border-[#0A0C10] text-white">2</span>
              </button>
            </div>

            <button className="flex items-center gap-2 px-3 py-2 bg-[#11141A] border border-[#1F2937] rounded-lg hover:bg-[#1F2937] transition-colors">
              <CalendarDays size={16} className="text-[#9CA3AF]" />
              <span className="text-sm text-[#E5E7EB]">May 30, 2025</span>
              <ChevronRight size={14} className="text-[#6B7280] ml-1 rotate-90" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col relative px-6 pb-6">
          {children}
        </div>
      </main>

      <CommandPalette />
    </div>
  );
}
