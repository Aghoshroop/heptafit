"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { CoachAppLayout } from "@/components/layout/CoachAppLayout";

export default function CoachLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["head_coach", "assistant_coach"]}>
      <CoachAppLayout>
        {children}
      </CoachAppLayout>
    </ProtectedRoute>
  );
}
