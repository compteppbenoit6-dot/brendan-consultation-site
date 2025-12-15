class AudioManager {
  private audio: HTMLAudioElement | null = null;
  private isInitialized = false;
  private shouldPlay = true;
  private volume = 0.3;
  
  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeAudio();
    }
  }

  private initializeAudio() {
    if (this.audio) return;
    
    this.audio = new Audio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/river-water-stream-sound-effect-330575-QnOe2wstTAXFVNVCjJ5nklnx2FUbRM.mp3");
    this.audio.loop = true;
    this.audio.volume = this.volume;
    this.audio.preload = "auto";
    
    // Handle audio events
    this.audio.addEventListener('canplaythrough', () => {
      this.isInitialized = true;
      if (this.shouldPlay) {
        this.play();
      }
    });

    this.audio.addEventListener('ended', () => {
      if (this.shouldPlay) {
        this.play();
      }
    });

    this.audio.addEventListener('error', (e) => {
      console.warn('Background audio error:', e);
    });
  }

  public async play() {
    if (!this.audio || !this.shouldPlay) return;
    
    try {
      if (this.audio.paused) {
        await this.audio.play();
      }
    } catch (error) {
      // Auto-play blocked by browser policy
      console.log('Auto-play blocked, waiting for user interaction');
    }
  }

  public pause() {
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
    }
  }

  public stop() {
    this.shouldPlay = false;
    this.pause();
  }

  public resume() {
    this.shouldPlay = true;
    this.play();
  }

  public setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
  }

  public fadeOut(duration: number = 1000) {
    if (!this.audio) return;
    
    const originalVolume = this.audio.volume;
    const fadeStep = originalVolume / (duration / 50);
    
    const fadeInterval = setInterval(() => {
      if (this.audio && this.audio.volume > fadeStep) {
        this.audio.volume -= fadeStep;
      } else {
        if (this.audio) {
          this.audio.volume = 0;
          this.pause();
        }
        clearInterval(fadeInterval);
      }
    }, 50);
  }

  public fadeIn(duration: number = 1000) {
    if (!this.audio) return;
    
    this.audio.volume = 0;
    this.play();
    
    const targetVolume = this.volume;
    const fadeStep = targetVolume / (duration / 50);
    
    const fadeInterval = setInterval(() => {
      if (this.audio && this.audio.volume < targetVolume - fadeStep) {
        this.audio.volume += fadeStep;
      } else {
        if (this.audio) {
          this.audio.volume = targetVolume;
        }
        clearInterval(fadeInterval);
      }
    }, 50);
  }

  public enableUserInteraction() {
    // Call this after first user interaction to enable auto-play
    if (this.shouldPlay && this.audio && this.audio.paused) {
      this.play();
    }
  }
}

// Create singleton instance
const audioManager = new AudioManager();

export default audioManager;