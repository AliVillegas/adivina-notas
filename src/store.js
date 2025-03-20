import { create } from "zustand";

// Notes in treble clef (from bottom to top):
// The 5 lines of the staff in treble clef are: Mi, Sol, Si, Re, Fa (E, G, B, D, F)
// The 4 spaces of the staff in treble clef are: Fa, La, Do, Mi (F, A, C, E)
// Define notes for three octaves
const createNoteSet = () => {
  // Define all notes in proper order for each octave
  const octave4 = [
    {
      name: "C4", // Do - first note in octave 4
      solfeo: "Do",
      position: -2,
      onLine: true,
      lineNumber: 0, // Below the staff
      frequency: 261.63,
      octave: 4,
    },
    {
      name: "D4", // Re - below the staff
      solfeo: "Re",
      position: -1,
      onLine: false,
      spaceNumber: 0, // Space below first line
      frequency: 293.66,
      octave: 4,
    },
    {
      name: "E4", // Mi - first line of the staff
      solfeo: "Mi",
      position: 0,
      onLine: true,
      lineNumber: 1, // First line (from bottom to top)
      frequency: 329.63,
      octave: 4,
    },
    {
      name: "F4", // Fa - first space
      solfeo: "Fa",
      position: 1,
      onLine: false,
      spaceNumber: 1, // First space
      frequency: 349.23,
      octave: 4,
    },
    {
      name: "G4", // Sol - second line
      solfeo: "Sol",
      position: 2,
      onLine: true,
      lineNumber: 2, // Second line
      frequency: 392.0,
      octave: 4,
    },
    {
      name: "A4", // La - second space
      solfeo: "La",
      position: 3,
      onLine: false,
      spaceNumber: 2, // Second space
      frequency: 440.0,
      octave: 4,
    },
    {
      name: "B4", // Si - third line
      solfeo: "Si",
      position: 4,
      onLine: true,
      lineNumber: 3, // Third line
      frequency: 493.88,
      octave: 4,
    },
  ];

  // Second octave (5th octave in standard notation)
  const octave5 = [
    {
      name: "C5", // Do - third space
      solfeo: "Do",
      position: 5,
      onLine: false,
      spaceNumber: 3, // Third space
      frequency: 523.25,
      octave: 5,
    },
    {
      name: "D5", // Re - fourth line
      solfeo: "Re",
      position: 6,
      onLine: true,
      lineNumber: 4, // Fourth line
      frequency: 587.33,
      octave: 5,
    },
    {
      name: "E5", // Mi - fourth space
      solfeo: "Mi",
      position: 7,
      onLine: false,
      spaceNumber: 4, // Fourth space
      frequency: 659.26,
      octave: 5,
    },
    {
      name: "F5", // Fa - fifth line
      solfeo: "Fa",
      position: 8,
      onLine: true,
      lineNumber: 5, // Fifth line
      frequency: 698.46,
      octave: 5,
    },
    {
      name: "G5", // Sol - above fifth line
      solfeo: "Sol",
      position: 9,
      onLine: false,
      spaceNumber: 5, // Space above fifth line
      frequency: 783.99,
      octave: 5,
    },
    {
      name: "A5", // La
      solfeo: "La",
      position: 10,
      onLine: true,
      lineNumber: 6, // Ledger line above staff
      frequency: 880.0,
      octave: 5,
    },
    {
      name: "B5", // Si
      solfeo: "Si",
      position: 11,
      onLine: false,
      spaceNumber: 6, // Space above ledger line
      frequency: 987.77,
      octave: 5,
    },
  ];

  // Third octave (6th octave in standard notation)
  const octave6 = [
    {
      name: "C6", // Do
      solfeo: "Do",
      position: 12,
      onLine: true,
      lineNumber: 7, // Second ledger line above staff
      frequency: 1046.5,
      octave: 6,
    },
    {
      name: "D6", // Re
      solfeo: "Re",
      position: 13,
      onLine: false,
      spaceNumber: 7, // Space above second ledger line
      frequency: 1174.66,
      octave: 6,
    },
    {
      name: "E6", // Mi
      solfeo: "Mi",
      position: 14,
      onLine: true,
      lineNumber: 8, // Third ledger line above staff
      frequency: 1318.51,
      octave: 6,
    },
    {
      name: "F6", // Fa
      solfeo: "Fa",
      position: 15,
      onLine: false,
      spaceNumber: 8, // Space above third ledger line
      frequency: 1396.91,
      octave: 6,
    },
    {
      name: "G6", // Sol
      solfeo: "Sol",
      position: 16,
      onLine: true,
      lineNumber: 9, // Fourth ledger line above staff
      frequency: 1567.98,
      octave: 6,
    },
    {
      name: "A6", // La
      solfeo: "La",
      position: 17,
      onLine: false,
      spaceNumber: 9, // Space above fourth ledger line
      frequency: 1760.0,
      octave: 6,
    },
    {
      name: "B6", // Si
      solfeo: "Si",
      position: 18,
      onLine: true,
      lineNumber: 10, // Fifth ledger line above staff
      frequency: 1975.53,
      octave: 6,
    },
  ];

  return [...octave4, ...octave5, ...octave6];
};

const notes = createNoteSet();

// Load history from localStorage
const loadHistory = () => {
  if (typeof window === "undefined") return [];

  const savedHistory = localStorage.getItem("historialQuizMusical");
  if (savedHistory) {
    try {
      return JSON.parse(savedHistory);
    } catch (e) {
      console.error("Error loading history:", e);
      localStorage.removeItem("historialQuizMusical");
      return [];
    }
  }
  return [];
};

// Save history to localStorage
const saveHistory = (history) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("historialQuizMusical", JSON.stringify(history));
};

