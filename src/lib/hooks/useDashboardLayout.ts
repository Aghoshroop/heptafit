import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export type WidgetId = "operational_briefing" | "smart_kpis" | "attention_center" | "competition_countdown" | "today_schedule" | "team_heatmap" | "athlete_roster" | "workload_intelligence";

export interface WidgetConfig {
  id: WidgetId;
  visible: boolean;
  colSpan?: 12 | 8 | 6 | 4 | 3;
}

export interface DashboardLayout {
  top: WidgetConfig[];
  left: WidgetConfig[];
  center: WidgetConfig[];
  right: WidgetConfig[];
}

const defaultLayout: DashboardLayout = {
  top: [
    { id: "operational_briefing", visible: true, colSpan: 4 },
    { id: "smart_kpis", visible: true, colSpan: 8 }
  ],
  left: [
    { id: "attention_center", visible: true },
    { id: "competition_countdown", visible: true },
    { id: "today_schedule", visible: true }
  ],
  center: [
    { id: "team_heatmap", visible: true },
    { id: "athlete_roster", visible: true }
  ],
  right: [
    { id: "workload_intelligence", visible: true }
  ]
};

export function useDashboardLayout() {
  const { user } = useAuth();
  const [layout, setLayout] = useState<DashboardLayout>(defaultLayout);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchLayout = async () => {
      try {
        const docRef = doc(db, "users", user.uid, "preferences", "dashboardLayout");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLayout(docSnap.data() as DashboardLayout);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard layout", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLayout();
  }, [user]);

  const saveLayout = async (newLayout: DashboardLayout) => {
    if (!user) return;
    setLayout(newLayout);
    try {
      const docRef = doc(db, "users", user.uid, "preferences", "dashboardLayout");
      await setDoc(docRef, newLayout, { merge: true });
    } catch (err) {
      console.error("Failed to save dashboard layout", err);
    }
  };

  return { layout, saveLayout, isEditMode, setIsEditMode, loading };
}
