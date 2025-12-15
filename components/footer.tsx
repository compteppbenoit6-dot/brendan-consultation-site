// File: components/footer.tsx

import { Mail, Youtube } from "lucide-react";
import { getContent } from "@/lib/content";

export async function Footer() {
  const content = await getContent();
  const email = content.footer_email;
  const youtubeUrl = content.footer_youtube_url;

  return (
    <footer className="w-full py-6 px-4 md:px-6 border-t bg-background">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-4 text-center md:justify-between">
        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} FIZ. All Rights Reserved.</p>
        <div className="flex items-center gap-4">
          {email && (
            <a href={`mailto:${email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Mail className="h-4 w-4" />
              <span>{email}</span>
            </a>
          )}
          {youtubeUrl && (
            <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Youtube className="h-4 w-4" />
              <span>YouTube</span>
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}