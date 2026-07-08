"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, orderBy, onSnapshot, addDoc, doc, serverTimestamp, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { Video, Play, MessageSquare, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import Image from "next/image";

export default function CoachVideosPage() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const [athletes, setAthletes] = useState<Record<string, any>>({});
  
  // Custom video player state for timestamp comments
  const videoRef = useRef<HTMLVideoElement>(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    // Fetch athletes for mapping names
    const fetchAthletes = async () => {
      const usersSnap = await getDocs(collection(db, "athletes"));
      const athleteMap: Record<string, any> = {};
      usersSnap.docs.forEach(d => {
        athleteMap[d.id] = d.data();
      });
      setAthletes(athleteMap);
    };
    fetchAthletes();

    const q = query(collection(db, "videos"), orderBy("uploadedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setVideos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch comments when active video changes
  useEffect(() => {
    if (!activeVideo) return;
    const q = query(collection(db, "videos", activeVideo.id, "video_comments"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [activeVideo]);

  const toggleImportant = async (video: any, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateDoc(doc(db, "videos", video.id), {
        isImportant: !video.isImportant
      });
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const addComment = async () => {
    if (!user || !activeVideo || !commentText.trim() || !videoRef.current) return;
    const currentTime = videoRef.current.currentTime;
    
    try {
      await addDoc(collection(db, "videos", activeVideo.id, "video_comments"), {
        timestamp: currentTime,
        text: commentText,
        authorId: user.uid,
        createdAt: serverTimestamp()
      });
      setCommentText("");
      
      // Notify athlete
      await addDoc(collection(db, "notifications"), {
        userId: activeVideo.athleteId,
        title: "New Video Feedback",
        message: `Your coach left a comment on ${activeVideo.title}`,
        isRead: false,
        createdAt: serverTimestamp()
      });
      
    } catch (err) {
      toast.error("Failed to add comment");
    }
  };

  const jumpToTime = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.play();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this video globally?")) return;
    try {
      await deleteDoc(doc(db, "videos", id));
      if (activeVideo?.id === id) setActiveVideo(null);
      toast.success("Video deleted");
    } catch (err) {
      toast.error("Failed to delete video");
    }
  };

  if (loading) return <Skeleton className="w-full h-[600px] rounded-xl" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Video Analysis</h1>
        <p className="text-muted-foreground mt-1">Review athlete footage and provide timestamped feedback.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* List */}
        <div className="lg:col-span-1 space-y-3 max-h-[800px] overflow-y-auto pr-2 no-scrollbar">
          {videos.map(video => {
            const athlete = athletes[video.athleteId];
            return (
              <div 
                key={video.id} 
                onClick={() => setActiveVideo(video)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${activeVideo?.id === video.id ? 'bg-primary/10 border-primary shadow-md' : 'bg-card hover:bg-accent'}`}
              >
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent flex-shrink-0 overflow-hidden border">
                    {athlete?.profileImage ? (
                      <Image src={athlete.profileImage} alt="" width={40} height={40} className="object-cover h-full w-full" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center font-bold text-xs">{athlete?.firstName?.[0]}</div>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-sm line-clamp-1">{video.title}</p>
                      <button onClick={(e) => toggleImportant(video, e)} className="text-muted-foreground hover:text-amber-500 transition-colors">
                        <Star size={14} className={video.isImportant ? "fill-amber-500 text-amber-500" : ""} />
                      </button>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {athlete?.firstName} {athlete?.lastName} • {video.uploadedAt?.toDate ? format(video.uploadedAt.toDate(), "MMM dd") : ""}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          {videos.length === 0 && (
            <div className="text-center p-8 border-2 border-dashed rounded-xl text-muted-foreground text-sm">
              No videos uploaded by athletes yet.
            </div>
          )}
        </div>

        {/* Player & Comments */}
        <div className="lg:col-span-2">
          {activeVideo ? (
            <Card glass className="overflow-hidden flex flex-col h-full max-h-[800px]">
              <div className="aspect-video bg-black relative flex-shrink-0">
                <video 
                  ref={videoRef}
                  src={activeVideo.url} 
                  controls 
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="p-4 border-b flex justify-between items-center bg-card">
                <div>
                  <h3 className="font-bold">{activeVideo.title}</h3>
                  <p className="text-xs text-muted-foreground">{athletes[activeVideo.athleteId]?.firstName} {athletes[activeVideo.athleteId]?.lastName}</p>
                </div>
                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(activeVideo.id)}>
                  <Trash2 size={16} />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
                {comments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">No feedback yet. Add a timestamped comment below.</div>
                ) : (
                  comments.map(comment => (
                    <div key={comment.id} className="flex gap-3 text-sm">
                      <button 
                        onClick={() => jumpToTime(comment.timestamp)}
                        className="h-6 px-2 rounded bg-primary/20 text-primary font-mono text-xs font-medium hover:bg-primary/30 transition-colors flex-shrink-0"
                      >
                        {formatTime(comment.timestamp)}
                      </button>
                      <div className="bg-card border rounded-lg p-3 flex-1 shadow-sm">
                        <p>{comment.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 bg-card border-t mt-auto">
                <div className="flex gap-2">
                  <Input 
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="Add feedback at current timestamp..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') addComment();
                    }}
                  />
                  <Button onClick={addComment} disabled={!commentText.trim()}>Add</Button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">Pause the video to leave a comment at a specific timestamp.</p>
              </div>
            </Card>
          ) : (
            <div className="h-[400px] border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-muted-foreground bg-accent/20">
              <Play size={48} className="mb-4 opacity-50" />
              <p>Select a video to analyze</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
