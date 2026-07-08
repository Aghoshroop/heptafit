"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ShieldCheck, Database, Lock, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // Reactive redirect based on AuthContext state
  useEffect(() => {
    if (user && !authLoading) {
      if (!userData) {
        // User authenticated but no profile doc -> needs onboarding
        router.push("/get-started");
      } else {
        // Route to the correct dashboard based on role
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
            router.push("/athlete"); // Fallback
        }
      }
    }
  }, [user, userData, authLoading, router]);

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      // The authentication state change will trigger AuthContext
      // which will then trigger the useEffect above for redirection.
      await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (err: any) {
      console.error(err);
      setIsSubmitting(false); // Only reset on error. Success triggers redirect.
      
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Invalid email or password. Please try again.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later or reset your password.");
      } else {
        setError("A network error occurred. Please check your connection.");
      }
    }
  };

  const isCheckingAuth = (user && authLoading) || isSubmitting || (user && !authLoading && userData);

  if (isCheckingAuth) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12"
      >
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.5)] z-10 relative">
            <span className="text-white font-black text-2xl">H</span>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-2 rounded-[1.2rem] border-2 border-primary/30 border-t-primary z-0"
          />
        </div>
        <motion.p 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="mt-8 font-medium text-foreground tracking-wide"
        >
          Preparing your workspace...
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full"
    >
      <div className="mb-10 lg:hidden flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-sm">H</span>
        </div>
        <span className="font-bold text-xl tracking-tight text-foreground">Heptafit</span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Welcome back to Heptafit</h1>
      <p className="text-muted-foreground text-sm md:text-base mb-8">
        Sign in to continue managing performance, training and athlete development.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/80" htmlFor="email">Work Email</label>
          <Input
            id="email"
            type="email"
            placeholder="coach@academy.com"
            {...register("email")}
            className={`h-12 bg-background/50 backdrop-blur-sm border-border/60 focus:border-primary focus:ring-primary/20 transition-all ${errors.email ? "border-destructive focus:border-destructive focus:ring-destructive/20" : ""}`}
          />
          <AnimatePresence>
            {errors.email && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-xs text-destructive mt-1">
                {errors.email.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-foreground/80" htmlFor="password">Password</label>
            <Link href="/forgot-password" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className={`h-12 bg-background/50 backdrop-blur-sm border-border/60 focus:border-primary focus:ring-primary/20 transition-all pr-10 ${errors.password ? "border-destructive focus:border-destructive focus:ring-destructive/20" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <AnimatePresence>
            {errors.password && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-xs text-destructive mt-1">
                {errors.password.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl flex items-start gap-3"
            >
              <Lock size={18} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold mb-1">Authentication Failed</p>
                <p className="opacity-90 leading-relaxed">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Button type="submit" variant="primary" className="w-full h-12 text-base font-bold shadow-[0_0_20px_-5px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.6)] transition-all mt-4">
          Sign In
        </Button>
      </form>

      <div className="mt-8 flex flex-col items-center">
        <div className="w-full h-px bg-border/50 relative mb-8">
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            New to Heptafit?
          </span>
        </div>
        
        <Link href="/get-started" className="w-full">
          <Button variant="outline" className="w-full h-12 text-sm font-bold border-border hover:bg-secondary/50">
            Start Free
          </Button>
        </Link>
      </div>

      {/* Trust Badges */}
      <div className="mt-12 flex justify-center gap-6 opacity-60">
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <ShieldCheck size={14} /> Secure
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Database size={14} /> Encrypted
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Users size={14} /> Role-Based
        </div>
      </div>
    </motion.div>
  );
}
