"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { 
  Search, Users, Activity, HeartPulse, UserPlus, FileText, 
  Settings, Target, CalendarDays, TrendingUp
} from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] sm:pt-[10vh]">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      
      {/* Command Palette */}
      <div className="relative w-full max-w-xl mx-4 rounded-xl border border-white/10 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <Command
          className="flex w-full h-full flex-col overflow-hidden bg-transparent"
          shouldFilter={true}
        >
          <div className="flex items-center border-b border-white/10 px-4">
            <Search className="mr-2 h-5 w-5 shrink-0 text-muted-foreground" />
            <Command.Input
              className="flex h-14 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 text-white"
              placeholder="Search athletes, jump to pages, or perform actions..."
              autoFocus
            />
          </div>
          
          <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>
            
            <Command.Group heading="Quick Actions" className="px-2 text-xs font-medium text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold">
              <Command.Item 
                onSelect={() => runCommand(() => console.log('Action: Invite Athlete'))}
                className="flex cursor-pointer items-center rounded-lg px-2 py-2 text-sm text-white hover:bg-white/10 aria-selected:bg-white/10 aria-selected:text-blue-400 transition-colors"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                <span>Invite Athlete</span>
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/coach/calendar'))}
                className="flex cursor-pointer items-center rounded-lg px-2 py-2 text-sm text-white hover:bg-white/10 aria-selected:bg-white/10 aria-selected:text-blue-400 transition-colors"
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                <span>Add Event to Calendar</span>
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => console.log('Action: Generate Report'))}
                className="flex cursor-pointer items-center rounded-lg px-2 py-2 text-sm text-white hover:bg-white/10 aria-selected:bg-white/10 aria-selected:text-blue-400 transition-colors"
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>Generate Weekly Report</span>
              </Command.Item>
            </Command.Group>
            
            <div className="h-px bg-white/5 my-1 mx-2" />

            <Command.Group heading="Navigation" className="px-2 text-xs font-medium text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold">
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/coach/athletes'))}
                className="flex cursor-pointer items-center rounded-lg px-2 py-2 text-sm text-white hover:bg-white/10 aria-selected:bg-white/10 aria-selected:text-blue-400 transition-colors"
              >
                <Users className="mr-2 h-4 w-4" />
                <span>My Roster</span>
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/coach/analytics'))}
                className="flex cursor-pointer items-center rounded-lg px-2 py-2 text-sm text-white hover:bg-white/10 aria-selected:bg-white/10 aria-selected:text-blue-400 transition-colors"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                <span>Analytics Center</span>
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/coach/training/board'))}
                className="flex cursor-pointer items-center rounded-lg px-2 py-2 text-sm text-white hover:bg-white/10 aria-selected:bg-white/10 aria-selected:text-blue-400 transition-colors"
              >
                <Target className="mr-2 h-4 w-4" />
                <span>Training Board</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
