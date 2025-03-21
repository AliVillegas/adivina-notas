import { create } from "zustand";
import { loadHistory, saveHistory } from "../utils/historyUtils";
import { useNotesStore } from "./notesStore";
import { useSettingsStore } from "./settingsStore";
import { useAudioStore } from "./audioStore";

// Create main game store with Zustand
export const useGameStore = create((set, get) => ({
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
  noteStartTime: null,
  activeClef: "treble", // Tracks which clef is active for the current round
  gameHistory: loadHistory() || [],

  // Start game
  startGame: () => {
    const { selectedClef, getActiveClef } = useSettingsStore.getState();
    const state = get();

    // Save previous game if completed
    if (state.gameComplete && state.score > 0) {
      // Safely get the history
      const currentHistory = Array.isArray(state.gameHistory)
        ? state.gameHistory
        : [];

      // Get the rounds from the current game if it exists
      const currentGameRounds =
        currentHistory.length > 0 && !currentHistory[0].completed
          ? Array.isArray(currentHistory[0].rounds)
            ? currentHistory[0].rounds
            : []
          : [];

      const newHistory = [
        {
          date: new Date().toISOString(),
          totalRounds: state.totalRounds,
          score: state.score,
          rounds: currentGameRounds,
          completed: true,
          clef: selectedClef,
        },
        ...currentHistory.filter(
          (_, index) => index > 0 || currentHistory[0].completed
        ),
      ].slice(0, 10); // Keep only the last 10 games

      saveHistory(newHistory);
      set({ gameHistory: newHistory });
    }

    // Determine initial active clef (for round 0)
    const initialActiveClef =
      selectedClef === "both" ? getActiveClef(0) : selectedClef;

    set({
      currentRound: 0,
      score: 0,
      gameActive: true,
      gameComplete: false,
      showResult: false,
      currentNote: null,
      selectedAnswer: null,
      activeClef: initialActiveClef,
    });

    console.log(
      `Starting game with clef: ${selectedClef}, active clef: ${initialActiveClef}`
    );

    // Generate first note
    get().generateNewNote();
  },

  // Set total rounds
  setTotalRounds: (total) => set({ totalRounds: Math.max(1, total || 5) }),

  // Generate new note
  generateNewNote: () => {
    const { selectedOctaves, selectedClef, getActiveClef } =
      useSettingsStore.getState();
    const { getTrebleNotes, getBassNotes } = useNotesStore.getState();
    const { currentRound } = get();

    // Determine which clef to use for this round
    // If 'both' is selected, alternate between treble and bass
    const clefForThisRound =
      selectedClef === "both" ? getActiveClef(currentRound) : selectedClef;

    // Get appropriate notes based on clef
    const notesForClef =
      clefForThisRound === "treble" ? getTrebleNotes() : getBassNotes();

    // Ensure selectedOctaves is valid
    const validOctaves =
      Array.isArray(selectedOctaves) && selectedOctaves.length > 0
        ? selectedOctaves
        : clefForThisRound === "treble"
        ? [4, 5]
        : [2, 3];

    // Filter notes based on selected octaves and current clef
    const availableNotes = notesForClef.filter((note) => {
      // For 'both' mode, filter notes by clef and octave
      if (selectedClef === "both") {
        // Only include octaves appropriate for the current clef round
        if (clefForThisRound === "treble" && note.octave < 4) return false;
        if (clefForThisRound === "bass" && note.octave > 3) return false;
      }
      return validOctaves.includes(note.octave);
    });

    const notesToUse =
      availableNotes.length > 0 ? availableNotes : notesForClef;
    const randomIndex = Math.floor(Math.random() * notesToUse.length);
    const newNote = notesToUse[randomIndex];

    console.log(
      `Generated new note: ${newNote.solfeo} (${newNote.name}) with frequency: ${newNote.frequency}Hz, clef: ${clefForThisRound}`
    );

    set({
      currentNote: newNote,
      selectedAnswer: null,
      showResult: false,
      noteStartTime: Date.now(), // Record the time when the note is shown
      activeClef: clefForThisRound, // Store which clef is active for this round
    });

    // Play the note if sound is enabled
    const { soundEnabled } = useSettingsStore.getState();
    const { playNote } = useAudioStore.getState();

    if (newNote && soundEnabled) {
      // Small delay to ensure component is ready
      setTimeout(() => {
        playNote(newNote.frequency);
      }, 500);
    }
  },

  // Handle answer selection
  handleAnswerSelection: (note) => {
    const state = get();
    const { soundEnabled } = useSettingsStore.getState();
    const { playErrorSound } = useAudioStore.getState();

    if (state.showResult || !state.currentNote) return;

    // Check both solfeo (note name) and octave for an exact match
    const correct =
      note.solfeo === state.currentNote.solfeo &&
      note.octave === state.currentNote.octave;

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
      clef: state.activeClef, // Use the active clef for this specific round
    };

    // Play feedback sound
    if (soundEnabled) {
      if (correct) {
        // playSuccessSound();
      } else {
        playErrorSound();
      }
    }

    // Update state
    set({
      selectedAnswer: note,
      showResult: true,
      isCorrect: correct,
      score: correct ? state.score + 1 : state.score,
    });

    // Safely get game history
    const currentHistory = Array.isArray(state.gameHistory)
      ? state.gameHistory
      : [];
    let updatedHistory = [...currentHistory];

    // If no game in progress or the last one is completed, create a new one
    if (!updatedHistory.length || updatedHistory[0].completed) {
      updatedHistory.unshift({
        date: new Date().toISOString(),
        totalRounds: state.totalRounds,
        score: correct ? 1 : 0,
        rounds: [newRound],
        completed: false,
        clef: useSettingsStore.getState().selectedClef,
      });
    } else {
      // Update game in progress
      // Check if rounds property exists and is an array before pushing
      if (!updatedHistory[0].rounds) {
        updatedHistory[0].rounds = [];
      }
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
        const currentHistory = Array.isArray(state.gameHistory)
          ? state.gameHistory
          : [];
        let updatedHistory = [...currentHistory];

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

  // Handle listen note button
  handleListenNote: () => {
    const { currentNote } = get();
    const { soundEnabled } = useSettingsStore.getState();
    const { playing, playNote } = useAudioStore.getState();

    if (currentNote && !playing && soundEnabled) {
      console.log(
        `Listen button: ${currentNote.solfeo} (${currentNote.name}) with frequency: ${currentNote.frequency}Hz`
      );
      playNote(currentNote.frequency);
    }
  },

  // Export game history as CSV
  exportHistory: () => {
    const { gameHistory } = get();
    if (!Array.isArray(gameHistory) || gameHistory.length === 0) {
      return null;
    }

    // CSV header
    let csv =
      "Fecha,Puntuación,Total Rondas,% Acierto,Clave,Rondas,Notas Mostradas,Notas Seleccionadas,Resultados,Tiempos (ms)\n";

    // Add data for each game
    gameHistory.forEach((game) => {
      if (!game || !game.completed) return;

      const date = new Date(game.date).toLocaleString();
      const score = game.score || 0;
      const totalRounds = game.totalRounds || 0;
      const accuracy =
        totalRounds > 0 ? Math.round((score / totalRounds) * 100) : 0;
      const clef = game.clef || "treble";

      // Safely access rounds
      const rounds = Array.isArray(game.rounds) ? game.rounds : [];

      // Collect all shown notes, selected notes, results, and times
      const roundNumbers = rounds.map((r) => r.round).join("|");
      const shownNotes = rounds.map((r) => r.shownNote).join("|");
      const selectedNotes = rounds.map((r) => r.selectedNote).join("|");
      const results = rounds
        .map((r) => (r.correct ? "Correcto" : "Incorrecto"))
        .join("|");
      const times = rounds.map((r) => r.responseTimeMs || "N/A").join("|");

      csv += `"${date}",${score},${totalRounds},${accuracy}%,"${clef}","${roundNumbers}","${shownNotes}","${selectedNotes}","${results}","${times}"\n`;
    });

    return csv;
  },

  resetGame: () => {
    set({
      gameActive: false,
      gameComplete: false,
      currentRound: 0,
      score: 0,
      currentNote: null,
      selectedAnswer: null,
      showResult: false,
      isCorrect: false,
      noteStartTime: null,
    });
  },
}));
