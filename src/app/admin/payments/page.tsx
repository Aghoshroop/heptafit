"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Download, ArrowUpRight, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Mock Data
const payments = [
  { id: "pi_3MtwBwLkdIwHu7ix28a3tq", org: "Elite Athletics Academy", amount: 299.00, gateway: "Stripe", method: "Visa •••• 4242", status: "Paid", date: "2025-06-15 14:30", invoice: "#INV-2025-001" },
  { id: "pi_4NuxCwMleJwIu8jy39b4ur", org: "Peak Performance Track", amount: 129.00, gateway: "Stripe", method: "Mastercard •••• 8888", status: "Pending", date: "2025-06-14 09:15", invoice: "#INV-2025-002" },
  { id: "pi_5OvyDxNmfKxJv9kz40c5vs", org: "City Runners Club", amount: 49.00, gateway: "PayPal", method: "PayPal Account", status: "Failed", date: "2025-06-13 11:20", invoice: "#INV-2025-003" },
  { id: "pi_6PwzEyOngLyKw0la51d6wt", org: "National Training Center", amount: 299.00, gateway: "Stripe", method: "Amex •••• 1005", status: "Refunded", date: "2025-06-10 16:45", invoice: "#INV-2025-004" },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Paid": return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500"><CheckCircle2 size={14} /> Paid</span>;
    case "Pending": return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500"><Clock size={14} /> Pending</span>;
    case "Failed": return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500"><XCircle size={14} /> Failed</span>;
    case "Refunded": return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-muted-foreground"><ArrowUpRight size={14} /> Refunded</span>;
    default: return null;
  }
};

export default function AdminPaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Payments</h1>
          <p className="text-muted-foreground mt-1">Global transaction history and revenue management.</p>
        </div>
        <Button variant="outline" className="gap-2 self-start md:self-auto">
          <Download size={16} />
          Export CSV
        </Button>
      </div>

      <div className="bg-card/50 backdrop-blur-md border border-border rounded-2xl overflow-hidden flex flex-col shadow-lg shadow-black/5">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text"
              placeholder="Search transaction ID or org..." 
              className="w-full bg-secondary/50 border border-border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            {["All", "Paid", "Pending", "Failed", "Refunded"].map(filter => (
              <button 
                key={filter}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === "All" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-secondary/30 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">Transaction ID</th>
                <th className="px-6 py-4 font-medium">Organization</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Method</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payments.map((payment, index) => (
                <motion.tr 
                  key={payment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-secondary/20 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-mono text-xs text-muted-foreground">{payment.id}</p>
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">
                    {payment.org}
                  </td>
                  <td className="px-6 py-4 font-bold text-foreground">
                    ${payment.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-foreground">{payment.method}</p>
                    <p className="text-xs text-muted-foreground">{payment.gateway}</p>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {payment.date}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a href="#" className="text-primary hover:underline text-sm">{payment.invoice}</a>
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
