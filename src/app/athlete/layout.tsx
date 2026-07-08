"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { StudentAppLayout } from "@/components/layout/StudentAppLayout";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["athlete"]}>
      <StudentAppLayout>
        {children}
      </StudentAppLayout>
    </ProtectedRoute>
  );
}
