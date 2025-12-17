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
import { Button } from "@/components/ui/button"
import { X, Loader2, Download, ZoomIn, ZoomOut } from "lucide-react"

interface ImageLightboxProps {
  src: string
  alt: string
  title?: string | null
  description?: string | null
  children: React.ReactNode
}

export function ImageLightbox({ src, alt, title, description, children }: ImageLightboxProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isZoomed, setIsZoomed] = useState(false)

  const handleDownload = async () => {
    try {
      const response = await fetch(src)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = title || 'image'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  return (
    <Dialog onOpenChange={() => { setIsLoading(true); setIsZoomed(false) }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[100vw] h-[100vh] max-w-[100vw] max-h-[100vh] bg-black border-none p-0 overflow-hidden rounded-none">
        <DialogTitle className="sr-only">{title || 'Full-size Image'}</DialogTitle>
        <DialogDescription className="sr-only">
          {description || `Full-size view of the image titled: ${title || alt}`}
        </DialogDescription>
        
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex-1">
            {title && (
              <h3 className="text-white font-medium truncate max-w-md">{title}</h3>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-white/70 hover:text-white hover:bg-white/10 rounded-full"
              onClick={() => setIsZoomed(!isZoomed)}
            >
              {isZoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-white/70 hover:text-white hover:bg-white/10 rounded-full"
              onClick={handleDownload}
            >
              <Download className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Image container */}
        <div 
          className={`relative flex items-center justify-center min-h-[50vh] ${isZoomed ? 'cursor-zoom-out overflow-auto' : 'cursor-zoom-in'}`}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-10 w-10 text-white/50 animate-spin" />
                <span className="text-white/50 text-sm">Loading image...</span>
              </div>
            </div>
          )}
          <img
            src={src}
            alt={alt}
            className={`
              ${isZoomed ? 'max-w-none w-auto' : 'w-full h-full max-w-[95vw] max-h-[95vh]'} 
              object-contain transition-all duration-300 ease-out
              ${isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
            `}
            style={isZoomed ? { minWidth: '150%' } : {}}
            onLoad={() => setIsLoading(false)}
          />
        </div>
        
        {/* Bottom bar with description */}
        {description && (
          <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-white/80 text-sm text-center max-w-2xl mx-auto line-clamp-2">
              {description}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
