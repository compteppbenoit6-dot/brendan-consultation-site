import type { CSSProperties } from "react"

// Width is expressed as "column span" against a 6-column grid on large screens.
// 1 = ~1/6 of the row, 3 = 1/2, 6 = full row hero.
export type TileColSpan = 1 | 2 | 3 | 4 | 5 | 6

export type TileKey = "picture" | "text" | "courses" | "spiritual" | "music"

export interface TileLayoutInput {
  pictureTileOpacity: number
  pictureTileColSpan: TileColSpan
  textTileOpacity: number
  textTileColSpan: TileColSpan
  coursesTileOpacity: number
  coursesTileColSpan: TileColSpan
  spiritualTileOpacity: number
  spiritualTileColSpan: TileColSpan
  musicTileOpacity: number
  musicTileColSpan: TileColSpan
}

export const TILE_KEYS: TileKey[] = ["picture", "text", "courses", "spiritual", "music"]

export const TILE_LABELS: Record<TileKey, string> = {
  picture: "Picture Gallery",
  text: "Text Gallery",
  courses: "Courses",
  spiritual: "Spiritual Sessions",
  music: "Music Universe",
}

export const COL_SPAN_VALUES: TileColSpan[] = [1, 2, 3, 4, 5, 6]

export function clampOpacity(value: unknown): number {
  const n = Number(value)
  if (!Number.isFinite(n)) return 70
  return Math.min(100, Math.max(0, Math.round(n)))
}

export function clampColSpan(value: unknown): TileColSpan {
  const n = Number(value)
  if (!Number.isFinite(n)) return 2
  const rounded = Math.min(6, Math.max(1, Math.round(n)))
  return rounded as TileColSpan
}

export function tileBackgroundStyle(opacity: number): CSSProperties {
  return {
    backgroundColor: `color-mix(in oklab, var(--card) ${opacity}%, transparent)`,
  }
}

// Static class strings so Tailwind v4 can detect them at build time.
// On mobile (1 col) every tile is full-width; on sm (2 cols) we cap at 2;
// on lg+ (6 cols) we apply the user's choice.
export const COL_SPAN_CLASS: Record<TileColSpan, string> = {
  1: "lg:col-span-1",
  2: "sm:col-span-2 lg:col-span-2",
  3: "sm:col-span-2 lg:col-span-3",
  4: "sm:col-span-2 lg:col-span-4",
  5: "sm:col-span-2 lg:col-span-5",
  6: "sm:col-span-2 lg:col-span-6",
}

// Width as a percentage of the row, for showing in the editor.
export function colSpanToPercent(span: TileColSpan): number {
  return Math.round((span / 6) * 100)
}
