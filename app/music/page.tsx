// File: app/music/page.tsx

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Music, Play, ExternalLink, Instagram, Video, Headphones } from "lucide-react"
import Link from "next/link"
import prisma from "@/lib/prisma"
import { AudioPlayerButton } from "./audio-player-button"
import { getContent } from "@/lib/content"

export default async function MusicPage() {
  const allTracks = await prisma.musicTrack.findMany({
    orderBy: { createdAt: 'desc' }
  });
  const content = await getContent();

  const beats = allTracks.filter(t => t.type === 'Beat');
  const freestyles = allTracks.filter(t => t.type === 'Freestyle');
  const tracks = allTracks.filter(t => t.type === 'Track');

  return (
    // --- MODIFICATION: Removed the semi-transparent background ---
    <div className="min-h-screen">
      <div className="text-center py-16 px-4">
        <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Music className="h-16 w-16 text-primary" />
        </div>
        {/* --- MODIFICATION: Added text-white and drop-shadow for readability --- */}
        <h1 className="font-serif font-black text-4xl md:text-6xl text-white drop-shadow-md mb-4">
          {content.music_title || "Music Universe"}
        </h1>
        {/* --- MODIFICATION: Changed text color and added drop-shadow --- */}
        <p className="text-lg text-neutral-200 max-w-2xl mx-auto leading-relaxed mb-8 drop-shadow-md">
          {content.music_subtitle || "All my beats, freestyles, and tracks. Made from scratch with pure heart. Real music for the world."}
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-background/80 backdrop-blur-sm">
            <a href="https://instagram.com/snapcracklefizzle" target="_blank" rel="noopener noreferrer">
              <Instagram className="h-4 w-4 mr-2" /> @snapcracklefizzle
            </a>
          </Button>
          <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-background/80 backdrop-blur-sm">
            <a href="https://tiktok.com/@fizzlemusic" target="_blank" rel="noopener noreferrer">
              <Video className="h-4 w-4 mr-2" /> @fizzlemusic
            </a>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground drop-shadow-md">Find all my music by typing "fiz" on any music platform</p>
      </div>

      <div className="px-4 pb-16">
        <div className="max-w-6xl mx-auto space-y-16">
          {beats.length > 0 && (
            <section>
              <div className="text-center mb-12">
                <h2 className="font-serif font-bold text-3xl text-white drop-shadow-md mb-4">Original Beats</h2>
                <p className="text-neutral-200 max-w-2xl mx-auto drop-shadow-md">Every beat made from scratch. No samples, no shortcuts.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {beats.map((beat) => (
                  <Card key={beat.id} className="bg-card/90 backdrop-blur-sm border-2 border-border hover:border-primary/50 transition-colors group">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Headphones className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-serif font-bold text-lg text-foreground group-hover:text-primary transition-colors">{beat.title}</h3>
                            <p className="text-xs text-muted-foreground">{beat.type} • {beat.duration}</p>
                          </div>
                        </div>
                        <AudioPlayerButton src={beat.audioSrc} />
                      </div>
                      <p className="text-secondary text-sm">{beat.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {freestyles.length > 0 && (
            <section>
              <div className="text-center mb-12">
                <h2 className="font-serif font-bold text-3xl text-white drop-shadow-md mb-4">Freestyle Sessions</h2>
                <p className="text-neutral-200 max-w-2xl mx-auto drop-shadow-md">Raw, unscripted flow straight from the heart.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {freestyles.map((freestyle) => (
                  <Card key={freestyle.id} className="bg-muted/90 backdrop-blur-sm border-2 border-border hover:border-accent/50 transition-colors group">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Play className="h-8 w-8 text-accent" />
                      </div>
                      <h3 className="font-serif font-bold text-lg text-foreground group-hover:text-accent transition-colors mb-2">{freestyle.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3">{freestyle.type} • {freestyle.duration}</p>
                      <p className="text-secondary text-sm mb-4">{freestyle.description}</p>
                      <AudioPlayerButton src={freestyle.audioSrc} variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {tracks.length > 0 && (
            <section>
              <div className="text-center mb-12">
                <h2 className="font-serif font-bold text-3xl text-white drop-shadow-md mb-4">Full Tracks</h2>
                <p className="text-neutral-200 max-w-2xl mx-auto drop-shadow-md">Complete songs with beats, lyrics, and soul.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {tracks.map((track) => (
                  <Card key={track.id} className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-border hover:border-primary/30 transition-colors group bg-card/90 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Music className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="font-serif font-bold text-xl text-foreground group-hover:text-primary transition-colors mb-2">{track.title}</h3>
                      <p className="text-xs text-muted-foreground mb-4">{track.type} • {track.duration}</p>
                      <p className="text-secondary mb-6">{track.description}</p>
                      <div className="flex justify-center space-x-3">
                        <AudioPlayerButton src={track.audioSrc} />
                        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent">
                          <ExternalLink className="h-4 w-4 mr-2" /> Stream
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {allTracks.length === 0 && (
            <div className="text-center py-16 bg-black/20 rounded-lg">
              <Music className="h-16 w-16 text-secondary mx-auto mb-4" />
              <h3 className="font-serif font-bold text-xl text-white mb-2">The Studio is Quiet</h3>
              <p className="text-neutral-300">New music is on the way. Check back soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}