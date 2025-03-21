import { create } from "zustand";

// Singleton AudioContext for the entire game
let globalAudioContext = null;

// Get AudioContext (or create it if it doesn't exist)
const getAudioContext = () => {
  if (!globalAudioContext) {
    globalAudioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
  }
  return globalAudioContext;
};

// Create audio store with Zustand
export const useAudioStore = create((set, get) => ({
  playing: false,

  // Play a note with specific frequency
  playNote: (frequency) => {
    const { setPlaying } = get();

    try {
      console.log(`Playing note with exact frequency: ${frequency}Hz`);

      const audioContext = getAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // Precise oscillator configuration
      oscillator.type = "sine"; // Pure sinusoidal tone
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime); // Exact frequency

      // Configure volume envelope to avoid clicks
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        0.5,
        audioContext.currentTime + 0.1
      ); // Attack
      gainNode.gain.linearRampToValueAtTime(
        0.3,
        audioContext.currentTime + 0.3
      ); // Sustain
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1.0); // Release

      // Connect audio components
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Start playback
      oscillator.start(audioContext.currentTime);
      setPlaying(true);

      // Stop after a time
      oscillator.stop(audioContext.currentTime + 1.0);

      // Clean up state after playing
      setTimeout(() => {
        setPlaying(false);
      }, 1000);
    } catch (error) {
      console.error("Error playing note:", error);
      setPlaying(false);
    }
  },

  // Play success sound
  playSuccessSound: () => {
    try {
      const audioContext = getAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // Use a higher and more pleasant tone
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);

      // Smooth envelope for success sound
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        0.3,
        audioContext.currentTime + 0.1
      );
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error("Error playing success sound:", error);
    }
  },

  // Play error sound
  playErrorSound: () => {
    try {
      const audioContext = getAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // Use a lower tone for the error
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);

      // Short envelope for error sound
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        0.3,
        audioContext.currentTime + 0.1
      );
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error("Error playing error sound:", error);
    }
  },

  // Set playback state
  setPlaying: (state) => set({ playing: !!state }),
}));
