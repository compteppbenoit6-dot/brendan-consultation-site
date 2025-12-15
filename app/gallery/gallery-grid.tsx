// File: app/gallery/gallery-grid.tsx

"use client"

import { useState, useCallback, useMemo } from "react"
import { ImageLightbox } from "./image-lightbox"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

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

const IMAGES_PER_PAGE = 12

export function GalleryGrid({ images }: GalleryGridProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())

  const totalPages = Math.ceil(images.length / IMAGES_PER_PAGE)
  
  const currentImages = useMemo(() => {
    const start = (currentPage - 1) * IMAGES_PER_PAGE
    return images.slice(start, start + IMAGES_PER_PAGE)
  }, [images, currentPage])

  const handleImageLoad = useCallback((id: string) => {
    setLoadedImages((prev) => new Set(prev).add(id))
  }, [])

  const goToPage = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of gallery smoothly
    window.scrollTo({ top: 300, behavior: 'smooth' })
  }

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }
    
    return pages
  }

  return (
    <div>
      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {currentImages.map((image, index) => (
          <GalleryItem
            key={image.id}
            image={image}
            index={index}
            isLoaded={loadedImages.has(image.id)}
            onLoad={() => handleImageLoad(image.id)}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-10 w-10 rounded-full text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, i) => (
              typeof page === 'number' ? (
                <Button
                  key={i}
                  variant="ghost"
                  onClick={() => goToPage(page)}
                  className={`h-10 w-10 rounded-full text-sm font-medium transition-all ${
                    currentPage === page
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {page}
                </Button>
              ) : (
                <span key={i} className="px-2 text-white/40">...</span>
              )
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-10 w-10 rounded-full text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Page info */}
      <p className="text-center text-white/40 text-sm mt-4">
        Page {currentPage} of {totalPages} • {images.length} photos
      </p>
    </div>
  )
}

interface GalleryItemProps {
  image: Image
  index: number
  isLoaded: boolean
  onLoad: () => void
}

function GalleryItem({ image, index, isLoaded, onLoad }: GalleryItemProps) {
  return (
    <div 
      className="animate-in fade-in slide-in-from-bottom-4 duration-500"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
    >
      <ImageLightbox 
        src={image.src} 
        alt={image.alt || 'Gallery image'} 
        title={image.title}
        description={image.description}
      >
        <div className="group cursor-pointer">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-white/5 border border-white/10 hover:border-white/30 transition-colors duration-200">
            {/* Placeholder */}
            {!isLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 animate-pulse" />
            )}
            
            {/* Image */}
            <img
              src={image.src}
              alt={image.alt || 'Gallery image'}
              loading="lazy"
              decoding="async"
              onLoad={onLoad}
              className={`
                w-full h-full object-cover
                transition-all duration-300 ease-out
                group-hover:scale-105
                ${isLoaded ? 'opacity-100' : 'opacity-0'}
              `}
            />
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            
            {/* Content on hover */}
            <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {image.category && (
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/90 text-white mb-1">
                  {image.category}
                </span>
              )}
              <h3 className="font-medium text-sm text-white truncate">
                {image.title || 'Untitled'}
              </h3>
            </div>
            
            {/* Expand icon */}
            <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </div>
          </div>
        </div>
      </ImageLightbox>
    </div>
  )
}
