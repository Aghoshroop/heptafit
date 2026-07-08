"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { collection, query, orderBy, onSnapshot, limit, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ActivityModule } from "@/lib/activityService";
import { Card, CardContent } from "@/components/ui/Card";
import { Heart, Activity, FileText, User, Trophy, Calendar, CheckCircle2, FileVideo } from "lucide-react";

const getIconForType = (module: ActivityModule) => {
  switch (module) {
    case "wellness": return <Heart size={16} className="text-emerald-500" />;
    case "metrics": return <Activity size={16} className="text-blue-500" />;
    case "notes": return <FileText size={16} className="text-amber-500" />;
    case "profile": return <User size={16} className="text-indigo-500" />;
    case "competition": return <Trophy size={16} className="text-purple-500" />;
    case "training": return <Calendar size={16} className="text-orange-500" />;
    case "attendance": return <CheckCircle2 size={16} className="text-emerald-400" />;
    default: return <Activity size={16} className="text-muted-foreground" />;
  }
};

const getBgForType = (module: ActivityModule) => {
  switch (module) {
    case "wellness": return "bg-emerald-500/10 border-emerald-500/20";
    case "metrics": return "bg-blue-500/10 border-blue-500/20";
    case "notes": return "bg-amber-500/10 border-amber-500/20";
    case "profile": return "bg-indigo-500/10 border-indigo-500/20";
    case "competition": return "bg-purple-500/10 border-purple-500/20";
    case "training": return "bg-orange-500/10 border-orange-500/20";
    case "attendance": return "bg-emerald-400/10 border-emerald-400/20";
    default: return "bg-white/5 border-white/10";
  }
};

export default function TimelinePage() {
  const params = useParams();
  const athleteId = params.id as string;
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!athleteId) return;

    const q = query(
      collection(db, "activities"),
      where("athleteId", "==", athleteId),
      orderBy("createdAt", "desc"),
      limit(50)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setActivities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [athleteId]);

  if (loading) {
    return <div className="flex justify-center p-12"><div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Athlete Timeline</h2>
        <p className="text-muted-foreground">A chronological history of all activities and updates.</p>
      </div>

      <div className="relative border-l border-white/10 ml-4 md:ml-6 space-y-8 pb-12">
        {activities.length === 0 ? (
          <div className="pl-8 text-muted-foreground">No activities recorded yet.</div>
        ) : (
          activities.map((activity) => {
            const date = activity.createdAt?.toDate?.() || new Date();
            
            return (
              <div key={activity.id} className="relative pl-8 md:pl-10">
                {/* Timeline Dot/Icon */}
                <div className={`absolute -left-5 md:-left-6 p-2 rounded-full border ${getBgForType(activity.module as ActivityModule)} flex items-center justify-center bg-background z-10`}>
                  {getIconForType(activity.module as ActivityModule)}
                </div>
                
                {/* Content Card */}
                <Card glass className="border-white/5 hover:bg-white/5 transition-colors">
                  <CardContent className="p-4 md:p-5">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="font-bold text-foreground">{activity.title}</h4>
                        {activity.description && <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap bg-white/5 px-2 py-1 rounded-md">
                        {date.toLocaleString(undefined, {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                    </div>

                    {/* Metadata rendering if present */}
                    {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap gap-2">
                        {Object.entries(activity.metadata).map(([key, value]) => (
                          <span key={key} className="inline-flex items-center text-xs bg-background/50 border border-white/5 rounded-md px-2 py-1 text-muted-foreground">
                            <span className="capitalize mr-1 opacity-70">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                            <span className="font-medium text-foreground">{String(value)}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
