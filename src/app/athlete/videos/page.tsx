"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, orderBy, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/FileUpload";
import { Skeleton } from "@/components/ui/Skeleton";
import { Trash2, Video, Play, MessageSquare, Star } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function StudentVideosPage() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "videos"),
      where("athleteId", "==", user.uid)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a: any, b: any) => {
        const timeA = a.uploadedAt?.toMillis ? a.uploadedAt.toMillis() : 0;
        const timeB = b.uploadedAt?.toMillis ? b.uploadedAt.toMillis() : 0;
        return timeB - timeA;
      });
      setVideos(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const handleUpload = async (url: string, name: string, type: string) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "videos"), {
        athleteId: user.uid,
        url,
        title: name,
        category: "Training",
        isImportant: false,
        uploadedAt: serverTimestamp()
      });
      toast.success("Video uploaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save video metadata");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this video?")) return;
    try {
      await deleteDoc(doc(db, "videos", id));
      if (activeVideo?.id === id) setActiveVideo(null);
      toast.success("Video deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete video");
    }
  };

  if (loading) return <Skeleton className="w-full h-[600px] rounded-xl" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Video Analysis</h1>
        <p className="text-muted-foreground mt-1">Upload training clips for coach feedback.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload & List */}
        <div className="lg:col-span-1 space-y-6">
          <Card glass>
            <CardHeader>
              <CardTitle>Upload Video</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload 
                onUploadComplete={handleUpload} 
                accept="video/*" 
                maxSizeMB={100} 
              />
            </CardContent>
          </Card>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 no-scrollbar">
            {videos.map(video => (
              <div 
                key={video.id} 
                onClick={() => setActiveVideo(video)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${activeVideo?.id === video.id ? 'bg-primary/10 border-primary shadow-md' : 'bg-card hover:bg-accent'}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3 items-center">
                    <div className={`p-2 rounded-lg ${video.isImportant ? 'bg-amber-500/20 text-amber-500' : 'bg-muted text-muted-foreground'}`}>
                      {video.isImportant ? <Star size={16} className="fill-amber-500" /> : <Video size={16} />}
                    </div>
                    <div>
                      <p className="font-medium text-sm line-clamp-1">{video.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {video.uploadedAt?.toDate ? format(video.uploadedAt.toDate(), "MMM dd") : "Just now"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {videos.length === 0 && (
              <div className="text-center p-8 border-2 border-dashed rounded-xl text-muted-foreground text-sm">
                No videos uploaded yet.
              </div>
            )}
          </div>
        </div>

        {/* Player & Comments */}
        <div className="lg:col-span-2">
          {activeVideo ? (
            <Card glass className="overflow-hidden">
              <div className="aspect-video bg-black relative">
                <video 
                  src={activeVideo.url} 
                  controls 
                  className="w-full h-full object-contain"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{activeVideo.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Uploaded on {activeVideo.uploadedAt?.toDate ? format(activeVideo.uploadedAt.toDate(), "PPP") : "Just now"}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(activeVideo.id)}>
                    <Trash2 size={18} />
                  </Button>
                </div>

                <div className="mt-8 border-t pt-6">
                  <h4 className="font-semibold flex items-center gap-2 mb-4">
                    <MessageSquare size={18} /> Coach Feedback
                  </h4>
                  <div className="text-center p-8 bg-muted/30 rounded-xl text-muted-foreground text-sm">
                    Comments will appear here once your coach reviews the video.
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-[400px] border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-muted-foreground bg-accent/20">
              <Play size={48} className="mb-4 opacity-50" />
              <p>Select a video to view analysis</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
