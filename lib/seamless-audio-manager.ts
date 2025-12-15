// File: lib/seamless-audio-manager.ts

class AdvancedSeamlessAudioManager {
  private audioContext: AudioContext | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private sources: AudioBufferSourceNode[] = [];
  private gainNode: GainNode | null = null;
  private isPlaying = false;
  private shouldPlay = true;
  private volume = 0.25;
  private crossfadeDuration = 2.0;
  private scheduleAheadTime = 0.2;
  private nextStartTime = 0;
  private scheduleId: number | null = null;
  private fadeTimeout: NodeJS.Timeout | null = null;
  
  private readonly audioUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/river-water-stream-sound-effect-330575-QnOe2wstTAXFVNVCjJ5nklnx2FUbRM.mp3";

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeAudio();
    }
  }

  private async initializeAudio() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);

      await this.loadAudio();
    } catch (error) {
      console.error('Failed to initialize advanced audio:', error);
    }
  }

  private async loadAudio() {
    if (!this.audioContext) return;

    try {
      const response = await fetch(this.audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      console.log('Audio buffer loaded successfully.');
    } catch (error) {
      console.error('Failed to load audio:', error);
    }
  }

  private scheduleNextBuffer() {
    if (!this.audioContext || !this.audioBuffer || !this.gainNode || !this.shouldPlay) {
      return;
    }

    const currentTime = this.audioContext.currentTime;
    
    this.sources = this.sources.filter(source => source.playbackState !== source.FINISHED_STATE);

    while (this.nextStartTime < currentTime + this.scheduleAheadTime) {
      const source = this.audioContext.createBufferSource();
      source.buffer = this.audioBuffer;
      source.connect(this.gainNode);
      source.start(this.nextStartTime);
      source.stop(this.nextStartTime + this.audioBuffer.duration);
      this.sources.push(source);
      this.nextStartTime += this.audioBuffer.duration - this.crossfadeDuration;
    }

    this.scheduleId = window.setTimeout(() => this.scheduleNextBuffer(), 25);
  }

  private async ensureAudioContext() {
    if (!this.audioContext) {
      await this.initializeAudio();
      return;
    }
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  public async play() {
    if (!this.shouldPlay || this.isPlaying) return;

    await this.ensureAudioContext();
    
    if (!this.audioContext || !this.audioBuffer) {
      setTimeout(() => this.play(), 100);
      return;
    }

    this.isPlaying = true;
    this.nextStartTime = this.audioContext.currentTime;
    this.scheduleNextBuffer();
  }

  public stop() {
    this.shouldPlay = false;
    this.isPlaying = false;
    
    if (this.scheduleId) {
      clearTimeout(this.scheduleId);
      this.scheduleId = null;
    }
    
    if (this.fadeTimeout) {
      clearTimeout(this.fadeTimeout);
      this.fadeTimeout = null;
    }

    const currentTime = this.audioContext?.currentTime || 0;
    this.sources.forEach(source => {
      try {
        source.stop(currentTime + 0.1);
      } catch (e) { /* Ignore errors */ }
    });
    this.sources = [];
  }

  public pause() { this.stop(); }
  public resume() { this.shouldPlay = true; if (!this.isPlaying) { this.play(); } }

  public setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.gainNode && this.audioContext) {
      // --- MODIFICATION: Use a very small number instead of 0 ---
      const targetVolume = Math.max(0.0001, this.volume);
      this.gainNode.gain.exponentialRampToValueAtTime(
        targetVolume, 
        this.audioContext.currentTime + 0.2
      );
    }
  }

  public fadeOut(duration: number = 1000) {
    if (!this.gainNode || !this.audioContext) return;
    const currentTime = this.audioContext.currentTime;
    // --- MODIFICATION: Fade to a very small number, not 0 ---
    this.gainNode.gain.exponentialRampToValueAtTime(0.0001, currentTime + duration / 1000);
    this.fadeTimeout = setTimeout(() => {
      this.stop();
      if (this.gainNode && this.audioContext) {
        this.gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
      }
    }, duration);
  }

  public fadeIn(duration: number = 1000) {
    if (!this.gainNode || !this.audioContext) return;
    // --- MODIFICATION: Start from a very small number, not 0 ---
    this.gainNode.gain.setValueAtTime(0.0001, this.audioContext.currentTime);
    this.play();
    if (this.audioContext) {
      const currentTime = this.audioContext.currentTime;
      // Ensure target volume is never 0 or too small for exponentialRamp
      const targetVolume = Math.max(0.0001, this.volume);
      this.gainNode.gain.exponentialRampToValueAtTime(targetVolume, currentTime + duration / 1000);
    }
  }

  public async enableUserInteraction() {
    await this.ensureAudioContext();
    if (this.shouldPlay && !this.isPlaying) {
      this.play();
    }
  }
  
  public isCurrentlyPlaying() { return this.isPlaying; }
  
  public getAnalyser() {
    if (!this.audioContext || !this.gainNode) return null;
    const analyser = this.audioContext.createAnalyser();
    this.gainNode.connect(analyser);
    return analyser;
  }
}

const advancedSeamlessAudioManager = new AdvancedSeamlessAudioManager();
export default advancedSeamlessAudioManager;