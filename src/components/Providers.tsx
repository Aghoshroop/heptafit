"use client";

import { AuthProvider } from "@/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";

import { ThemeProvider } from "next-themes";

import { usePathname } from "next/navigation";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();

  // Force dark theme on all pages EXCEPT dashboards
  const isDashboard = pathname?.startsWith('/coach') || pathname?.startsWith('/athlete') || pathname?.startsWith('/student');
  const forcedTheme = isDashboard ? undefined : "dark";

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange forcedTheme={forcedTheme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors theme="system" />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
