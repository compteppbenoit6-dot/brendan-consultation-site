// File: app/courses/video-player.tsx

"use client"

import { useRef, useEffect } from "react"

export function VideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Reset video when source changes
    if (videoRef.current) {
      videoRef.current.load()
    }
  }, [src])

  return (
    <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        controls
        preload="metadata"
        playsInline
        className="w-full h-full"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}