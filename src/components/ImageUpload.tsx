"use client";

import { useState, useRef } from "react";
import { uploadImageToImgBB } from "@/lib/imgbb";
import { Button } from "@/components/ui/Button";
import { UploadCloud, X, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  onRemove: () => void;
  className?: string;
}

export function ImageUpload({ value, onChange, onRemove, className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      const url = await uploadImageToImgBB(file);
      if (url) {
        onChange(url);
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className={`space-y-4 w-full ${className}`}>
      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
          {error}
        </div>
      )}
      
      <div className="flex items-center justify-center w-full">
        {value ? (
          <div className="relative w-40 h-40 group">
            <Image
              src={value}
              alt="Uploaded content"
              fill
              className="object-cover rounded-xl border"
              sizes="(max-width: 160px) 100vw, 160px"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
              <Button 
                variant="destructive" 
                size="icon" 
                onClick={onRemove}
                type="button"
              >
                <X size={18} />
              </Button>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-input rounded-xl cursor-pointer hover:bg-accent/50 transition-colors bg-background">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {isUploading ? (
                <Loader2 className="h-10 w-10 text-muted-foreground animate-spin mb-3" />
              ) : (
                <UploadCloud className="h-10 w-10 text-muted-foreground mb-3" />
              )}
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold text-primary">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">PNG, JPG or GIF (MAX. 5MB)</p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              disabled={isUploading}
            />
          </label>
        )}
      </div>
    </div>
  );
}
