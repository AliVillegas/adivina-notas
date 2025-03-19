import React from "react";
import useStore from "../store";
import { formatearFecha } from "../utils";

const HistorialPartidas = () => {
  const { historialRondas } = useStore();

  if (historialRondas.length === 0) {
    return (
      <p className="text-gray-500 text-sm italic mt-4">
        No hay historial de partidas
      </p>
    );
  }

  return (
    <div className="mt-4 max-h-60 overflow-y-auto">
      <h3 className="text-md font-bold mb-2 text-indigo-700">
        Historial de partidas
      </h3>
      {historialRondas
        .filter((partida) => partida.completado)
        .map((partida, index) => (
          <div
            key={index}
            className="mb-2 p-2 border border-gray-200 rounded-md bg-gray-50"
          >
            <div className="flex justify-between text-sm">
              <span>{formatearFecha(partida.fecha)}</span>
              <span className="font-medium">
                Puntuación: {partida.puntuacion}/{partida.totalRondas}
              </span>
            </div>
            <div className="flex mt-1">
              {partida.rondas.map((ronda, rIndex) => (
                <div
                  key={rIndex}
                  className={`w-6 h-6 mx-1 rounded-full flex items-center justify-center text-xs ${
                    ronda.correcto
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : "bg-red-100 text-red-800 border border-red-300"
                  }`}
                  title={`Ronda ${ronda.ronda}: ${ronda.notaMostrada} - ${
                    ronda.correcto ? "Correcto" : "Incorrecto"
                  }`}
                >
                  {ronda.correcto ? "✓" : "✗"}
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default HistorialPartidas;
