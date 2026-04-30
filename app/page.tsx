// File: app/page.tsx

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, FileText, Heart, Music, ArrowRight, GraduationCap } from "lucide-react"
import Link from "next/link"
import { cloneElement, isValidElement } from "react"
import prisma from "@/lib/prisma"
import { getContent } from "@/lib/content"
import {
  clampColSpan,
  clampOpacity,
  TILE_WIDTH_CLASS,
  tileBackgroundStyle,
  type TileColSpan,
} from "@/lib/tile-config"

export const dynamic = 'force-dynamic'

type SectionCardProps = {
  href: string
  external?: boolean
  icon: React.ReactNode
  title: string
  description: string
  cta: string
  accent?: "primary" | "accent" | "secondary"
  opacity: number
  colSpan: TileColSpan
  children?: React.ReactNode
  delay?: string
}

function SectionCard({
  href,
  external,
  icon,
  title,
  description,
  cta,
  accent = "primary",
  opacity,
  colSpan,
  children,
  delay,
}: SectionCardProps) {
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

  const cardStyle: React.CSSProperties = {
    ...tileBackgroundStyle(opacity),
    ...(delay ? { animationDelay: delay } : null),
  }

  return (
    <div className={TILE_WIDTH_CLASS[colSpan]}>
      <Card
        className={`group backdrop-blur-md border border-border/60 transition-all duration-300 h-full overflow-hidden animate-fade-up ${accentRing}`}
        style={cardStyle}
      >
        <CardContent className="flex h-full flex-col gap-4 p-5 md:p-6">
          <div className={`flex items-center justify-center h-12 w-12 md:h-14 md:w-14 rounded-2xl ${iconBg} transition-transform duration-300 group-hover:scale-110`}>
            {isValidElement(icon)
              ? cloneElement(icon as React.ReactElement<{ className?: string }>, {
                  className: "h-6 w-6",
                })
              : icon}
          </div>
          <div className="space-y-1.5">
            <h2 className="font-serif font-bold text-foreground tracking-tight text-lg md:text-xl">
              {title}
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
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
    </div>
  )
}

export default async function HomePage() {
  const [recentImages, settings, content] = await Promise.all([
    prisma.image.findMany({ orderBy: { createdAt: 'desc' }, take: 4 }),
    prisma.siteSettings.findFirst(),
    getContent(),
  ])

  const tile = {
    picture: {
      opacity: clampOpacity(settings?.pictureTileOpacity ?? 70),
      colSpan: clampColSpan(settings?.pictureTileColSpan ?? 2),
    },
    text: {
      opacity: clampOpacity(settings?.textTileOpacity ?? 70),
      colSpan: clampColSpan(settings?.textTileColSpan ?? 2),
    },
    courses: {
      opacity: clampOpacity(settings?.coursesTileOpacity ?? 70),
      colSpan: clampColSpan(settings?.coursesTileColSpan ?? 2),
    },
    spiritual: {
      opacity: clampOpacity(settings?.spiritualTileOpacity ?? 70),
      colSpan: clampColSpan(settings?.spiritualTileColSpan ?? 2),
    },
    music: {
      opacity: clampOpacity(settings?.musicTileOpacity ?? 70),
      colSpan: clampColSpan(settings?.musicTileColSpan ?? 2),
    },
  }

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
          {/*
            Flex-wrap with justify-start so tiles flow left-to-right.
            Per-tile widths come from TILE_WIDTH_CLASS and are calc'd to leave
            room for a 1rem gap between siblings.
          */}
          <div className="flex flex-wrap justify-start gap-4">
            {settings?.showPictureSection && (
              <SectionCard
                href="/gallery"
                icon={<Camera />}
                title="Picture Gallery"
                description="Visual moments from the journey."
                cta="View gallery"
                accent="primary"
                opacity={tile.picture.opacity}
                colSpan={tile.picture.colSpan}
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
                icon={<FileText />}
                title="Text Gallery"
                description="Raw thoughts, real stories."
                cta="Read stories"
                accent="accent"
                opacity={tile.text.opacity}
                colSpan={tile.text.colSpan}
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
              icon={<GraduationCap />}
              title="Courses"
              description="Learn the craft, from beats to flow."
              cta="View courses"
              accent="primary"
              opacity={tile.courses.opacity}
              colSpan={tile.courses.colSpan}
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
                icon={<Heart />}
                title="Spiritual Sessions"
                description="One-on-one spiritual guidance."
                cta="Book a session"
                accent="secondary"
                opacity={tile.spiritual.opacity}
                colSpan={tile.spiritual.colSpan}
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
                icon={<Music />}
                title="Music Universe"
                description="Beats, freestyles, and tracks."
                cta="Latest tracks"
                accent="primary"
                opacity={tile.music.opacity}
                colSpan={tile.music.colSpan}
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
