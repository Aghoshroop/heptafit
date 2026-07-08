"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, orderBy, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/FileUpload";
import { Skeleton } from "@/components/ui/Skeleton";
import { FileText, Download, Trash2, File, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function StudentDocumentsPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "documents"),
      where("athleteId", "==", user.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a: any, b: any) => {
        const timeA = a.uploadedAt?.toMillis ? a.uploadedAt.toMillis() : 0;
        const timeB = b.uploadedAt?.toMillis ? b.uploadedAt.toMillis() : 0;
        return timeB - timeA;
      });
      setDocuments(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const handleUpload = async (url: string, name: string, type: string) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "documents"), {
        athleteId: user.uid,
        url,
        name,
        type,
        uploadedAt: serverTimestamp()
      });
      toast.success("Document uploaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save document metadata");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this document?")) return;
    try {
      await deleteDoc(doc(db, "documents", id));
      toast.success("Document deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete document");
    }
  };

  const getIcon = (type: string) => {
    if (type === 'pdf') return <FileText className="text-rose-500" size={24} />;
    if (type === 'image') return <ImageIcon className="text-blue-500" size={24} />;
    return <File className="text-muted-foreground" size={24} />;
  };

  if (loading) return <Skeleton className="w-full h-[600px] rounded-xl" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Documents</h1>
        <p className="text-muted-foreground mt-1">Manage your medical records, waivers, and files.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card glass className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Upload Document</CardTitle>
            <CardDescription>Upload PDFs, Word docs, or images.</CardDescription>
          </CardHeader>
          <CardContent>
            <FileUpload 
              onUploadComplete={handleUpload} 
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" 
              maxSizeMB={20} 
            />
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          {documents.length === 0 ? (
            <div className="text-center p-12 border-2 border-dashed rounded-xl text-muted-foreground">
              No documents uploaded yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {documents.map(doc => (
                <Card key={doc.id} glass className="flex flex-col">
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="p-3 bg-muted rounded-xl flex-shrink-0">
                      {getIcon(doc.type)}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-semibold truncate" title={doc.name}>{doc.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {doc.uploadedAt?.toDate ? format(doc.uploadedAt.toDate(), "MMM dd, yyyy") : "Just now"}
                      </p>
                    </div>
                  </CardContent>
                  <div className="mt-auto px-4 py-3 bg-muted/30 border-t border-border/50 flex justify-end gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer">
                        <Download size={16} className="mr-2" /> View
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(doc.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
