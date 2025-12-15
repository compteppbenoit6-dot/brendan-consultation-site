"use client"

import { useEffect, useRef } from "react"

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Autoplay is often blocked by browsers until the user interacts with the page.
    // This function will be called on the first click/touch to start the audio.
    const playWithSound = () => {
      // A small delay can help ensure the user interaction is registered
      setTimeout(() => {
        if (audio) {
          audio.muted = false
          audio.play().catch(error => {
            // Log errors if playback fails (e.g., user hasn't interacted yet)
            console.error("Audio playback failed:", error)
          })
        }
        // Clean up the event listeners once the audio starts playing
        document.removeEventListener("click", playWithSound)
        document.removeEventListener("touchstart", playWithSound)
      }, 100)
    }

    // Add event listeners to play audio on first user interaction
    document.addEventListener("click", playWithSound)
    document.addEventListener("touchstart", playWithSound)

    // Cleanup function to remove listeners when the component unmounts
    return () => {
      document.removeEventListener("click", playWithSound)
      document.removeEventListener("touchstart", playWithSound)
    }
  }, []) // The empty dependency array ensures this effect runs only once

  return (
    <audio ref={audioRef} loop muted autoPlay className="hidden">
      <source
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/river-water-stream-sound-effect-330575-QnOe2wstTAXFVNVCjJ5nklnx2FUbRM.mp3"
        type="audio/mpeg"
      />
      Your browser does not support the audio element.
    </audio>
  )
}