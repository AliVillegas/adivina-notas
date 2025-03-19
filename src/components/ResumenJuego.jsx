import React from "react";
import useStore from "../store";
import { calcularPorcentajeAcierto, obtenerMensajePuntuacion } from "../utils";

const ResumenJuego = () => {
  const { puntuacion, totalRondas, historialRondas, iniciarJuego } = useStore();

  // Obtener el juego más reciente (debería ser el que acabamos de completar)
  const juegoActual = historialRondas.length > 0 ? historialRondas[0] : null;

  return (
    <div className="text-center">
      <h2 className="text-xl mb-2 text-indigo-700">¡Juego Terminado!</h2>
      <p className="text-lg mb-2">
        Tu puntuación final: {puntuacion}/{totalRondas}
      </p>
      <p className="mb-3 text-gray-700">
        {obtenerMensajePuntuacion(puntuacion, totalRondas)}
      </p>

      {/* Resumen de la partida */}
      <div className="mb-4 p-3 bg-indigo-50 rounded-md border border-indigo-100">
        <h3 className="text-md font-medium mb-2 text-indigo-700">
          Resumen de la partida
        </h3>
        <div className="flex justify-center space-x-1 mb-2">
          {juegoActual &&
            juegoActual.rondas.map((ronda, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  ronda.correcto
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : "bg-red-100 text-red-800 border border-red-300"
                }`}
                title={`Nota mostrada: ${ronda.notaMostrada}, Nota seleccionada: ${ronda.notaSeleccionada}`}
              >
                {ronda.correcto ? "✓" : "✗"}
              </div>
            ))}
        </div>
        <p className="text-sm text-gray-600">
          Porcentaje de acierto:{" "}
          {calcularPorcentajeAcierto(puntuacion, totalRondas)}%
        </p>
      </div>

      <button
        onClick={iniciarJuego}
        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300 shadow-md"
      >
        Jugar de Nuevo
      </button>
    </div>
  );
};

export default ResumenJuego;
