"use client"

import { cloneElement, isValidElement, useState, useTransition } from "react"
import {
  Camera,
  FileText,
  GraduationCap,
  Heart,
  Music,
  Save,
  RotateCcw,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  TILE_LABELS,
  TILE_WIDTH_CLASS,
  clampColSpan,
  clampOpacity,
  colSpanToPercent,
  tileBackgroundStyle,
  type TileColSpan,
  type TileKey,
  type TileLayoutInput,
} from "@/lib/tile-config"
import { updateHomepageLayout } from "./actions"

const TILE_ICON: Record<TileKey, React.ReactNode> = {
  picture: <Camera />,
  text: <FileText />,
  courses: <GraduationCap />,
  spiritual: <Heart />,
  music: <Music />,
}

const TILE_DESCRIPTION: Record<TileKey, string> = {
  picture: "Visual moments from the journey.",
  text: "Raw thoughts, real stories.",
  courses: "Learn the craft, from beats to flow.",
  spiritual: "One-on-one spiritual guidance.",
  music: "Beats, freestyles, and tracks.",
}

const TILE_ACCENT: Record<TileKey, "primary" | "accent" | "secondary"> = {
  picture: "primary",
  text: "accent",
  courses: "primary",
  spiritual: "secondary",
  music: "primary",
}

const ORDERED_KEYS: TileKey[] = ["picture", "text", "courses", "spiritual", "music"]

const FIELD_OPACITY: Record<TileKey, keyof TileLayoutInput> = {
  picture: "pictureTileOpacity",
  text: "textTileOpacity",
  courses: "coursesTileOpacity",
  spiritual: "spiritualTileOpacity",
  music: "musicTileOpacity",
}

const FIELD_COLSPAN: Record<TileKey, keyof TileLayoutInput> = {
  picture: "pictureTileColSpan",
  text: "textTileColSpan",
  courses: "coursesTileColSpan",
  spiritual: "spiritualTileColSpan",
  music: "musicTileColSpan",
}

const DEFAULTS: TileLayoutInput = {
  pictureTileOpacity: 70,
  pictureTileColSpan: 2,
  textTileOpacity: 70,
  textTileColSpan: 2,
  coursesTileOpacity: 70,
  coursesTileColSpan: 2,
  spiritualTileOpacity: 70,
  spiritualTileColSpan: 2,
  musicTileOpacity: 70,
  musicTileColSpan: 2,
}

