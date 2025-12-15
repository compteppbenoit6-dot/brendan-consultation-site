// File: app/texts/[slug]/page.tsx

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Tag } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"

export async function generateStaticParams() {
  const posts = await prisma.textPost.findMany({ select: { slug: true } });
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function TextPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.textPost.findUnique({
    where: { slug }
  });

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Button asChild variant="ghost" className="mb-8 text-accent hover:text-accent-foreground hover:bg-accent/10">
            <Link href="/texts">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Text Gallery
            </Link>
          </Button>
        </div>
      </div>

      <div className="px-4 pb-16">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-card border-2 border-border">
            {post.imageUrl && (
              <div className="aspect-video overflow-hidden rounded-t-xl border-b">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardContent className="p-8 md:p-12">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-8">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Tag className="h-4 w-4" />
                    <span className="bg-accent/10 text-accent px-2 py-1 rounded-full font-medium">{post.category}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <h1 className="font-serif font-black text-3xl md:text-4xl text-foreground mb-8 leading-tight">
                {post.title}
              </h1>

              <div className="prose prose-lg max-w-none">
                {post.content.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="text-secondary leading-relaxed mb-6 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-border">
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Written by Fiz • Pittsburgh's finest freestyle rapper & beat maker
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent">
                      <Link href="/consultation">Book Spiritual Session</Link>
                    </Button>
                    <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent">
                      <Link href="/music">Listen to Music</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}