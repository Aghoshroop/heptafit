"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ImageUpload";
import { ImagePlus, MessageSquare, Heart, Share2, MoreHorizontal, Send, Pin, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Loader2, MessageCircle, MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/Skeleton";

export function SocialFeed({ userRole }: { userRole: 'student' | 'coach' }) {
  const { user, userData } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const postsData = await Promise.all(snapshot.docs.map(async (document) => {
        const data = document.data();
        
        // Fetch comments
        // Note: For a production app, we would use a subcollection listener, 
        // but for simplicity in this component we can store an array of comments directly on the post document if small,
        // or just fetch them here. Since we want real-time comments, a subcollection listener is better, but harder to do inside a map.
        // Let's assume comments and likes are arrays on the post document to save reads for this MVP scale.
        
        return {
          id: document.id,
          ...data,
        };
      }));
      
      // Sort pinned to top
      const sorted = postsData.sort((a: any, b: any) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return 0;
      });
      
      setPosts(sorted);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handlePost = async () => {
    if (!user || (!newPostContent.trim() && !newPostImage)) return;
    setIsPosting(true);
    
    try {
      await addDoc(collection(db, "posts"), {
        authorId: user.uid,
        authorName: `${userData?.firstName} ${userData?.lastName}`,
        authorRole: userRole,
        authorImage: (userData as any)?.profile?.profilePhotoUrl || null,
        content: newPostContent,
        mediaUrls: newPostImage ? [newPostImage] : [],
        likes: [],
        comments: [],
        isPinned: false,
        createdAt: serverTimestamp(),
      });
      
      setNewPostContent("");
      setNewPostImage(null);
      toast.success("Posted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to post.");
    } finally {
      setIsPosting(false);
    }
  };

  const handleLike = async (post: any) => {
    if (!user) return;
    const postRef = doc(db, "posts", post.id);
    const hasLiked = post.likes?.includes(user.uid);
    
    const newLikes = hasLiked 
      ? post.likes.filter((id: string) => id !== user.uid)
      : [...(post.likes || []), user.uid];
      
    await updateDoc(postRef, { likes: newLikes });
  };

  const handleComment = async (postId: string) => {
    if (!user || !commentText.trim()) return;
    const postRef = doc(db, "posts", postId);
    
    const postDoc = await getDoc(postRef);
    if (postDoc.exists()) {
      const currentComments = postDoc.data().comments || [];
      await updateDoc(postRef, {
        comments: [...currentComments, {
          id: Math.random().toString(36).substring(7),
          authorId: user.uid,
          authorName: `${userData?.firstName} ${userData?.lastName}`,
          text: commentText,
          createdAt: new Date().toISOString()
        }]
      });
    }
    
    setCommentText("");
    setActiveCommentPost(null);
  };

  const togglePin = async (post: any) => {
    if (userRole !== 'coach') return;
    await updateDoc(doc(db, "posts", post.id), {
      isPinned: !post.isPinned
    });
  };

  const handleDelete = async (post: any) => {
    if (userRole !== 'coach' && post.authorId !== user?.uid) return;
    if (confirm("Delete this post?")) {
      await deleteDoc(doc(db, "posts", post.id));
      toast.success("Post deleted.");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <Skeleton className="h-[200px] w-full rounded-xl" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto pb-20">
      
      {/* Create Post */}
      <Card glass className="overflow-hidden">
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center text-primary font-bold overflow-hidden border border-primary/30">
              {(userData as any)?.profile?.profilePhotoUrl ? (
                <Image src={(userData as any).profile.profilePhotoUrl} alt="Avatar" width={40} height={40} className="object-cover h-full w-full" />
              ) : (
                userData?.firstName?.[0] || userRole[0].toUpperCase()
              )}
            </div>
            <textarea 
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder={`Share an update, ${userRole === 'coach' ? 'coach' : 'athlete'}...`}
              className="flex-1 min-h-[80px] bg-transparent border-none resize-none focus:ring-0 text-lg placeholder:text-muted-foreground/60 focus-visible:outline-none"
            />
          </div>
          
          {newPostImage && (
            <div className="relative w-32 h-32 ml-14">
              <Image src={newPostImage} alt="Upload preview" fill className="object-cover rounded-lg" />
              <button onClick={() => setNewPostImage(null)} className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 shadow-md">
                <Trash2 size={14} />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between ml-14 pt-2 border-t border-border/50">
            <div className="w-8 flex-shrink-0">
               <ImageUpload 
                 onChange={(url) => setNewPostImage(url)} 
                 onRemove={() => setNewPostImage(null)} 
                 className="!w-10 !h-10 opacity-0 absolute z-10 cursor-pointer" 
               />
               <Button variant="ghost" size="icon" type="button" className="pointer-events-none relative z-0">
                 <Image src="/upload-icon.svg" alt="" width={0} height={0} className="hidden" /> {/* Dummy to fix type */}
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
               </Button>
            </div>
            
            <Button onClick={handlePost} disabled={isPosting || (!newPostContent.trim() && !newPostImage)}>
              {isPosting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Post"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feed */}
      <div className="space-y-6">
        {posts.map(post => (
          <Card key={post.id} glass className={`overflow-hidden ${post.isPinned ? 'ring-2 ring-primary/50' : ''}`}>
            <CardHeader className="p-4 sm:p-6 pb-0 flex flex-row items-start justify-between">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-accent flex-shrink-0 flex items-center justify-center text-foreground font-bold overflow-hidden border">
                  {post.authorImage ? (
                    <Image src={post.authorImage} alt={post.authorName} width={40} height={40} className="object-cover h-full w-full" />
                  ) : (
                    post.authorName?.[0] || 'U'
                  )}
                </div>
                <div>
                  <h4 className="font-semibold">{post.authorName}</h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <span className="capitalize">{post.authorRole}</span>
                    <span>•</span>
                    {post.createdAt?.toDate ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : 'Just now'}
                    {post.isPinned && (
                      <>
                        <span>•</span>
                        <span className="text-primary flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider">
                          <Pin size={10} /> Pinned
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              {(userRole === 'coach' || user?.uid === post.authorId) && (
                <div className="flex gap-2">
                  {userRole === 'coach' && (
                    <Button variant="ghost" size="icon" onClick={() => togglePin(post)} className={post.isPinned ? "text-primary" : "text-muted-foreground"}>
                      <Pin size={16} />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(post)} className="text-destructive hover:bg-destructive/10">
                    <Trash2 size={16} />
                  </Button>
                </div>
              )}
            </CardHeader>

            <CardContent className="p-4 sm:p-6">
              <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{post.content}</p>
              
              {post.mediaUrls?.length > 0 && (
                <div className="mt-4 rounded-xl overflow-hidden border relative aspect-video bg-black/5">
                  <Image src={post.mediaUrls[0]} alt="Post media" fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" />
                </div>
              )}
            </CardContent>

            <div className="px-4 sm:px-6 py-3 border-t border-border/50 flex items-center gap-6">
              <button 
                onClick={() => handleLike(post)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${post.likes?.includes(user?.uid) ? 'text-rose-500' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Heart size={18} className={post.likes?.includes(user?.uid) ? 'fill-rose-500' : ''} />
                {post.likes?.length || 0}
              </button>
              
              <button 
                onClick={() => setActiveCommentPost(activeCommentPost === post.id ? null : post.id)}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageCircle size={18} />
                {post.comments?.length || 0}
              </button>
            </div>

            {/* Comments Section */}
            {(activeCommentPost === post.id || post.comments?.length > 0) && (
              <div className="bg-muted/30 px-4 sm:px-6 py-4 space-y-4 border-t border-border/50">
                {post.comments?.map((comment: any) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-accent flex-shrink-0 flex items-center justify-center text-xs font-bold">
                      {comment.authorName?.[0]}
                    </div>
                    <div className="bg-background border rounded-2xl rounded-tl-sm px-4 py-2 text-sm flex-1">
                      <div className="font-semibold mb-0.5">{comment.authorName}</div>
                      <div className="text-muted-foreground">{comment.text}</div>
                    </div>
                  </div>
                ))}

                {activeCommentPost === post.id && (
                  <div className="flex gap-3 mt-4 items-end">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center text-primary text-xs font-bold">
                      {userData?.firstName?.[0]}
                    </div>
                    <div className="flex-1 flex gap-2">
                      <Input 
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        className="rounded-full bg-background"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleComment(post.id);
                          }
                        }}
                      />
                      <Button size="icon" onClick={() => handleComment(post.id)} disabled={!commentText.trim()} className="rounded-full flex-shrink-0">
                        <Send size={16} className="-ml-0.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </Card>
        ))}
        
        {posts.length === 0 && (
          <div className="text-center p-12 border-2 border-dashed rounded-xl text-muted-foreground">
            No posts yet. Be the first to share something!
          </div>
        )}
      </div>

    </div>
  );
}
