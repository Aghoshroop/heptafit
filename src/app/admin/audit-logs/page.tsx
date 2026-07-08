"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ShieldAlert, Key, Trash2, Edit, Database } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Mock Data
const logs = [
  { id: "AL-592", time: "2026-07-08 10:15:22", admin: "aviroopghosh283@gmail.com", action: "UPDATE_FEATURE_FLAG", target: "gps_sync", result: "Success", ip: "192.168.1.1", icon: Edit },
  { id: "AL-591", time: "2026-07-08 09:42:11", admin: "aviroopghosh283@gmail.com", action: "DELETE_ORGANIZATION", target: "ORG-003", result: "Success", ip: "192.168.1.1", icon: Trash2 },
  { id: "AL-590", time: "2026-07-08 09:30:00", admin: "aviroopghosh283@gmail.com", action: "ADMIN_LOGIN", target: "System", result: "Success", ip: "192.168.1.1", icon: Key },
  { id: "AL-589", time: "2026-07-07 18:22:15", admin: "unknown@evil.com", action: "ADMIN_LOGIN", target: "System", result: "Failure (403)", ip: "45.33.22.11", icon: ShieldAlert },
  { id: "AL-588", time: "2026-07-07 14:10:05", admin: "aviroopghosh283@gmail.com", action: "CLEAR_CACHE", target: "Redis", result: "Success", ip: "192.168.1.1", icon: Database },
];

export default function AdminAuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Audit Logs</h1>
          <p className="text-muted-foreground mt-1">Security and compliance records for all admin actions.</p>
        </div>
      </div>

      <div className="bg-card/50 backdrop-blur-md border border-border rounded-2xl overflow-hidden flex flex-col shadow-lg shadow-black/5">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text"
              placeholder="Search actions or IP..." 
              className="w-full bg-secondary/50 border border-border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="w-full sm:w-auto gap-2">
            <Filter size={16} />
            Filter Logs
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-secondary/30 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">Timestamp</th>
                <th className="px-6 py-4 font-medium">Admin</th>
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium">Target</th>
                <th className="px-6 py-4 font-medium">IP Address</th>
                <th className="px-6 py-4 font-medium">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.map((log, index) => (
                <motion.tr 
                  key={log.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-secondary/20 transition-colors"
                >
                  <td className="px-6 py-4 text-muted-foreground">
                    {log.time}
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">
                    {log.admin}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <log.icon size={14} className="text-muted-foreground" />
                      <span className="font-mono text-xs font-bold text-foreground bg-secondary px-2 py-1 rounded-md">
                        {log.action}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground">
                    {log.target}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground font-mono text-xs">
                    {log.ip}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      log.result.includes('Success') 
                        ? 'bg-emerald-500/10 text-emerald-500' 
                        : 'bg-red-500/10 text-red-500'
                    }`}>
                      {log.result}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
