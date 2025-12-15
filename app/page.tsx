// File: app/page.tsx

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, FileText, Heart, Music, ArrowRight, GraduationCap } from "lucide-react"
import Link from "next/link"
import prisma from "@/lib/prisma"
import { getContent } from "@/lib/content"

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const recentImages = await prisma.image.findMany({
    orderBy: { createdAt: 'desc' },
    take: 2,
  });

  const settings = await prisma.siteSettings.findFirst();
  const content = await getContent();

  return (
    <div className="min-h-screen">
      <div className="text-center py-6 md:py-12 px-4">
        {/* --- MODIFICATION: Added text-white and drop-shadow for readability --- */}
        <h1 className="font-serif font-black text-4xl md:text-7xl text-white drop-shadow-md mb-2 md:mb-4">FIZ</h1>
        {/* --- MODIFICATION: Changed text color and added drop-shadow --- */}
        <p className="text-sm md:text-lg text-neutral-200 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
          {content.home_subtitle || "Pittsburgh's greatest freestyle rapper & beat maker. Making real music with my heart. Been battling \"I don't Give A F*ck\" all my life. It feels good."}
        </p>
      </div>

      <div className="px-2 md:px-4 pb-4 md:pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2 md:gap-6">
            
            {settings?.showPictureSection && (
              <div className="w-[calc(50%-0.25rem)] md:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]">
                <Card className="bg-card/90 backdrop-blur-sm border-2 border-border hover:border-primary/50 transition-colors h-full">
                  <CardContent className="p-3 md:p-6 text-center space-y-2 md:space-y-4">
                    <div className="w-12 h-12 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Camera className="h-6 w-6 md:h-10 md:w-10 text-primary" />
                    </div>
                    <h2 className="font-serif font-bold text-sm md:text-xl text-foreground">Picture Gallery</h2>
                    <p className="text-secondary text-xs md:text-sm hidden md:block">Visual moments from the journey.</p>
                    <div className="bg-muted rounded-lg p-2 md:p-4">
                      <div className="grid grid-cols-2 gap-1 mb-2 md:mb-3">
                        <div className="aspect-square rounded overflow-hidden bg-background/50">
                          {recentImages[0] ? (<img src={recentImages[0].src} alt={recentImages[0].alt || 'Recent image 1'} className="w-full h-full object-cover"/>) : <div className="w-full h-full bg-muted"></div>}
                        </div>
                        <div className="aspect-square rounded overflow-hidden bg-background/50">
                          {recentImages[1] ? (<img src={recentImages[1].src} alt={recentImages[1].alt || 'Recent image 2'} className="w-full h-full object-cover"/>) : <div className="w-full h-full bg-muted"></div>}
                        </div>
                      </div>
                      <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-xs md:text-sm">
                        <Link href="/gallery"><span className="hidden md:inline">View Gallery</span><span className="md:hidden">View</span><ArrowRight className="h-3 w-3 md:h-4 md:w-4 ml-1 md:ml-2" /></Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {settings?.showTextSection && (
              <div className="w-[calc(50%-0.25rem)] md:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]">
                <Card className="bg-muted/90 backdrop-blur-sm border-2 border-border hover:border-accent/50 transition-colors h-full">
                  <CardContent className="p-3 md:p-6 text-center space-y-2 md:space-y-4">
                    <div className="w-12 h-12 md:w-20 md:h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                      <FileText className="h-6 w-6 md:h-10 md:w-10 text-accent" />
                    </div>
                    <h2 className="font-serif font-bold text-sm md:text-xl text-foreground">Text Gallery</h2>
                    <p className="text-secondary text-xs md:text-sm hidden md:block">Raw thoughts, real stories.</p>
                    <div className="bg-background rounded-lg p-2 md:p-4">
                      <div className="text-left space-y-1 mb-2 md:mb-3">
                        <div className="h-1.5 md:h-2 bg-accent/20 rounded w-full"></div>
                        <div className="h-1.5 md:h-2 bg-accent/15 rounded w-3/4"></div>
                        <div className="h-1.5 md:h-2 bg-accent/10 rounded w-1/2"></div>
                      </div>
                      <Button asChild size="sm" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent text-xs md:text-sm">
                        <Link href="/texts"><span className="hidden md:inline">Read Stories</span><span className="md:hidden">Read</span><ArrowRight className="h-3 w-3 md:h-4 md:w-4 ml-1 md:ml-2" /></Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="w-[calc(50%-0.25rem)] md:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]">
              <Card className="bg-card/90 backdrop-blur-sm border-2 border-border hover:border-primary/50 transition-colors h-full">
                <CardContent className="p-3 md:p-6 text-center space-y-2 md:space-y-4">
                  <div className="w-12 h-12 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <GraduationCap className="h-6 w-6 md:h-10 md:w-10 text-primary" />
                  </div>
                  <h2 className="font-serif font-bold text-sm md:text-xl text-foreground">Courses</h2>
                  <p className="text-secondary text-xs md:text-sm hidden md:block">Learn the craft, from beats to flow.</p>
                  <div className="bg-muted rounded-lg p-2 md:p-4">
                    <div className="text-left space-y-1 mb-2 md:mb-3">
                      <p className="text-xs font-bold text-primary">Free & Premium Lessons</p>
                      <p className="text-xs text-muted-foreground">Unlock your creative potential.</p>
                    </div>
                    <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-xs md:text-sm">
                      <Link href="/courses">
                        <span className="hidden md:inline">View Courses</span>
                        <span className="md:hidden">View</span>
                        <ArrowRight className="h-3 w-3 md:h-4 md:w-4 ml-1 md:ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {settings?.showSpiritualSection && (
              <div className="w-[calc(50%-0.25rem)] md:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]">
                <Card className="bg-card/90 backdrop-blur-sm border-2 border-border hover:border-secondary/50 transition-colors h-full">
                  <CardContent className="p-3 md:p-6 text-center space-y-2 md:space-y-4">
                    <div className="w-12 h-12 md:w-20 md:h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                      <Heart className="h-6 w-6 md:h-10 md:w-10 text-secondary" />
                    </div>
                    <h2 className="font-serif font-bold text-sm md:text-xl text-foreground">Spiritual Sessions</h2>
                    <p className="text-secondary text-xs md:text-sm hidden md:block">One-on-one spiritual guidance.</p>
                    <div className="space-y-2 md:space-y-3">
                      <div className="bg-muted rounded-lg p-2 md:p-3">
                        <p className="text-xs md:text-sm text-foreground font-medium">1-Hour Session</p>
                        <p className="text-xs text-muted-foreground hidden md:block">Deep spiritual conversation</p>
                      </div>
                      <Button asChild size="sm" variant="outline" className="w-full border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground bg-transparent text-xs md:text-sm">
                        <Link href="/consultation"><span className="hidden md:inline">Book Session</span><span className="md:hidden">Book</span><ArrowRight className="h-3 w-3 md:h-4 md:w-4 ml-1 md:ml-2" /></Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {settings?.showMusicSection && (
              <div className="w-[calc(50%-0.25rem)] md:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]">
                <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-2 border-border hover:border-primary/30 transition-colors h-full bg-card/90 backdrop-blur-sm">
                  <CardContent className="p-3 md:p-6 text-center space-y-2 md:space-y-4">
                    <div className="w-12 h-12 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Music className="h-6 w-6 md:h-10 md:w-10 text-primary" />
                    </div>
                    <h2 className="font-serif font-bold text-sm md:text-xl text-foreground">Music Universe</h2>
                    <p className="text-secondary text-xs md:text-sm hidden md:block">Beats, freestyles, and tracks.</p>
                    <div className="space-y-2 md:space-y-3">
                      <Button asChild size="sm" className="w-full bg-primary hover:bg-primary/90 text-xs md:text-sm">
                        <Link href="/music"><span className="hidden md:inline">Latest Tracks</span><span className="md:hidden">Tracks</span><Music className="h-3 w-3 md:h-4 md:w-4 ml-1 md:ml-2" /></Link>
                      </Button>
                      <Button asChild size="sm" variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent text-xs md:text-sm">
                        <a href="https://instagram.com/snapcracklefizzle" target="_blank" rel="noopener noreferrer"><span className="hidden md:inline">Follow Journey</span><span className="md:hidden">Follow</span><ArrowRight className="h-3 w-3 md:h-4 md:w-4 ml-1 md:ml-2" /></a>
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground hidden md:block">Find all my music by typing "fiz" on any platform</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}