export function HomepageEditor({
  initialLayout,
  backgroundImageUrl,
}: {
  initialLayout: TileLayoutInput
  backgroundImageUrl: string | null
}) {
  const [layout, setLayout] = useState<TileLayoutInput>(initialLayout)
  const [savedSnapshot, setSavedSnapshot] = useState<TileLayoutInput>(initialLayout)
  const [isPending, startTransition] = useTransition()

  const dirty = JSON.stringify(layout) !== JSON.stringify(savedSnapshot)

  const setOpacity = (key: TileKey, value: number) => {
    setLayout((l) => ({ ...l, [FIELD_OPACITY[key]]: clampOpacity(value) }))
  }

  const setColSpan = (key: TileKey, value: number) => {
    setLayout((l) => ({ ...l, [FIELD_COLSPAN[key]]: clampColSpan(value) }))
  }

  const handleSave = () => {
    startTransition(async () => {
      const res = await updateHomepageLayout(layout)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(res.success ?? "Saved.")
        setSavedSnapshot(layout)
      }
    })
  }

  const previewBg: React.CSSProperties = backgroundImageUrl
    ? {
        backgroundImage: `linear-gradient(rgba(20,0,0,0.55), rgba(20,0,0,0.55)), url(${backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {
        background:
          "radial-gradient(ellipse at top, #5b1d05 0%, #1a0a02 60%, #000 100%)",
      }

  return (
    <div className="space-y-6">
      {/* Live preview */}
      <Card>
        <CardContent className="p-0">
          <div className="border-b px-6 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Live preview</p>
              <p className="text-xs text-muted-foreground">
                Reflects unsaved changes. Width = how many of 6 grid columns the tile occupies.
              </p>
            </div>
            {dirty && (
              <span className="text-xs font-medium text-amber-600">Unsaved changes</span>
            )}
          </div>
          <div className="p-4 sm:p-6 lg:p-8" style={previewBg}>
            <div className="flex flex-wrap justify-start gap-4">
              {ORDERED_KEYS.map((key) => (
                <PreviewTile
                  key={key}
                  tileKey={key}
                  opacity={layout[FIELD_OPACITY[key]] as number}
                  colSpan={layout[FIELD_COLSPAN[key]] as TileColSpan}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ORDERED_KEYS.map((key) => (
          <TileControls
            key={key}
            tileKey={key}
            opacity={layout[FIELD_OPACITY[key]] as number}
            colSpan={layout[FIELD_COLSPAN[key]] as TileColSpan}
            onOpacityChange={(v) => setOpacity(key, v)}
            onColSpanChange={(v) => setColSpan(key, v)}
          />
        ))}
      </div>

      {/* Action bar */}
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLayout(DEFAULTS)}
              disabled={isPending}
              className="gap-1.5"
            >
              <RotateCcw className="h-4 w-4" />
              Reset to defaults
            </Button>
            {dirty && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLayout(savedSnapshot)}
                disabled={isPending}
              >
                Discard changes
              </Button>
            )}
          </div>
          <Button onClick={handleSave} disabled={isPending || !dirty} className="gap-1.5">
            <Save className="h-4 w-4" />
            {isPending ? "Saving..." : "Save layout"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function PreviewTile({
  tileKey,
  opacity,
  colSpan,
}: {
  tileKey: TileKey
  opacity: number
  colSpan: TileColSpan
}) {
  const accent = TILE_ACCENT[tileKey]

  const iconBg =
    accent === "secondary"
      ? "bg-secondary/10 text-secondary"
      : accent === "accent"
      ? "bg-accent/10 text-accent"
      : "bg-primary/10 text-primary"

  return (
    <div className={TILE_WIDTH_CLASS[colSpan]}>
      <div
        className="h-full rounded-xl border border-border/60 backdrop-blur-md transition-all"
        style={tileBackgroundStyle(opacity)}
      >
        <div className="flex h-full flex-col gap-4 p-5 md:p-6">
          <div className={`flex items-center justify-center h-12 w-12 rounded-2xl ${iconBg}`}>
            {isValidElement(TILE_ICON[tileKey])
              ? cloneElement(
                  TILE_ICON[tileKey] as React.ReactElement<{ className?: string }>,
                  { className: "h-6 w-6" }
                )
              : TILE_ICON[tileKey]}
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-foreground tracking-tight text-lg">
              {TILE_LABELS[tileKey]}
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {TILE_DESCRIPTION[tileKey]}
            </p>
          </div>
          <div className="mt-auto pt-2 flex items-center gap-2 text-[10px] font-mono text-foreground/60">
            <span className="rounded bg-foreground/5 px-1.5 py-0.5">{opacity}%</span>
            <span className="rounded bg-foreground/5 px-1.5 py-0.5">{colSpan}/6 · {colSpanToPercent(colSpan)}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function TileControls({
  tileKey,
  opacity,
  colSpan,
  onOpacityChange,
  onColSpanChange,
}: {
  tileKey: TileKey
  opacity: number
  colSpan: TileColSpan
  onOpacityChange: (value: number) => void
  onColSpanChange: (value: number) => void
}) {
  return (
    <Card>
      <CardContent className="space-y-5 p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            {isValidElement(TILE_ICON[tileKey])
              ? cloneElement(
                  TILE_ICON[tileKey] as React.ReactElement<{ className?: string }>,
                  { className: "h-4 w-4" }
                )
              : TILE_ICON[tileKey]}
          </span>
          <p className="text-sm font-semibold">{TILE_LABELS[tileKey]}</p>
        </div>

        {/* Opacity: slider + number input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={`${tileKey}-opacity`} className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Opacity
            </Label>
            <span className="text-[10px] text-muted-foreground">0–100</span>
          </div>
          <div className="flex items-center gap-3">
            <Slider
              id={`${tileKey}-opacity`}
              value={[opacity]}
              min={0}
              max={100}
              step={1}
              onValueChange={(v) => onOpacityChange(v[0] ?? 0)}
              className="flex-1"
            />
            <Input
              type="number"
              min={0}
              max={100}
              step={1}
              value={opacity}
              onChange={(e) => {
                const n = parseInt(e.target.value, 10)
                onOpacityChange(Number.isFinite(n) ? n : 0)
              }}
              className="w-16 text-center font-mono text-sm"
              aria-label={`${TILE_LABELS[tileKey]} opacity exact value`}
            />
          </div>
        </div>

        {/* Width: slider 1-6 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={`${tileKey}-width`} className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Width
            </Label>
            <span className="text-[10px] text-muted-foreground">1–6 columns</span>
          </div>
          <div className="flex items-center gap-3">
            <Slider
              id={`${tileKey}-width`}
              value={[colSpan]}
              min={1}
              max={6}
              step={1}
              onValueChange={(v) => onColSpanChange(v[0] ?? 2)}
              className="flex-1"
            />
            <div className="flex w-16 flex-col items-center text-xs">
              <span className="font-mono font-semibold text-foreground">{colSpan}/6</span>
              <span className="text-[10px] text-muted-foreground">{colSpanToPercent(colSpan)}%</span>
            </div>
          </div>
          <div className="flex justify-between gap-1 pt-1">
            {[1, 2, 3, 4, 5, 6].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => onColSpanChange(v)}
                className={`flex-1 rounded-md border px-1 py-1 text-[10px] font-medium transition-colors ${
                  colSpan === v
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
                aria-label={`Set width to ${v} of 6`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
