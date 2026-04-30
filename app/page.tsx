// File: app/page.tsx

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, FileText, Heart, Music, ArrowRight, GraduationCap } from "lucide-react"
import Link from "next/link"
import prisma from "@/lib/prisma"
import { getContent } from "@/lib/content"

export const dynamic = 'force-dynamic'

type SectionCardProps = {
  href: string
  external?: boolean
  icon: React.ReactNode
  title: string
  description: string
  cta: string
  accent?: "primary" | "accent" | "secondary"
  children?: React.ReactNode
  delay?: string
}

function SectionCard({ href, external, icon, title, description, cta, accent = "primary", children, delay }: SectionCardProps) {
  const accentRing =
    accent === "secondary"
      ? "hover:border-secondary/60 hover:shadow-[0_0_0_1px_var(--color-secondary),0_20px_40px_-20px_var(--color-secondary)]"
      : accent === "accent"
      ? "hover:border-accent/60 hover:shadow-[0_0_0_1px_var(--color-accent),0_20px_40px_-20px_var(--color-accent)]"
      : "hover:border-primary/60 hover:shadow-[0_0_0_1px_var(--color-primary),0_20px_40px_-20px_var(--color-primary)]"

  const iconBg =
    accent === "secondary"
      ? "bg-secondary/10 text-secondary"
      : accent === "accent"
      ? "bg-accent/10 text-accent"
      : "bg-primary/10 text-primary"

  return (
    <Card
      className={`group bg-card/70 backdrop-blur-md border border-border/60 transition-all duration-300 h-full overflow-hidden animate-fade-up ${accentRing}`}
      style={delay ? { animationDelay: delay } : undefined}
    >
      <CardContent className="p-5 md:p-6 flex h-full flex-col gap-4">
        <div className={`flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl ${iconBg} transition-transform duration-300 group-hover:scale-110`}>
          {icon}
        </div>
        <div className="space-y-1.5">
          <h2 className="font-serif text-lg md:text-xl font-bold text-foreground tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
        {children && <div className="flex-1">{children}</div>}
        <Button
          asChild
          variant="ghost"
          className="group/btn -mx-3 mt-auto justify-start font-semibold text-foreground hover:bg-foreground/5"
        >
          {external ? (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {cta}
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </a>
          ) : (
            <Link href={href}>
              {cta}
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

export default async function HomePage() {
  const [recentImages, settings, content] = await Promise.all([
    prisma.image.findMany({ orderBy: { createdAt: 'desc' }, take: 4 }),
    prisma.siteSettings.findFirst(),
    getContent(),
  ])

  return (
    <div className="min-h-screen">
      <section className="px-4 pt-12 pb-10 md:pt-20 md:pb-16 text-center">
        <div className="mx-auto max-w-3xl space-y-4 md:space-y-6">
          <span className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Pittsburgh • Music • Spirit
          </span>
          <h1 className="animate-fade-up font-serif font-black text-5xl md:text-8xl text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)] tracking-tight">
            FIZ
          </h1>
          <p className="animate-fade-up text-base md:text-lg text-neutral-100/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md text-balance" style={{ animationDelay: "120ms" }}>
            {content.home_subtitle ||
              "Pittsburgh's greatest freestyle rapper & beat maker. Making real music with my heart. Been battling \"I don't Give A F*ck\" all my life. It feels good."}
          </p>
        </div>
      </section>

      <section className="px-4 pb-12 md:pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-5">
            {settings?.showPictureSection && (
              <SectionCard
                href="/gallery"
                icon={<Camera className="h-6 w-6" />}
                title="Picture Gallery"
                description="Visual moments from the journey."
                cta="View gallery"
                accent="primary"
                delay="60ms"
              >
                <div className="grid grid-cols-2 gap-1.5 rounded-lg overflow-hidden">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} className="aspect-square bg-muted/60 overflow-hidden rounded-md">
                      {recentImages[i] ? (
                        <img
                          src={recentImages[i].src}
                          alt={recentImages[i].alt || `Recent ${i + 1}`}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : null}
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {settings?.showTextSection && (
              <SectionCard
                href="/texts"
                icon={<FileText className="h-6 w-6" />}
                title="Text Gallery"
                description="Raw thoughts, real stories."
                cta="Read stories"
                accent="accent"
                delay="120ms"
              >
                <div className="space-y-2 rounded-lg bg-background/60 p-3">
                  <div className="h-2 w-full rounded-full bg-accent/25" />
                  <div className="h-2 w-4/5 rounded-full bg-accent/20" />
                  <div className="h-2 w-2/3 rounded-full bg-accent/15" />
                  <div className="h-2 w-1/2 rounded-full bg-accent/10" />
                </div>
              </SectionCard>
            )}

            <SectionCard
              href="/courses"
              icon={<GraduationCap className="h-6 w-6" />}
              title="Courses"
              description="Learn the craft, from beats to flow."
              cta="View courses"
              accent="primary"
              delay="180ms"
            >
              <div className="rounded-lg bg-muted/70 p-3 space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">Free & Premium</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Unlock your creative potential.
                </p>
              </div>
            </SectionCard>

            {settings?.showSpiritualSection && (
              <SectionCard
                href="/consultation"
                icon={<Heart className="h-6 w-6" />}
                title="Spiritual Sessions"
                description="One-on-one spiritual guidance."
                cta="Book a session"
                accent="secondary"
                delay="240ms"
              >
                <div className="rounded-lg bg-muted/70 p-3 space-y-1">
                  <p className="text-sm font-medium text-foreground">1-Hour Session</p>
                  <p className="text-xs text-muted-foreground">Deep spiritual conversation.</p>
                </div>
              </SectionCard>
            )}

            {settings?.showMusicSection && (
              <SectionCard
                href="/music"
                icon={<Music className="h-6 w-6" />}
                title="Music Universe"
                description="Beats, freestyles, and tracks."
                cta="Latest tracks"
                accent="primary"
                delay="300ms"
              >
                <div className="space-y-2">
                  <div className="rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 p-3 space-y-1">
                    <p className="text-xs font-medium text-foreground">Find me everywhere</p>
                    <p className="text-xs text-muted-foreground">
                      Search "fiz" on any platform.
                    </p>
                  </div>
                  <a
                    href="https://instagram.com/snapcracklefizzle"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full rounded-md border border-accent/40 bg-transparent px-3 py-1.5 text-center text-xs font-semibold text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    Follow on Instagram
                  </a>
                </div>
              </SectionCard>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
