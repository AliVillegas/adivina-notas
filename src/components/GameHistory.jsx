import React, { useState } from "react";
import useStore from "../store";
import { formatDate } from "../utils";

const GameHistory = () => {
  const { gameHistory } = useStore();
  const [expandedGame, setExpandedGame] = useState(null);

  if (gameHistory.length === 0) {
    return (
      <p className="text-gray-500 text-sm italic mt-4">
        No hay historial de partidas
      </p>
    );
  }

  // Calculate average response time for correct answers
  const getAverageResponseTime = (rounds) => {
    const correctRounds = rounds.filter((r) => r.correct && r.responseTimeMs);
    if (correctRounds.length === 0) return "N/A";

    const totalTime = correctRounds.reduce(
      (sum, r) => sum + r.responseTimeMs,
      0
    );
    // Return the average time in seconds
    return (
      (Math.round(totalTime / correctRounds.length) / 1000).toFixed(1) + "s"
    );
  };

  // Format milliseconds to seconds
  const formatTimeInSeconds = (ms) => {
    return (ms / 1000).toFixed(1) + "s";
  };

  return (
    <div className="mt-4 max-h-80 overflow-y-auto">
      <h3 className="text-md font-bold mb-2 text-indigo-700">
        Historial de partidas
      </h3>
      {gameHistory
        .filter((game) => game.completed)
        .map((game, index) => (
          <div
            key={index}
            className="mb-2 p-2 border border-gray-200 rounded-md bg-gray-50"
          >
            <div
              className="flex justify-between text-sm cursor-pointer"
              onClick={() =>
                setExpandedGame(expandedGame === index ? null : index)
              }
            >
              <span>{formatDate(game.date)}</span>
              <div className="flex items-center">
                <span className="font-medium mr-2">
                  Puntuación: {game.score}/{game.totalRounds}
                </span>
                <span className="text-xs">
                  {expandedGame === index ? "▲" : "▼"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap mt-1">
              {game.rounds.map((round, rIndex) => (
                <div
                  key={rIndex}
                  className={`w-6 h-6 mx-1 mb-1 rounded-full flex items-center justify-center text-xs ${
                    round.correct
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : "bg-red-100 text-red-800 border border-red-300"
                  }`}
                  title={`Ronda ${round.round}: ${round.shownNote} (${
                    round.noteInfo || ""
                  }) - ${round.correct ? "Correcto" : "Incorrecto"}${
                    round.responseTimeMs
                      ? ` - Tiempo: ${formatTimeInSeconds(
                          round.responseTimeMs
                        )}`
                      : ""
                  }`}
                >
                  {round.correct ? "✓" : "✗"}
                </div>
              ))}
            </div>

            {expandedGame === index && (
              <div className="mt-2 text-xs border-t pt-2 border-gray-200">
                <div className="flex justify-between text-gray-600 mb-1">
                  <span>Tiempo promedio de respuesta (correctas):</span>
                  <span className="font-medium">
                    {getAverageResponseTime(game.rounds)}
                  </span>
                </div>

                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-1 pr-2">Ronda</th>
                      <th className="py-1 pr-2">Nota</th>
                      <th className="py-1 pr-2">Respuesta</th>
                      <th className="py-1">Tiempo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {game.rounds.map((round, rIndex) => (
                      <tr
                        key={rIndex}
                        className={`${
                          round.correct ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        <td className="py-1 pr-2">{round.round}</td>
                        <td className="py-1 pr-2">
                          {round.shownNote}{" "}
                          {round.noteInfo ? `(${round.noteInfo})` : ""}
                        </td>
                        <td className="py-1 pr-2">{round.selectedNote}</td>
                        <td className="py-1">
                          {round.responseTimeMs
                            ? formatTimeInSeconds(round.responseTimeMs)
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default GameHistory;
