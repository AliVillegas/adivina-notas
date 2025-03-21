import React from "react";
import { useGameStore } from "../stores/gameStore";
import { useSettingsStore } from "../stores/settingsStore";
import {
  getScoreMessage,
  calculateAccuracyPercentage,
  getAverageResponseTime,
} from "../utils/historyUtils";

const GameSummary = () => {
  const { score, totalRounds, gameHistory, startGame } = useGameStore();
  const { selectedClef } = useSettingsStore();

  // Get the latest completed game from history
  const latestGame =
    gameHistory && gameHistory.length > 0 ? gameHistory[0] : null;
  const gameRounds =
    latestGame && Array.isArray(latestGame.rounds) ? latestGame.rounds : [];

  // Calculate percentage
  const percentage = calculateAccuracyPercentage(score, totalRounds);

  // Calculate average time
  const averageTime = getAverageResponseTime(gameRounds);

  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-bold mb-3 text-indigo-700">
        Resumen del Juego
      </h2>

      <div className="mb-4">
        <div className="mb-2 flex items-center justify-center">
          <div className="text-5xl font-bold text-indigo-500">{score}</div>
          <div className="mx-2 text-gray-400">/</div>
          <div className="text-2xl text-gray-600">{totalRounds}</div>
        </div>
        <div className="text-xl font-medium">{percentage}% de aciertos</div>
        <div className="mt-1 text-sm text-gray-600">
          Tiempo promedio: {averageTime}
        </div>
        <div className="mt-1 text-sm">
          Modo:{" "}
          {selectedClef === "both"
            ? "Ambas claves (alternando)"
            : selectedClef === "bass"
            ? "Clave de Fa (mano izquierda)"
            : "Clave de Sol (mano derecha)"}
        </div>
      </div>

      <div className="mb-4 p-3 bg-indigo-50 rounded-md">
        <p className="text-indigo-800">{getScoreMessage(score, totalRounds)}</p>
      </div>

      {gameRounds.length > 0 && (
        <div className="mb-4">
          <h3 className="font-medium mb-2 text-left">Rondas:</h3>
          <div className="grid grid-cols-1 gap-2">
            {gameRounds.map((round, index) => (
              <div
                key={index}
                className={`p-2 rounded-md text-left text-sm flex items-center
                  ${
                    round.correct
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center mr-2
                    ${
                      round.correct
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                >
                  {round.correct ? "✓" : "✗"}
                </div>
                <div className="flex-1">
                  <div className="font-medium">
                    Ronda {round.round}: {round.noteInfo || round.shownNote}
                  </div>
                  <div className="text-xs">
                    {round.correct
                      ? `Correcto! Tiempo: ${
                          round.responseTimeMs
                            ? (round.responseTimeMs / 1000).toFixed(1) + "s"
                            : "N/A"
                        }`
                      : `Incorrecto. Elegiste: ${round.selectedNote}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={startGame}
        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300 shadow-md"
      >
        Jugar Otra Vez
      </button>
    </div>
  );
};

export default GameSummary;
