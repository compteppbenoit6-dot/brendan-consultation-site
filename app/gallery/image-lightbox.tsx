"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Download, Loader2, X } from "lucide-react"

interface LightboxImage {
  id: string
  src: string
  alt: string | null
  title: string | null
  description: string | null
}

interface ImageLightboxProps {
  images: LightboxImage[]
  index: number | null
  onClose: () => void
  onIndexChange: (index: number) => void
}

const SWIPE_THRESHOLD_PX = 60

export function ImageLightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: ImageLightboxProps) {
  const isOpen = index !== null
  const safeIndex = index ?? 0
  const current = images[safeIndex]
  const hasPrev = isOpen && safeIndex > 0
  const hasNext = isOpen && safeIndex < images.length - 1

  const [loaded, setLoaded] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  // Reset loading state when navigating to a new image.
  useEffect(() => {
    if (!isOpen) return
    setLoaded(false)
  }, [safeIndex, isOpen])

  const goToPrev = useCallback(() => {
    if (safeIndex > 0) onIndexChange(safeIndex - 1)
  }, [safeIndex, onIndexChange])

  const goToNext = useCallback(() => {
    if (safeIndex < images.length - 1) onIndexChange(safeIndex + 1)
  }, [safeIndex, images.length, onIndexChange])

  // Keyboard navigation.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrev()
      else if (e.key === "ArrowRight") goToNext()
      else if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpen, goToPrev, goToNext, onClose])

  // Preload neighbors so navigation feels instant.
  useEffect(() => {
    if (!isOpen) return
    const preload = (src?: string) => {
      if (!src || typeof window === "undefined") return
      const img = new window.Image()
      img.src = src
    }
    preload(images[safeIndex + 1]?.src)
    preload(images[safeIndex - 1]?.src)
  }, [isOpen, safeIndex, images])

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    touchStartX.current = null
    touchStartY.current = null

    // Only treat as swipe if mostly horizontal.
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD_PX) {
      if (dx > 0) goToPrev()
      else goToNext()
    }
  }

  const handleDownload = async () => {
    if (!current) return
    try {
      const res = await fetch(current.src)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      const safeName = (current.title || "image").replace(/[^a-zA-Z0-9._-]+/g, "_")
      a.download = safeName
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {
      // Fall back to opening the image in a new tab.
      window.open(current.src, "_blank", "noopener,noreferrer")
    }
  }

  if (!isOpen || !current) return null

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="h-[100dvh] max-h-[100dvh] w-screen max-w-none overflow-hidden border-none bg-black p-0 text-white"
      >
        <DialogTitle className="sr-only">
          {current.title || current.alt || "Gallery image"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {current.description ||
            `Viewing image ${safeIndex + 1} of ${images.length}`}
        </DialogDescription>

        {/* Top bar */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 bg-gradient-to-b from-black/70 via-black/30 to-transparent p-3 sm:p-4"
          style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
        >
          <div className="pointer-events-auto min-w-0 flex-1">
            {current.title && (
              <h3 className="truncate text-sm font-medium text-white sm:text-base">
                {current.title}
              </h3>
            )}
            <p className="text-xs text-white/60">
              {safeIndex + 1} / {images.length}
            </p>
          </div>
          <div className="pointer-events-auto flex shrink-0 items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              aria-label="Download image"
              className="h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close"
              className="h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Image stage with swipe handlers */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-white/60" />
            </div>
          )}
          <img
            key={current.id}
            src={current.src}
            alt={current.alt || current.title || ""}
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(true)}
            draggable={false}
            className={`max-h-[100dvh] max-w-[100vw] object-contain transition-opacity duration-300 ${
              loaded ? "opacity-100" : "opacity-0"
            } px-2 sm:px-16`}
          />
        </div>

        {/* Side nav buttons (hidden on small screens — swipe instead) */}
        {hasPrev && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              goToPrev()
            }}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white sm:inline-flex"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}
        {hasNext && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              goToNext()
            }}
            aria-label="Next image"
            className="absolute right-3 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white sm:inline-flex"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}

        {/* Bottom caption + dot indicator on mobile */}
        {(current.description || images.length > 1) && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-2 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 py-3 sm:py-4"
            style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
          >
            {current.description && (
              <p className="line-clamp-2 max-w-2xl text-center text-xs text-white/85 sm:text-sm">
                {current.description}
              </p>
            )}
            {images.length > 1 && images.length <= 12 && (
              <div className="pointer-events-auto flex items-center gap-1.5 sm:hidden">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onIndexChange(i)}
                    aria-label={`Go to image ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      i === safeIndex ? "w-6 bg-white" : "w-1.5 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
