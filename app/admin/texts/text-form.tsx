// File: app/admin/texts/text-form.tsx

"use client"

// --- CORRECTED IMPORTS ---
import { useActionState, useEffect, useState } from "react"
import { useFormStatus } from "react-dom"
// --- END CORRECTION ---

import { upsertTextPost } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import type { TextPost } from "@prisma/client"

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (isEditing ? "Saving..." : "Creating...") : (isEditing ? "Save Changes" : "Create Post")}
    </Button>
  )
}

const initialState = { error: null, fieldErrors: null, success: null }

interface TextFormProps {
  post?: TextPost | null
  children?: React.ReactNode
  onSuccess?: () => void
}

export function TextForm({ post, children, onSuccess }: TextFormProps) {
  const [state, formAction] = useActionState(upsertTextPost, initialState)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (state.success) {
      toast.success(state.success)
      setIsOpen(false)
      if (onSuccess) {
        onSuccess()
      }
    }
    if (state.fieldErrors?.slug) {
        toast.error(state.fieldErrors.slug[0])
    } else if (state.error) {
      toast.error(state.error)
    }
  }, [state, onSuccess])

  const isEditing = !!post

  const FormContent = (
    <form action={formAction} className="space-y-4">
      {isEditing && <input type="hidden" name="id" value={post.id} />}
      
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={post?.title ?? ""} required />
        {state.fieldErrors?.title && <p className="text-destructive text-sm mt-1">{state.fieldErrors.title[0]}</p>}
      </div>

      <div>
        <Label htmlFor="image">Featured Image (Optional)</Label>
        <Input id="image" name="image" type="file" accept="image/*" />
        {isEditing && <p className="text-xs text-muted-foreground mt-1">Leave blank to keep the current image.</p>}
        {state.fieldErrors?.image && <p className="text-destructive text-sm mt-1">{state.fieldErrors.image[0]}</p>}
      </div>

      <div>
        <Label htmlFor="content">Full Content</Label>
        <Textarea id="content" name="content" defaultValue={post?.content ?? ""} required className="min-h-[200px]" />
        {state.fieldErrors?.content && <p className="text-destructive text-sm mt-1">{state.fieldErrors.content[0]}</p>}
      </div>

      <DialogFooter>
        {children ? (
          <>
            <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
            <SubmitButton isEditing={isEditing} />
          </>
        ) : (
          <SubmitButton isEditing={isEditing} />
        )}
      </DialogFooter>
    </form>
  );

  if (!children && onSuccess) {
    return FormContent;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Post" : "Add New Post"}</DialogTitle>
        </DialogHeader>
        {FormContent}
      </DialogContent>
    </Dialog>
  )
}