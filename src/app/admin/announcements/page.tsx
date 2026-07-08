"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Bell, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminAnnouncementsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Announcements</h1>
          <p className="text-muted-foreground mt-1">Broadcast messages to organizations and users.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Announcement Form */}
        <div className="bg-card/50 backdrop-blur-md border border-border rounded-2xl p-6 shadow-lg shadow-black/5">
          <h2 className="text-lg font-bold text-foreground mb-4">Create Announcement</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Title</label>
              <input 
                type="text" 
                placeholder="e.g. Scheduled Maintenance Notice" 
                className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
              <textarea 
                placeholder="Content of your announcement..." 
                className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground h-32 resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Type</label>
                <select className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground">
                  <option>Banner</option>
                  <option>Popup Modal</option>
                  <option>Email</option>
                  <option>Push Notification</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Target Audience</label>
                <select className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground">
                  <option>All Users</option>
                  <option>All Organizations</option>
                  <option>Specific Organizations...</option>
                  <option>All Coaches</option>
                  <option>All Athletes</option>
                </select>
              </div>
            </div>

            <Button variant="primary" className="w-full mt-4 gap-2">
              <Send size={16} /> Broadcast Now
            </Button>
          </div>
        </div>

        {/* History */}
        <div className="bg-card/50 backdrop-blur-md border border-border rounded-2xl p-6 shadow-lg shadow-black/5 flex flex-col h-[600px]">
          <h2 className="text-lg font-bold text-foreground mb-4">Recent Broadcasts</h2>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
            {[
              { title: "Platform V2 Launch", date: "June 1, 2025", type: "Banner", audience: "All Users" },
              { title: "New GPS Integration", date: "May 15, 2025", type: "Email", audience: "Elite Organizations" },
              { title: "Server Maintenance", date: "May 1, 2025", type: "Popup", audience: "All Users" },
            ].map((announcement, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 bg-secondary/30 border border-border rounded-xl"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-foreground">{announcement.title}</h4>
                  <span className="flex items-center gap-1 text-xs text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    <CheckCircle2 size={12} /> Sent
                  </span>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                  <span className="flex items-center gap-1"><Bell size={12} /> {announcement.type}</span>
                  <span>Audience: {announcement.audience}</span>
                  <span>{announcement.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
