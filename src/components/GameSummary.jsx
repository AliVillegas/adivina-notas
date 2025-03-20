import React from "react";
import useStore from "../store";
import { calculateAccuracyPercentage, getScoreMessage } from "../utils";

const GameSummary = () => {
  const { score, totalRounds, gameHistory, startGame } = useStore();

  // Get the most recent game (should be the one we just completed)
  const currentGame = gameHistory.length > 0 ? gameHistory[0] : null;

  // Calculate average response time for correct answers
  const getAverageResponseTime = () => {
    if (!currentGame) return "N/A";

    const correctRounds = currentGame.rounds.filter(
      (r) => r.correct && r.responseTimeMs
    );
    if (correctRounds.length === 0) return "N/A";

    const totalTime = correctRounds.reduce(
      (sum, r) => sum + r.responseTimeMs,
      0
    );
    return Math.round(totalTime / correctRounds.length);
  };

  return (
    <div className="text-center">
      <h2 className="text-xl mb-2 text-indigo-700">¡Juego Terminado!</h2>
      <p className="text-lg mb-2">
        Tu puntuación final: {score}/{totalRounds}
      </p>
      <p className="mb-3 text-gray-700">
        {getScoreMessage(score, totalRounds)}
      </p>
      {/* Game summary */}
      <div className="mb-4 p-3 bg-indigo-50 rounded-md border border-indigo-100">
        <h3 className="text-md font-medium mb-2 text-indigo-700">
          Resumen de la partida
        </h3>
        <div className="flex justify-center space-x-1 mb-2">
          {currentGame &&
            currentGame.rounds.map((round, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  round.correct
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : "bg-red-100 text-red-800 border border-red-300"
                }`}
                title={`Nota mostrada: ${round.shownNote} ${
                  round.noteInfo ? `(${round.noteInfo})` : ""
                }, Nota seleccionada: ${round.selectedNote}, Tiempo: ${
                  round.responseTimeMs ? `${round.responseTimeMs}ms` : "N/A"
                }`}
              >
                {round.correct ? "✓" : "✗"}
              </div>
            ))}
        </div>
        <p className="text-sm text-gray-600">
          Porcentaje de acierto:{" "}
          {calculateAccuracyPercentage(score, totalRounds)}%
        </p>
        {currentGame && (
          <p className="text-sm text-gray-600 mt-1">
            Tiempo promedio de respuesta (correctas): {getAverageResponseTime()}
            ms
          </p>
        )}
      </div>

      {currentGame && currentGame.rounds.length > 0 && (
        <div className="mb-4 text-left text-sm">
          <h3 className="text-md font-medium mb-2 text-indigo-700 text-center">
            Detalle de respuestas
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-1 border border-gray-200">Ronda</th>
                  <th className="p-1 border border-gray-200">Nota</th>
                  <th className="p-1 border border-gray-200">Respuesta</th>
                  <th className="p-1 border border-gray-200">Resultado</th>
                  <th className="p-1 border border-gray-200">Tiempo</th>
                </tr>
              </thead>
              <tbody>
                {currentGame.rounds.map((round, index) => (
                  <tr
                    key={index}
                    className={round.correct ? "bg-green-50" : "bg-red-50"}
                  >
                    <td className="p-1 border border-gray-200 text-center">
                      {round.round}
                    </td>
                    <td className="p-1 border border-gray-200">
                      {round.shownNote}{" "}
                      {round.noteInfo ? `(${round.noteInfo})` : ""}
                    </td>
                    <td className="p-1 border border-gray-200">
                      {round.selectedNote}
                    </td>
                    <td className="p-1 border border-gray-200 text-center">
                      <span
                        className={
                          round.correct ? "text-green-600" : "text-red-600"
                        }
                      >
                        {round.correct ? "✓" : "✗"}
                      </span>
                    </td>
                    <td className="p-1 border border-gray-200 text-right">
                      {round.responseTimeMs
                        ? `${round.responseTimeMs}ms`
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <button
        onClick={startGame}
        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300 shadow-md"
      >
        Jugar de Nuevo
      </button>
    </div>
  );
};

export default GameSummary;
