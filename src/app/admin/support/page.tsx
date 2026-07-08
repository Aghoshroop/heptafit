"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, MessageSquare, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Mock Data
const tickets = [
  { id: "TKT-1042", subject: "Billing issue with annual plan", user: "John Smith", org: "Elite Athletics", priority: "High", status: "Open", date: "2 Hours ago" },
  { id: "TKT-1041", subject: "How to add assistant coaches?", user: "Sarah Connor", org: "Peak Performance", priority: "Low", status: "In Progress", date: "5 Hours ago" },
  { id: "TKT-1040", subject: "Feature request: GPS sync", user: "Mike Johnson", org: "City Runners", priority: "Medium", status: "Closed", date: "1 Day ago" },
];

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "High": return <span className="flex items-center gap-1 text-xs font-medium text-red-500"><AlertCircle size={12} /> High</span>;
    case "Medium": return <span className="flex items-center gap-1 text-xs font-medium text-amber-500"><AlertCircle size={12} /> Medium</span>;
    case "Low": return <span className="flex items-center gap-1 text-xs font-medium text-blue-500"><AlertCircle size={12} /> Low</span>;
    default: return null;
  }
};

export default function AdminSupportPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Support Tickets</h1>
          <p className="text-muted-foreground mt-1">Manage and resolve user queries and issues.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket List */}
        <div className="lg:col-span-1 bg-card/50 backdrop-blur-md border border-border rounded-2xl flex flex-col h-[calc(100vh-12rem)] shadow-lg shadow-black/5">
          <div className="p-4 border-b border-border">
            <div className="relative w-full mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                type="text"
                placeholder="Search tickets..." 
                className="w-full bg-secondary/50 border border-border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="w-full text-xs">All</Button>
              <Button variant="outline" className="w-full text-xs">Open</Button>
              <Button variant="outline" className="w-full text-xs">Closed</Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
            {tickets.map((ticket, i) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                  i === 0 ? "bg-primary/5 border-primary/30" : "bg-transparent border-transparent hover:bg-secondary/50"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
                  {getPriorityBadge(ticket.priority)}
                </div>
                <h4 className="text-sm font-bold text-foreground line-clamp-1">{ticket.subject}</h4>
                <p className="text-xs text-muted-foreground mt-1">{ticket.user} • {ticket.org}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Ticket Detail */}
        <div className="lg:col-span-2 bg-card/50 backdrop-blur-md border border-border rounded-2xl flex flex-col h-[calc(100vh-12rem)] shadow-lg shadow-black/5">
          <div className="p-4 md:p-6 border-b border-border flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">Billing issue with annual plan</h2>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><UserIcon size={14} /> John Smith</span>
                <span className="flex items-center gap-1"><Clock size={14} /> Opened 2 Hours ago</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium">Open</span>
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <CheckCircle2 size={16} /> Close Ticket
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                JS
              </div>
              <div className="flex-1 bg-secondary/30 border border-border rounded-2xl rounded-tl-none p-4">
                <p className="text-sm text-foreground">
                  Hi, I recently upgraded my organization to the Enterprise plan but it seems my card was charged twice. Can someone look into this?
                </p>
                <p className="text-xs text-muted-foreground mt-2">2 Hours ago</p>
              </div>
            </div>
            
            <div className="flex gap-4 flex-row-reverse">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                S
              </div>
              <div className="flex-1 bg-primary/10 border border-primary/20 rounded-2xl rounded-tr-none p-4">
                <p className="text-sm text-foreground">
                  Hello John, I'm looking into your Stripe transactions right now. I'll issue a refund for the duplicate charge immediately.
                </p>
                <p className="text-xs text-primary/60 mt-2">1 Hour ago</p>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-border bg-secondary/10">
            <div className="flex gap-2">
              <textarea 
                className="flex-1 bg-card border border-border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground resize-none h-20"
                placeholder="Type your reply..."
              ></textarea>
              <Button variant="primary" className="h-20 px-6 gap-2">
                <MessageSquare size={16} />
                Reply
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserIcon({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  );
}
