import { SocialFeed } from "@/components/SocialFeed";

export default function StudentFeedPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Feed</h1>
        <p className="text-muted-foreground mt-1">Stay updated with your teammates and coaches.</p>
      </div>
      <SocialFeed userRole="student" />
    </div>
  );
}
