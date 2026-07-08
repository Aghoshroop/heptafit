"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

// The loader component to show while the Spline runtime is downloading and WebGL is compiling
const SplineLoader = () => (
  <div className="w-full h-full min-h-[350px] md:min-h-[600px] flex flex-col items-center justify-center relative">
    <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl" />
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      className="w-16 h-16 rounded-full border border-primary/20 border-t-primary shadow-[0_0_15px_rgba(168,85,247,0.5)] mb-4"
    />
    <motion.p 
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="text-primary/70 font-medium tracking-widest text-sm uppercase"
    >
      Loading OS Core
    </motion.p>
  </div>
);

// Dynamically import the Spline component, turning off SSR because WebGL needs the browser environment
export const HeroSpline = dynamic(() => import("./HeroSplineBase"), {
  ssr: false,
  loading: () => <SplineLoader />,
});
