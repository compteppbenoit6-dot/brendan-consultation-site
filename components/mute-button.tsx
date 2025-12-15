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
    
    if (initialMuteState) {
      seamlessAudioManager.setVolume(0);
    } else {
      seamlessAudioManager.setVolume(0.25); // Default volume
    }
  }, []);

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    localStorage.setItem("fiz-audio-muted", JSON.stringify(newMuteState));
    
    if (newMuteState) {
      seamlessAudioManager.setVolume(0);
    } else {
      seamlessAudioManager.setVolume(0.25); // Restore volume
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