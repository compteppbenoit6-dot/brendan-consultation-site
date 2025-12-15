// File: components/mute-button.tsx

"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import seamlessAudioManager from "@/lib/seamless-audio-manager";

export function MuteButton() {
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    // On initial load, check localStorage for saved preference
    const savedMuteState = localStorage.getItem("fiz-audio-muted");
    const initialMuteState = savedMuteState ? JSON.parse(savedMuteState) : true;
    setIsMuted(initialMuteState);
    
    // Don't auto-play on load - wait for user interaction
    if (initialMuteState) {
      seamlessAudioManager.stop();
    }
  }, []);

  const toggleMute = async () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    localStorage.setItem("fiz-audio-muted", JSON.stringify(newMuteState));
    
    if (newMuteState) {
      seamlessAudioManager.fadeOut(300);
    } else {
      // Ensure user interaction enables audio context
      await seamlessAudioManager.enableUserInteraction();
      seamlessAudioManager.fadeIn(300);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleMute}
      className="fixed bottom-4 right-4 z-50 rounded-full bg-background/50 backdrop-blur-sm"
      aria-label={isMuted ? "Unmute background audio" : "Mute background audio"}
    >
      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
    </Button>
  );
}