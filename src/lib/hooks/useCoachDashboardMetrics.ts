import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRealtimeData } from "./useRealtimeData";
import { where } from "firebase/firestore";
import { getAthleteStatus, getAthleteReadiness } from "../utils/athleteStatus";
import { subDays, format } from "date-fns";

export function useCoachData() {
  const { userData, user } = useAuth();
  const orgId = userData?.organizationId || "";
  const coachId = user?.uid || "";
  
  const isReady = !!orgId && !!coachId;

  const isHeadCoach = userData?.accountType === "head_coach";

  const { data: relationships, loading: relLoading } = useRealtimeData("coachAthleteRelationships", [
    where("coachId", "==", coachId)
  ], isReady);
  
  const { data: athletesRaw, loading: athletesLoading } = useRealtimeData("users", [
    where("organizationId", "==", orgId)
  ], isReady);

  const athleteIds = useMemo(() => relationships.map((r: any) => r.studentId), [relationships]);
  const athletes = useMemo(() => athletesRaw.filter((a: any) => {
    if (a.accountType !== "athlete" && a.role !== "student") return false;
    if (isHeadCoach) return true;
    return athleteIds.includes(a.uid || a.id) || a.headCoachId === coachId;
  }), [athletesRaw, athleteIds, isHeadCoach, coachId]);

  const { data: insights, loading: insightsLoading } = useRealtimeData("insights", [
    where("organizationId", "==", orgId)
  ], isReady);

  const thirtyDaysAgo = useMemo(() => format(subDays(new Date(), 30), 'yyyy-MM-dd'), []);
  const { data: wellness, loading: wellnessLoading } = useRealtimeData("wellness", [
    where("organizationId", "==", orgId),
    where("date", ">=", thirtyDaysAgo)
  ], isReady);

  const sixtyDaysAgo = useMemo(() => format(subDays(new Date(), 60), 'yyyy-MM-dd'), []);
  const { data: schedules, loading: schedulesLoading } = useRealtimeData("schedules", [
    where("organizationId", "==", orgId),
    where("date", ">=", sixtyDaysAgo)
  ], isReady);

  const { data: trainingPlans, loading: plansLoading } = useRealtimeData("training_plans", [
    where("organizationId", "==", orgId),
    where("coachId", "==", coachId)
  ], isReady);

  const { data: groups, loading: groupsLoading } = useRealtimeData("groups", [
    where("organizationId", "==", orgId)
  ], isReady);

  const loading = !isReady || relLoading || athletesLoading || insightsLoading || wellnessLoading || schedulesLoading || plansLoading || groupsLoading;

  return {
    athletes,
    athleteIds,
    insights,
    wellness,
    schedules,
    trainingPlans,
    groups,
    loading,
    orgId,
    coachId
  };
}

export function useCoachDashboardMetrics() {
  const { athletes, insights, wellness, schedules, trainingPlans, loading } = useCoachData();

  const metrics = useMemo(() => {
    // 1. Total Athletes
    const totalAthletes = athletes.length;

    // 2. Active Plans
    const activePlansCount = trainingPlans.length;

    // 3. Sessions This Week
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const sessionsThisWeek = schedules.filter((s: any) => {
      const d = new Date(s.date);
      return d >= oneWeekAgo && d <= now;
    }).length;

    // 4. Injury Concerns
    const injuryConcerns = insights.filter((i: any) => i.type === "Injury" && i.status === "active").length;

    // 5. Training Load Trend (Completed Sessions this month vs last month)
    const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthStr = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`;
    
    let currentMonthLoad = 0;
    let lastMonthLoad = 0;
    
    schedules.forEach((s: any) => {
      if (s.isCompleted && s.date && s.duration) {
        if (s.date.startsWith(currentMonthStr)) {
          currentMonthLoad += (Number(s.duration) || 0);
        } else if (s.date.startsWith(lastMonthStr)) {
          lastMonthLoad += (Number(s.duration) || 0);
        }
      }
    });

    let loadTrend = 0;
    let loadTrendText = "vs last month";
    if (lastMonthLoad > 0) {
      loadTrend = ((currentMonthLoad - lastMonthLoad) / lastMonthLoad) * 100;
    } else if (currentMonthLoad > 0) {
      loadTrend = 100; // 100% increase if last month was 0
    }

    const formattedTrend = loadTrend > 0 ? `+${loadTrend.toFixed(1)}%` : `${loadTrend.toFixed(1)}%`;

    return {
      totalAthletes,
      activePlansCount,
      sessionsThisWeek,
      injuryConcerns,
      loadTrend: formattedTrend,
      loadTrendValue: loadTrend
    };
  }, [athletes, insights, schedules, trainingPlans]);

  return { metrics, loading };
}

export function useCoachAthletesWithMetrics() {
  const { athletes, insights, wellness, schedules, loading } = useCoachData();

  const enrichedAthletes = useMemo(() => {
    return athletes.map((athlete: any) => {
      const uId = athlete.uid || athlete.id;
      const status = getAthleteStatus(uId, wellness, insights, schedules);
      const readiness = getAthleteReadiness(uId, wellness);
      
      // Calculate last active from schedules (latest completed)
      const athleteSchedules = schedules
        .filter((s: any) => (s.athleteId === uId || s.athleteId === athlete.id) && s.isCompleted)
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
      const lastActive = athleteSchedules.length > 0 ? (athleteSchedules[0] as any).date : "Never";

      return {
        ...athlete,
        uid: uId, // Make sure uid is explicitly set for components using it as key
        status,
        readiness,
        lastActive
      };
    });
  }, [athletes, insights, wellness, schedules]);

  return { athletes: enrichedAthletes, loading };
}

export function useAthleteWorkspaceMetrics(athleteId: string) {
  const { userData } = useAuth();
  const orgId = userData?.organizationId || "";

  const { data: insights } = useRealtimeData("insights", [
    where("organizationId", "==", orgId),
    where("athleteId", "==", athleteId),
    where("status", "==", "active")
  ]);

  const { data: wellness } = useRealtimeData("wellness", [
    where("organizationId", "==", orgId),
    where("athleteId", "==", athleteId)
  ]);

  const { data: schedules } = useRealtimeData("schedules", [
    where("organizationId", "==", orgId),
    where("athleteId", "==", athleteId)
  ]);

  const status = useMemo(() => {
    return getAthleteStatus(athleteId, wellness, insights, schedules);
  }, [athleteId, wellness, insights, schedules]);

  const readiness = useMemo(() => {
    return getAthleteReadiness(athleteId, wellness);
  }, [athleteId, wellness]);

  return { status, readiness, insights, wellness, schedules };
}
