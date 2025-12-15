class RobustAudioManager {
  private audioContext: AudioContext | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private fallbackAudio: HTMLAudioElement | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;
  private shouldPlay = true;
  private volume = 0.25;
  private initializationAttempts = 0;
  private maxRetries = 3;
  private isInitialized = false;
  private userInteracted = false;
  
  private readonly audioUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/river-water-stream-sound-effect-330575-QnOe2wstTAXFVNVCjJ5nklnx2FUbRM.mp3";

  constructor() {
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  private async initialize() {
    try {
      console.log('Initializing audio manager...');
      await this.initializeWebAudio();
      this.setupFallback();
      this.isInitialized = true;
      console.log('Audio manager initialized successfully');
    } catch (error) {
      console.warn('Web Audio initialization failed, using fallback:', error);
      this.setupFallback();
      this.isInitialized = true;
    }
  }

  private async initializeWebAudio() {
    if (this.audioContext) return;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
      this.gainNode.connect(this.audioContext.destination);

      await this.loadAudioBuffer();
    } catch (error) {
      console.error('Web Audio setup failed:', error);
      throw error;
    }
  }

  private setupFallback() {
    if (this.fallbackAudio) return;

    try {
      this.fallbackAudio = new Audio(this.audioUrl);
      this.fallbackAudio.loop = true;
      this.fallbackAudio.volume = this.volume;
      this.fallbackAudio.preload = 'auto';
      
      this.fallbackAudio.addEventListener('canplaythrough', () => {
        console.log('Fallback audio ready');
      });

      this.fallbackAudio.addEventListener('error', (e) => {
        console.error('Fallback audio error:', e);
      });

      console.log('Fallback audio setup complete');
    } catch (error) {
      console.error('Fallback audio setup failed:', error);
    }
  }

  private async loadAudioBuffer() {
    if (!this.audioContext || this.audioBuffer) return;

    try {
      console.log('Loading audio buffer...');
      
      // Add timeout to fetch
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(this.audioUrl, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      console.log('Audio buffer loaded:', {
        duration: this.audioBuffer.duration,
        channels: this.audioBuffer.numberOfChannels
      });

    } catch (error) {
      console.error('Failed to load audio buffer:', error);
      throw error;
    }
  }

  private async ensureAudioContext() {
    if (!this.audioContext && this.initializationAttempts < this.maxRetries) {
      this.initializationAttempts++;
      console.log(`Retry audio initialization (${this.initializationAttempts}/${this.maxRetries})`);
      await this.initializeWebAudio();
    }

    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
        console.log('Audio context resumed');
      } catch (error) {
        console.error('Failed to resume audio context:', error);
      }
    }
  }

  private scheduleLoop() {
    if (!this.audioContext || !this.audioBuffer || !this.gainNode || !this.shouldPlay) {
      return;
    }

    try {
      // Stop previous source if exists
      if (this.currentSource) {
        this.currentSource.stop();
      }

      // Create new source
      this.currentSource = this.audioContext.createBufferSource();
      this.currentSource.buffer = this.audioBuffer;
      this.currentSource.loop = true; // Use native looping for simplicity
      this.currentSource.connect(this.gainNode);
      
      // Handle source end (shouldn't happen with loop=true)
      this.currentSource.onended = () => {
        if (this.shouldPlay) {
          console.log('Source ended unexpectedly, rescheduling...');
          setTimeout(() => this.scheduleLoop(), 100);
        }
      };

      this.currentSource.start();
      console.log('Audio loop started');

    } catch (error) {
      console.error('Failed to schedule audio loop:', error);
      this.fallbackToHtmlAudio();
    }
  }

  private fallbackToHtmlAudio() {
    if (!this.fallbackAudio || !this.shouldPlay) return;

    try {
      this.fallbackAudio.currentTime = 0;
      this.fallbackAudio.play().catch(error => {
        console.error('Fallback audio play failed:', error);
      });
      console.log('Using HTML audio fallback');
    } catch (error) {
      console.error('HTML audio fallback failed:', error);
    }
  }

  public async play() {
    if (!this.shouldPlay || this.isPlaying) return;

    // Wait for initialization if needed
    let attempts = 0;
    while (!this.isInitialized && attempts < 50) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }

    this.isPlaying = true;

    try {
      await this.ensureAudioContext();
      
      if (this.audioContext && this.audioBuffer) {
        this.scheduleLoop();
      } else {
        console.log('Web Audio not available, using fallback');
        this.fallbackToHtmlAudio();
      }
    } catch (error) {
      console.error('Play failed:', error);
      this.fallbackToHtmlAudio();
    }
  }

  public stop() {
    this.shouldPlay = false;
    this.isPlaying = false;

    try {
      if (this.currentSource) {
        this.currentSource.stop();
        this.currentSource = null;
      }
      
      if (this.fallbackAudio && !this.fallbackAudio.paused) {
        this.fallbackAudio.pause();
      }
    } catch (error) {
      console.error('Stop failed:', error);
    }
  }

  public pause() {
    this.stop();
  }

  public resume() {
    this.shouldPlay = true;
    if (!this.isPlaying) {
      this.play();
    }
  }

  public setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    
    try {
      if (this.gainNode && this.audioContext) {
        this.gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
      }
      
      if (this.fallbackAudio) {
        this.fallbackAudio.volume = this.volume;
      }
    } catch (error) {
      console.error('Volume change failed:', error);
    }
  }

  public fadeOut(duration: number = 1000) {
    try {
      if (this.gainNode && this.audioContext) {
        const currentTime = this.audioContext.currentTime;
        this.gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + duration / 1000);
        
        setTimeout(() => {
          this.stop();
          if (this.gainNode && this.audioContext) {
            this.gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
          }
        }, duration);
      } else if (this.fallbackAudio) {
        // Simple fade for HTML audio
        const startVolume = this.fallbackAudio.volume;
        const fadeStep = startVolume / (duration / 50);
        
        const fadeInterval = setInterval(() => {
          if (this.fallbackAudio && this.fallbackAudio.volume > fadeStep) {
            this.fallbackAudio.volume -= fadeStep;
          } else {
            if (this.fallbackAudio) {
              this.fallbackAudio.volume = 0;
              this.stop();
              this.fallbackAudio.volume = this.volume;
            }
            clearInterval(fadeInterval);
          }
        }, 50);
      }
    } catch (error) {
      console.error('Fade out failed:', error);
    }
  }

  public fadeIn(duration: number = 1000) {
    try {
      if (this.gainNode && this.audioContext) {
        this.gainNode.gain.setValueAtTime(0.0001, this.audioContext.currentTime);
        this.play();
        
        if (this.audioContext) {
          const currentTime = this.audioContext.currentTime;
          // Ensure target volume is never 0 or too small for exponentialRamp
          const targetVolume = Math.max(0.0001, this.volume);
          this.gainNode.gain.exponentialRampToValueAtTime(targetVolume, currentTime + duration / 1000);
        }
      } else if (this.fallbackAudio) {
        this.fallbackAudio.volume = 0;
        this.play();
        
        const targetVolume = this.volume;
        const fadeStep = targetVolume / (duration / 50);
        
        const fadeInterval = setInterval(() => {
          if (this.fallbackAudio && this.fallbackAudio.volume < targetVolume - fadeStep) {
            this.fallbackAudio.volume += fadeStep;
          } else {
            if (this.fallbackAudio) {
              this.fallbackAudio.volume = targetVolume;
            }
            clearInterval(fadeInterval);
          }
        }, 50);
      }
    } catch (error) {
      console.error('Fade in failed:', error);
    }
  }

  public async enableUserInteraction() {
    this.userInteracted = true;
    console.log('User interaction detected');
    
    if (this.shouldPlay && !this.isPlaying) {
      await this.play();
    }
  }

  public isCurrentlyPlaying() {
    return this.isPlaying && (
      (this.currentSource !== null) || 
      (this.fallbackAudio && !this.fallbackAudio.paused)
    );
  }

  public getStatus() {
    return {
      initialized: this.isInitialized,
      playing: this.isPlaying,
      shouldPlay: this.shouldPlay,
      hasWebAudio: !!this.audioContext,
      hasFallback: !!this.fallbackAudio,
      userInteracted: this.userInteracted
    };
  }
}

const robustAudioManager = new RobustAudioManager();

// Debug helper
if (typeof window !== 'undefined') {
  (window as any).audioDebug = () => console.log(robustAudioManager.getStatus());
}

export default robustAudioManager;