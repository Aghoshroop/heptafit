"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Shield } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export function MyTeamWidget() {
  const { user } = useAuth();
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const coachRelQuery = query(collection(db, "coachAthleteRelationships"), where("studentId", "==", user.uid));
    const unsubscribeCoachRel = onSnapshot(coachRelQuery, async (snapshot) => {
      if (snapshot.empty) {
        setTeam([]);
        setLoading(false);
        return;
      }
      
      const headCoachUid = snapshot.docs[0].data().coachId;
      
      // Fetch head coach to get organizationId
      const { getDoc, doc } = await import("firebase/firestore");
      const hcDoc = await getDoc(doc(db, "coaches", headCoachUid));
      if (!hcDoc.exists()) {
        setTeam([{ role: "Head Coach", type: "head_coach" }]);
        setLoading(false);
        return;
      }
      
      const organizationId = hcDoc.data().organizationId;
      
      // Fetch staff assigned to this organization
      const staffRelQuery = query(collection(db, "staffRelationships"), where("organizationId", "==", organizationId));
      const unsubscribeStaffRel = onSnapshot(staffRelQuery, (staffSnapshot) => {
        const staffRels = staffSnapshot.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter((rel: any) => rel.status === "active");

        // Ideally we fetch users to get names, but for a simple widget we can display roles
        setTeam([{ role: "Head Coach", type: "head_coach" }, ...staffRels]);
        setLoading(false);
      }, (err) => console.error("unsubscribeStaffRel error:", err));

      return () => unsubscribeStaffRel();
    }, (err) => console.error("unsubscribeCoachRel error:", err));

    return () => unsubscribeCoachRel();
  }, [user]);

  if (loading) {
    return (
      <Card glass className="flex flex-col items-center justify-center min-h-[200px]">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
      </Card>
    );
  }

  if (team.length === 0) {
    return null; // Don't show if not part of a team
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
      <Card glass hoverEffect>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-bold tracking-tight">Support Team</CardTitle>
          <Shield size={18} className="text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {team.slice(0, 4).map((member, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-background/50 border border-white/10 flex items-center justify-center">
                <Shield size={14} className={member.type === "head_coach" ? "text-primary" : "text-muted-foreground"} />
              </div>
              <div>
                <p className="text-sm font-bold capitalize">
                  {member.role ? member.role : member.staffRole?.replace("_", " ")}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                  {member.type === "head_coach" ? "Lead" : "Support Staff"}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
