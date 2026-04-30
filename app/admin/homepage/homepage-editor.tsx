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
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  TILE_LABELS,
  type TileKey,
  type TileSize,
  tileBackgroundStyle,
  tileSizeClasses,
} from "@/lib/tile-config"
import { updateHomepageLayout, type TileLayoutInput } from "./actions"

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

const FIELD_SIZE: Record<TileKey, keyof TileLayoutInput> = {
  picture: "pictureTileSize",
  text: "textTileSize",
  courses: "coursesTileSize",
  spiritual: "spiritualTileSize",
  music: "musicTileSize",
}

const DEFAULTS: TileLayoutInput = {
  pictureTileOpacity: 70,
  pictureTileSize: "medium",
  textTileOpacity: 70,
  textTileSize: "medium",
  coursesTileOpacity: 70,
  coursesTileSize: "medium",
  spiritualTileOpacity: 70,
  spiritualTileSize: "medium",
  musicTileOpacity: 70,
  musicTileSize: "medium",
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
    setLayout((l) => ({ ...l, [FIELD_OPACITY[key]]: value }))
  }

  const setSize = (key: TileKey, value: TileSize) => {
    setLayout((l) => ({ ...l, [FIELD_SIZE[key]]: value }))
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

  const handleReset = () => {
    setLayout(DEFAULTS)
  }

  const handleRevert = () => {
    setLayout(savedSnapshot)
  }

  // Background style for the preview pane: use the saved backdrop image if any,
  // otherwise a dark gradient that hints at the live video backdrop.
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
                Reflects unsaved changes. Hidden tiles still appear here so you can tune them.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {dirty && (
                <span className="text-xs font-medium text-amber-600">Unsaved changes</span>
              )}
            </div>
          </div>
          <div className="p-4 sm:p-6 lg:p-8" style={previewBg}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-5">
              {ORDERED_KEYS.map((key) => (
                <PreviewTile
                  key={key}
                  tileKey={key}
                  opacity={layout[FIELD_OPACITY[key]] as number}
                  size={layout[FIELD_SIZE[key]] as TileSize}
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
            size={layout[FIELD_SIZE[key]] as TileSize}
            onOpacityChange={(v) => setOpacity(key, v)}
            onSizeChange={(v) => setSize(key, v)}
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
              onClick={handleReset}
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
                onClick={handleRevert}
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
  size,
}: {
  tileKey: TileKey
  opacity: number
  size: TileSize
}) {
  const cls = tileSizeClasses(size)
  const accent = TILE_ACCENT[tileKey]

  const iconBg =
    accent === "secondary"
      ? "bg-secondary/10 text-secondary"
      : accent === "accent"
      ? "bg-accent/10 text-accent"
      : "bg-primary/10 text-primary"

  return (
    <div className={cls.span}>
      <div
        className="h-full rounded-xl border border-border/60 backdrop-blur-md transition-all"
        style={tileBackgroundStyle(opacity)}
      >
        <div className={`flex h-full flex-col ${cls.padding} ${cls.gap}`}>
          <div
            className={`flex items-center justify-center ${cls.iconWrap} ${iconBg}`}
          >
            {isValidElement(TILE_ICON[tileKey])
              ? cloneElement(
                  TILE_ICON[tileKey] as React.ReactElement<{ className?: string }>,
                  { className: cls.iconSvg }
                )
              : TILE_ICON[tileKey]}
          </div>
          <div className="space-y-1">
            <h3 className={`font-serif font-bold text-foreground tracking-tight ${cls.title}`}>
              {TILE_LABELS[tileKey]}
            </h3>
            <p className={`text-muted-foreground leading-relaxed ${cls.description}`}>
              {TILE_DESCRIPTION[tileKey]}
            </p>
          </div>
          <div className="mt-auto pt-2 text-xs font-semibold text-foreground/70">
            opacity {opacity}% · {size}
          </div>
        </div>
      </div>
    </div>
  )
}

function TileControls({
  tileKey,
  opacity,
  size,
  onOpacityChange,
  onSizeChange,
}: {
  tileKey: TileKey
  opacity: number
  size: TileSize
  onOpacityChange: (value: number) => void
  onSizeChange: (value: TileSize) => void
}) {
  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            {TILE_ICON[tileKey]}
          </span>
          <div>
            <p className="text-sm font-semibold">{TILE_LABELS[tileKey]}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={`${tileKey}-opacity`} className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Opacity
            </Label>
            <span className="text-xs font-mono text-foreground">{opacity}%</span>
          </div>
          <Slider
            id={`${tileKey}-opacity`}
            value={[opacity]}
            min={0}
            max={100}
            step={5}
            onValueChange={(v) => onOpacityChange(v[0] ?? 0)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${tileKey}-size`} className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Size
          </Label>
          <Select value={size} onValueChange={(v) => onSizeChange(v as TileSize)}>
            <SelectTrigger id={`${tileKey}-size`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large (spans 2 columns)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
