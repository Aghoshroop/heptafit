import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog | Heptafit",
  description: "Track the evolution of the Heptafit platform. See all new features, improvements, and bug fixes.",
};

export default function ChangelogPage() {
  const releases = [
    {
      version: "v2.1.0",
      date: "October 20, 2024",
      title: "AI Coach Enhancements & Expanded Webhooks",
      changes: [
        { type: "Feature", text: "The AI Coach now correlates sleep debt with acute workload spikes to refine injury risk predictions." },
        { type: "Improvement", text: "Dashboard loads 40% faster for academies with >500 athletes." },
        { type: "Fix", text: "Resolved an issue where RPE sliders occasionally reset on Android devices." }
      ]
    },
    {
      version: "v2.0.0",
      date: "September 1, 2024",
      title: "The Heptafit V2 Launch",
      changes: [
        { type: "Feature", text: "Complete redesign of the Coach Dashboard featuring a new dark mode UI and glassmorphism elements." },
        { type: "Feature", text: "Introduced the Medical Bay for physiotherapists to track rehab protocols." },
        { type: "Feature", text: "Added the global Super Admin Control Center." }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="pt-24 pb-16 px-4 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Changelog</h1>
        <p className="text-xl text-muted-foreground">
          New updates and improvements to Heptafit.
        </p>
      </header>

      <main className="px-4 max-w-3xl mx-auto pb-24">
        <div className="space-y-16 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {releases.map((release, idx) => (
            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-primary bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 text-primary">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card border border-border p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">{release.title}</h3>
                  <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-1 rounded-md">{release.version}</span>
                </div>
                <time className="block text-sm text-primary mb-4 font-medium">{release.date}</time>
                <ul className="space-y-3">
                  {release.changes.map((change, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex gap-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider h-fit shrink-0 ${
                        change.type === 'Feature' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                        change.type === 'Improvement' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                        'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                        {change.type}
                      </span>
                      <span className="leading-relaxed">{change.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
