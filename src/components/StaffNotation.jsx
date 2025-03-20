import React from "react";
import useStore from "../store";
import { playNote } from "../utils";

const StaffNotation = () => {
  const { currentNote, soundEnabled, playing, setPlaying } = useStore();

  // Add debug log to see if component is being rendered and receiving data
  console.log("StaffNotation rendering with currentNote:", currentNote);

  if (!currentNote) {
    console.log("No currentNote available, rendering null");
    return (
      <div className="text-center py-10 text-gray-500">Cargando nota...</div>
    );
  }

  // Define constants for the grid
  const GRID_ROWS = 11; // 5 lines + 6 spaces (including spaces above and below)
  const ROW_HEIGHT = 12; // Height of each row in pixels
  const TOTAL_HEIGHT = GRID_ROWS * ROW_HEIGHT;

  // Get position in the grid based on note name
  const getGridRow = () => {
    // Use the position property directly as it's now consistently defined
    return currentNote.position;
  };

  const gridRow = getGridRow();
  console.log(
    `Rendering note: ${currentNote.solfeo} (${currentNote.name}) in grid row: ${gridRow}`
  );

  // Convert grid row to position in pixels (from bottom)
  const positionFromBottom = gridRow * ROW_HEIGHT;

  // Convert to position from top (since CSS uses top from top)
  // Fine adjustment to center notes on lines
  let verticalPosition = TOTAL_HEIGHT - positionFromBottom - ROW_HEIGHT / 2;

  // If the note is on a line, center it exactly on the line
  if (currentNote.onLine) {
    // Adjustment to center notes on lines
    verticalPosition = TOTAL_HEIGHT - positionFromBottom - ROW_HEIGHT / 2 - 1;
  }

  // Handle note playback
  const handlePlayNote = () => {
    if (playing || !soundEnabled) return;
    console.log(
      `Button on staff - Playing: ${currentNote.solfeo} (${currentNote.name}) with frequency: ${currentNote.frequency}Hz`
    );
    playNote(currentNote.frequency, soundEnabled, setPlaying);
  };

  return (
    <div className="relative h-56 w-full max-w-md mx-auto mb-2">
      <div className="absolute inset-0" style={{ height: TOTAL_HEIGHT }}>
        {/* Staff lines */}
        {[0, 2, 4, 6, 8].map((lineIdx) => (
          <div
            key={`line-${lineIdx}`}
            className="absolute w-full h-0.5 bg-black"
            style={{
              top: `${TOTAL_HEIGHT - lineIdx * ROW_HEIGHT - ROW_HEIGHT / 2}px`,
            }}
          />
        ))}

        {/* Ledger lines above the staff - for higher notes */}
        {currentNote && currentNote.position > 8 && (
          <>
            {[10, 14].map(
              (lineIdx) =>
                currentNote.position >= lineIdx &&
                currentNote.onLine && (
                  <div
                    key={`ledger-above-${lineIdx}`}
                    className="absolute w-10 h-0.5 bg-black left-1/2 transform -translate-x-1/2"
                    style={{
                      top: `${
                        TOTAL_HEIGHT - lineIdx * ROW_HEIGHT - ROW_HEIGHT / 2
                      }px`,
                    }}
                  />
                )
            )}
          </>
        )}

        {/* Ledger lines below the staff - for lower notes */}
        {currentNote && currentNote.position < 0 && (
          <>
            {[-2, -6].map(
              (lineIdx) =>
                currentNote.position <= lineIdx &&
                currentNote.onLine && (
                  <div
                    key={`ledger-below-${lineIdx}`}
                    className="absolute w-10 h-0.5 bg-black left-1/2 transform -translate-x-1/2"
                    style={{
                      top: `${
                        TOTAL_HEIGHT - lineIdx * ROW_HEIGHT - ROW_HEIGHT / 2
                      }px`,
                    }}
                  />
                )
            )}
          </>
        )}

        {/* Treble clef */}
        <div
          className="absolute left-2 text-6xl font-bold"
          style={{ top: "30px", transform: "scale(3)" }}
        >
          𝄞
        </div>

        {/* Note */}
        <div
          className="absolute w-6 h-4 bg-black rounded-full"
          style={{
            top: `${verticalPosition}px`,
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Display octave number */}
        {/* <div
          className="absolute text-xs font-medium text-indigo-700"
          style={{
            top: `${verticalPosition - 15}px`,
            left: "calc(50% + 15px)",
          }}
        >
          {currentNote.name}
        </div> */}
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
    </div>
  );
};

export default StaffNotation;
