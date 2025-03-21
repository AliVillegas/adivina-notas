import React, { useEffect } from "react";
import { useGameStore } from "../stores/gameStore";
import { useSettingsStore } from "../stores/settingsStore";
import { useNotesStore } from "../stores/notesStore";
import StaffNotation from "./StaffNotation";

const ActiveGame = () => {
  const {
    currentRound,
    totalRounds,
    score,
    currentNote,
    selectedAnswer,
    showResult,
    isCorrect,
    activeClef,
    generateNewNote,
    handleAnswerSelection,
    handleListenNote,
  } = useGameStore();

  const { selectedOctaves, selectedClef, soundEnabled, notationType } =
    useSettingsStore();

  const { getNotesByClef } = useNotesStore();

  // Debug output
  console.log(
    `ActiveGame: selectedClef=${selectedClef}, activeClef=${activeClef}, round=${currentRound}`
  );

  // Effect to generate note at start
  useEffect(() => {
    if (!currentNote) {
      console.log("No current note, generating a new one");
      generateNewNote();
    }
  }, [currentNote, generateNewNote]);

  // Helper function to get the button color based on note octave and state
  const getButtonColor = (note, isSelected) => {
    // If selected, return based on correctness
    if (isSelected) {
      return isCorrect
        ? "bg-green-500 text-white hover:bg-green-600"
        : "bg-red-500 text-white hover:bg-red-600";
    }

    // Otherwise, return based on octave and current active clef
    // In 'both' mode, we need to consider which clef is currently active
    if (note.clef === "treble") {
      if (note.octave === 4)
        return "bg-blue-100 hover:bg-blue-200 text-blue-800";
      if (note.octave === 5)
        return "bg-green-100 hover:bg-green-200 text-green-800";
      return "bg-purple-100 hover:bg-purple-200 text-purple-800";
    } else {
      if (note.octave === 2)
        return "bg-amber-100 hover:bg-amber-200 text-amber-800";
      if (note.octave === 3)
        return "bg-teal-100 hover:bg-teal-200 text-teal-800";
      return "bg-blue-100 hover:bg-blue-200 text-blue-800";
    }
  };

  // Helper function to display note name based on notation type preference
  const getNoteDisplay = (note) => {
    if (notationType === "solfeo") {
      return <div className="font-bold text-xs">{note.solfeo}</div>;
    } else if (notationType === "letter") {
      return <div className="font-bold text-xs">{note.name}</div>;
    } else {
      // 'both' - show both notations
      return (
        <>
          <div className="font-bold text-xs">{note.solfeo}</div>
          <div className="text-xs">{note.name}</div>
        </>
      );
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-2 p-2 bg-indigo-100 rounded-md">
        <span className="font-medium">
          Ronda: {currentRound + 1}/{totalRounds}
        </span>
        <span className="font-medium">Puntuación: {score}</span>
      </div>

      {/* Clef indicator */}
      <div className="mb-1 text-center text-sm font-medium text-indigo-700">
        {selectedClef === "both"
          ? `Alternando claves - Actual: ${
              activeClef === "treble"
                ? "Clave de Sol (mano derecha)"
                : "Clave de Fa (mano izquierda)"
            }`
          : selectedClef === "treble"
          ? "Clave de Sol (mano derecha)"
          : "Clave de Fa (mano izquierda)"}
      </div>

      {showResult && (
        <div
          className={`p-2 mb-2 rounded-md text-center transition-all duration-300 ${
            isCorrect
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {isCorrect
            ? "¡Correcto!"
            : `Incorrecto. La respuesta correcta era ${currentNote.solfeo} (${currentNote.name}).`}
        </div>
      )}

      <div className="mb-2">
        <h2 className="text-md font-medium mb-1 text-center text-indigo-700">
          Identifica esta nota:
        </h2>
        <StaffNotation />
      </div>

      {/* For 'both' mode, only show notes for current active clef */}
      {selectedClef === "both" ? (
        // In 'both' mode, only show notes for the current active clef
        <div className="bg-indigo-50 rounded-md p-2 mb-2">
          <div className="text-xs text-center text-indigo-700 mb-2">
            Mostrando notas para{" "}
            {activeClef === "treble" ? "Clave de Sol" : "Clave de Fa"}
          </div>

          {selectedOctaves
            .filter((octave) => {
              // Only show relevant octaves for current clef
              if (activeClef === "treble") return octave >= 4;
              else return octave <= 3;
            })
            .map((octave) => {
              const octaveNotes = getNotesByClef(activeClef).filter(
                (note) => note.octave === octave
              );

              if (octaveNotes.length === 0) return null;

              return (
                <div key={`octave-${octave}`} className="mb-2">
                  <div className="text-xs text-gray-500 mb-1">
                    Octava {octave}{" "}
                    {activeClef === "treble" ? `(${octave - 3})` : ""}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {octaveNotes.map((note) => (
                      <button
                        key={note.name}
                        onClick={() => handleAnswerSelection(note)}
                        className={`p-1 rounded-md text-center transition-all duration-300 shadow-sm ${getButtonColor(
                          note,
                          selectedAnswer === note
                        )}`}
                        disabled={showResult}
                      >
                        {getNoteDisplay(note)}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        // Single clef mode (treble or bass)
        selectedOctaves.map((octave) => {
          const octaveNotes = getNotesByClef(selectedClef).filter(
            (note) => note.octave === octave
          );

          if (octaveNotes.length === 0) return null;

          return (
            <div key={`octave-${octave}`} className="mb-2">
              <div className="text-xs text-gray-500 mb-1">
                Octava {octave}{" "}
                {selectedClef === "treble" ? `(${octave - 3})` : ""}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {octaveNotes.map((note) => (
                  <button
                    key={note.name}
                    onClick={() => handleAnswerSelection(note)}
                    className={`p-1 rounded-md text-center transition-all duration-300 shadow-sm ${getButtonColor(
                      note,
                      selectedAnswer === note
                    )}`}
                    disabled={showResult}
                  >
                    {getNoteDisplay(note)}
                  </button>
                ))}
              </div>
            </div>
          );
        })
      )}

      {soundEnabled && (
        <button
          onClick={handleListenNote}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 mb-2 shadow-md text-sm"
          disabled={!currentNote}
        >
          Escuchar nota
        </button>
      )}
    </div>
  );
};

export default ActiveGame;
