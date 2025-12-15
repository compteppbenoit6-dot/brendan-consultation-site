"use client"

import { useEffect, useRef, useState } from 'react'
import seamlessAudioManager from '@/lib/seamless-audio-manager'

interface AudioVisualizerProps {
  className?: string
  barCount?: number
  height?: number
}

export function AudioVisualizer({ className = "", barCount = 20, height = 40 }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)

  useEffect(() => {
    const setupAnalyser = () => {
      const audioAnalyser = seamlessAudioManager.getAnalyser()
      if (audioAnalyser) {
        setAnalyser(audioAnalyser)
      }
    }

    // Try to get analyser after a short delay to ensure audio is initialized
    const timeout = setTimeout(setupAnalyser, 1000)
    
    return () => {
      clearTimeout(timeout)
    }
  }, [])

  useEffect(() => {
    if (!analyser || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dataArray = new Uint8Array(analyser.frequencyBinCount)
    
    const animate = () => {
      if (!seamlessAudioManager.isCurrentlyPlaying()) {
        // Draw flat bars when not playing
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        ctx.fillStyle = 'hsl(var(--muted))'
        for (let i = 0; i < barCount; i++) {
          const barWidth = canvas.width / barCount
          const barHeight = 2
          const x = i * barWidth
          const y = canvas.height - barHeight
          ctx.fillRect(x, y, barWidth - 2, barHeight)
        }
        
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      analyser.getByteFrequencyData(dataArray)
      
      // Clear canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw bars
      const barWidth = canvas.width / barCount
      
      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor(i * dataArray.length / barCount)
        const barHeight = (dataArray[dataIndex] / 255) * canvas.height * 0.8
        
        // Create gradient for each bar
        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height)
        gradient.addColorStop(0, 'hsl(var(--primary))')
        gradient.addColorStop(1, 'hsl(var(--secondary))')
        
        ctx.fillStyle = gradient
        
        const x = i * barWidth
        const y = canvas.height - barHeight
        
        ctx.fillRect(x, y, barWidth - 2, barHeight)
      }
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [analyser, barCount])

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={height}
      className={`rounded ${className}`}
      style={{ width: '200px', height: `${height}px` }}
    />
  )
}