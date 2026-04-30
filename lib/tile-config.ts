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

// We render the homepage with `flex flex-wrap justify-center gap-4` so partial
// rows are centered. Each tile's width is calc((c/6)*100% - ((1-c/6)*1rem)) to
// account for the 1rem gap between siblings on lg+. On smaller screens we fall
// back to coarser fractions (full width / half width).
//
// Static class strings so Tailwind v4 picks them up at build time.
export const TILE_WIDTH_CLASS: Record<TileColSpan, string> = {
  1: "w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(16.6667%-0.8333rem)]",
  2: "w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.3333%-0.6667rem)]",
  3: "w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(50%-0.5rem)]",
  4: "w-full sm:w-full lg:w-[calc(66.6667%-0.3333rem)]",
  5: "w-full sm:w-full lg:w-[calc(83.3333%-0.1667rem)]",
  6: "w-full",
}

// At narrow widths the bulky preview content (image grids, preview bars, etc.)
// stretches the tile into an ugly tall rectangle. We hide it below this threshold
// so narrow tiles render as compact, near-square cards.
export const COMPACT_TILE_THRESHOLD: TileColSpan = 2

export function isCompactTile(span: TileColSpan): boolean {
  return span <= COMPACT_TILE_THRESHOLD
}

// Width as a percentage of the row, for showing in the editor.
export function colSpanToPercent(span: TileColSpan): number {
  return Math.round((span / 6) * 100)
}
