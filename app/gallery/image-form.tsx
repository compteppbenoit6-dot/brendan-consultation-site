"use client"

import { useFormState, useFormStatus } from "react-dom"
import { useEffect, useRef } from "react"
import { upsertImage } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { PlusCircle, Edit } from "lucide-react"
import { toast } from "sonner"
import type { Image } from "@prisma/client"

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (isEditing ? "Saving..." : "Creating...") : (isEditing ? "Save Changes" : "Create Image")}
    </Button>
  )
}

export function ImageForm({ image, children }: { image?: Image | null, children: React.ReactNode }) {
  const [state, formAction] = useFormState(upsertImage, { error: null, fieldErrors: null })
  const formRef = useRef<HTMLFormElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (state.success) {
      toast.success(state.success)
      formRef.current?.reset()
      closeButtonRef.current?.click()
    }
    if (state.error) {
      toast.error(state.error)
    }
  }, [state])

  const isEditing = !!image

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Image" : "Add New Image"}</DialogTitle>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="space-y-4">
          {isEditing && <input type="hidden" name="id" value={image.id} />}
          
          <div>
            <Label htmlFor="src">Image URL</Label>
            <Input id="src" name="src" defaultValue={image?.src ?? ""} required />
            {state.fieldErrors?.src && <p className="text-destructive text-sm mt-1">{state.fieldErrors.src[0]}</p>}
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
            <DialogClose asChild>
              <Button type="button" variant="secondary" ref={closeButtonRef}>Cancel</Button>
            </DialogClose>
            <SubmitButton isEditing={isEditing} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}