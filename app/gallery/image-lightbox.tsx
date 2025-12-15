// File: app/gallery/image-lightbox.tsx

"use client"

import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger,
  DialogTitle, // Import DialogTitle
  DialogDescription // Import DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Maximize2, Loader2 } from "lucide-react"

interface ImageLightboxProps {
  src: string
  alt: string
  title?: string | null
  description?: string | null // Add description to props
  children: React.ReactNode
}

export function ImageLightbox({ src, alt, title, description, children }: ImageLightboxProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-5xl w-full h-auto bg-transparent border-none shadow-none p-2">
        
        {/* THIS IS THE FIX: Add a hidden title and description for accessibility */}
        <DialogTitle className="sr-only">{title || 'Full-size Image'}</DialogTitle>
        <DialogDescription className="sr-only">
          {description || `Full-size view of the image titled: ${title || alt}`}
        </DialogDescription>
        
        <div className="relative w-full h-full flex items-center justify-center">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
              <Loader2 className="h-12 w-12 text-white animate-spin" />
            </div>
          )}
          <img
            src={src}
            alt={alt}
            className={`max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setIsLoading(false)}
          />
        </div>
        {title && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm">
            {title}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}