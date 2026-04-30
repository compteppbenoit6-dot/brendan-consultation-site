// Optional Cloudflare Image Resizing integration. Set NEXT_PUBLIC_IMAGE_RESIZE_PREFIX
// to a Cloudflare zone hostname (e.g. https://fiz.guru) that has Image Transformations
// enabled. The helper rewrites image URLs through /cdn-cgi/image/<options>/<source>
// so the browser can fetch correctly-sized variants. Without the env var, all helpers
// are no-ops and the original URL is returned untouched.
//
// Docs: https://developers.cloudflare.com/images/transform-images/transform-via-url/

const RESIZE_PREFIX = process.env.NEXT_PUBLIC_IMAGE_RESIZE_PREFIX?.replace(/\/$/, "")

const THUMBNAIL_WIDTHS = [320, 480, 640, 800, 1024] as const
const FULLSIZE_WIDTHS = [1024, 1600, 2048, 2560] as const

export function isResizeEnabled(): boolean {
  return Boolean(RESIZE_PREFIX)
}

export function resizedUrl(src: string, width: number, quality = 75): string {
  if (!RESIZE_PREFIX || !src) return src
  const opts = `width=${width},quality=${quality},format=auto,fit=cover`
  return `${RESIZE_PREFIX}/cdn-cgi/image/${opts}/${src}`
}

export function thumbnailSrcSet(src: string): string | undefined {
  if (!RESIZE_PREFIX || !src) return undefined
  return THUMBNAIL_WIDTHS.map((w) => `${resizedUrl(src, w, 72)} ${w}w`).join(", ")
}

export function fullsizeSrcSet(src: string): string | undefined {
  if (!RESIZE_PREFIX || !src) return undefined
  return FULLSIZE_WIDTHS.map((w) => `${resizedUrl(src, w, 82)} ${w}w`).join(", ")
}
