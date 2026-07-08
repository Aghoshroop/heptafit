"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, orderBy, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { FileCheck, MessageSquare, Star, Clock } from "lucide-react";
import { format } from "date-fns";

export default function StudentReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [coaches, setCoaches] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) return;
    
    // Fetch Coach Names
    const fetchCoaches = async () => {
      const usersSnap = await getDocs(collection(db, "coaches"));
      const map: Record<string, string> = {};
      usersSnap.docs.forEach(d => {
        map[d.id] = `Coach ${d.data().lastName || ""}`;
      });
      setCoaches(map);
    };
    fetchCoaches();

    const q = query(
      collection(db, "coach_reviews"),
      where("athleteId", "==", user.uid)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a: any, b: any) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });
      setReviews(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) return <Skeleton className="w-full h-[600px] rounded-xl" />;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Coach Reviews</h1>
        <p className="text-muted-foreground mt-1">Read your latest feedback, analysis, and reports.</p>
      </div>

      <div className="space-y-6 mt-8">
        {reviews.length === 0 ? (
          <div className="text-center p-12 border-2 border-dashed rounded-xl text-muted-foreground bg-card">
            <Star size={48} className="mx-auto mb-4 opacity-50" />
            <p>You have no coach reviews yet.</p>
          </div>
        ) : (
          <div className="relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:ml-[120px] md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {reviews.map(review => (
              <div key={review.id} className="relative flex items-center justify-between md:justify-normal group is-active mb-8">
                
                {/* Date for Desktop */}
                <div className="hidden md:block w-[100px] text-right text-xs text-muted-foreground shrink-0 pr-6 pt-2 font-medium">
                  {review.createdAt?.toDate ? format(review.createdAt.toDate(), "MMM dd") : "Today"}
                </div>
                
                {/* Icon */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary/20 text-primary shadow shrink-0 z-10 md:mr-6">
                  <FileCheck size={16} />
                </div>
                
                {/* Content */}
                <Card glass className="w-[calc(100%-4rem)] md:w-[calc(100%-120px-2.5rem)] shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardDescription className="text-xs font-bold text-primary uppercase tracking-wider">{review.type}</CardDescription>
                        <CardTitle className="text-base mt-1">From {coaches[review.authorId] || "Coach"}</CardTitle>
                      </div>
                      <div className="md:hidden text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        {review.createdAt?.toDate ? format(review.createdAt.toDate(), "MMM dd") : "Today"}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap text-muted-foreground leading-relaxed">{review.content}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
