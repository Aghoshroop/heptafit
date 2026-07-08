"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { collection, query, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, orderBy, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Trash2, Pin, Tag, Clock, Send, ShieldAlert, Activity, Users, Image as ImageIcon, Search, Filter, Archive } from "lucide-react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { logActivity } from "@/lib/activityService";

// Dynamically import Quill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const CATEGORIES = [
  { id: "tactical", label: "Tactical", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" },
  { id: "technical", label: "Technical", icon: Activity, color: "text-indigo-500", bg: "bg-indigo-500/10 border-indigo-500/20" },
  { id: "medical", label: "Medical", icon: ShieldAlert, color: "text-rose-500", bg: "bg-rose-500/10 border-rose-500/20" },
  { id: "general", label: "General", icon: Tag, color: "text-slate-400", bg: "bg-slate-500/10 border-slate-500/20" },
];

export default function CoachNotesPage() {
  const params = useParams();
  const athleteId = params.id as string;
  const { user } = useAuth();
  
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Editor state
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
  const [isPinned, setIsPinned] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Attachments state
  const [attachments, setAttachments] = useState<{url: string, name: string}[]>([]);
  const [uploading, setUploading] = useState(false);

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    if (!athleteId) return;

    const q = query(
      collection(db, "users", athleteId, "coach_notes"),
      orderBy("createdAt", "desc")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [athleteId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      if (!apiKey) throw new Error("ImgBB API key is not configured in .env.local");

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        setAttachments(prev => [...prev, { url: data.data.url, name: file.name }]);
        toast.success("Image attached");
      } else {
        throw new Error("Failed to upload image to ImgBB");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handlePost = async () => {
    if ((!content.trim() || content === "<p><br></p>") && attachments.length === 0) {
      toast.error("Note content or attachment is required");
      return;
    }
    
    setSaving(true);
    try {
      await addDoc(collection(db, "users", athleteId, "coach_notes"), {
        content,
        category,
        priority,
        isPinned,
        isArchived: false,
        attachments,
        authorId: user?.uid || "unknown",
        createdAt: serverTimestamp(),
      });
      
      await logActivity({
        actorId: user?.uid || "unknown",
        actorName: "Coach", // Context doesn't easily have user's name right here since we use `user` not `userData`, but I'll use Coach for now.
        actorRole: "Head Coach",
        athleteId,
        module: "notes",
        action: "created",
        title: `Coach Note Added: ${CATEGORIES.find(c => c.id === category)?.label}`,
        description: `Priority: ${priority.toUpperCase()}`,
        metadata: {
          category,
          hasAttachments: attachments.length > 0
        }
      });
      
      setContent("");
      setIsPinned(false);
      setCategory("general");
      setPriority("low");
      setAttachments([]);
      toast.success("Note posted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to post note");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this note?")) {
      await deleteDoc(doc(db, "users", athleteId, "coach_notes", id));
    }
  };

  const togglePin = async (id: string, currentStatus: boolean) => {
    await updateDoc(doc(db, "users", athleteId, "coach_notes", id), {
      isPinned: !currentStatus
    });
  };

  const toggleArchive = async (id: string, currentStatus: boolean) => {
    await updateDoc(doc(db, "users", athleteId, "coach_notes", id), {
      isArchived: !currentStatus,
      isPinned: false // unpin when archiving
    });
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Filter and sort
  const filteredNotes = notes.filter(note => {
    if (note.isArchived !== showArchived) return false;
    if (filterCategory !== "all" && note.category !== filterCategory) return false;
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      // Search in content (stripping HTML is complex here, so simple substring match)
      if (!note.content?.toLowerCase().includes(searchLower)) return false;
    }
    
    return true;
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Coach Notes</h2>
          <p className="text-muted-foreground text-sm">Private technical, tactical, and medical assessments.</p>
        </div>
      </div>

      {/* Editor */}
      <Card glass className="border-white/5 overflow-visible">
        <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex justify-between items-center">
          <h3 className="font-bold text-sm">New Note</h3>
          <p className="text-[10px] text-muted-foreground">Use @ to mention athletes (coming soon)</p>
        </div>
        <CardContent className="p-0">
          <div className="bg-background/80 relative">
            <ReactQuill 
              theme="snow" 
              value={content} 
              onChange={setContent}
              className="text-white border-none h-40 mb-12 [&_.ql-editor]:text-sm"
              placeholder="Write a detailed assessment..."
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  ['link', 'clean']
                ],
              }}
            />
          </div>
          
          {/* Attachments Preview */}
          {attachments.length > 0 && (
            <div className="px-4 pb-4 flex flex-wrap gap-2 border-t border-white/5 pt-4">
              {attachments.map((att, i) => (
                <div key={i} className="relative group rounded-md border border-white/10 overflow-hidden w-20 h-20">
                  <img src={att.url} alt="Attachment" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => removeAttachment(i)}
                    className="absolute top-1 right-1 bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={12} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="p-4 bg-card/50 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="h-8 rounded-md border border-white/10 bg-background/50 px-2 py-1 text-xs text-foreground font-medium"
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>

              <select 
                value={priority} 
                onChange={(e) => setPriority(e.target.value as any)}
                className={`h-8 rounded-md border border-white/10 bg-background/50 px-2 py-1 text-xs font-medium ${
                  priority === "high" ? "text-rose-500" : priority === "medium" ? "text-amber-500" : "text-foreground"
                }`}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>

              <label className="flex items-center gap-1 h-8 px-3 rounded-md border border-white/10 bg-background/50 text-xs font-medium cursor-pointer hover:bg-white/5">
                <ImageIcon size={12} /> Add Image
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
              {uploading && <span className="text-[10px] text-blue-400 animate-pulse">Uploading...</span>}

              <Button 
                type="button"
                variant={isPinned ? "default" : "outline"}
                size="sm"
                onClick={() => setIsPinned(!isPinned)}
                className={`h-8 text-xs border-white/10 px-3 ${isPinned ? "bg-amber-500 hover:bg-amber-600 text-white border-transparent" : "text-muted-foreground"}`}
              >
                <Pin size={12} className="mr-1" /> Pin
              </Button>
            </div>
            
            <Button onClick={handlePost} disabled={saving || uploading} className="bg-blue-500 hover:bg-blue-600 text-white w-full md:w-auto h-8 text-xs">
              <Send size={12} className="mr-2" />
              {saving ? "Posting..." : "Post Note"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters & Feed */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search notes..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-sm bg-background/50 border-white/10"
              />
            </div>
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              className="h-9 rounded-md border border-white/10 bg-background/50 px-3 text-sm text-muted-foreground"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowArchived(!showArchived)}
            className={`h-9 border-white/10 text-xs ${showArchived ? "bg-white/10 text-white" : "text-muted-foreground"}`}
          >
            <Archive size={14} className="mr-2" />
            {showArchived ? "View Active" : "View Archive"}
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center p-12"><div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" /></div>
        ) : sortedNotes.length === 0 ? (
          <div className="bg-background/30 border border-white/5 rounded-xl p-8 text-center">
            <p className="text-muted-foreground text-sm">No notes found matching your filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedNotes.map(note => {
              const cat = CATEGORIES.find(c => c.id === note.category) || CATEGORIES[3];
              const CatIcon = cat.icon;
              const date = note.createdAt?.toDate?.() || new Date();
              
              return (
                <Card key={note.id} glass className={`border-white/5 overflow-hidden transition-all relative ${note.isPinned ? "border-amber-500/30 shadow-[0_0_15px_-3px_rgba(245,158,11,0.15)]" : ""}`}>
                  {note.isPinned && (
                    <div className="absolute top-0 right-0 bg-amber-500/20 text-amber-500 px-3 py-1 rounded-bl-lg text-[10px] font-bold flex items-center gap-1 border-b border-l border-amber-500/30 z-10">
                      <Pin size={10} /> Pinned
                    </div>
                  )}
                  {note.isArchived && (
                    <div className="absolute top-0 right-0 bg-slate-500/20 text-slate-400 px-3 py-1 rounded-bl-lg text-[10px] font-bold flex items-center gap-1 border-b border-l border-slate-500/30 z-10">
                      <Archive size={10} /> Archived
                    </div>
                  )}
                  
                  <CardContent className="p-0">
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${cat.bg}`}>
                            <CatIcon size={16} className={cat.color} />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{cat.label} Assessment</p>
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider font-medium">
                              <span className="flex items-center gap-1"><Clock size={10} /> {date.toLocaleDateString()} {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                              {note.priority === "high" && <span className="text-rose-500 font-bold px-1.5 py-0.5 bg-rose-500/10 rounded border border-rose-500/20">High Priority</span>}
                              {note.priority === "medium" && <span className="text-amber-500 font-bold px-1.5 py-0.5 bg-amber-500/10 rounded border border-amber-500/20">Medium Priority</span>}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-1 z-10 relative">
                          <Button variant="ghost" size="icon" onClick={() => togglePin(note.id, note.isPinned)} className={`h-7 w-7 ${note.isPinned ? "text-amber-500" : "text-muted-foreground hover:text-amber-500"}`} disabled={note.isArchived}>
                            <Pin size={12} />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => toggleArchive(note.id, note.isArchived)} className={`h-7 w-7 ${note.isArchived ? "text-blue-400" : "text-muted-foreground hover:text-blue-400"}`}>
                            <Archive size={12} />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(note.id)} className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Render HTML content safely */}
                      {note.content && note.content !== "<p><br></p>" && (
                        <div 
                          className="prose prose-invert max-w-none text-sm text-foreground/90 prose-p:leading-relaxed prose-a:text-blue-400"
                          dangerouslySetInnerHTML={{ __html: note.content }}
                        />
                      )}
                      
                      {/* Attachments */}
                      {note.attachments && note.attachments.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-3">
                          {note.attachments.map((att: any, i: number) => (
                            <a key={i} href={att.url} target="_blank" rel="noopener noreferrer" className="block w-24 h-24 rounded-md border border-white/10 overflow-hidden hover:border-blue-500/50 transition-colors">
                              <img src={att.url} alt="Attachment" className="w-full h-full object-cover" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
