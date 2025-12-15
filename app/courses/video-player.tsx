// File: app/courses/video-player.tsx

"use client"

import { useRef, useEffect, useState } from "react"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function VideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setError(false)
    setLoading(true)
    if (videoRef.current) {
      videoRef.current.load()
    }
  }, [src])

  const handleError = () => {
    setError(true)
    setLoading(false)
  }

  const handleCanPlay = () => {
    setLoading(false)
    setError(false)
  }

  const handleRetry = () => {
    setError(false)
    setLoading(true)
    if (videoRef.current) {
      videoRef.current.load()
    }
  }

  // Use proxy URL for R2 videos to handle range requests properly
  const proxyUrl = src.includes('r2.dev') 
    ? `/api/video-proxy?url=${encodeURIComponent(src)}`
    : src

  return (
    <div className="aspect-video w-full bg-black rounded-lg overflow-hidden relative">
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
        </div>
      )}
      
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white gap-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <p className="text-center px-4">Video failed to load. The file may be too large or not optimized for streaming.</p>
          <div className="flex gap-2">
            <Button onClick={handleRetry} variant="secondary" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" /> Retry
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href={src} target="_blank" rel="noopener noreferrer">Download Instead</a>
            </Button>
          </div>
        </div>
      ) : (
        <video
          ref={videoRef}
          controls
          preload="auto"
          playsInline
          crossOrigin="anonymous"
          onError={handleError}
          onCanPlay={handleCanPlay}
          onLoadedData={handleCanPlay}
          className="w-full h-full"
        >
          <source src={proxyUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  )
}