"use client";

import { useState, useEffect } from "react";
import { Search, User, ClipboardList, Calendar, FileText, Trophy, ShieldAlert, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm p-4"
        onClick={() => setIsOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-2xl bg-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5">
            <Search size={20} className="text-muted-foreground" />
            <input
              autoFocus
              type="text"
              placeholder="Search athletes, plans, sessions, or type a command..."
              className="flex-1 bg-transparent border-none outline-none text-lg placeholder:text-muted-foreground"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="text-[10px] font-bold text-muted-foreground bg-white/5 px-2 py-1 rounded border border-white/10 uppercase tracking-wider">
              ESC
            </div>
          </div>

          {/* Results Area */}
          <div className="max-h-[60vh] overflow-y-auto p-2 no-scrollbar">
            {query.length === 0 ? (
              <div className="p-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Quick Actions</p>
                <div className="space-y-1">
                  <ActionItem icon={Calendar} label="Create Session" shortcut="S" />
                  <ActionItem icon={ClipboardList} label="Create Plan" shortcut="P" />
                  <ActionItem icon={Trophy} label="Register Competition" shortcut="C" />
                  <ActionItem icon={User} label="Add Athlete" shortcut="A" />
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <Search size={32} className="mx-auto mb-3 opacity-20" />
                <p>Global search for "{query}" will connect to HIE.</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ActionItem({ icon: Icon, label, shortcut }: { icon: any, label: string, shortcut: string }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-blue-500/10 hover:text-blue-400 cursor-pointer transition-colors group">
      <div className="flex items-center gap-3">
        <Icon size={16} className="text-muted-foreground group-hover:text-blue-400" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-1">
        <kbd className="bg-white/5 border border-white/10 text-[10px] rounded px-1.5 py-0.5 text-muted-foreground">⌘</kbd>
        <kbd className="bg-white/5 border border-white/10 text-[10px] rounded px-1.5 py-0.5 text-muted-foreground">{shortcut}</kbd>
      </div>
    </div>
  );
}
