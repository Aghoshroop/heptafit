import { Monitor } from "lucide-react";

export function DeviceRestrictionOverlay() {
  return (
    <div className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center p-8 text-center lg:hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(168,85,247,0.1)_0%,transparent_60%)] pointer-events-none mix-blend-screen" />
      <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-8 relative z-10">
        <Monitor className="text-primary w-10 h-10 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
      </div>
      <h1 className="text-3xl font-black text-white mb-4 tracking-tight drop-shadow-md relative z-10">
        Desktop Only
      </h1>
      <p className="text-lg text-white/70 max-w-md leading-relaxed font-medium relative z-10">
        We aren't ready for mobile or tablet screens yet. Heptafit OS is a high-density command center designed exclusively for desktop experiences.
      </p>
      <p className="mt-8 text-sm font-bold tracking-widest uppercase text-primary/60 relative z-10 animate-pulse">
        Please use a wider screen
      </p>
    </div>
  );
}
