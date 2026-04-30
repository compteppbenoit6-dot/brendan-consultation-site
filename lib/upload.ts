export const IMAGE_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
] as const

export const COURSE_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
  "video/quicktime",
] as const

export const MAX_IMAGE_SIZE_BYTES = 25 * 1024 * 1024
export const MAX_COURSE_FILE_SIZE_BYTES = 2 * 1024 * 1024 * 1024

export function sanitizeFilename(input: unknown): string | null {
  if (typeof input !== "string") return null
  const trimmed = input.trim()
  if (!trimmed || trimmed.length > 200) return null

  const base = trimmed.split(/[\\/]/).pop() ?? ""
  if (!base || base === "." || base === "..") return null

  const cleaned = base
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .replace(/^[._-]+/, "")
    .replace(/[._-]+$/, "")

  if (!cleaned || cleaned.length > 150) return null
  if (cleaned.includes("..")) return null
  return cleaned
}

export function isAllowedContentType<T extends readonly string[]>(
  value: unknown,
  allowed: T
): value is T[number] {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
}

export function isValidSize(value: unknown, max: number): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0 && value <= max
}
