"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AccountType } from "@/lib/types";
import { Activity } from "lucide-react";
import { motion } from "framer-motion";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: (AccountType | "super_admin")[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (!userData) {
      // User is authenticated but has no profile document. Needs onboarding.
      if (pathname !== "/get-started") {
        router.push("/get-started");
      }
      return;
    }

    // If allowedRoles is provided, we must strictly verify
    if (allowedRoles && !allowedRoles.includes(userData.accountType as any)) {
      
      // Determine the correct origin for this specific user
      switch (userData.accountType) {
        case "super_admin":
          router.push("/admin");
          break;
        case "head_coach":
        case "assistant_coach":
          router.push("/coach");
          break;
        case "support_staff":
          router.push("/staff");
          break;
        case "athlete":
          router.push("/athlete");
          break;
        default:
          router.push("/athlete"); // safe fallback
      }
    }
  }, [user, userData, loading, router, allowedRoles, pathname]);

  // Block render if loading, not authenticated, missing userData, or wrong role
  if (
    loading || 
    !user || 
    !userData || 
    (allowedRoles && !allowedRoles.includes(userData.accountType as any))
  ) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="p-4 rounded-2xl bg-primary/10 text-primary mb-4"
        >
          <Activity size={40} />
        </motion.div>
        <p className="text-muted-foreground animate-pulse">Loading command center...</p>
      </div>
    );
  }

  return <>{children}</>;
}
