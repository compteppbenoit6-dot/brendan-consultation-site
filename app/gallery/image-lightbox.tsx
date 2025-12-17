// File: app/gallery/image-lightbox.tsx

"use client"

import { useState, useEffect, useCallback } from "react"
import { 
  Dialog, 
  DialogContent,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Loader2, Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react"

interface Image {
  id: string
  src: string
  alt: string | null
  title: string | null
  description: string | null
}

interface ImageLightboxProps {
  images: Image[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onNavigate: (index: number) => void
}

export function ImageLightbox({ images, currentIndex, isOpen, onClose, onNavigate }: ImageLightboxProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isZoomed, setIsZoomed] = useState(false)

  const currentImage = images[currentIndex]
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < images.length - 1

  const goToPrev = useCallback(() => {
    if (hasPrev) {
      setIsLoading(true)
      setIsZoomed(false)
      onNavigate(currentIndex - 1)
    }
  }, [hasPrev, currentIndex, onNavigate])

  const goToNext = useCallback(() => {
    if (hasNext) {
      setIsLoading(true)
      setIsZoomed(false)
      onNavigate(currentIndex + 1)
    }
  }, [hasNext, currentIndex, onNavigate])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev()
      else if (e.key === 'ArrowRight') goToNext()
      else if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, goToPrev, goToNext, onClose])

  const handleDownload = async () => {
    if (!currentImage) return
    try {
      const response = await fetch(currentImage.src)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = currentImage.title || 'image'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  if (!currentImage) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); setIsLoading(true); setIsZoomed(false) }}>
      <DialogContent className="w-[100vw] h-[100vh] max-w-[100vw] max-h-[100vh] bg-black border-none p-0 overflow-hidden rounded-none">
        <DialogTitle className="sr-only">{currentImage.title || 'Full-size Image'}</DialogTitle>
        <DialogDescription className="sr-only">
          {currentImage.description || `Full-size view of the image titled: ${currentImage.title || currentImage.alt}`}
        </DialogDescription>
        
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex-1">
            {currentImage.title && (
              <h3 className="text-white font-medium truncate max-w-md">{currentImage.title}</h3>
            )}
            <span className="text-white/50 text-sm">{currentIndex + 1} / {images.length}</span>
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
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 sm:h-12 sm:w-12 bg-black/50 hover:bg-black/70 text-white hover:text-white rounded-full border border-white/30"
              onClick={onClose}
            >
              <X className="h-6 w-6 sm:h-7 sm:w-7" />
            </Button>
          </div>
        </div>

        {/* Navigation arrows */}
        {hasPrev && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 h-14 w-14 sm:h-16 sm:w-16 bg-black/50 hover:bg-black/70 text-white hover:text-white rounded-full border border-white/30"
            onClick={(e) => { e.stopPropagation(); goToPrev(); }}
          >
            <ChevronLeft className="h-10 w-10 sm:h-12 sm:w-12" />
          </Button>
        )}
        {hasNext && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 h-14 w-14 sm:h-16 sm:w-16 bg-black/50 hover:bg-black/70 text-white hover:text-white rounded-full border border-white/30"
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
          >
            <ChevronRight className="h-10 w-10 sm:h-12 sm:w-12" />
          </Button>
        )}
        
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
            src={currentImage.src}
            alt={currentImage.alt || 'Gallery image'}
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
        {currentImage.description && (
          <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-white/80 text-sm text-center max-w-2xl mx-auto line-clamp-2">
              {currentImage.description}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
