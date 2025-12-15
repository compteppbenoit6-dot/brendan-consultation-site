// File: app/gallery/page.tsx

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Camera, Sparkles } from "lucide-react"
import prisma from "@/lib/prisma"
import { ImageLightbox } from "./image-lightbox"
import { getContent } from "@/lib/content"

export default async function GalleryPage() {
  const images = await prisma.image.findMany({
    orderBy: { createdAt: 'desc' }
  });
  const content = await getContent();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative py-20 px-4 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <Button 
            variant="ghost" 
            asChild 
            className="mb-8 text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-white/80">Visual Journey</span>
          </div>
          
          <h1 className="font-serif font-black text-5xl md:text-7xl text-white mb-6 tracking-tight">
            {content.gallery_title || "Picture Gallery"}
          </h1>
          
          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            {content.gallery_subtitle || "Visual moments from the journey. Life through my lens, beats through my soul."}
          </p>
          
          {images.length > 0 && (
            <div className="mt-8 flex items-center justify-center gap-6 text-white/60">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                <span>{images.length} photos</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gallery Section */}
      <section className="py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {images.length === 0 ? (
            <div className="text-center py-24 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
                <Camera className="h-10 w-10 text-white/50" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-white mb-3">The Gallery is Quiet</h3>
              <p className="text-white/60 max-w-md mx-auto">Check back soon for new visual moments from the journey.</p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {images.map((image, index) => (
                <ImageLightbox 
                  key={image.id} 
                  src={image.src} 
                  alt={image.alt || 'Gallery image'} 
                  title={image.title}
                  description={image.description}
                >
                  <div className="break-inside-avoid group cursor-pointer">
                    <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-500">
                      {/* Image */}
                      <div className="relative overflow-hidden">
                        <img
                          src={image.src}
                          alt={image.alt || 'Gallery image'}
                          loading="lazy"
                          className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Content on hover */}
                        <div className="absolute inset-0 p-5 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
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
                        <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </ImageLightbox>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
