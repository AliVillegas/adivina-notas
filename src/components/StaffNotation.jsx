import React from "react";
import { useGameStore } from "../stores/gameStore";
import { useSettingsStore } from "../stores/settingsStore";
import { useAudioStore } from "../stores/audioStore";

const StaffNotation = () => {
  const { currentNote, activeClef } = useGameStore();
  const { soundEnabled } = useSettingsStore();
  const { playing, playNote } = useAudioStore();

  if (!currentNote) {
    return (
      <div className="text-center py-10 text-gray-500">Cargando nota...</div>
    );
  }

  // Define constants for spacing
  const STAFF_HEIGHT = 120; // Total height in pixels
  const LINE_SPACING = 12; // Space between lines (px)

  // Position calculation
  // In our note definition:
  // position 0 = first line from bottom (E4 in treble, G2 in bass)
  // Each 0.5 increment is a step up (line to space or space to line)
  // We multiply by LINE_SPACING to get pixel position
  const calculateYPosition = (position) => {
    // Start from the bottom of the staff
    // Higher position = higher up the staff = smaller Y value
    const basePosition = STAFF_HEIGHT - 20; // Base position (bottom line)
    return basePosition - position * LINE_SPACING;
  };

  // Calculate vertical position for the note
  const noteYPosition = calculateYPosition(currentNote.position);

  // Handle note playback
  const handlePlayNote = () => {
    if (playing || !soundEnabled) return;
    console.log(
      `Button on staff - Playing: ${currentNote.solfeo} (${currentNote.name}) with frequency: ${currentNote.frequency}Hz`
    );
    playNote(currentNote.frequency);
  };

  // Determine if we need to show ledger lines
  const showLedgerLines = () => {
    const ledgerLines = [];

    // Lines above the staff (positions higher than 4)
    if (currentNote.position > 4 && currentNote.onLine) {
      // For each whole number position above 4
      for (let pos = 5; pos <= currentNote.position; pos += 1) {
        if (Number.isInteger(pos)) {
          ledgerLines.push({
            key: `ledger-above-${pos}`,
            position: calculateYPosition(pos),
          });
        }
      }
    }

    // Lines below the staff (positions less than 0)
    if (currentNote.position < 0 && currentNote.onLine) {
      // For each whole number position below 0
      for (let pos = -1; pos >= currentNote.position; pos -= 1) {
        if (Number.isInteger(pos)) {
          ledgerLines.push({
            key: `ledger-below-${pos}`,
            position: calculateYPosition(pos),
          });
        }
      }
    }

    return ledgerLines;
  };

  // Get ledger lines
  const ledgerLines = showLedgerLines();

  return (
    <div className="relative h-56 w-full max-w-md mx-auto mb-2">
      <div className="absolute inset-0">
        {/* Staff lines - 5 lines from bottom to top */}
        {[0, 1, 2, 3, 4].map((lineNum) => (
          <div
            key={`staff-line-${lineNum}`}
            className="absolute w-full h-0.5 bg-black"
            style={{
              top: `${calculateYPosition(lineNum)}px`,
            }}
          />
        ))}

        {/* Ledger lines */}
        {ledgerLines.map((line) => (
          <div
            key={line.key}
            className="absolute w-10 h-0.5 bg-black left-1/2 transform -translate-x-1/2"
            style={{
              top: `${line.position}px`,
            }}
          />
        ))}

        {/* Middle C indicator */}
        {(activeClef === "treble" && currentNote.position <= -1) ||
        (activeClef === "bass" && currentNote.position >= 5) ? (
          <div
            className="absolute right-4 w-8 h-0.5 bg-gray-300"
            style={{
              top: `${calculateYPosition(activeClef === "treble" ? -1 : 5)}px`,
              borderTopStyle: "dashed",
            }}
          />
        ) : null}

        {/* Clef symbol */}
        <div
          className="absolute left-2 text-6xl font-bold"
          style={{
            top: activeClef === "treble" ? "30px" : "18px",
            transform: "scale(3)",
          }}
        >
          {activeClef === "treble" ? "𝄞" : "𝄢"}
        </div>

        {/* Note head */}
        <div
          className="absolute w-6 h-4 bg-black rounded-full"
          style={{
            top: `${noteYPosition}px`,
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Note stem */}
        {currentNote.position < 2 ? (
          <div
            className="absolute w-1 bg-black"
            style={{
              top: `${noteYPosition - 2}px`,
              left: "53%",
              height: "28px",
            }}
          />
        ) : (
          <div
            className="absolute w-1 bg-black"
            style={{
              top: `${noteYPosition - 24}px`,
              left: "47%",
              height: "28px",
            }}
          />
        )}
      </div>
      {/* Button to listen to the note */}
      {soundEnabled && (
        <button
          className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-full shadow-md transition-colors duration-300"
          onClick={handlePlayNote}
          disabled={playing}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
          </svg>
        </button>
      )}
      {/* Debug info - only shown in development */}(
      {/* <div className="absolute bottom-0 left-0 text-xs bg-white/70 p-1 rounded text-gray-500">
        {currentNote.name} ({currentNote.solfeo}) - {activeClef} clef
      </div> */}
    </div>
  );
};

export default StaffNotation;