// Create store with Zustand
const useStore = create((set, get) => ({
  // Constants
  notes,

  // Game states
  totalRounds: 5,
  currentRound: 0,
  score: 0,
  gameActive: false,
  gameComplete: false,
  currentNote: null,
  selectedAnswer: null,
  showResult: false,
  isCorrect: false,
  playing: false,
  soundEnabled: true,
  gameHistory: loadHistory(),
  noteStartTime: null,
  selectedOctaves: [4, 5], // Default: include first two octaves

  // Actions
  setTotalRounds: (total) => set({ totalRounds: total }),
  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
  setSelectedOctaves: (octaves) => set({ selectedOctaves: octaves }),

  // Export game history as CSV
  exportHistory: () => {
    const { gameHistory } = get();
    if (gameHistory.length === 0) {
      return null;
    }

    // CSV header
    let csv =
      "Fecha,Puntuación,Total Rondas,% Acierto,Rondas,Notas Mostradas,Notas Seleccionadas,Resultados,Tiempos (ms)\n";

    // Add data for each game
    gameHistory.forEach((game) => {
      if (!game.completed) return;

      const date = new Date(game.date).toLocaleString();
      const score = game.score;
      const totalRounds = game.totalRounds;
      const accuracy = Math.round((score / totalRounds) * 100);

      // Collect all shown notes, selected notes, results, and times
      const roundNumbers = game.rounds.map((r) => r.round).join("|");
      const shownNotes = game.rounds.map((r) => r.shownNote).join("|");
      const selectedNotes = game.rounds.map((r) => r.selectedNote).join("|");
      const results = game.rounds
        .map((r) => (r.correct ? "Correcto" : "Incorrecto"))
        .join("|");
      const times = game.rounds.map((r) => r.responseTimeMs || "N/A").join("|");

      csv += `"${date}",${score},${totalRounds},${accuracy}%,"${roundNumbers}","${shownNotes}","${selectedNotes}","${results}","${times}"\n`;
    });

    return csv;
  },

  // Start game
  startGame: () => {
    const state = get();
    const newRounds = [];

    // Save previous game if completed
    if (state.gameComplete && state.score > 0) {
      const newHistory = [
        {
          date: new Date().toISOString(),
          totalRounds: state.totalRounds,
          score: state.score,
          rounds: newRounds,
          completed: true,
        },
        ...state.gameHistory,
      ].slice(0, 10); // Keep only the last 10 games

      saveHistory(newHistory);
      set({ gameHistory: newHistory });
    }

    set({
      currentRound: 0,
      score: 0,
      gameActive: true,
      gameComplete: false,
      showResult: false,
      currentNote: null,
      selectedAnswer: null,
    });

    // Generate first note
    get().generateNewNote();
  },

  // Generate random note
  generateNewNote: () => {
    const { notes, selectedOctaves } = get();

    // Filter notes based on selected octaves
    const availableNotes = notes.filter((note) => {
      const octave = parseInt(note.name.slice(-1));
      return selectedOctaves.includes(octave);
    });

    const notesToUse = availableNotes.length > 0 ? availableNotes : notes;
    const randomIndex = Math.floor(Math.random() * notesToUse.length);
    const newNote = notesToUse[randomIndex];

    console.log(
      `Generated new note: ${newNote.solfeo} (${newNote.name}) with frequency: ${newNote.frequency}Hz`
    );

    set({
      currentNote: newNote,
      selectedAnswer: null,
      showResult: false,
      noteStartTime: Date.now(), // Record the time when the note is shown
    });
  },

  // Handle answer selection
  handleAnswerSelection: (note) => {
    const state = get();

    if (state.showResult) return;

    const correct = note.solfeo === state.currentNote.solfeo;

    // Calculate response time
    const responseTimeMs = state.noteStartTime
      ? Date.now() - state.noteStartTime
      : null;

    // Save result of current round
    const newRound = {
      round: state.currentRound + 1,
      shownNote: state.currentNote.solfeo,
      selectedNote: note.solfeo,
      correct: correct,
      responseTimeMs: responseTimeMs,
      noteInfo: state.currentNote.name, // Store full note info including octave
    };

    // Update state
    set({
      selectedAnswer: note,
      showResult: true,
      isCorrect: correct,
      score: correct ? state.score + 1 : state.score,
    });

    // Update temporary history
    let updatedHistory = [...state.gameHistory];

    // If no game in progress or the last one is completed, create a new one
    if (!updatedHistory.length || updatedHistory[0].completed) {
      updatedHistory.unshift({
        date: new Date().toISOString(),
        totalRounds: state.totalRounds,
        score: correct ? 1 : 0,
        rounds: [newRound],
        completed: false,
      });
    } else {
      // Update game in progress
      updatedHistory[0].rounds.push(newRound);
      updatedHistory[0].score = correct
        ? updatedHistory[0].score + 1
        : updatedHistory[0].score;
    }

    set({ gameHistory: updatedHistory });

    // Move to next round after a brief delay
    setTimeout(() => {
      const state = get();
      const nextRound = state.currentRound + 1;

      if (nextRound >= state.totalRounds) {
        // Game complete
        set({ gameComplete: true, gameActive: false });

        // Mark current game as completed
        const updatedHistory = [...state.gameHistory];
        if (updatedHistory.length > 0) {
          updatedHistory[0].completed = true;
          saveHistory(updatedHistory);
          set({ gameHistory: updatedHistory });
        }
      } else {
        // Next round
        set({ currentRound: nextRound });
        get().generateNewNote();
      }
    }, 1500);
  },

  // Set playback state
  setPlaying: (state) => set({ playing: state }),
}));

export default useStore;
