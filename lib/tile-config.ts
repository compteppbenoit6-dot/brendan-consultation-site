import type { CSSProperties } from "react"

export type TileSize = "small" | "medium" | "large"

export interface TileLayoutInput {
  pictureTileOpacity: number
  pictureTileSize: TileSize
  textTileOpacity: number
  textTileSize: TileSize
  coursesTileOpacity: number
  coursesTileSize: TileSize
  spiritualTileOpacity: number
  spiritualTileSize: TileSize
  musicTileOpacity: number
  musicTileSize: TileSize
}

export type TileKey = "picture" | "text" | "courses" | "spiritual" | "music"

export interface TileConfig {
  opacity: number
  size: TileSize
}

export const TILE_KEYS: TileKey[] = ["picture", "text", "courses", "spiritual", "music"]

export const TILE_LABELS: Record<TileKey, string> = {
  picture: "Picture Gallery",
  text: "Text Gallery",
  courses: "Courses",
  spiritual: "Spiritual Sessions",
  music: "Music Universe",
}

export function clampOpacity(value: unknown): number {
  const n = Number(value)
  if (!Number.isFinite(n)) return 70
  return Math.min(100, Math.max(0, Math.round(n)))
}

export function normalizeSize(value: unknown): TileSize {
  if (value === "small" || value === "large") return value
  return "medium"
}

export function tileBackgroundStyle(opacity: number): CSSProperties {
  // color-mix lets us blend the theme card color with transparent at the
  // chosen opacity without losing the OKLCH theme variable.
  return {
    backgroundColor: `color-mix(in oklab, var(--card) ${opacity}%, transparent)`,
  }
}

export function tileSizeClasses(size: TileSize) {
  switch (size) {
    case "small":
      return {
        span: "",
        padding: "p-3 md:p-4",
        gap: "gap-3",
        iconWrap: "h-10 w-10 md:h-11 md:w-11 rounded-xl",
        iconSvg: "h-5 w-5",
        title: "text-sm md:text-base",
        description: "text-xs",
      }
    case "large":
      return {
        span: "sm:col-span-2 lg:col-span-2",
        padding: "p-6 md:p-8",
        gap: "gap-5",
        iconWrap: "h-14 w-14 md:h-16 md:w-16 rounded-2xl",
        iconSvg: "h-7 w-7 md:h-8 md:w-8",
        title: "text-xl md:text-2xl",
        description: "text-sm md:text-base",
      }
    default:
      return {
        span: "",
        padding: "p-5 md:p-6",
        gap: "gap-4",
        iconWrap: "h-12 w-12 md:h-14 md:w-14 rounded-2xl",
        iconSvg: "h-6 w-6",
        title: "text-lg md:text-xl",
        description: "text-sm",
      }
  }
}
