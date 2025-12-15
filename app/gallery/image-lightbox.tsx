// File: app/gallery/image-lightbox.tsx

"use client"

import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

interface ImageLightboxProps {
  src: string
  alt: string
  title?: string | null
  description?: string | null
  children: React.ReactNode
}

export function ImageLightbox({ src, alt, title, description, children }: ImageLightboxProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <Dialog onOpenChange={() => setIsLoading(true)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-auto h-auto bg-black/95 border-white/10 p-2">
        <DialogTitle className="sr-only">{title || 'Image'}</DialogTitle>
        <DialogDescription className="sr-only">{description || alt}</DialogDescription>
        
        <div className="relative flex items-center justify-center min-h-[300px]">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-white/50 animate-spin" />
            </div>
          )}
          <img
            src={src}
            alt={alt}
            className={`max-w-full max-h-[90vh] object-contain rounded-lg ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setIsLoading(false)}
          />
        </div>
        
        {title && (
          <div className="text-center mt-3 text-white/80 text-sm">{title}</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
