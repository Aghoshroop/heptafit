"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Tag, Copy, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Mock Data
const coupons = [
  { id: "1", code: "SUMMER2025", type: "Percentage", value: "20%", limit: 100, used: 45, revenue: 3500, expiry: "2025-08-31", status: "Active" },
  { id: "2", code: "WELCOME50", type: "Flat", value: "$50", limit: null, used: 210, revenue: 10500, expiry: "Never", status: "Active" },
  { id: "3", code: "BETA_TESTERS", type: "Percentage", value: "100%", limit: 50, used: 50, revenue: 0, expiry: "2024-12-31", status: "Expired" },
];

export default function AdminCouponsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Coupons & Promotions</h1>
          <p className="text-muted-foreground mt-1">Manage discount codes and promotional campaigns.</p>
        </div>
        <Button variant="primary" className="gap-2 self-start md:self-auto">
          <Plus size={16} />
          Create Coupon
        </Button>
      </div>

      <div className="bg-card/50 backdrop-blur-md border border-border rounded-2xl overflow-hidden flex flex-col shadow-lg shadow-black/5">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text"
              placeholder="Search coupons..." 
              className="w-full bg-secondary/50 border border-border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-secondary/30 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">Code</th>
                <th className="px-6 py-4 font-medium">Value</th>
                <th className="px-6 py-4 font-medium">Usage</th>
                <th className="px-6 py-4 font-medium">Generated Rev.</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Expiry</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {coupons.map((coupon, index) => (
                <motion.tr 
                  key={coupon.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-secondary/20 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Tag size={16} className="text-muted-foreground" />
                      <span className="font-mono font-bold text-foreground bg-secondary px-2 py-1 rounded-md">{coupon.code}</span>
                      <button className="text-muted-foreground hover:text-primary transition-colors">
                        <Copy size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-emerald-500">{coupon.value}</p>
                    <p className="text-xs text-muted-foreground">{coupon.type} Discount</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full max-w-[100px] h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: coupon.limit ? `${(coupon.used / coupon.limit) * 100}%` : '100%' }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {coupon.used} / {coupon.limit || '∞'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">
                    ${coupon.revenue}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      coupon.status === 'Active' 
                        ? 'bg-emerald-500/10 text-emerald-500' 
                        : 'bg-secondary text-muted-foreground'
                    }`}>
                      {coupon.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {coupon.expiry}
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
      </div>
    </div>
  );
}
