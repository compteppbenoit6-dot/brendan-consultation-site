"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Search } from "lucide-react"
import { ImageLightbox } from "./image-lightbox"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { thumbnailSrcSet } from "@/lib/image"

// Roughly: above-the-fold images on a 5-col xl grid = first row.
// We hint the browser to fetch the first dozen with high priority.
const PRIORITY_COUNT = 12

// Sizes attribute matches the responsive grid (2/3/4/5 cols, container max-w-7xl ~1280px).
const THUMB_SIZES =
  "(min-width: 1280px) 240px, (min-width: 1024px) 256px, (min-width: 640px) 33vw, 50vw"

interface GalleryImage {
  id: string
  src: string
  alt: string | null
  title: string | null
  description: string | null
  category: string | null
}

interface GalleryGridProps {
  images: GalleryImage[]
}

const PAGE_SIZE = 24

export function GalleryGrid({ images }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const gridRef = useRef<HTMLDivElement | null>(null)

  const categories = useMemo(() => {
    const set = new Set<string>()
    for (const img of images) {
      if (img.category) set.add(img.category)
    }
    return ["All", ...Array.from(set).sort()]
  }, [images])

  const filteredImages = useMemo(() => {
    if (activeCategory === "All") return images
    return images.filter((img) => img.category === activeCategory)
  }, [images, activeCategory])

  // Reset paging when filter changes.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [activeCategory])

  const visibleImages = filteredImages.slice(0, visibleCount)
  const hasMore = visibleCount < filteredImages.length

  const openLightbox = (index: number) => {
    // Use the View Transitions API for a smooth thumb→lightbox morph when supported.
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      ;(document as Document & {
        startViewTransition: (cb: () => void) => unknown
      }).startViewTransition(() => setLightboxIndex(index))
      return
    }
    setLightboxIndex(index)
  }

  const closeLightbox = () => {
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      ;(document as Document & {
        startViewTransition: (cb: () => void) => unknown
      }).startViewTransition(() => setLightboxIndex(null))
      return
    }
    setLightboxIndex(null)
  }

  const showMore = () => {
    setVisibleCount((c) => Math.min(c + PAGE_SIZE, filteredImages.length))
  }

  return (
    <div ref={gridRef}>
      {categories.length > 2 && (
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-all",
                activeCategory === category
                  ? "border-white/50 bg-white/15 text-white shadow-sm"
                  : "border-white/15 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/10 hover:text-white"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {filteredImages.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-16 text-center backdrop-blur-sm">
          <Search className="mx-auto mb-4 h-8 w-8 text-white/40" />
          <p className="text-white/70">No photos in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 xl:grid-cols-5">
          {visibleImages.map((image, index) => (
            <Thumbnail
              key={image.id}
              image={image}
              priority={index < PRIORITY_COUNT}
              activeViewTransition={lightboxIndex === index}
              onOpen={() => openLightbox(index)}
            />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <Button
            variant="outline"
            onClick={showMore}
            className="rounded-full border-white/20 bg-white/5 px-6 text-white backdrop-blur-sm hover:border-white/40 hover:bg-white/10 hover:text-white"
          >
            Show more ({filteredImages.length - visibleCount} left)
          </Button>
        </div>
      )}

      {filteredImages.length > 0 && (
        <p className="mt-6 text-center text-xs text-white/50">
          Showing {visibleImages.length} of {filteredImages.length}
          {activeCategory !== "All" && ` in "${activeCategory}"`}
        </p>
      )}

      <ImageLightbox
        images={filteredImages}
        index={lightboxIndex}
        onClose={closeLightbox}
        onIndexChange={setLightboxIndex}
      />
    </div>
  )
}

function Thumbnail({
  image,
  priority,
  activeViewTransition,
  onOpen,
}: {
  image: GalleryImage
  priority: boolean
  activeViewTransition: boolean
  onOpen: () => void
}) {
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  // Cached images can complete before React attaches the onLoad listener.
  const setRef = (node: HTMLImageElement | null) => {
    imgRef.current = node
    if (node?.complete && node.naturalWidth > 0) {
      setLoaded(true)
    }
  }

  const srcSet = thumbnailSrcSet(image.src)

  // The active thumbnail (the one being opened) shares its view-transition-name
  // with the lightbox image so the browser morphs between them.
  const viewTransitionStyle = activeViewTransition
    ? ({ viewTransitionName: "gallery-active-image" } as React.CSSProperties)
    : undefined

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={image.alt || image.title || "Open image"}
      className="group relative block aspect-square overflow-hidden rounded-lg bg-white/5 ring-1 ring-white/10 transition-all duration-200 hover:ring-2 hover:ring-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      style={viewTransitionStyle}
    >
      {!loaded && !errored && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/10 via-white/5 to-white/10" />
      )}

      {errored ? (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-white/50">
          unavailable
        </div>
      ) : (
        <img
          ref={setRef}
          src={image.src}
          srcSet={srcSet}
          sizes={srcSet ? THUMB_SIZES : undefined}
          alt={image.alt || image.title || ""}
          loading={priority ? "eager" : "lazy"}
          // @ts-expect-error fetchpriority is a valid HTML attribute, types lag.
          fetchpriority={priority ? "high" : "low"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-[transform,opacity] duration-500 ease-out group-hover:scale-[1.04]",
            loaded ? "opacity-100" : "opacity-0"
          )}
          draggable={false}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      {image.title && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="line-clamp-1 text-xs font-medium text-white drop-shadow">{image.title}</p>
        </div>
      )}
    </button>
  )
}
