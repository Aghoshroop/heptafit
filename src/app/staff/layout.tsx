import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["support_staff", "assistant_coach", "administrator"]}>
      <div className="min-h-screen bg-background text-foreground flex relative">
        <div className="ambient-glow bg-emerald-500/10 w-[600px] h-[600px] top-[-200px] left-[-200px]" />
        <main className="flex-1 min-h-screen relative z-10 p-4 lg:p-8 flex items-center justify-center">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
