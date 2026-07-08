export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Mini Breadcrumb/Nav for Blog */}
      <nav className="border-b border-border/50 bg-card/50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-2 text-sm text-muted-foreground">
          <a href="/" className="hover:text-primary">Home</a>
          <span>/</span>
          <a href="/resources" className="hover:text-primary">Resources</a>
          <span>/</span>
          <span className="text-foreground">Blog</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {children}
      </div>
    </div>
  );
}
