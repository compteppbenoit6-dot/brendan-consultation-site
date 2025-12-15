// File: app/gallery/gallery-grid.tsx

"use client"

import { useState, useEffect, useRef } from "react"
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

const BATCH_SIZE = 16

export function GalleryGrid({ images }: GalleryGridProps) {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE)
  const loaderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < images.length) {
          setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, images.length))
        }
      },
      { rootMargin: "400px" }
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => observer.disconnect()
  }, [visibleCount, images.length])

  const visibleImages = images.slice(0, visibleCount)

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {visibleImages.map((image) => (
          <GalleryItem key={image.id} image={image} />
        ))}
      </div>
      
      {visibleCount < images.length && (
        <div ref={loaderRef} className="flex justify-center py-12">
          <div className="text-white/40 text-sm">Loading more...</div>
        </div>
      )}
    </>
  )
}

function GalleryItem({ image }: { image: Image }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <ImageLightbox 
      src={image.src} 
      alt={image.alt || 'Gallery image'} 
      title={image.title}
      description={image.description}
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-white/5 cursor-pointer group">
        {/* Placeholder */}
        {!loaded && (
          <div className="absolute inset-0 bg-white/5 animate-pulse" />
        )}
        
        <img
          src={image.src}
          alt={image.alt || 'Gallery image'}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`
            w-full h-full object-cover
            transition-opacity duration-300
            ${loaded ? 'opacity-100' : 'opacity-0'}
          `}
        />
        
        {/* Simple hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200" />
        
        {/* Title on hover */}
        {image.title && (
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <p className="text-white text-sm font-medium truncate">{image.title}</p>
          </div>
        )}
      </div>
    </ImageLightbox>
  )
}
