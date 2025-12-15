// File: app/admin/gallery/multi-image-form.tsx

"use client"

import { useState, useTransition } from "react"
import { createMultipleImages } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"
import { XCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ImagePreview {
  file: File
  previewUrl: string
  id: string
}

interface MultiImageFormProps {
  onSuccess: () => void
}

export function MultiImageForm({ onSuccess }: MultiImageFormProps) {
  const [previews, setPreviews] = useState<ImagePreview[]>([])
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isPending, startTransition] = useTransition()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        previewUrl: URL.createObjectURL(file),
        id: `${file.name}-${file.lastModified}`
      }));
      setPreviews(prev => [...prev, ...newFiles]);
      e.target.value = "";
    }
  }

  const removePreview = (id: string) => {
    setPreviews(prev => prev.filter(p => p.id !== id));
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (previews.length === 0) {
      toast.error("Please select at least one image to upload.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const form = e.currentTarget;
    const uploadedImageData = [];

    try {
      // Use Promise.all to upload all files in parallel
      await Promise.all(previews.map(async (preview, i) => {
        const file = preview.file;

        // 1. Get a secure upload URL from our server
        const presignResponse = await fetch('/api/images/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, contentType: file.type }),
        });

        if (!presignResponse.ok) {
          throw new Error(`Failed to get upload URL for ${file.name}`);
        }
        const { uploadUrl, publicUrl } = await presignResponse.json();

        // 2. Upload the file directly to R2
        const uploadResponse = await fetch(uploadUrl, {
          method: 'PUT',
          body: file,
        });

        if (!uploadResponse.ok) {
          throw new Error(`Upload failed for ${file.name}`);
        }

        // 3. Collect the metadata and the final public URL
        const title = (form.elements.namedItem(`title-${i}`) as HTMLInputElement)?.value || file.name;
        const alt = (form.elements.namedItem(`alt-${i}`) as HTMLInputElement)?.value || title;
        const category = (form.elements.namedItem(`category-${i}`) as HTMLInputElement)?.value || "General";
        const description = (form.elements.namedItem(`description-${i}`) as HTMLTextAreaElement)?.value || "";

        uploadedImageData.push({ src: publicUrl, title, alt, category, description });
        
        // Update progress (this is a simple approximation)
        setUploadProgress(prev => prev + (100 / previews.length));
      }));

      toast.success("All images uploaded! Saving to database...");

      // 4. Submit the collected data to the server action
      const formData = new FormData();
      formData.append('imagesData', JSON.stringify(uploadedImageData));

      startTransition(async () => {
        const result = await createMultipleImages(formData);
        if (result.success) {
          toast.success(result.success);
          onSuccess();
        } else if (result.error) {
          toast.error(result.error);
        }
      });

    } catch (error) {
      toast.error((error as Error).message || "An error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="src-multi">Select Images</Label>
        <Input id="src-multi" name="src-multi" type="file" accept="image/*" multiple onChange={handleFileChange} disabled={isUploading} />
        <p className="text-xs text-muted-foreground mt-1">You can select multiple files at once.</p>
      </div>

      {isUploading && <Progress value={uploadProgress} className="w-full" />}

      {previews.length > 0 && (
        <ScrollArea className="h-72 w-full rounded-md border p-4">
          <div className="space-y-6">
            {previews.map((p, index) => (
              <div key={p.id} className="relative flex flex-col md:flex-row gap-4 border-b pb-6">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-0 right-0 h-6 w-6 text-destructive hover:text-destructive"
                  onClick={() => removePreview(p.id)}
                  type="button"
                  disabled={isUploading}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
                <img src={p.previewUrl} alt="Preview" className="w-full md:w-32 h-32 object-cover rounded-md" />
                <div className="flex-1 space-y-2">
                  <div>
                    <Label htmlFor={`title-${index}`}>Title (Optional)</Label>
                    <Input id={`title-${index}`} name={`title-${index}`} disabled={isUploading} />
                  </div>
                  <div>
                    <Label htmlFor={`alt-${index}`}>Alt Text (Optional)</Label>
                    <Input id={`alt-${index}`} name={`alt-${index}`} disabled={isUploading} />
                  </div>
                  <div>
                    <Label htmlFor={`category-${index}`}>Category (Optional)</Label>
                    <Input id={`category-${index}`} name={`category-${index}`} disabled={isUploading} />
                  </div>
                  <div>
                    <Label htmlFor={`description-${index}`}>Description (Optional)</Label>
                    <Textarea id={`description-${index}`} name={`description-${index}`} className="h-20" disabled={isUploading} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      <DialogFooter>
        <Button type="submit" disabled={isPending || isUploading || previews.length === 0}>
          {isUploading ? `Uploading ${previews.length} images...` : `Upload ${previews.length} Image(s)`}
        </Button>
      </DialogFooter>
    </form>
  )
}