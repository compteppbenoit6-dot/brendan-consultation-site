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

const IMAGES_PER_PAGE = 24

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
    window.scrollTo({ top: 300, behavior: 'smooth' })
  }

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
      {/* Grid - 2 columns max */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
        <div className="mt-10 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
          <div className="flex items-center justify-center gap-2">
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
                        ? 'bg-primary text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {page}
                  </Button>
                ) : (
                  <span key={i} className="px-1 text-white/40">...</span>
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
          <p className="text-center text-white/50 text-xs mt-3">
            {images.length} photos
          </p>
        </div>
      )}
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
      className="animate-in fade-in duration-300"
      style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'both' }}
    >
      <ImageLightbox 
        src={image.src} 
        alt={image.alt || 'Gallery image'} 
        title={image.title}
        description={image.description}
      >
        <div className="group cursor-pointer">
          <div className="relative overflow-hidden rounded-lg bg-white/5 ring-1 ring-white/10 hover:ring-white/30 hover:ring-2 transition-all duration-200">
            {/* Image thumbnail */}
            <img
              src={image.src}
              alt={image.alt || 'Gallery image'}
              loading="lazy"
              decoding="async"
              onLoad={onLoad}
              className={`w-full h-auto block transition-all duration-300 ease-out group-hover:scale-110 group-hover:brightness-110 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
            
            {/* Loading placeholder */}
            {!isLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 animate-pulse" />
            )}
            
            {/* Subtle hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
            
            {/* Expand indicator on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-200">
                <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </ImageLightbox>
    </div>
  )
}
