import { CinematicShowcase } from "@/components/auth/CinematicShowcase";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background font-sans text-foreground">
      {/* Left side - Cinematic Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative border-r border-border/50">
        <CinematicShowcase />
      </div>

      {/* Right side - Forms (Centered on mobile, half screen on desktop) */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        {/* Subtle mobile background */}
        <div className="lg:hidden absolute inset-0 pointer-events-none -z-10">
          <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-primary/10 blur-[100px] rounded-full mix-blend-screen" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[100px] rounded-full mix-blend-screen" />
        </div>
        
        <div className="w-full max-w-md relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
