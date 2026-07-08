"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, onSnapshot, addDoc, serverTimestamp, getDocs, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { FileCheck, MessageSquare, Trash2, Edit3, Send } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function CoachReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [athletes, setAthletes] = useState<any[]>([]);

  const [selectedAthleteId, setSelectedAthleteId] = useState("");
  const [reviewType, setReviewType] = useState("Weekly Report");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!user) return;
    
    const q = query(collection(db, "coach_reviews"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    const fetchAthletes = async () => {
      const usersSnap = await getDocs(collection(db, "athletes"));
      setAthletes(usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
    fetchAthletes();

    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAthleteId || !content) return;
    
    const athlete = athletes.find(a => a.id === selectedAthleteId);

    try {
      if (!user) {
        throw new Error("User not found");
      }

      await addDoc(collection(db, "coach_reviews"), {
        athleteId: selectedAthleteId,
        athleteName: `${athlete?.firstName} ${athlete?.lastName}`,
        type: reviewType,
        content,
        authorId: user.uid,
        createdAt: serverTimestamp()
      });
      
      // Notify athlete
      await addDoc(collection(db, "notifications"), {
        userId: selectedAthleteId,
        title: `New ${reviewType}`,
        message: "Your coach has published a new review for you.",
        isRead: false,
        createdAt: serverTimestamp()
      });

      toast.success("Review published");
      setContent("");
    } catch (err) {
      toast.error("Failed to publish review");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    try {
      await deleteDoc(doc(db, "coach_reviews", id));
      toast.success("Review deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  if (loading) return <Skeleton className="w-full h-[600px] rounded-xl" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Coach Reviews</h1>
        <p className="text-muted-foreground mt-1">Publish daily, weekly, and competition reports for your athletes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Composer */}
        <Card glass className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Write Review</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Athlete</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={selectedAthleteId}
                  onChange={e => setSelectedAthleteId(e.target.value)}
                  required
                >
                  <option value="">-- Choose Athlete --</option>
                  {athletes.map(a => (
                    <option key={a.id} value={a.id}>{a.firstName} {a.lastName}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={reviewType}
                  onChange={e => setReviewType(e.target.value)}
                >
                  <option>Daily Feedback</option>
                  <option>Weekly Report</option>
                  <option>Monthly Report</option>
                  <option>Competition Analysis</option>
                  <option>Technical Observation</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Detailed Review</label>
                <textarea 
                  className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Provide constructive feedback..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                <Send size={16} className="mr-2" /> Publish Report
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* History */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2"><FileCheck size={18} className="text-primary"/> Published Reports</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reviews.map(review => (
              <Card key={review.id} glass className="flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{review.athleteName}</CardTitle>
                      <CardDescription className="text-xs font-semibold text-primary mt-1 uppercase tracking-wider">{review.type}</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(review.id)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm whitespace-pre-wrap text-muted-foreground">{review.content}</p>
                </CardContent>
                <div className="px-6 py-3 bg-muted/20 border-t text-xs text-muted-foreground">
                  {review.createdAt?.toDate ? format(review.createdAt.toDate(), "PPP p") : "Just now"}
                </div>
              </Card>
            ))}
            {reviews.length === 0 && (
              <div className="col-span-1 sm:col-span-2 text-center p-12 border-2 border-dashed rounded-xl text-muted-foreground">
                No reviews published yet.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
