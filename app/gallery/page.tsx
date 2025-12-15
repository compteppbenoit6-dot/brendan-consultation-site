// File: app/gallery/page.tsx

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Camera } from "lucide-react"
import prisma from "@/lib/prisma"
import { ImageLightbox } from "./image-lightbox"
import { getContent } from "@/lib/content"

export default async function GalleryPage() {
  const images = await prisma.image.findMany({
    orderBy: { createdAt: 'desc' }
  });
  const content = await getContent();

  return (
    // --- MODIFICATION: Removed the background class ---
    <div className="min-h-screen">
      <div className="text-center py-16 px-4">
        <Button variant="ghost" asChild className="mb-8 text-accent hover:text-accent-foreground hover:bg-accent/10 bg-background/50 backdrop-blur-sm rounded-full">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Camera className="h-12 w-12 text-primary" />
        </div>
        {/* --- MODIFICATION: Added text-white and drop-shadow for readability --- */}
        <h1 className="font-serif font-black text-4xl md:text-6xl text-white drop-shadow-md mb-4">
          {content.gallery_title || "Picture Gallery"}
        </h1>
        {/* --- MODIFICATION: Changed text color and added drop-shadow --- */}
        <p className="text-lg text-neutral-200 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
          {content.gallery_subtitle || "Visual moments from the journey. Life through my lens, beats through my soul."}
        </p>
      </div>

      <section className="py-12 px-4">
        <div className="container mx-auto">
          {images.length === 0 ? (
             <div className="text-center py-12 bg-black/20 rounded-lg">
              <Camera className="h-16 w-16 text-secondary mx-auto mb-4" />
              <h3 className="font-serif font-bold text-xl text-white mb-2">The Gallery is Quiet</h3>
              <p className="text-neutral-300">Check back soon for new visual moments.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {images.map((image) => (
                <ImageLightbox 
                  key={image.id} 
                  src={image.src} 
                  alt={image.alt || 'Gallery image'} 
                  title={image.title}
                  description={image.description}
                >
                  <Card
                    className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 bg-card/90 backdrop-blur-sm cursor-pointer"
                  >
                    <div className="aspect-square overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
                      <img
                        src={image.src}
                        alt={image.alt || 'Gallery image thumbnail'}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 space-y-3">
                      {image.category && (
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                          {image.category}
                        </span>
                      )}
                      <h3 className="font-serif font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                        {image.title || 'Untitled'}
                      </h3>
                      <p className="text-secondary text-sm leading-relaxed line-clamp-2">
                        {image.description || 'No description available.'}
                      </p>
                    </div>
                  </Card>
                </ImageLightbox>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}