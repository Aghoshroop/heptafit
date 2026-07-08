"use client";

export function PremiumFooter() {
  return (
    <footer className="bg-black border-t border-border/10 pt-24 pb-12 text-sm text-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                <span className="text-white font-black text-lg">H</span>
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">Heptafit</span>
            </div>
            <p className="mb-6 max-w-sm leading-relaxed">
              The Operating System for High-Performance Sport. Manage academies, coaches, and athletes seamlessly with enterprise-grade security and AI intelligence.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors">𝕏</a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors">in</a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors">IG</a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Platform</h4>
            <ul className="space-y-4">
              <li><a href="/features/coach" className="hover:text-white transition-colors">Coach Dashboard</a></li>
              <li><a href="/features/athlete" className="hover:text-white transition-colors">Athlete App</a></li>
              <li><a href="/features/ai" className="hover:text-white transition-colors">AI Engine</a></li>
              <li><a href="/features/analytics" className="hover:text-white transition-colors">Analytics</a></li>
              <li><a href="/pricing" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Resources</h4>
            <ul className="space-y-4">
              <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="/research" className="hover:text-white transition-colors">Research Hub</a></li>
              <li><a href="/glossary" className="hover:text-white transition-colors">Glossary</a></li>
              <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="/docs" className="hover:text-white transition-colors">Documentation</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Company</h4>
            <ul className="space-y-4">
              <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="/changelog" className="hover:text-white transition-colors">Changelog</a></li>
              <li><a href="/careers" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Legal</h4>
            <ul className="space-y-4">
              <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="/security" className="hover:text-white transition-colors">Security</a></li>
              <li><a href="/gdpr" className="hover:text-white transition-colors">GDPR</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Heptafit Technologies Inc. All rights reserved.</p>
          <div className="flex gap-4 text-xs font-bold tracking-widest uppercase">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> All Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
