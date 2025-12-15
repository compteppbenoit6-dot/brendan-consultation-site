// File: app/admin/content/content-form.tsx

"use client"

import { useActionState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"
import { CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { updateContentBlocks } from "./actions"
import type { ContentBlock } from "@prisma/client"

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? "Saving..." : "Save Content"}</Button>
}

// Helper to format the key into a readable title
const formatKey = (key: string) => {
  return key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
};

export function ContentForm({ contentBlocks }: { contentBlocks: ContentBlock[] }) {
  const [state, formAction] = useActionState(updateContentBlocks, { success: null, error: null });

  useEffect(() => {
    if (state.success) {
      toast.success(state.success);
    }
    if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={formAction}>
      <CardContent className="space-y-6">
        {contentBlocks.map(block => (
          <div key={block.id} className="space-y-2">
            <Label htmlFor={block.key}>{formatKey(block.key)}</Label>
            <Textarea
              id={block.key}
              name={block.key}
              defaultValue={block.value}
              className="min-h-[80px]"
            />
          </div>
        ))}
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <SubmitButton />
      </CardFooter>
    </form>
  )
}