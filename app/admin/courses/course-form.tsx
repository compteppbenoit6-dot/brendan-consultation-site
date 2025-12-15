// File: app/admin/courses/course-form.tsx

"use client"

import { useActionState, useEffect, useState, useRef } from "react"
import { useFormStatus } from "react-dom"
import { upsertCourse } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DialogFooter } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import type { Course, CourseVideo } from "@prisma/client"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { GripVertical, PlusCircle, Trash2, Upload } from "lucide-react"

// --- SUBMIT BUTTON ---
function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : isEditing ? "Save Changes" : "Create Course"}
    </Button>
  )
}

// --- UPLOAD HELPER ---
async function uploadFile(file: File, onProgress: (progress: number) => void): Promise<string> {
  onProgress(0);
  const response = await fetch('/api/courses/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: file.name, contentType: file.type }),
  });

  if (!response.ok) throw new Error('Failed to get upload URL.');
  const { uploadUrl, publicUrl } = await response.json();

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl, true);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status === 200) resolve(publicUrl);
      else reject(new Error('Upload failed.'));
    };
    xhr.onerror = () => reject(new Error('Upload failed.'));
    xhr.send(file);
  });
}

// --- VIDEO ITEM COMPONENT ---
interface VideoItemProps {
  video: Partial<CourseVideo>;
  index: number;
  updateVideo: (index: number, data: Partial<CourseVideo>) => void;
  removeVideo: (index: number) => void;
}

function VideoItem({ video, index, updateVideo, removeVideo }: VideoItemProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const publicUrl = await uploadFile(file, setUploadProgress);
      updateVideo(index, { videoSrc: publicUrl });
      toast.success(`Video "${video.title || 'Untitled'}" uploaded.`);
    } catch (error) {
      toast.error("Video upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="p-4 bg-muted/50">
      <div className="flex items-start gap-4">
        <GripVertical className="h-5 w-5 text-muted-foreground mt-2 cursor-grab" />
        <div className="flex-1 space-y-2">
          <Input
            placeholder="Video Title"
            value={video.title || ""}
            onChange={(e) => updateVideo(index, { title: e.target.value })}
          />
          <div className="flex items-center gap-2">
            <Input type="file" accept="video/*" onChange={handleFileChange} disabled={isUploading} className="text-xs" />
            {isUploading && <Progress value={uploadProgress} className="w-24 h-2" />}
          </div>
          {video.videoSrc && !isUploading && <p className="text-xs text-green-600">Video is ready.</p>}
        </div>
        <Button variant="ghost" size="icon" onClick={() => removeVideo(index)} className="text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

// --- MAIN FORM ---
const initialState = { error: null, fieldErrors: null, success: null }

interface CourseFormProps {
  course?: (Course & { videos: CourseVideo[] }) | null
  onSuccess: () => void
}

export function CourseForm({ course, onSuccess }: CourseFormProps) {
  const [state, formAction] = useActionState(upsertCourse, initialState)
  const [isPremium, setIsPremium] = useState(course?.isPremium ?? false)
  const [videos, setVideos] = useState<Partial<CourseVideo>[]>(course?.videos || []);
  
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(course?.coverImageUrl || null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [coverUploadProgress, setCoverUploadProgress] = useState(0);

  useEffect(() => {
    if (state.success) {
      toast.success(state.success)
      onSuccess()
    }
    if (state.error) {
      toast.error(state.error)
      if (state.fieldErrors?.videos) toast.error(state.fieldErrors.videos[0]);
    }
  }, [state, onSuccess])

  const handleCoverImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploadingCover(true);
    try {
      const publicUrl = await uploadFile(file, setCoverUploadProgress);
      setCoverImageUrl(publicUrl);
      toast.success("Cover image uploaded.");
    } catch (error) {
      toast.error("Cover image upload failed.");
    } finally {
      setIsUploadingCover(false);
    }
  };

  const addVideo = () => setVideos([...videos, { title: "", videoSrc: "", order: videos.length }]);
  const removeVideo = (index: number) => setVideos(videos.filter((_, i) => i !== index));
  const updateVideo = (index: number, data: Partial<CourseVideo>) => {
    const newVideos = [...videos];
    newVideos[index] = { ...newVideos[index], ...data };
    setVideos(newVideos);
  };

  const isEditing = !!course

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="id" value={course?.id} />
      <input type="hidden" name="coverImageUrl" value={coverImageUrl || ""} />
      <input type="hidden" name="videos" value={JSON.stringify(videos.map((v, i) => ({ ...v, order: i })))} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div>
            <Label htmlFor="title">Course Title</Label>
            <Input id="title" name="title" defaultValue={course?.title ?? ""} required />
            {state.fieldErrors?.title && <p className="text-destructive text-sm mt-1">{state.fieldErrors.title[0]}</p>}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={course?.description ?? ""} required />
            {state.fieldErrors?.description && <p className="text-destructive text-sm mt-1">{state.fieldErrors.description[0]}</p>}
          </div>
        </div>
        <div>
          <Label>Cover Image</Label>
          <Card className="mt-1 aspect-video flex items-center justify-center bg-muted/50 border-2 border-dashed">
            {coverImageUrl ? (
              <img src={coverImageUrl} alt="Cover preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-muted-foreground">
                <Upload className="mx-auto h-8 w-8" />
                <p className="text-xs">Upload Cover</p>
              </div>
            )}
          </Card>
          <Input id="coverImageFile" type="file" accept="image/*" onChange={handleCoverImageChange} disabled={isUploadingCover} className="mt-2" />
          {isUploadingCover && <Progress value={coverUploadProgress} className="mt-2" />}
        </div>
      </div>

      <div>
        <Label>Course Videos</Label>
        <div className="space-y-2 mt-1">
          {videos.map((video, index) => (
            <VideoItem key={index} index={index} video={video} updateVideo={updateVideo} removeVideo={removeVideo} />
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addVideo} className="mt-2">
          <PlusCircle className="h-4 w-4 mr-2" /> Add Video
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="isPremium" name="isPremium" checked={isPremium} onCheckedChange={(checked) => setIsPremium(checked as boolean)} />
        <Label htmlFor="isPremium">This is a Premium Course</Label>
      </div>

      {isPremium && (
        <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
          <div>
            <Label htmlFor="price">Price ($)</Label>
            <Input id="price" name="price" type="number" defaultValue={course?.price ?? ""} placeholder="e.g., 50" />
          </div>
          <div>
            <Label htmlFor="unlockCode">Unlock Code</Label>
            <Input id="unlockCode" name="unlockCode" defaultValue={course?.unlockCode ?? ""} placeholder="e.g., FIZZLE123" />
          </div>
        </div>
      )}
      {state.fieldErrors?.isPremium && <p className="text-destructive text-sm mt-1">{state.fieldErrors.isPremium[0]}</p>}

      <DialogFooter>
        <SubmitButton isEditing={isEditing} />
      </DialogFooter>
    </form>
  )
}