"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, MoreVertical, User, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Mock Data
const users = [
  { id: "USR-001", name: "David Miller", email: "david@eliteathletics.com", role: "head_coach", org: "Elite Athletics", status: "Active", joined: "2025-01-15" },
  { id: "USR-002", name: "Emma Thompson", email: "emma@peaktrack.com", role: "athlete", org: "Peak Performance", status: "Active", joined: "2025-02-20" },
  { id: "USR-003", name: "Robert Chen", email: "robert@cityrunners.org", role: "assistant_coach", org: "City Runners", status: "Disabled", joined: "2025-03-10" },
  { id: "USR-004", name: "Super Admin", email: "aviroopghosh283@gmail.com", role: "super_admin", org: "Platform", status: "Active", joined: "2024-01-01" },
];

const getRoleBadge = (role: string) => {
  switch (role) {
    case "super_admin": return <span className="px-2 py-1 rounded-md text-xs font-medium bg-rose-500/10 text-rose-500 border border-rose-500/20">Super Admin</span>;
    case "head_coach": return <span className="px-2 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">Head Coach</span>;
    case "assistant_coach": return <span className="px-2 py-1 rounded-md text-xs font-medium bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">Assistant</span>;
    case "athlete": return <span className="px-2 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Athlete</span>;
    default: return <span className="px-2 py-1 rounded-md text-xs font-medium bg-secondary text-foreground">{role}</span>;
  }
};

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Users</h1>
          <p className="text-muted-foreground mt-1">Global user management and administration.</p>
        </div>
      </div>

      <div className="bg-card/50 backdrop-blur-md border border-border rounded-2xl overflow-hidden flex flex-col shadow-lg shadow-black/5">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text"
              placeholder="Search users by name, email..." 
              className="w-full bg-secondary/50 border border-border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Filter size={16} />
              Role
            </Button>
            <Button variant="outline" className="gap-2">
              <Filter size={16} />
              Status
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-secondary/30 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Organization</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user, index) => (
                <motion.tr 
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-secondary/20 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                        <User size={14} className="text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 text-foreground">
                    {user.org}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {user.status === 'Active' 
                        ? <CheckCircle2 size={14} className="text-emerald-500" /> 
                        : <XCircle size={14} className="text-red-500" />
                      }
                      <span className={`text-xs font-medium ${user.status === 'Active' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {user.joined}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
          <p>Showing 1 to 4 of 3,450 users</p>
          <div className="flex gap-2">
            <button className="p-2 border border-border rounded-lg hover:bg-secondary transition-colors disabled:opacity-50">
              <ChevronLeft size={16} />
            </button>
            <button className="p-2 border border-border rounded-lg hover:bg-secondary transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
