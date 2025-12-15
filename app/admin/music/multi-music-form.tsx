// File: app/admin/music/multi-music-form.tsx

"use client"

import { useState, useTransition } from "react"
import { upsertMultipleMusicTracks } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"
import { XCircle, Music } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AudioPreview {
  file: File
  id: string
}

interface MultiMusicFormProps {
  onSuccess: () => void
}

export function MultiMusicForm({ onSuccess }: MultiMusicFormProps) {
  const [previews, setPreviews] = useState<AudioPreview[]>([])
  const [isPending, startTransition] = useTransition()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        id: `${file.name}-${file.lastModified}`
      }));
      setPreviews(prev => [...prev, ...newFiles]);
      e.target.value = ""; // Allow re-selecting the same file
    }
  }

  const removePreview = (id: string) => {
    setPreviews(prev => prev.filter(p => p.id !== id));
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (previews.length === 0) {
      toast.error("Please select at least one audio file to upload.");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData();
    const metadata = [];

    for (let i = 0; i < previews.length; i++) {
      const preview = previews[i];
      formData.append('files', preview.file);
      
      const title = (form.elements.namedItem(`title-${i}`) as HTMLInputElement)?.value;
      const type = (form.elements.namedItem(`type-${i}`) as HTMLInputElement)?.value;
      const duration = (form.elements.namedItem(`duration-${i}`) as HTMLInputElement)?.value;
      const description = (form.elements.namedItem(`description-${i}`) as HTMLTextAreaElement)?.value;

      if (!type) {
        toast.error(`Please select a type for the track: ${title || preview.file.name}`);
        return;
      }

      metadata.push({ title, type, duration, description });
    }

    formData.append('metadata', JSON.stringify(metadata));

    startTransition(async () => {
      const result = await upsertMultipleMusicTracks(formData);
      if (result.success) {
        toast.success(result.success);
        onSuccess();
      } else if (result.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="src-multi-audio">Select Audio Files</Label>
        <Input id="src-multi-audio" name="src-multi-audio" type="file" accept="audio/*" multiple onChange={handleFileChange} />
        <p className="text-xs text-muted-foreground mt-1">You can select multiple files at once.</p>
      </div>

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
                >
                  <XCircle className="h-4 w-4" />
                </Button>
                <div className="w-full md:w-32 h-32 bg-muted rounded-md flex flex-col items-center justify-center text-center p-2">
                  <Music className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground line-clamp-3">{p.file.name}</p>
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="md:col-span-2">
                    <Label htmlFor={`title-${index}`}>Title</Label>
                    <Input id={`title-${index}`} name={`title-${index}`} defaultValue={p.file.name.replace(/\.[^/.]+$/, "")} required />
                  </div>
                  <div>
                    <Label htmlFor={`type-${index}`}>Type</Label>
                    <Select name={`type-${index}`} required>
                      <SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beat">Beat</SelectItem>
                        <SelectItem value="Freestyle">Freestyle</SelectItem>
                        <SelectItem value="Track">Track</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor={`duration-${index}`}>Duration (e.g., 3:42)</Label>
                    <Input id={`duration-${index}`} name={`duration-${index}`} required />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor={`description-${index}`}>Description</Label>
                    <Textarea id={`description-${index}`} name={`description-${index}`} required className="h-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      <DialogFooter>
        <Button type="submit" disabled={isPending || previews.length === 0}>
          {isPending ? `Uploading ${previews.length} tracks...` : `Upload ${previews.length} Track(s)`}
        </Button>
      </DialogFooter>
    </form>
  )
}