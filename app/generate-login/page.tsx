"use client"

import { useState } from "react"
import Link from "next/link"
import { ShieldAlert, KeyRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function GenerateLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [secret, setSecret] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch("/api/generate-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, secret }),
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        toast.error(data.error ?? "Failed to generate login.")
        setIsLoading(false)
        return
      }

      toast.success(data.message ?? "Login generated.")
      setDone(true)
      setPassword("")
      setSecret("")
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md border-border/60 bg-card/90 backdrop-blur-md animate-fade-up">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <KeyRound className="h-5 w-5" />
          </div>
          <h1 className="font-serif font-black text-3xl text-foreground tracking-tight">FIZ</h1>
          <CardTitle className="text-xl">Generate Admin Login</CardTitle>
          <CardDescription>
            Recreate or reset the admin account for this site.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Security warning</p>
              <p className="leading-relaxed">
                This page can create admin accounts. After signing in, delete{" "}
                <code className="rounded bg-destructive/10 px-1 py-0.5 text-xs">app/generate-login/</code>,{" "}
                <code className="rounded bg-destructive/10 px-1 py-0.5 text-xs">app/api/generate-login/</code>,
                and rotate the setup secret.
              </p>
            </div>
          </div>

          {done ? (
            <div className="space-y-4 text-center">
              <p className="text-sm text-foreground">
                Login created. You can now sign in with your new credentials.
              </p>
              <Button asChild className="w-full">
                <Link href="/login">Go to login</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 8 characters.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secret">Setup secret</Label>
                <Input
                  id="secret"
                  type="password"
                  required
                  autoComplete="off"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  Must match the <code className="rounded bg-muted px-1 py-0.5">SETUP_SECRET</code> environment variable.
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Generating..." : "Generate login"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
