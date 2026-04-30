"use client"

import { useState, useTransition } from "react"
import { Lock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { verifyUnlockCode } from "./actions"

interface UnlockFormProps {
  courseId: string
  children: React.ReactNode
}

export function UnlockForm({ courseId, children }: UnlockFormProps) {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [inputCode, setInputCode] = useState("")
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    startTransition(async () => {
      const result = await verifyUnlockCode(courseId, inputCode)
      if (result.ok) {
        setIsUnlocked(true)
      } else {
        setError(result.error ?? "Incorrect code.")
      }
    })
  }

  if (isUnlocked) {
    return <>{children}</>
  }

  return (
    <div className="mt-6 rounded-xl border border-border/60 bg-card/60 p-8 text-center backdrop-blur-sm">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <Lock className="h-5 w-5 text-primary" />
      </div>
      <h3 className="font-serif text-xl font-bold text-foreground">Premium course</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter the unlock code you received after payment.
      </p>
      <form onSubmit={handleUnlock} className="mx-auto mt-6 max-w-sm space-y-4">
        <div className="space-y-2 text-left">
          <Label htmlFor="unlockCode">Unlock code</Label>
          <Input
            id="unlockCode"
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="XXXX-XXXX"
            className="text-center tracking-widest"
            autoComplete="off"
            disabled={isPending}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={isPending || !inputCode.trim()}>
          {isPending ? "Checking..." : "Unlock course"}
        </Button>
      </form>
    </div>
  )
}
