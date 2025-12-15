// File: app/gallery/page.tsx

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Camera } from "lucide-react"
import prisma from "@/lib/prisma"
import { GalleryGrid } from "./gallery-grid"
import { getContent } from "@/lib/content"

export default async function GalleryPage() {
  const images = await prisma.image.findMany({
    orderBy: { createdAt: 'desc' }
  });
  const content = await getContent();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="py-16 px-4 text-center">
        <Button 
          variant="ghost" 
          asChild 
          className="mb-8 text-white/70 hover:text-white hover:bg-white/10 rounded-full"
        >
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        
        <h1 className="font-serif font-bold text-4xl md:text-6xl text-white mb-4">
          {content.gallery_title || "Picture Gallery"}
        </h1>
        
        <p className="text-lg text-white/60 max-w-xl mx-auto">
          {content.gallery_subtitle || "Visual moments from the journey."}
        </p>
        
        {images.length > 0 && (
          <p className="mt-4 text-white/40 text-sm">{images.length} photos</p>
        )}
      </div>

      {/* Gallery */}
      <section className="pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {images.length === 0 ? (
            <div className="text-center py-20">
              <Camera className="h-12 w-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/50">No photos yet.</p>
            </div>
          ) : (
            <GalleryGrid images={images} />
          )}
        </div>
      </section>
    </div>
  )
}
