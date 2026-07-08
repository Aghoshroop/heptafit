"use client";

import { useState, useRef } from "react";
import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/Button";
import { FileUp, X, Loader2, File, FileText, Image as ImageIcon, Video } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onUploadComplete: (url: string, name: string, type: string) => void;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
}

export function FileUpload({ onUploadComplete, accept = "*", maxSizeMB = 50, className }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File must be smaller than ${maxSizeMB}MB.`);
      return;
    }

    setIsUploading(true);
    setProgress(0);

    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExtension}`;
    const storageRef = ref(storage, `uploads/${uniqueFileName}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(prog);
      },
      (error) => {
        console.error("Upload error:", error);
        toast.error("Failed to upload file.");
        setIsUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        
        let type = "document";
        if (file.type.startsWith("image/")) type = "image";
        if (file.type.startsWith("video/")) type = "video";
        if (file.type.includes("pdf")) type = "pdf";
        
        onUploadComplete(downloadURL, file.name, type);
        setIsUploading(false);
        setProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    );
  };

  return (
    <div className={cn("w-full", className)}>
      <label className="flex flex-col items-center justify-center w-full min-h-[160px] border-2 border-dashed border-input rounded-xl cursor-pointer hover:bg-accent/50 transition-colors bg-background relative overflow-hidden">
        {isUploading ? (
          <div className="flex flex-col items-center justify-center w-full h-full p-6 z-10">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-3" />
            <p className="mb-2 text-sm font-medium">Uploading... {progress}%</p>
            <div className="w-full max-w-[200px] bg-muted rounded-full h-2 mt-2 overflow-hidden">
              <div className="bg-primary h-2 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <FileUp className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold text-primary">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">Max size: {maxSizeMB}MB</p>
          </div>
        )}
        <input 
          type="file" 
          className="hidden" 
          accept={accept}
          onChange={handleFileChange}
          ref={fileInputRef}
          disabled={isUploading}
        />
      </label>
    </div>
  );
}
