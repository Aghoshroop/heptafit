"use client";

import Spline from "@splinetool/react-spline";
import { motion } from "framer-motion";

export default function HeroSplineBase() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, delay: 0.2, ease: "easeOut" }}
      className="w-full h-full flex items-center justify-center relative bg-transparent overflow-hidden"
    >
      {/* Intense radial glow precisely behind the Spline object */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[60vh] h-[60vh] bg-[radial-gradient(circle,rgba(168,85,247,0.4)_0%,rgba(6,182,212,0.2)_50%,transparent_70%)] blur-[40px] rounded-full mix-blend-screen pointer-events-none"
      />
      
      {/* Faint volumetric light rays emanating from center */}
      <div className="absolute w-[150vw] h-[150vh] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(168,85,247,0.05)_45deg,transparent_90deg,rgba(6,182,212,0.05)_135deg,transparent_180deg,rgba(168,85,247,0.05)_225deg,transparent_270deg,rgba(6,182,212,0.05)_315deg,transparent_360deg)] animate-spin-slow mix-blend-screen pointer-events-none blur-3xl opacity-60" />

      {/* Floating dust particles */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(circle,white,transparent_70%)] opacity-20 pointer-events-none mix-blend-screen" />
      
      {/* Subtle floating animation for the canvas itself to simulate hovering */}
      <motion.div
        animate={{ y: [-15, 15, -15] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="w-full h-full flex items-center justify-center"
      >
        <Spline 
          scene="https://prod.spline.design/xLhnnGLWBzLb2ZQV/scene.splinecode" 
          className="w-full h-full bg-transparent object-cover drop-shadow-[0_0_50px_rgba(6,182,212,0.6)] brightness-110 contrast-125 saturate-150 pointer-events-none"
          style={{ background: 'transparent' }}
        />
      </motion.div>
    </motion.div>
  );
}
