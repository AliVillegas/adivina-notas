import React, { useEffect } from "react";
import useStore from "../store";
import StaffNotation from "./StaffNotation"; // Correctly import the renamed component
import { playNote, playSuccessSound, playErrorSound } from "../utils";

const ActiveGame = () => {
  const {
    currentRound,
    totalRounds,
    score,
    currentNote,
    selectedAnswer,
    showResult,
    isCorrect,
    notes,
    soundEnabled,
    playing,
    setPlaying,
    handleAnswerSelection,
    generateNewNote,
    selectedOctaves,
  } = useStore();

  // Effect to play feedback sound
  useEffect(() => {
    if (showResult && soundEnabled) {
      if (isCorrect) {
        // playSuccessSound(soundEnabled);
      } else {
        playErrorSound(soundEnabled);
      }
    }
  }, [showResult, isCorrect, soundEnabled]);

  // Effect to play note when it changes
  useEffect(() => {
    if (currentNote && soundEnabled) {
      // Small delay to ensure component is ready
      const timeoutId = setTimeout(() => {
        console.log(
          `Playing initial note: ${currentNote.solfeo} (${currentNote.name}) with frequency: ${currentNote.frequency}Hz`
        );
        playNote(currentNote.frequency, soundEnabled, setPlaying);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [currentNote, soundEnabled, setPlaying]);

  // Effect to generate note at start
  useEffect(() => {
    if (!currentNote) {
      generateNewNote();
    }
  }, [currentNote, generateNewNote]);

  // Handle click on listen note button
  const handleListenNote = () => {
    if (currentNote && !playing && soundEnabled) {
      console.log(
        `Listen button: ${currentNote.solfeo} (${currentNote.name}) with frequency: ${currentNote.frequency}Hz`
      );
      playNote(currentNote.frequency, soundEnabled, setPlaying);
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
        {/* Debug information to check if currentNote exists */}
        {currentNote && (
          <div className="text-xs text-gray-500 text-center mt-1">
            Debug: Nota actual - {currentNote.solfeo} ({currentNote.name})
          </div>
        )}
      </div>

      {/* Group notes by octave */}
      {selectedOctaves.map((octave) => (
        <div key={`octave-${octave}`} className="mb-2">
          <div className="text-xs text-gray-500 mb-1">Octava {octave - 3}</div>
          <div className="grid grid-cols-7 gap-1">
            {notes
              .filter((note) => note.octave === octave)
              .map((note) => (
                <button
                  key={note.name}
                  onClick={() => handleAnswerSelection(note)}
                  className={`p-1 rounded-md text-center transition-all duration-300 shadow-sm ${
                    selectedAnswer === note
                      ? isCorrect
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-red-500 text-white hover:bg-red-600"
                      : note.octave === 4
                      ? "bg-blue-100 hover:bg-blue-200 text-blue-800"
                      : note.octave === 5
                      ? "bg-green-100 hover:bg-green-200 text-green-800"
                      : "bg-purple-100 hover:bg-purple-200 text-purple-800"
                  }`}
                  disabled={showResult}
                >
                  <div className="font-bold text-xs">{note.solfeo}</div>
                  <div className="text-xs">{note.name}</div>
                </button>
              ))}
          </div>
        </div>
      ))}

      {soundEnabled && (
        <button
          onClick={handleListenNote}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 mb-2 shadow-md text-sm"
          disabled={playing}
        >
          Escuchar nota
        </button>
      )}
    </div>
  );
};

export default ActiveGame;
