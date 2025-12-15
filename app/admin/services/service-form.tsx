// File: app/admin/services/service-form.tsx

"use client"

// --- CORRECTED IMPORTS ---
import { useActionState, useEffect } from "react"
import { useFormStatus } from "react-dom"
// --- END CORRECTION ---

import { upsertService } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DialogFooter } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import type { Service } from "@prisma/client"

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : isEditing ? "Save Changes" : "Create Service"}
    </Button>
  )
}

const initialState = { error: null, fieldErrors: null, success: null }

interface ServiceFormProps {
  service?: Service | null
  onSuccess: () => void
}

export function ServiceForm({ service, onSuccess }: ServiceFormProps) {
  const [state, formAction] = useActionState(upsertService, initialState)

  useEffect(() => {
    if (state.success) {
      toast.success(state.success)
      onSuccess()
    }
    if (state.error) {
      toast.error(state.error)
    }
  }, [state, onSuccess])

  const isEditing = !!service

  return (
    <form action={formAction} className="space-y-4">
      {isEditing && <input type="hidden" name="id" value={service.id} />}
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Service Name</Label>
          <Input id="name" name="name" defaultValue={service?.name ?? ""} required />
          {state.fieldErrors?.name && <p className="text-destructive text-sm mt-1">{state.fieldErrors.name[0]}</p>}
        </div>
        <div>
          <Label htmlFor="price">Price ($)</Label>
          <Input id="price" name="price" type="number" defaultValue={service?.price ?? ""} required />
          {state.fieldErrors?.price && <p className="text-destructive text-sm mt-1">{state.fieldErrors.price[0]}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="duration">Duration (e.g., 60min)</Label>
          <Input id="duration" name="duration" defaultValue={service?.duration ?? ""} required />
          {state.fieldErrors?.duration && <p className="text-destructive text-sm mt-1">{state.fieldErrors.duration[0]}</p>}
        </div>
        <div>
          <Label htmlFor="icon">Icon Name (from Lucide)</Label>
          <Input id="icon" name="icon" defaultValue={service?.icon ?? "Heart"} required />
          {state.fieldErrors?.icon && <p className="text-destructive text-sm mt-1">{state.fieldErrors.icon[0]}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={service?.description ?? ""} required />
        {state.fieldErrors?.description && <p className="text-destructive text-sm mt-1">{state.fieldErrors.description[0]}</p>}
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Checkbox id="active" name="active" defaultChecked={service?.active ?? true} />
          <Label htmlFor="active">Active (Visible to users)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="popular" name="popular" defaultChecked={service?.popular ?? false} />
          <Label htmlFor="popular">Popular</Label>
        </div>
      </div>

      <DialogFooter>
        <SubmitButton isEditing={isEditing} />
      </DialogFooter>
    </form>
  )
}