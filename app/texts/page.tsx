// File: app/texts/page.tsx

import type { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ArrowRight, Calendar } from "lucide-react"
import Link from "next/link"
import prisma from "@/lib/prisma"
import { getContent } from "@/lib/content"

export async function generateMetadata(): Promise<Metadata> {
  const blocks = await prisma.contentBlock.findMany({
    where: { key: { in: ['seo_texts_title', 'seo_texts_description'] } }
  });
  const content = Object.fromEntries(blocks.map(b => [b.key, b.value]));
  return {
    title: content.seo_texts_title || "Texts | Fiz",
    description: content.seo_texts_description || "Raw thoughts and real stories from Fiz.",
  };
}

export default async function TextsPage() {
  const texts = await prisma.textPost.findMany({
    orderBy: { publishedAt: 'desc' }
  });
  const content = await getContent();

  return (
    // --- MODIFICATION: Removed the background class ---
    <div className="min-h-screen">
      <div className="text-center py-16 px-4">
        <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileText className="h-12 w-12 text-accent" />
        </div>
        {/* --- MODIFICATION: Added text-white and drop-shadow for readability --- */}
        <h1 className="font-serif font-black text-4xl md:text-6xl text-white drop-shadow-md mb-4">
          {content.texts_title || "Text Gallery"}
        </h1>
        {/* --- MODIFICATION: Changed text color and added drop-shadow --- */}
        <p className="text-lg text-neutral-200 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
          {content.texts_subtitle || "Raw thoughts, real stories. Words straight from the soul of a Pittsburgh beat maker."}
        </p>
      </div>

      <div className="px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          {texts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {texts.map((text) => (
                <Card
                  key={text.id}
                  className="bg-card/90 backdrop-blur-sm border-2 border-border hover:border-accent/50 transition-all duration-300 group flex flex-col"
                >
                  {text.imageUrl && (
                    <div className="aspect-video overflow-hidden rounded-t-xl border-b">
                      <img 
                        src={text.imageUrl} 
                        alt={text.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardContent className="p-6 space-y-4 flex-1 flex flex-col">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="bg-accent/10 text-accent px-2 py-1 rounded-full font-medium">{text.category}</span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(text.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <h2 className="font-serif font-bold text-xl text-foreground group-hover:text-accent transition-colors">
                      {text.title}
                    </h2>
                    <p className="text-secondary text-sm leading-relaxed flex-1">{text.excerpt}</p>
                    <Button asChild variant="ghost" className="w-full justify-between text-accent hover:text-accent-foreground hover:bg-accent/10 p-0 h-auto py-3 mt-auto">
                      <Link href={`/texts/${text.slug}`}>
                        Read Full Story
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-black/20 rounded-lg">
              <FileText className="h-16 w-16 text-secondary mx-auto mb-4" />
              <h3 className="font-serif font-bold text-xl text-white mb-2">The Page is Blank</h3>
              <p className="text-neutral-300">New stories and thoughts are coming soon.</p>
            </div>
          )}
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-background/80 backdrop-blur-sm">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}