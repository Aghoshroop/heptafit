import { SocialFeed } from "@/components/SocialFeed";

export default function CoachFeedPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Feed</h1>
        <p className="text-muted-foreground mt-1">Monitor the team and share important updates.</p>
      </div>
      <SocialFeed userRole="coach" />
    </div>
  );
}
