// File: components/footer.tsx

import { Mail, Youtube } from "lucide-react"
import { getContent } from "@/lib/content"

export async function Footer() {
  const content = await getContent()
  const email = content.footer_email
  const youtubeUrl = content.footer_youtube_url

  return (
    <footer className="w-full border-t border-border/60 bg-background/80 px-4 py-6 backdrop-blur-sm md:px-6">
      <div className="container mx-auto flex flex-col items-center justify-center gap-3 text-center md:flex-row md:justify-between">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} <span className="font-serif font-bold tracking-wider">FIZ</span>. All rights reserved.
        </p>
        <div className="flex items-center gap-3">
          {email && (
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>{email}</span>
            </a>
          )}
          {youtubeUrl && (
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              <Youtube className="h-3.5 w-3.5" />
              <span>YouTube</span>
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}
