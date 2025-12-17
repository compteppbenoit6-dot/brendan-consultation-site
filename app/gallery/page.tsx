// File: app/gallery/page.tsx

import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Camera, Sparkles } from "lucide-react"
import prisma from "@/lib/prisma"
import { GalleryGrid } from "./gallery-grid"
import { getContent } from "@/lib/content"

export async function generateMetadata(): Promise<Metadata> {
  const blocks = await prisma.contentBlock.findMany({
    where: { key: { in: ['seo_gallery_title', 'seo_gallery_description'] } }
  });
  const content = Object.fromEntries(blocks.map(b => [b.key, b.value]));
  return {
    title: content.seo_gallery_title || "Gallery | Fiz",
    description: content.seo_gallery_description || "Visual moments from the journey of Fiz.",
  };
}

export default async function GalleryPage() {
  const images = await prisma.image.findMany({
    orderBy: { createdAt: 'desc' }
  });
  const content = await getContent();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative py-20 px-4 overflow-hidden">
        {/* Decorative elements - simplified for performance */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
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
            <GalleryGrid images={images} />
          )}
        </div>
      </section>
    </div>
  )
}
