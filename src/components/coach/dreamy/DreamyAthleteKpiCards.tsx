"use client";

import { Users, ClipboardList, Calendar, UsersIcon, UserMinus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCoachAthletesWithMetrics, useCoachData } from "@/lib/hooks/useCoachDashboardMetrics";

export function DreamyAthleteKpiCards() {
  const { userData } = useAuth();
  const { athletes } = useCoachAthletesWithMetrics();
  const { groups } = useCoachData();
  const [stats, setStats] = useState({
    invitations: 0,
  });

  useEffect(() => {
    if (!userData?.organizationId) return;
    
    // Fetch pending invitations
    const invitesQ = query(
      collection(db, "coachInvitations"), 
      where("organizationId", "==", userData.organizationId),
      where("coachId", "==", userData.uid),
      where("status", "==", "pending")
    );
    
    const unsub = onSnapshot(invitesQ, (snap) => {
      setStats({ invitations: snap.size });
    }, (error) => {
      console.error("DreamyAthleteKpiCards: Error fetching coachInvitations:", error);
    });

    return () => unsub();
  }, [userData?.organizationId]);

  const activeAthletes = athletes.filter(a => a.status !== 'Unknown').length;
  const inactiveAthletes = athletes.filter(a => a.status === 'Unknown').length;

  const cards = [
    { 
      title: "Total Athletes", 
      value: athletes.length, 
      subtext: "Total registered", 
      icon: Users,
      iconColor: "text-[#8B5CF6]",
      iconBg: "bg-[#8B5CF6]/10",
      subtextColor: "text-muted-foreground"
    },
    { 
      title: "Active Athletes", 
      value: activeAthletes, 
      subtext: "Recently active", 
      icon: ClipboardList,
      iconColor: "text-[#3B82F6]",
      iconBg: "bg-[#3B82F6]/10",
      subtextColor: "text-[#3B82F6]"
    },
    { 
      title: "New Invitations", 
      value: stats.invitations, 
      subtext: "Pending invites", 
      icon: Calendar,
      iconColor: "text-[#10B981]",
      iconBg: "bg-[#10B981]/10",
      subtextColor: "text-muted-foreground"
    },
    { 
      title: "Inactive Athletes", 
      value: inactiveAthletes, 
      subtext: "No activity", 
      icon: UserMinus,
      iconColor: "text-[#F59E0B]",
      iconBg: "bg-[#F59E0B]/10",
      subtextColor: "text-muted-foreground"
    },
    { 
      title: "Total Groups", 
      value: groups.length, 
      subtext: "Training groups", 
      icon: UsersIcon,
      iconColor: "text-[#EF4444]",
      iconBg: "bg-[#EF4444]/10",
      subtextColor: "text-muted-foreground"
    }
  ];

  return (
    <div className="grid grid-cols-5 gap-4">
      {cards.map((card, i) => (
        <div key={i} className="bg-card rounded-xl p-5 border border-border flex items-center gap-4 hover:border-border transition-colors">
          <div className={`w-12 h-12 rounded-full ${card.iconBg} flex items-center justify-center shrink-0`}>
            <card.icon className={card.iconColor} size={24} />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-medium text-muted-foreground truncate">{card.title}</h3>
            <div className="text-2xl font-bold text-foreground mt-0.5">{card.value}</div>
            <p className={`text-[10px] mt-1 truncate ${card.subtextColor}`}>{card.subtext}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
