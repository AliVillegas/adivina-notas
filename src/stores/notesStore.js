import { create } from "zustand";

// Create notes store with Zustand
export const useNotesStore = create((set, get) => {
  // Define all notes for treble clef
  // Standard notation for Treble Clef (G Clef):
  // Lines from bottom to top: E4, G4, B4, D5, F5
  // Spaces from bottom to top: F4, A4, C5, E5
  const createTrebleNotes = () => {
    // First octave (4th octave)
    const octave4 = [
      {
        name: "C4", // Middle C (ledger line below staff)
        solfeo: "Do",
        position: -1,
        onLine: true,
        frequency: 261.63,
        octave: 4,
        clef: "treble",
      },
      {
        name: "D4", // Space below first line
        solfeo: "Re",
        position: -0.5,
        onLine: false,
        frequency: 293.66,
        octave: 4,
        clef: "treble",
      },
      {
        name: "E4", // First line (bottom)
        solfeo: "Mi",
        position: 0,
        onLine: true,
        frequency: 329.63,
        octave: 4,
        clef: "treble",
      },
      {
        name: "F4", // First space from bottom
        solfeo: "Fa",
        position: 0.5,
        onLine: false,
        frequency: 349.23,
        octave: 4,
        clef: "treble",
      },
      {
        name: "G4", // Second line from bottom
        solfeo: "Sol",
        position: 1,
        onLine: true,
        frequency: 392.0,
        octave: 4,
        clef: "treble",
      },
      {
        name: "A4", // Second space from bottom
        solfeo: "La",
        position: 1.5,
        onLine: false,
        frequency: 440.0,
        octave: 4,
        clef: "treble",
      },
      {
        name: "B4", // Third line from bottom
        solfeo: "Si",
        position: 2,
        onLine: true,
        frequency: 493.88,
        octave: 4,
        clef: "treble",
      },
    ];

    // Second octave (5th octave)
    const octave5 = [
      {
        name: "C5", // Third space from bottom
        solfeo: "Do",
        position: 2.5,
        onLine: false,
        frequency: 523.25,
        octave: 5,
        clef: "treble",
      },
      {
        name: "D5", // Fourth line from bottom
        solfeo: "Re",
        position: 3,
        onLine: true,
        frequency: 587.33,
        octave: 5,
        clef: "treble",
      },
      {
        name: "E5", // Fourth space from bottom
        solfeo: "Mi",
        position: 3.5,
        onLine: false,
        frequency: 659.26,
        octave: 5,
        clef: "treble",
      },
      {
        name: "F5", // Fifth line from bottom
        solfeo: "Fa",
        position: 4,
        onLine: true,
        frequency: 698.46,
        octave: 5,
        clef: "treble",
      },
      {
        name: "G5", // Space above fifth line
        solfeo: "Sol",
        position: 4.5,
        onLine: false,
        frequency: 783.99,
        octave: 5,
        clef: "treble",
      },
      {
        name: "A5", // First ledger line above staff
        solfeo: "La",
        position: 5,
        onLine: true,
        frequency: 880.0,
        octave: 5,
        clef: "treble",
      },
      {
        name: "B5", // Space above first ledger line
        solfeo: "Si",
        position: 5.5,
        onLine: false,
        frequency: 987.77,
        octave: 5,
        clef: "treble",
      },
    ];

    // Third octave (6th octave)
    const octave6 = [
      {
        name: "C6", // Second ledger line above staff
        solfeo: "Do",
        position: 6,
        onLine: true,
        frequency: 1046.5,
        octave: 6,
        clef: "treble",
      },
      {
        name: "D6", // Space above second ledger line
        solfeo: "Re",
        position: 6.5,
        onLine: false,
        frequency: 1174.66,
        octave: 6,
        clef: "treble",
      },
      {
        name: "E6", // Third ledger line above staff
        solfeo: "Mi",
        position: 7,
        onLine: true,
        frequency: 1318.51,
        octave: 6,
        clef: "treble",
      },
      {
        name: "F6", // Space above third ledger line
        solfeo: "Fa",
        position: 7.5,
        onLine: false,
        frequency: 1396.91,
        octave: 6,
        clef: "treble",
      },
      {
        name: "G6", // Fourth ledger line above staff
        solfeo: "Sol",
        position: 8,
        onLine: true,
        frequency: 1567.98,
        octave: 6,
        clef: "treble",
      },
    ];

    return [...octave4, ...octave5, ...octave6];
  };

  // Define all notes for bass clef
  // Standard notation for Bass Clef (F Clef):
  // Lines from bottom to top: G2, B2, D3, F3, A3
  // Spaces from bottom to top: A2, C3, E3, G3
  const createBassNotes = () => {
    // First octave (2nd octave)
    const octave2 = [
      {
        name: "E2", // Ledger line below staff
        solfeo: "Mi",
        position: -1,
        onLine: true,
        frequency: 82.41,
        octave: 2,
        clef: "bass",
      },
      {
        name: "F2", // Space below bottom line
        solfeo: "Fa",
        position: -0.5,
        onLine: false,
        frequency: 87.31,
        octave: 2,
        clef: "bass",
      },
      {
        name: "G2", // First line (bottom)
        solfeo: "Sol",
        position: 0,
        onLine: true,
        frequency: 98.0,
        octave: 2,
        clef: "bass",
      },
      {
        name: "A2", // First space from bottom
        solfeo: "La",
        position: 0.5,
        onLine: false,
        frequency: 110.0,
        octave: 2,
        clef: "bass",
      },
      {
        name: "B2", // Second line from bottom
        solfeo: "Si",
        position: 1,
        onLine: true,
        frequency: 123.47,
        octave: 2,
        clef: "bass",
      },
      {
        name: "C2", // Third line from bottom
        solfeo: "Do",
        position: 1.5,
        onLine: false,
        frequency: 130.81,
        octave: 2,
        clef: "bass",
      },
      {
        name: "D2", // Fourth line from bottom
        solfeo: "Re",
        position: 2,
        onLine: true,
        frequency: 146.83,
        octave: 2,
        clef: "bass",
      },
    ];

    // Second octave (3rd octave)
    const octave3 = [
      {
        name: "C3", // Second space from bottom
        solfeo: "Do",
        position: 1.5,
        onLine: false,
        frequency: 130.81,
        octave: 3,
        clef: "bass",
      },
      {
        name: "D3", // Third line from bottom
        solfeo: "Re",
        position: 2,
        onLine: true,
        frequency: 146.83,
        octave: 3,
        clef: "bass",
      },
      {
        name: "E3", // Third space from bottom
        solfeo: "Mi",
        position: 2.5,
        onLine: false,
        frequency: 164.81,
        octave: 3,
        clef: "bass",
      },
      {
        name: "F3", // Fourth line from bottom
        solfeo: "Fa",
        position: 3,
        onLine: true,
        frequency: 174.61,
        octave: 3,
        clef: "bass",
      },
      {
        name: "G3", // Fourth space from bottom
        solfeo: "Sol",
        position: 3.5,
        onLine: false,
        frequency: 196.0,
        octave: 3,
        clef: "bass",
      },
      {
        name: "A3", // Fifth line from bottom
        solfeo: "La",
        position: 4,
        onLine: true,
        frequency: 220.0,
        octave: 3,
        clef: "bass",
      },
      {
        name: "B3", // Space above fifth line
        solfeo: "Si",
        position: 4.5,
        onLine: false,
        frequency: 246.94,
        octave: 3,
        clef: "bass",
      },
    ];

    // Third octave (4th octave)
    const octave4 = [
      {
        name: "C4", // Middle C (ledger line above staff)
        solfeo: "Do",
        position: 5,
        onLine: true,
        frequency: 261.63,
        octave: 4,
        clef: "bass",
      },
      {
        name: "D4", // Space above ledger line
        solfeo: "Re",
        position: 5.5,
        onLine: false,
        frequency: 293.66,
        octave: 4,
        clef: "bass",
      },
      {
        name: "E4", // Second ledger line above staff
        solfeo: "Mi",
        position: 6,
        onLine: true,
        frequency: 329.63,
        octave: 4,
        clef: "bass",
      },
      // {
      //   name: "F4", // Space above second ledger line
      //   solfeo: "Fa",
      //   position: 6.5,
      //   onLine: false,
      //   frequency: 349.23,
      //   octave: 4,
      //   clef: "bass",
      // },
      // {
      //   name: "G4", // Third ledger line above staff
      //   solfeo: "Sol",
      //   position: 7,
      //   onLine: true,
      //   frequency: 392.0,
      //   octave: 4,
      //   clef: "bass",
      // },
      // {
      //   name: "A4", // Fourth ledger line above staff
      //   solfeo: "La",
      //   position: 7.5,
      //   onLine: false,
      //   frequency: 440.0,
      //   octave: 4,
      //   clef: "bass",
      // },
      // {
      //   name: "B4", // Space above fourth ledger line
      //   solfeo: "Si",
      //   position: 8,
      //   onLine: true,
      //   frequency: 493.88,
      //   octave: 4,
      //   clef: "bass",
      // },
    ];

    return [...octave2, ...octave3, ...octave4];
  };

  const trebleNotes = createTrebleNotes();
  const bassNotes = createBassNotes();

  return {
    trebleNotes,
    bassNotes,

    // Getter methods
    getTrebleNotes: () => get().trebleNotes,
    getBassNotes: () => get().bassNotes,

    // Get all notes for a given clef
    getNotesByClef: (clef) =>
      clef === "treble" ? get().trebleNotes : get().bassNotes,

    // Get note by name and clef
    getNote: (name, clef) => {
      const notes = clef === "treble" ? get().trebleNotes : get().bassNotes;
      return notes.find((note) => note.name === name);
    },
  };
});
