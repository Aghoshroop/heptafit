import { Metadata } from "next";
import { Code2, Webhook, KeyRound, Blocks } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Heptafit Developer API & SDKs",
  description: "Build custom integrations, sync GPS data, and extend the Heptafit sports performance operating system with our RESTful API and Webhooks.",
};

export default function DevelopersPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="pt-24 pb-16 px-4 max-w-5xl mx-auto text-center border-b border-border/50">
        <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Code2 size={32} />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Heptafit Developers</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Integrate external wearables, export readiness scores to your BI tools, and build custom workflows with the Heptafit API.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="primary">Read the API Docs</Button>
          <Button variant="outline">Get API Keys</Button>
        </div>
      </header>

      <main className="px-4 max-w-5xl mx-auto py-24">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card border border-border p-8 rounded-3xl hover:border-primary/50 transition-colors">
            <Webhook className="text-purple-500 mb-6" size={32} />
            <h2 className="text-xl font-bold mb-3">Real-time Webhooks</h2>
            <p className="text-muted-foreground leading-relaxed">
              Subscribe to events. Get notified instantly when an athlete completes a wellness check, logs a session, or enters the injury danger zone.
            </p>
          </div>

          <div className="bg-card border border-border p-8 rounded-3xl hover:border-primary/50 transition-colors">
            <KeyRound className="text-emerald-500 mb-6" size={32} />
            <h2 className="text-xl font-bold mb-3">Secure Authentication</h2>
            <p className="text-muted-foreground leading-relaxed">
              Authenticate via OAuth 2.0 or secure Bearer tokens. Granular scopes ensure your integrations only access what they need.
            </p>
          </div>

          <div className="bg-card border border-border p-8 rounded-3xl hover:border-primary/50 transition-colors">
            <Blocks className="text-blue-500 mb-6" size={32} />
            <h2 className="text-xl font-bold mb-3">SDKs & Libraries</h2>
            <p className="text-muted-foreground leading-relaxed">
              Official SDKs for Node.js, Python, and Go. Drop-in libraries to get your academy's data pipelines running in minutes.
            </p>
          </div>
        </div>

        <section className="mt-24 bg-secondary/20 border border-border rounded-3xl p-8 md:p-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4">API Reference Preview</h2>
            <p className="text-muted-foreground mb-6">
              Our REST API uses standard HTTP verbs and returns JSON responses. Here's how easy it is to fetch a team's readiness scores:
            </p>
          </div>
          <div className="bg-background border border-border rounded-xl p-4 overflow-x-auto font-mono text-sm mt-8">
            <div className="text-emerald-400 mb-2"># Fetch today's readiness scores for Team A</div>
            <div className="text-foreground">
              curl -X GET "https://api.heptafit.com/v1/readiness?team_id=123" \<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY"
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
