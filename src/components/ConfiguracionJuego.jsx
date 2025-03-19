import React from "react";
import useStore from "../store";
import HistorialPartidas from "./HistorialPartidas";

const ConfiguracionJuego = () => {
  const {
    totalRondas,
    setTotalRondas,
    sonidoActivado,
    setSonidoActivado,
    iniciarJuego,
  } = useStore();

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
          value={totalRondas}
          onChange={(e) => setTotalRondas(parseInt(e.target.value) || 1)}
          className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div className="flex items-center mb-3">
        <input
          type="checkbox"
          id="sonidoActivado"
          checked={sonidoActivado}
          onChange={(e) => setSonidoActivado(e.target.checked)}
          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <label htmlFor="sonidoActivado" className="ml-2 text-gray-700">
          Activar sonido
        </label>
      </div>

      <button
        onClick={iniciarJuego}
        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300 transform hover:scale-105 shadow-md"
      >
        Iniciar Juego
      </button>

      <HistorialPartidas />
    </div>
  );
};

export default ConfiguracionJuego;
