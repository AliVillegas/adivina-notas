import React from "react";
import { useGameStore } from "../stores/gameStore";
import { useSettingsStore } from "../stores/settingsStore";
import { useNotesStore } from "../stores/notesStore";
import GameHistory from "./GameHistory";

const GameConfiguration = () => {
  const { totalRounds, setTotalRounds, startGame, exportHistory } =
    useGameStore();

  const {
    soundEnabled,
    setSoundEnabled,
    selectedOctaves,
    setSelectedOctaves,
    selectedClef,
    setSelectedClef,
    notationType,
    setNotationType,
    getAvailableOctaves,
  } = useSettingsStore();

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

    setSelectedOctaves(newSelectedOctaves.sort((a, b) => a - b));
  };

  // Handle clef selection
  const handleClefChange = (clef) => {
    console.log(`Changing clef to: ${clef}`);
    setSelectedClef(clef);
  };

  // Handle notation type selection
  const handleNotationTypeChange = (type) => {
    setNotationType(type);
  };

  // Get available octaves based on current clef
  const availableOctaves = getAvailableOctaves();

  // Octave names and descriptions
  const getOctaveName = (octave, index) => {
    if (selectedClef === "treble") {
      return `Octava ${index + 1} (Do${octave}-Si${octave})`;
    } else {
      return `Octava ${octave} (Do${octave}-Si${octave})`;
    }
  };

  const getOctaveDescription = (octave) => {
    if (selectedClef === "treble") {
      if (octave === 4) return "Notas bajas";
      if (octave === 5) return "Notas medias";
      if (octave === 6) return "Notas altas";
    } else {
      if (octave === 2) return "Notas bajas";
      if (octave === 3) return "Notas medias";
      if (octave === 4) return "Notas altas (incl. Do central)";
    }
    return "";
  };

  // Octave color classes
  const getOctaveColorClass = (octave) => {
    if (selectedClef === "treble") {
      if (octave === 4) return "bg-blue-50 border-blue-100";
      if (octave === 5) return "bg-green-50 border-green-100";
      if (octave === 6) return "bg-purple-50 border-purple-100";
    } else {
      if (octave === 2) return "bg-amber-50 border-amber-100";
      if (octave === 3) return "bg-teal-50 border-teal-100";
      if (octave === 4) return "bg-blue-50 border-blue-100";
    }
    return "bg-gray-50 border-gray-100";
  };

  // Get note names for an octave
  const getNoteNames = (octave) => {
    const solfeoNotes = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Si"];
    const letterNotes = ["C", "D", "E", "F", "G", "A", "B"];

    if (notationType === "solfeo") {
      return solfeoNotes.map((note) => `${note}${octave}`);
    } else if (notationType === "letter") {
      return letterNotes.map((note) => `${note}${octave}`);
    } else {
      // For 'both', alternate display
      return solfeoNotes.map((note, i) => `${note}/${letterNotes[i]}${octave}`);
    }
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
          Clave musical:
        </label>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <button
            className={`px-2 py-2 rounded-md border flex items-center justify-center font-medium
              ${
                selectedClef === "treble"
                  ? "bg-indigo-100 border-indigo-300 text-indigo-800"
                  : "bg-gray-50 border-gray-200 text-gray-500"
              }`}
            onClick={() => handleClefChange("treble")}
          >
            <span className="text-2xl mr-1">𝄞</span>
            <div className="flex flex-col">
              <span className="text-sm">Clave de Sol</span>
              <span className="text-xs text-gray-500">(mano derecha)</span>
            </div>
          </button>

          <button
            className={`px-2 py-2 rounded-md border flex items-center justify-center font-medium
              ${
                selectedClef === "bass"
                  ? "bg-indigo-100 border-indigo-300 text-indigo-800"
                  : "bg-gray-50 border-gray-200 text-gray-500"
              }`}
            onClick={() => handleClefChange("bass")}
          >
            <span className="text-2xl mr-1">𝄢</span>
            <div className="flex flex-col">
              <span className="text-sm">Clave de Fa</span>
              <span className="text-xs text-gray-500">(mano izquierda)</span>
            </div>
          </button>

          <button
            className={`px-2 py-2 rounded-md border flex items-center justify-center font-medium
              ${
                selectedClef === "both"
                  ? "bg-indigo-100 border-indigo-300 text-indigo-800"
                  : "bg-gray-50 border-gray-200 text-gray-500"
              }`}
            onClick={() => {
              console.log("Both clefs button clicked");
              handleClefChange("both");
            }}
          >
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <span className="text-xl">𝄞</span>
                <span className="text-xl">𝄢</span>
              </div>
              <span className="text-sm">Ambas claves</span>
              <span className="text-xs text-gray-500">(alternando)</span>
            </div>
          </button>
        </div>
      </div>

      <div className="mb-3">
        <label className="block mb-1 font-medium text-gray-700">
          Notación de notas:
        </label>
        <div className="flex items-center space-x-2 mb-3">
          <button
            className={`px-3 py-1 rounded-md border flex-1 text-center
              ${
                notationType === "solfeo"
                  ? "bg-indigo-100 border-indigo-300 text-indigo-800"
                  : "bg-gray-50 border-gray-200 text-gray-500"
              }`}
            onClick={() => handleNotationTypeChange("solfeo")}
          >
            Do-Re-Mi
          </button>

          <button
            className={`px-3 py-1 rounded-md border flex-1 text-center
              ${
                notationType === "letter"
                  ? "bg-indigo-100 border-indigo-300 text-indigo-800"
                  : "bg-gray-50 border-gray-200 text-gray-500"
              }`}
            onClick={() => handleNotationTypeChange("letter")}
          >
            C-D-E
          </button>

          <button
            className={`px-3 py-1 rounded-md border flex-1 text-center
              ${
                notationType === "both"
                  ? "bg-indigo-100 border-indigo-300 text-indigo-800"
                  : "bg-gray-50 border-gray-200 text-gray-500"
              }`}
            onClick={() => handleNotationTypeChange("both")}
          >
            Ambos
          </button>
        </div>
      </div>

      <div className="mb-3">
        <label className="block mb-1 font-medium text-gray-700">
          Octavas a practicar:
        </label>

        {availableOctaves.map((octave, index) => (
          <div className="mb-2" key={octave}>
            <div className="flex items-center mb-1">
              <div
                className={`px-3 py-1 rounded-md border cursor-pointer mr-2
                  ${
                    selectedOctaves.includes(octave)
                      ? "bg-indigo-100 border-indigo-300 text-indigo-800"
                      : "bg-gray-50 border-gray-200 text-gray-500"
                  }`}
                onClick={() => handleOctaveChange(octave)}
              >
                {getOctaveName(octave, index)}
              </div>
              <div className="text-xs text-gray-500">
                {getOctaveDescription(octave)}
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {getNoteNames(octave).map((note, i) => (
                <div
                  key={i}
                  className={`p-1 text-center text-xs ${getOctaveColorClass(
                    octave
                  )} rounded`}
                >
                  {note}
                </div>
              ))}
            </div>
          </div>
        ))}
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
