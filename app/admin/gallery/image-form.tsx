// File: app/admin/gallery/image-form.tsx

"use client"

import { useActionState, useEffect, useState, useRef } from "react"
import { useFormStatus } from "react-dom"
import { upsertImage } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import type { Image } from "@prisma/client"
import { Progress } from "@/components/ui/progress"

function SubmitButton({ isEditing, isUploading }: { isEditing: boolean, isUploading: boolean }) {
  const { pending } = useFormStatus()
  const isDisabled = pending || isUploading;

  let buttonText = isEditing ? "Save Changes" : "Create Image";
  if (isUploading) buttonText = "Uploading image...";
  if (pending) buttonText = "Saving...";

  return (
    <Button type="submit" disabled={isDisabled}>
      {buttonText}
    </Button>
  )
}

const initialState = { error: null, fieldErrors: null, success: null }

interface ImageFormProps {
  image?: Image | null
  onSuccess: () => void
}

export function ImageForm({ image, onSuccess }: ImageFormProps) {
  const [state, formAction] = useActionState(upsertImage, initialState)
  
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(image?.src || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (state.success) {
      toast.success(state.success)
      onSuccess()
    }
    if (state.error) {
      toast.error(state.error)
    }
  }, [state, onSuccess])

  const isEditing = !!image

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const response = await fetch('/api/images/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get upload URL.');
      }
      
      const { uploadUrl, publicUrl } = await response.json();

      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadUrl, true);
      
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          setImageBlobUrl(publicUrl);
          toast.success("Image uploaded successfully!");
          setIsUploading(false);
        } else {
          throw new Error('Upload failed.');
        }
      };
      
      xhr.onerror = () => { throw new Error('Upload failed.'); };
      xhr.send(file);

    } catch (error) {
      toast.error((error as Error).message || "Image upload failed.");
      console.error(error);
      setIsUploading(false);
    }
  };

  return (
    <form action={formAction} className="space-y-4">
      {isEditing && <input type="hidden" name="id" value={image.id} />}
      {imageBlobUrl && <input type="hidden" name="src" value={imageBlobUrl} />}
      
      <div>
        <Label htmlFor="imageFile">Image File</Label>
        <Input id="imageFile" ref={inputFileRef} type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
        {isUploading && <Progress value={uploadProgress} className="mt-2" />}
        {!isUploading && imageBlobUrl && !isEditing && (
          <p className="text-xs text-green-600 mt-1">Image is ready to be saved.</p>
        )}
        {isEditing && (
          <p className="text-xs text-muted-foreground mt-1">Upload a new file to replace the current image.</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={image?.title ?? ""} required />
        {state.fieldErrors?.title && <p className="text-destructive text-sm mt-1">{state.fieldErrors.title[0]}</p>}
      </div>

      <div>
        <Label htmlFor="alt">Alt Text (for accessibility)</Label>
        <Input id="alt" name="alt" defaultValue={image?.alt ?? ""} required />
        {state.fieldErrors?.alt && <p className="text-destructive text-sm mt-1">{state.fieldErrors.alt[0]}</p>}
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Input id="category" name="category" defaultValue={image?.category ?? ""} required />
        {state.fieldErrors?.category && <p className="text-destructive text-sm mt-1">{state.fieldErrors.category[0]}</p>}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={image?.description ?? ""} required />
        {state.fieldErrors?.description && <p className="text-destructive text-sm mt-1">{state.fieldErrors.description[0]}</p>}
      </div>

      <DialogFooter>
        <SubmitButton isEditing={isEditing} isUploading={isUploading} />
      </DialogFooter>
    </form>
  )
}