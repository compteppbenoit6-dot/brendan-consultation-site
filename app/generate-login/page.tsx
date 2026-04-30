"use client"

import { useState } from "react"
import Link from "next/link"
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
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <h1 className="font-serif font-black text-4xl text-foreground">FIZ</h1>
          <CardTitle className="text-2xl">Generate Admin Login</CardTitle>
          <CardDescription>
            Recreate or reset the admin account for this site.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
            <p className="font-semibold">Security warning</p>
            <p className="mt-1">
              This page can create admin accounts. It is protected by a setup
              secret stored on the server. After you sign in successfully,
              delete <code>app/generate-login/</code> and{" "}
              <code>app/api/generate-login/</code> from the repo and rotate the
              setup secret.
            </p>
          </div>

          {done ? (
            <div className="space-y-4">
              <p className="text-sm text-foreground">
                Login created. You can now sign in with the credentials you just
                set.
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
                  Must match the <code>SETUP_SECRET</code> environment variable
                  on the server.
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
