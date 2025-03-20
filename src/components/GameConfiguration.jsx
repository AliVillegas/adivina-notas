import React, { useState } from "react";
import useStore from "../store";
import GameHistory from "./GameHistory";

const GameConfiguration = () => {
  const {
    totalRounds,
    setTotalRounds,
    soundEnabled,
    setSoundEnabled,
    startGame,
    selectedOctaves,
    setSelectedOctaves,
    exportHistory,
  } = useStore();

  // Download history data
  const handleDownloadHistory = () => {
    const csvData = exportHistory();
    if (!csvData) {
      alert("No hay datos de historial para descargar");
      return;
    }

    // Create blob and download link
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `historial-quiz-musical-${new Date().toISOString().slice(0, 10)}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle octave selection
  const handleOctaveChange = (octave) => {
    const newSelectedOctaves = [...selectedOctaves];

    if (newSelectedOctaves.includes(octave)) {
      // If at least one octave remains selected, allow deselection
      if (newSelectedOctaves.length > 1) {
        const index = newSelectedOctaves.indexOf(octave);
        newSelectedOctaves.splice(index, 1);
      }
    } else {
      newSelectedOctaves.push(octave);
    }

    setSelectedOctaves(newSelectedOctaves.sort());
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl mb-2 text-indigo-700">Configuración del Juego</h2>
      <div className="flex flex-col mb-3">
        <label className="mb-1 font-medium text-gray-700">
          Número de Rondas:
        </label>
        <input
          type="number"
          min="1"
          max="20"
          value={totalRounds}
          onChange={(e) => setTotalRounds(parseInt(e.target.value) || 1)}
          className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1 font-medium text-gray-700">
          Octavas a practicar:
        </label>

        {/* Octave 4 (Do4-Si4) */}
        <div className="mb-2">
          <div className="flex items-center mb-1">
            <div
              className={`px-3 py-1 rounded-md border cursor-pointer mr-2
                ${
                  selectedOctaves.includes(4)
                    ? "bg-indigo-100 border-indigo-300 text-indigo-800"
                    : "bg-gray-50 border-gray-200 text-gray-500"
                }`}
              onClick={() => handleOctaveChange(4)}
            >
              Octava 1 (Do4-Si4)
            </div>
            <div className="text-xs text-gray-500">Notas bajas</div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            <div className="p-1 text-center text-xs bg-blue-50 border border-blue-100 rounded">
              Do4
            </div>
            <div className="p-1 text-center text-xs bg-blue-50 border border-blue-100 rounded">
              Re4
            </div>
            <div className="p-1 text-center text-xs bg-blue-50 border border-blue-100 rounded">
              Mi4
            </div>
            <div className="p-1 text-center text-xs bg-blue-50 border border-blue-100 rounded">
              Fa4
            </div>
            <div className="p-1 text-center text-xs bg-blue-50 border border-blue-100 rounded">
              Sol4
            </div>
            <div className="p-1 text-center text-xs bg-blue-50 border border-blue-100 rounded">
              La4
            </div>
            <div className="p-1 text-center text-xs bg-blue-50 border border-blue-100 rounded">
              Si4
            </div>
          </div>
        </div>

        {/* Octave 5 (Do5-Si5) */}
        <div className="mb-2">
          <div className="flex items-center mb-1">
            <div
              className={`px-3 py-1 rounded-md border cursor-pointer mr-2
                ${
                  selectedOctaves.includes(5)
                    ? "bg-indigo-100 border-indigo-300 text-indigo-800"
                    : "bg-gray-50 border-gray-200 text-gray-500"
                }`}
              onClick={() => handleOctaveChange(5)}
            >
              Octava 2 (Do5-Si5)
            </div>
            <div className="text-xs text-gray-500">Notas medias</div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            <div className="p-1 text-center text-xs bg-green-50 border border-green-100 rounded">
              Do5
            </div>
            <div className="p-1 text-center text-xs bg-green-50 border border-green-100 rounded">
              Re5
            </div>
            <div className="p-1 text-center text-xs bg-green-50 border border-green-100 rounded">
              Mi5
            </div>
            <div className="p-1 text-center text-xs bg-green-50 border border-green-100 rounded">
              Fa5
            </div>
            <div className="p-1 text-center text-xs bg-green-50 border border-green-100 rounded">
              Sol5
            </div>
            <div className="p-1 text-center text-xs bg-green-50 border border-green-100 rounded">
              La5
            </div>
            <div className="p-1 text-center text-xs bg-green-50 border border-green-100 rounded">
              Si5
            </div>
          </div>
        </div>

        {/* Octave 6 (Do6-Si6) */}
        <div className="mb-2">
          <div className="flex items-center mb-1">
            <div
              className={`px-3 py-1 rounded-md border cursor-pointer mr-2
                ${
                  selectedOctaves.includes(6)
                    ? "bg-indigo-100 border-indigo-300 text-indigo-800"
                    : "bg-gray-50 border-gray-200 text-gray-500"
                }`}
              onClick={() => handleOctaveChange(6)}
            >
              Octava 3 (Do6-Si6)
            </div>
            <div className="text-xs text-gray-500">Notas altas</div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            <div className="p-1 text-center text-xs bg-purple-50 border border-purple-100 rounded">
              Do6
            </div>
            <div className="p-1 text-center text-xs bg-purple-50 border border-purple-100 rounded">
              Re6
            </div>
            <div className="p-1 text-center text-xs bg-purple-50 border border-purple-100 rounded">
              Mi6
            </div>
            <div className="p-1 text-center text-xs bg-purple-50 border border-purple-100 rounded">
              Fa6
            </div>
            <div className="p-1 text-center text-xs bg-purple-50 border border-purple-100 rounded">
              Sol6
            </div>
            <div className="p-1 text-center text-xs bg-purple-50 border border-purple-100 rounded">
              La6
            </div>
            <div className="p-1 text-center text-xs bg-purple-50 border border-purple-100 rounded">
              Si6
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center mb-3">
        <input
          type="checkbox"
          id="soundEnabled"
          checked={soundEnabled}
          onChange={(e) => setSoundEnabled(e.target.checked)}
          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <label htmlFor="soundEnabled" className="ml-2 text-gray-700">
          Activar sonido
        </label>
      </div>

      <button
        onClick={startGame}
        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300 transform hover:scale-105 shadow-md mb-3"
      >
        Iniciar Juego
      </button>

      <button
        onClick={handleDownloadHistory}
        className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 transition-colors duration-300 shadow-md mb-4"
      >
        Descargar Historial (CSV)
      </button>

      <GameHistory />
    </div>
  );
};

export default GameConfiguration;
