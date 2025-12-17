// File: app/courses/page.tsx

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, GraduationCap } from "lucide-react";
import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";

export default async function CoursesPage() {
  const [courses, contentBlocks] = await Promise.all([
    prisma.course.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.contentBlock.findMany({ where: { key: { in: ['courses_title', 'courses_subtitle'] } } })
  ]);

  const content = Object.fromEntries(contentBlocks.map(b => [b.key, b.value]));
  const title = content.courses_title || 'Courses';
  const subtitle = content.courses_subtitle || 'Learn the craft, from beatmaking fundamentals to advanced freestyle techniques.';

  return (
    // --- MODIFICATION: Removed the background class ---
    <div className="min-h-screen">
      <div className="text-center py-16 px-4">
        <Button variant="ghost" asChild className="mb-8 text-accent hover:text-accent-foreground hover:bg-accent/10 bg-background/50 backdrop-blur-sm rounded-full">
          <Link href="/"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Home</Link>
        </Button>
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <GraduationCap className="h-12 w-12 text-primary" />
        </div>
        <h1 className="font-serif font-black text-4xl md:text-6xl text-white drop-shadow-md mb-4">{title}</h1>
        <p className="text-lg text-neutral-200 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
          {subtitle}
        </p>
      </div>

      <div className="px-4 pb-16 space-y-16">
        {courses.length > 0 ? (
          <section className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <Link key={course.id} href={`/courses/${course.id}`} className="block group">
                  <Card className="bg-card/90 backdrop-blur-sm border-2 border-border hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
                    <div className="aspect-video overflow-hidden bg-muted relative">
                      {course.coverImageUrl ? (
                        <img src={course.coverImageUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <GraduationCap className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <Badge className="absolute top-2 right-2" variant={course.isPremium ? "default" : "secondary"}>
                        {course.isPremium ? `$${course.price}` : "Free"}
                      </Badge>
                    </div>
                    <CardContent className="p-4 flex-1 flex flex-col">
                      <h3 className="font-serif font-bold text-lg text-foreground group-hover:text-primary transition-colors mb-2">{course.title}</h3>
                      <p className="text-secondary text-sm flex-1">{course.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <div className="text-center py-16 bg-black/20 rounded-lg">
            <GraduationCap className="h-16 w-16 text-secondary mx-auto mb-4" />
            <h3 className="font-serif font-bold text-xl text-white mb-2">No Courses Yet</h3>
            <p className="text-neutral-300">New lessons are coming soon. Stay tuned!</p>
          </div>
        )}
      </div>
    </div>
  );
}