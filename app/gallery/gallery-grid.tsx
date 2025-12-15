// File: app/gallery/gallery-grid.tsx

"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ImageLightbox } from "./image-lightbox"

interface Image {
  id: string
  src: string
  alt: string | null
  title: string | null
  description: string | null
  category: string | null
}

interface GalleryGridProps {
  images: Image[]
}

// Number of images to load per batch
const BATCH_SIZE = 12

export function GalleryGrid({ images }: GalleryGridProps) {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const loaderRef = useRef<HTMLDivElement>(null)

  // Infinite scroll - load more images when reaching bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < images.length) {
          setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, images.length))
        }
      },
      { rootMargin: "200px" }
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => observer.disconnect()
  }, [visibleCount, images.length])

  const handleImageLoad = useCallback((id: string) => {
    setLoadedImages((prev) => new Set(prev).add(id))
  }, [])

  const visibleImages = images.slice(0, visibleCount)

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
        {visibleImages.map((image, index) => (
          <GalleryItem
            key={image.id}
            image={image}
            index={index}
            isLoaded={loadedImages.has(image.id)}
            onLoad={() => handleImageLoad(image.id)}
          />
        ))}
      </div>
      
      {/* Infinite scroll trigger */}
      {visibleCount < images.length && (
        <div ref={loaderRef} className="flex justify-center py-8">
          <div className="flex items-center gap-2 text-white/50">
            <div className="w-2 h-2 rounded-full bg-white/50 animate-pulse" />
            <span className="text-sm">Loading more...</span>
          </div>
        </div>
      )}
    </>
  )
}

interface GalleryItemProps {
  image: Image
  index: number
  isLoaded: boolean
  onLoad: () => void
}

function GalleryItem({ image, index, isLoaded, onLoad }: GalleryItemProps) {
  const [isInView, setIsInView] = useState(false)
  const itemRef = useRef<HTMLDivElement>(null)

  // Only render image when in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: "100px" }
    )

    if (itemRef.current) {
      observer.observe(itemRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div 
      ref={itemRef}
      className="break-inside-avoid mb-4"
      style={{
        // Stagger animation based on index within current batch
        animationDelay: `${(index % BATCH_SIZE) * 50}ms`
      }}
    >
      <ImageLightbox 
        src={image.src} 
        alt={image.alt || 'Gallery image'} 
        title={image.title}
        description={image.description}
      >
        <div className="group cursor-pointer">
          <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition-colors duration-300">
            {/* Placeholder */}
            {!isLoaded && (
              <div className="aspect-square bg-gradient-to-br from-white/5 to-white/10 animate-pulse" />
            )}
            
            {/* Image - only load when in view */}
            {isInView && (
              <div className={`relative ${!isLoaded ? 'absolute inset-0' : ''}`}>
                <img
                  src={image.src}
                  alt={image.alt || 'Gallery image'}
                  loading="lazy"
                  decoding="async"
                  onLoad={onLoad}
                  className={`
                    w-full h-auto will-change-transform
                    transition-all duration-500 ease-out
                    group-hover:scale-105
                    ${isLoaded ? 'opacity-100' : 'opacity-0'}
                  `}
                  style={{ 
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden'
                  }}
                />
                
                {/* Hover overlay - GPU accelerated */}
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ transform: 'translateZ(0)' }}
                />
                
                {/* Content on hover */}
                <div className="absolute inset-0 p-5 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {image.category && (
                    <span className="inline-flex self-start px-3 py-1 rounded-full text-xs font-medium bg-primary/90 text-white mb-3">
                      {image.category}
                    </span>
                  )}
                  <h3 className="font-serif font-bold text-lg text-white leading-tight mb-1">
                    {image.title || 'Untitled'}
                  </h3>
                  {image.description && (
                    <p className="text-white/70 text-sm line-clamp-2">
                      {image.description}
                    </p>
                  )}
                </div>
                
                {/* Expand icon */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </ImageLightbox>
    </div>
  )
}
