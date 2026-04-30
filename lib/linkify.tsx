import * as React from "react"

// Match http(s):// URLs greedily up to whitespace. We strip trailing
// punctuation later so sentences like "see https://example.com." don't
// drag the dot into the link.
const URL_REGEX = /(https?:\/\/\S+)/g
const TRAILING_PUNCT = /[.,!?;:)\]}"']+$/

export function linkify(text: string): React.ReactNode[] {
  if (!text) return [text]
  const parts = text.split(URL_REGEX)

  return parts.map((part, i) => {
    if (!part.match(/^https?:\/\//)) {
      return <React.Fragment key={i}>{part}</React.Fragment>
    }

    const trailingMatch = part.match(TRAILING_PUNCT)
    const trailing = trailingMatch ? trailingMatch[0] : ""
    const url = trailing ? part.slice(0, -trailing.length) : part

    return (
      <React.Fragment key={i}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="text-accent underline underline-offset-4 decoration-accent/40 hover:decoration-accent break-all"
        >
          {url}
        </a>
        {trailing}
      </React.Fragment>
    )
  })
}
