"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"
import { cn } from "@/lib/utils"

interface AudioPlayerButtonProps extends React.ComponentProps<typeof Button> {
  src: string
}

export function AudioPlayerButton({ src, variant, className, ...props }: AudioPlayerButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    // Cleanup function to pause and remove audio when component unmounts
    const audio = audioRef.current;
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
        audioRef.current = null;
      }
    }
  }, [])

  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src)
      audioRef.current.addEventListener('ended', () => setIsPlaying(false))
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio playback error:', e)
        setIsPlaying(false)
      })
    }

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().catch((error) => {
        console.error('Audio playback failed:', error)
        setIsPlaying(false)
      })
      setIsPlaying(true)
    }
  }

  return (
    <Button 
      onClick={togglePlay} 
      size="sm" 
      variant={variant} 
      className={cn(variant === "outline" ? "" : "bg-primary hover:bg-primary/90", className)} 
      {...props}
    >
      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      <span className="ml-2">{isPlaying ? "Pause" : "Play"}</span>
    </Button>
  )
}