// File: components/global-audio-player.tsx

"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
// CHANGE THIS IMPORT
import seamlessAudioManager from '@/lib/seamless-audio-manager'

export function GlobalAudioPlayer() {
  const pathname = usePathname()

  useEffect(() => {
    // Pages where background music should be disabled
    const musicPages = ['/music']
    const shouldDisableMusic = musicPages.some(page => pathname.startsWith(page))

    // Check if user has muted audio
    const savedMuteState = typeof window !== 'undefined' 
      ? localStorage.getItem("fiz-audio-muted") 
      : null;
    const isMuted = savedMuteState ? JSON.parse(savedMuteState) : true;

    if (shouldDisableMusic || isMuted) {
      seamlessAudioManager.fadeOut(500)
    } else {
      // Add a small delay to prevent immediate restart when navigating
      const timer = setTimeout(() => {
        seamlessAudioManager.fadeIn(1000)
      }, 200)
      
      return () => clearTimeout(timer)
    }
  }, [pathname])

  useEffect(() => {
    // Enable audio after first user interaction
    const enableAudio = async () => {
      // CHANGE THIS
      await seamlessAudioManager.enableUserInteraction()
      // Remove event listeners after first interaction
      document.removeEventListener('click', enableAudio)
      document.removeEventListener('keydown', enableAudio)
      document.removeEventListener('touchstart', enableAudio)
      document.removeEventListener('scroll', enableAudio)
    }

    // Add multiple types of user interaction detection
    document.addEventListener('click', enableAudio, { passive: true })
    document.addEventListener('keydown', enableAudio, { passive: true })
    document.addEventListener('touchstart', enableAudio, { passive: true })
    document.addEventListener('scroll', enableAudio, { passive: true, once: true })

    return () => {
      document.removeEventListener('click', enableAudio)
      document.removeEventListener('keydown', enableAudio)
      document.removeEventListener('touchstart', enableAudio)
      document.removeEventListener('scroll', enableAudio)
    }
  }, [])

  // This component doesn't render anything visible
  return null
}