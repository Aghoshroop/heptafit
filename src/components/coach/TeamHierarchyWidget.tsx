"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Shield, ChevronRight } from "lucide-react";
import Link from "next/link";
import { StatusChip } from "@/components/ui/StatusChip";

export function TeamHierarchyWidget() {
  const { user, userData } = useAuth();
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    // Simplistic version: Just fetch relationships to get count and maybe a few names
    const relQuery = query(collection(db, "staffRelationships"), where("organizationId", "==", userData?.organizationId || ""));
    const unsubscribe = onSnapshot(relQuery, (snapshot) => {
      const activeRelationships = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((rel: any) => rel.status === "active");
        
      setStaff(activeRelationships);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <Card glass className="border-white/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield size={16} className="text-blue-500" /> My Staff
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card glass className="border-white/5 overflow-hidden">
      <CardHeader className="pb-2 flex flex-row items-center justify-between border-b border-white/5">
        <CardTitle className="text-sm flex items-center gap-2">
          <Shield size={16} className="text-blue-500" /> Team Staff
        </CardTitle>
        <Link href="/coach/team" className="text-xs text-blue-400 hover:text-blue-300 flex items-center transition-colors">
          Manage <ChevronRight size={14} />
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {staff.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">No staff members yet.</p>
            <Link href="/coach/team" className="text-xs font-bold text-blue-500 hover:text-blue-400">
              Invite your team +
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {staff.slice(0, 3).map((member) => (
              <div key={member.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                    <Shield size={12} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-bold capitalize">{member.staffRole.replace("_", " ")}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">{member.targetType}</p>
                  </div>
                </div>
                <StatusChip status={member.status === "active" ? "active" : "neutral"}>{member.status || "Unknown"}</StatusChip>
              </div>
            ))}
            {staff.length > 3 && (
              <div className="p-2 text-center border-t border-white/5 bg-white/5">
                <Link href="/coach/team" className="text-xs text-muted-foreground hover:text-foreground">
                  View all {staff.length} staff members
                </Link>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
