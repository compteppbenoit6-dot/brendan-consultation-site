// File: app/gallery/page.tsx

import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Camera } from "lucide-react"
import prisma from "@/lib/prisma"
import { GalleryGrid } from "./gallery-grid"
import { getContent } from "@/lib/content"

export async function generateMetadata(): Promise<Metadata> {
  const blocks = await prisma.contentBlock.findMany({
    where: { key: { in: ["seo_gallery_title", "seo_gallery_description"] } },
  })
  const content = Object.fromEntries(blocks.map((b) => [b.key, b.value]))
  return {
    title: content.seo_gallery_title || "Gallery | Fiz",
    description:
      content.seo_gallery_description ||
      "Visual moments from the journey of Fiz.",
  }
}

export default async function GalleryPage() {
  const [images, content] = await Promise.all([
    prisma.image.findMany({ orderBy: { createdAt: "desc" } }),
    getContent(),
  ])

  // ImageGallery JSON-LD for richer search results.
  const jsonLd =
    images.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ImageGallery",
          name: content.gallery_title || "Picture Gallery",
          description:
            content.gallery_subtitle ||
            "Visual moments from the journey of Fiz.",
          image: images.slice(0, 30).map((img) => ({
            "@type": "ImageObject",
            contentUrl: img.src,
            name: img.title || undefined,
            description: img.description || undefined,
            caption: img.alt || undefined,
            uploadDate: img.createdAt.toISOString(),
          })),
        }
      : null

  return (
    <div className="min-h-screen">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <section className="relative overflow-hidden px-4 pt-12 pb-8 md:pt-20 md:pb-12">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -bottom-24 right-1/4 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <Button
            variant="ghost"
            asChild
            className="mb-6 rounded-full border border-white/20 bg-white/5 text-white/80 backdrop-blur-sm hover:bg-white/10 hover:text-white"
          >
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to home
            </Link>
          </Button>

          <h1 className="animate-fade-up font-serif font-black text-5xl md:text-7xl text-white tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
            {content.gallery_title || "Picture Gallery"}
          </h1>

          <p
            className="animate-fade-up mt-4 mx-auto max-w-2xl text-base md:text-lg leading-relaxed text-white/85 drop-shadow text-balance"
            style={{ animationDelay: "120ms" }}
          >
            {content.gallery_subtitle ||
              "Visual moments from the journey. Life through my lens, beats through my soul."}
          </p>

          {images.length > 0 && (
            <div
              className="animate-fade-up mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white/85 backdrop-blur-sm"
              style={{ animationDelay: "200ms" }}
            >
              <Camera className="h-3.5 w-3.5" />
              {images.length} {images.length === 1 ? "photo" : "photos"}
            </div>
          )}
        </div>
      </section>

      <section className="px-4 pb-16 md:px-8">
        <div className="mx-auto max-w-7xl">
          {images.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-24 text-center backdrop-blur-sm">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                <Camera className="h-7 w-7 text-white/70" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-white">
                The Gallery is Quiet
              </h3>
              <p className="mt-2 text-sm text-white/70">
                Check back soon for new visual moments from the journey.
              </p>
            </div>
          ) : (
            <GalleryGrid images={images} />
          )}
        </div>
      </section>
    </div>
  )
}
