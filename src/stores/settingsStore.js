import { create } from "zustand";
import { persist } from "zustand/middleware";

// Create settings store with persistence using Zustand
export const useSettingsStore = create(
  persist(
    (set, get) => ({
      // Settings states
      soundEnabled: true,
      selectedOctaves: [4, 5], // Default: include octaves 4 and 5 for treble
      selectedClef: "treble", // Default clef: 'treble', 'bass', or 'both'
      notationType: "both", // 'solfeo', 'letter', or 'both'

      // Actions to change settings
      setSoundEnabled: (enabled) => set({ soundEnabled: !!enabled }),

      setSelectedOctaves: (octaves) => {
        // Ensure octaves is a valid array with at least one element
        const validOctaves =
          Array.isArray(octaves) && octaves.length > 0
            ? octaves
            : get().selectedClef === "treble"
            ? [4, 5]
            : [2, 3];
        set({ selectedOctaves: validOctaves });
      },

      // Set the clef and update octaves accordingly if needed
      setSelectedClef: (clef) => {
        console.log(`Setting clef in store to: ${clef}`);

        // Ensure clef is a valid option
        const validClef = ["treble", "bass", "both"].includes(clef)
          ? clef
          : "treble";
        const currentOctaves = get().selectedOctaves || [];

        // Start with current octaves or empty array if invalid
        let newOctaves = Array.isArray(currentOctaves)
          ? [...currentOctaves]
          : [];

        // If switching to bass clef and all octaves are high (treble octaves)
        if (
          validClef === "bass" &&
          (newOctaves.length === 0 || Math.min(...newOctaves) >= 4)
        ) {
          newOctaves = [2, 3]; // Default bass octaves
        }

        // If switching to treble clef and all octaves are low (bass octaves)
        if (
          validClef === "treble" &&
          (newOctaves.length === 0 || Math.max(...newOctaves) <= 3)
        ) {
          newOctaves = [4, 5]; // Default treble octaves
        }

        // If switching to both clefs, ensure we have octaves for both hands
        if (validClef === "both") {
          // For 'both' mode, include at least one octave from each hand range
          newOctaves = [3, 4]; // One bass octave, one treble octave by default

          // Or, if we have octaves selected, make sure we have at least one of each range
          if (currentOctaves.length > 0) {
            if (!currentOctaves.some((o) => o <= 3)) {
              newOctaves = [...currentOctaves, 3]; // Add a bass octave
            }
            if (!currentOctaves.some((o) => o >= 4)) {
              newOctaves = [...newOctaves, 4]; // Add a treble octave
            }
          }
        }

        console.log(`Setting clef to ${validClef} with octaves:`, newOctaves);

        set({
          selectedClef: validClef,
          selectedOctaves: newOctaves,
        });
      },

      setNotationType: (type) => {
        const validType = ["solfeo", "letter", "both"].includes(type)
          ? type
          : "both";
        set({ notationType: validType });
      },

      // Get available octaves for the current clef
      getAvailableOctaves: () => {
        const clef = get().selectedClef;
        if (clef === "treble") return [4, 5, 6];
        if (clef === "bass") return [2, 3, 4];
        // For 'both', return all octaves
        return [2, 3, 4, 5, 6];
      },

      // Get active clef for the current round
      getActiveClef: (roundNumber) => {
        const clef = get().selectedClef;
        if (clef !== "both") return clef;

        // If both is selected, alternate between treble and bass
        // Even rounds use treble, odd rounds use bass
        return roundNumber % 2 === 0 ? "treble" : "bass";
      },
    }),
    {
      name: "music-quiz-settings", // localStorage key
      // Only persist these specific keys
      partialize: (state) => ({
        soundEnabled: state.soundEnabled,
        selectedOctaves: state.selectedOctaves,
        selectedClef: state.selectedClef,
        notationType: state.notationType,
      }),
    }
  )
);
