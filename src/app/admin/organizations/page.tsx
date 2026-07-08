"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, MoreVertical, Building2, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

// Mock Data
const organizations = [
  { id: "ORG-001", name: "Elite Athletics Academy", owner: "John Smith", email: "john@eliteathletics.com", plan: "Enterprise", coaches: 12, athletes: 145, status: "Active", renewal: "2026-12-01" },
  { id: "ORG-002", name: "Peak Performance Track", owner: "Sarah Connor", email: "sarah@peaktrack.com", plan: "Professional", coaches: 4, athletes: 45, status: "Active", renewal: "2026-08-15" },
  { id: "ORG-003", name: "City Runners Club", owner: "Mike Johnson", email: "mike@cityrunners.org", plan: "Starter", coaches: 2, athletes: 15, status: "Suspended", renewal: "2026-06-01" },
  { id: "ORG-004", name: "National Training Center", owner: "Elena Rostova", email: "elena@ntc.gov", plan: "Enterprise", coaches: 28, athletes: 310, status: "Active", renewal: "2027-01-01" },
];

export default function AdminOrganizationsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Organizations</h1>
          <p className="text-muted-foreground mt-1">Manage all academies and clubs on the platform.</p>
        </div>
        <Button variant="primary" className="gap-2 self-start md:self-auto">
          <Plus size={16} />
          Add Organization
        </Button>
      </div>

      <div className="bg-card/50 backdrop-blur-md border border-border rounded-2xl overflow-hidden flex flex-col shadow-lg shadow-black/5">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text"
              placeholder="Search organizations..." 
              className="w-full bg-secondary/50 border border-border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="w-full sm:w-auto gap-2">
            <Filter size={16} />
            Filters
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-secondary/30 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">Organization</th>
                <th className="px-6 py-4 font-medium">Owner</th>
                <th className="px-6 py-4 font-medium">Plan</th>
                <th className="px-6 py-4 font-medium">Users</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Renewal</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {organizations.map((org, index) => (
                <motion.tr 
                  key={org.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-secondary/20 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                        <Building2 size={16} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{org.name}</p>
                        <p className="text-xs text-muted-foreground">{org.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-foreground">{org.owner}</p>
                    <p className="text-xs text-muted-foreground">{org.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-purple-500/10 text-purple-500 border border-purple-500/20">
                      {org.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-foreground">{org.coaches} Coaches</p>
                    <p className="text-xs text-muted-foreground">{org.athletes} Athletes</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      org.status === 'Active' 
                        ? 'bg-emerald-500/10 text-emerald-500' 
                        : 'bg-red-500/10 text-red-500'
                    }`}>
                      {org.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {org.renewal}
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
          <p>Showing 1 to 4 of 124 organizations</p>
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
