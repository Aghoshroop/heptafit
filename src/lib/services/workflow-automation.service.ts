import { notificationRepository } from "@/lib/repositories/notification.repository";
import { insightRepository } from "@/lib/repositories/insight.repository";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { IntelligenceInsight } from "@/lib/types";

export class WorkflowAutomationService {

  /**
   * Triggered when an athlete logs wellness
   */
  async onWellnessLogged(athleteId: string, readinessScore: number, organizationId: string, headCoachId: string) {
    if (readinessScore < 40) {
      // 1. Notify Head Coach
      await notificationRepository.create({
        recipientId: headCoachId,
        title: "Critical Readiness Alert",
        message: `Athlete readiness dropped to ${readinessScore}%. Consider a recovery session.`,
        type: "Wellness",
        isRead: false,
        actionUrl: `/coach/athletes/${athleteId}/wellness`,
        organizationId,
        headCoachId,
        athleteId
      }, "SYSTEM", "Workflow Engine");

      // 2. Notify Athlete
      await notificationRepository.create({
        recipientId: athleteId,
        title: "Recovery Recommended",
        message: `Your readiness is low (${readinessScore}%). We suggest prioritizing recovery today.`,
        type: "Wellness",
        isRead: false,
        organizationId,
        headCoachId,
        athleteId
      }, "SYSTEM", "Workflow Engine");

      // 3. Flag Athlete via Intelligence Insight
      await insightRepository.create({
        athleteId,
        type: "Overtraining Risk",
        title: "Acute Fatigue Alert",
        description: `Readiness plummeted to ${readinessScore}%. Immediate action required.`,
        status: "active",
        organizationId,
        headCoachId
      }, "SYSTEM", "Workflow Engine");
    }
  }

  /**
   * Triggered when an injury status changes
   */
  async onInjuryStatusChanged(athleteId: string, injuryId: string, newStatus: string, organizationId: string, headCoachId: string) {
    if (newStatus === "Return To Training" || newStatus === "Return To Competition" || newStatus === "Closed") {
      const athleteSnap = await getDoc(doc(db, "users", athleteId));
      const athleteName = athleteSnap.exists() ? `${athleteSnap.data().firstName} ${athleteSnap.data().lastName}` : "An athlete";

      // Notify Head Coach
      await notificationRepository.create({
        recipientId: headCoachId,
        title: "Injury Cleared",
        message: `${athleteName}'s injury status is now: ${newStatus}.`,
        type: "Injury",
        isRead: false,
        actionUrl: `/coach/athletes/${athleteId}/injuries`,
        organizationId,
        headCoachId,
        athleteId
      }, "SYSTEM", "Workflow Engine");

      // Notify Athlete
      await notificationRepository.create({
        recipientId: athleteId,
        title: "Medical Update",
        message: `Your injury status has been updated to: ${newStatus}.`,
        type: "Injury",
        isRead: false,
        actionUrl: `/athlete/medical`,
        organizationId,
        headCoachId,
        athleteId
      }, "SYSTEM", "Workflow Engine");
    }
  }

  /**
   * Triggered when a new PB is recorded
   */
  async onNewPB(athleteId: string, eventName: string, resultValue: any, organizationId: string, headCoachId: string) {
    const athleteSnap = await getDoc(doc(db, "users", athleteId));
    const athleteName = athleteSnap.exists() ? `${athleteSnap.data().firstName} ${athleteSnap.data().lastName}` : "An athlete";

    // Notify Coach
    await notificationRepository.create({
      recipientId: headCoachId,
      title: "New Personal Best!",
      message: `${athleteName} just hit a PB in ${eventName}!`,
      type: "Performance",
      isRead: false,
      actionUrl: `/coach/athletes/${athleteId}/performance`,
      organizationId,
      headCoachId,
      athleteId
    }, "SYSTEM", "Workflow Engine");

    // Notify Athlete
    await notificationRepository.create({
      recipientId: athleteId,
      title: "Congratulations! 🎉",
      message: `You hit a new PB in ${eventName}!`,
      type: "Performance",
      isRead: false,
      actionUrl: `/athlete/performance`,
      organizationId,
      headCoachId,
      athleteId
    }, "SYSTEM", "Workflow Engine");
  }

}

export const workflowAutomation = new WorkflowAutomationService();
