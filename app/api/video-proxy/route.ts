// File: app/api/video-proxy/route.ts
// Proxy for R2 videos to handle range requests properly

import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")
  
  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 })
  }

  // Only allow R2 URLs
  if (!url.includes("r2.dev")) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
  }

  try {
    const range = request.headers.get("range")
    
    const headers: HeadersInit = {}
    if (range) {
      headers["Range"] = range
    }

    const response = await fetch(url, { headers })
    
    const responseHeaders = new Headers()
    responseHeaders.set("Content-Type", response.headers.get("Content-Type") || "video/mp4")
    responseHeaders.set("Accept-Ranges", "bytes")
    
    if (response.headers.get("Content-Length")) {
      responseHeaders.set("Content-Length", response.headers.get("Content-Length")!)
    }
    if (response.headers.get("Content-Range")) {
      responseHeaders.set("Content-Range", response.headers.get("Content-Range")!)
    }
    
    // Cache for 1 hour
    responseHeaders.set("Cache-Control", "public, max-age=3600")

    return new NextResponse(response.body, {
      status: response.status,
      headers: responseHeaders,
    })
  } catch (error) {
    console.error("Video proxy error:", error)
    return NextResponse.json({ error: "Failed to fetch video" }, { status: 500 })
  }
}
