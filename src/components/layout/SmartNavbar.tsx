"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function SmartNavbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    
    // Update background transparency based on scroll position
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }

    // Hide on scroll down, show on scroll up
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.header 
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" }
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${isScrolled ? "bg-black/60 border-b border-white/10 backdrop-blur-md" : "bg-transparent border-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image priority src="/logo.png" alt="Heptafit Logo" width={82} height={82} className="w-[82px] h-[82px] object-contain animate-shimmer" />
          <span className="font-bold text-xl tracking-tight text-white">Heptafit</span>
        </Link>
        
        <nav className="hidden md:flex gap-8 text-sm font-medium text-white/70">
          <Link href="/#platform" className="hover:text-white transition-colors">Features</Link>
          <Link href="/#solutions" className="hover:text-white transition-colors">Solutions</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:block">
            <Button variant="outline" className="text-xs border-transparent hover:bg-white/10 text-white font-semibold">
              Login
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="primary" className="text-xs gap-2 shadow-[0_0_20px_-5px_rgba(168,85,247,0.8)]">
              Start Free <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
