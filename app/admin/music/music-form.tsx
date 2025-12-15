// File: app/admin/music/music-form.tsx

"use client"

// --- CORRECTED IMPORTS ---
import { useActionState, useEffect, useState } from "react"
import { useFormStatus } from "react-dom"
// --- END CORRECTION ---

import { upsertMusicTrack } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import type { MusicTrack } from "@prisma/client"

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (isEditing ? "Saving..." : "Uploading...") : (isEditing ? "Save Changes" : "Add Track")}
    </Button>
  )
}

const initialState = { error: null, fieldErrors: null, success: null }

interface MusicFormProps {
  track?: MusicTrack | null
  children?: React.ReactNode
  onSuccess?: () => void
}

export function MusicForm({ track, children, onSuccess }: MusicFormProps) {
  const [state, formAction] = useActionState(upsertMusicTrack, initialState)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (state.success) {
      toast.success(state.success)
      setIsOpen(false)
      if (onSuccess) {
        onSuccess()
      }
    }
    if (state.error) {
      toast.error(state.error)
    }
  }, [state, onSuccess])

  const isEditing = !!track

  const FormContent = (
    <form action={formAction} className="space-y-4">
      {isEditing && <input type="hidden" name="id" value={track.id} />}
      
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={track?.title ?? ""} required />
        {state.fieldErrors?.title && <p className="text-destructive text-sm mt-1">{state.fieldErrors.title[0]}</p>}
      </div>

      <div>
        <Label htmlFor="type">Type</Label>
        <Select name="type" defaultValue={track?.type ?? ""}>
          <SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Beat">Beat</SelectItem>
            <SelectItem value="Freestyle">Freestyle</SelectItem>
            <SelectItem value="Track">Track</SelectItem>
          </SelectContent>
        </Select>
        {state.fieldErrors?.type && <p className="text-destructive text-sm mt-1">{state.fieldErrors.type[0]}</p>}
      </div>

      <div>
        <Label htmlFor="duration">Duration (e.g., 3:42)</Label>
        <Input id="duration" name="duration" defaultValue={track?.duration ?? ""} required />
        {state.fieldErrors?.duration && <p className="text-destructive text-sm mt-1">{state.fieldErrors.duration[0]}</p>}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={track?.description ?? ""} required />
        {state.fieldErrors?.description && <p className="text-destructive text-sm mt-1">{state.fieldErrors.description[0]}</p>}
      </div>

      <div>
        <Label htmlFor="audioSrc">Audio File</Label>
        <Input id="audioSrc" name="audioSrc" type="file" accept="audio/*" required={!isEditing} />
        {isEditing && <p className="text-xs text-muted-foreground mt-1">Leave blank to keep current audio.</p>}
        {state.fieldErrors?.audioSrc && <p className="text-destructive text-sm mt-1">{state.fieldErrors.audioSrc[0]}</p>}
      </div>

      <DialogFooter>
        <SubmitButton isEditing={isEditing} />
      </DialogFooter>
    </form>
  );

  if (!children && onSuccess) {
    return FormContent;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Track" : "Add New Track"}</DialogTitle>
        </DialogHeader>
        {FormContent}
      </DialogContent>
    </Dialog>
  )
}