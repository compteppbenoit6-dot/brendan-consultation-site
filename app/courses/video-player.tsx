// File: app/courses/video-player.tsx

"use client"

import { useRef, useEffect, useState } from "react"
import { AlertCircle, Loader2, Play, Pause, Maximize, Volume2, VolumeX, PictureInPicture2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

type VideoState = "loading" | "ready" | "playing" | "paused" | "error"

export function VideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<VideoState>("loading")
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [buffered, setBuffered] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Detect file type from URL
  const getVideoType = (url: string): string => {
    const ext = url.split('.').pop()?.toLowerCase().split('?')[0]
    const types: Record<string, string> = {
      mp4: 'video/mp4',
      webm: 'video/webm',
      ogg: 'video/ogg',
      mov: 'video/mp4', // MOV often works as mp4
      m4v: 'video/mp4',
      avi: 'video/x-msvideo',
      mkv: 'video/x-matroska',
    }
    return types[ext || ''] || 'video/mp4'
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    setState("loading")
    setError(null)
    video.load()

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setState("ready")
    }

    const handleCanPlay = () => {
      if (state === "loading") setState("ready")
    }

    const handlePlay = () => setState("playing")
    const handlePause = () => setState("paused")
    
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
      setProgress((video.currentTime / video.duration) * 100)
    }

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1)
        setBuffered((bufferedEnd / video.duration) * 100)
      }
    }

    const handleError = () => {
      const errorMessages: Record<number, string> = {
        1: "Video loading was aborted",
        2: "Network error while loading video",
        3: "Video decoding failed - format may not be supported",
        4: "Video format not supported by your browser",
      }
      const code = video.error?.code || 4
      setError(errorMessages[code] || "An error occurred while playing the video")
      setState("error")
    }

    const handleWaiting = () => {
      if (state === "playing") setState("loading")
    }

    const handlePlaying = () => setState("playing")

    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("canplay", handleCanPlay)
    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("progress", handleProgress)
    video.addEventListener("error", handleError)
    video.addEventListener("waiting", handleWaiting)
    video.addEventListener("playing", handlePlaying)

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("canplay", handleCanPlay)
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("progress", handleProgress)
      video.removeEventListener("error", handleError)
      video.removeEventListener("waiting", handleWaiting)
      video.removeEventListener("playing", handlePlaying)
    }
  }, [src])

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play()
    } else {
      video.pause()
    }
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return
    const time = (value[0] / 100) * duration
    video.currentTime = time
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current
    if (!video) return
    const vol = value[0] / 100
    video.volume = vol
    setVolume(vol)
    setMuted(vol === 0)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !muted
    setMuted(!muted)
  }

  const toggleFullscreen = () => {
    const container = containerRef.current
    if (!container) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      container.requestFullscreen()
    }
  }

  const togglePiP = async () => {
    const video = videoRef.current
    if (!video) return
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
      } else {
        await video.requestPictureInPicture()
      }
    } catch (err) {
      console.error("PiP not supported:", err)
    }
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    if (state === "playing") {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }
  }

  return (
    <div 
      ref={containerRef}
      className="relative aspect-video w-full bg-black rounded-lg overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => state === "playing" && setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
        preload="metadata"
        onClick={togglePlay}
      >
        <source src={src} type={getVideoType(src)} />
        Your browser does not support video playback.
      </video>

      {/* Loading overlay */}
      {state === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-center text-white">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-2" />
            <p className="text-sm">Loading video...</p>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {state === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center text-white p-6 max-w-md">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h3 className="font-semibold text-lg mb-2">Video Playback Error</h3>
            <p className="text-sm text-gray-300 mb-4">{error}</p>
            <p className="text-xs text-gray-400">
              This video may be encoded in a format not supported by your browser. 
              For best compatibility, videos should be encoded in H.264/MP4 format.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setState("loading")
                setError(null)
                videoRef.current?.load()
              }}
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Play button overlay (when paused/ready) */}
      {(state === "ready" || state === "paused") && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
        >
          <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
            <Play className="h-10 w-10 text-black ml-1" fill="currentColor" />
          </div>
        </button>
      )}

      {/* Custom controls */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300",
          showControls || state !== "playing" ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Progress bar */}
        <div className="relative h-1 bg-white/30 rounded-full mb-3 cursor-pointer group/progress">
          {/* Buffered */}
          <div 
            className="absolute h-full bg-white/50 rounded-full"
            style={{ width: `${buffered}%` }}
          />
          {/* Progress */}
          <Slider
            value={[progress]}
            onValueChange={handleSeek}
            max={100}
            step={0.1}
            className="absolute inset-0"
          />
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={togglePlay}
            >
              {state === "playing" ? (
                <Pause className="h-5 w-5" fill="currentColor" />
              ) : (
                <Play className="h-5 w-5" fill="currentColor" />
              )}
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={toggleMute}
              >
                {muted || volume === 0 ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>
              <Slider
                value={[muted ? 0 : volume * 100]}
                onValueChange={handleVolumeChange}
                max={100}
                className="w-20"
              />
            </div>

            <span className="text-sm ml-2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={togglePiP}
              title="Picture in Picture"
            >
              <PictureInPicture2 className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={toggleFullscreen}
              title="Fullscreen"
            >
              <Maximize className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}