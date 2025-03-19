import React, { useEffect } from "react";
import useStore from "../store";
import Pentagrama from "./Pentagrama";
import {
  reproducirNota,
  reproducirSonidoExito,
  reproducirSonidoError,
} from "../utils";

const JuegoActivo = () => {
  const {
    rondaActual,
    totalRondas,
    puntuacion,
    notaActual,
    respuestaSeleccionada,
    mostrarResultado,
    esCorrecto,
    notas,
    sonidoActivado,
    reproduciendo,
    setReproduciendo,
    manejarSeleccionRespuesta,
    generarNuevaNota,
  } = useStore();

  // Efecto para reproducir sonido de retroalimentación
  useEffect(() => {
    if (mostrarResultado && sonidoActivado) {
      if (esCorrecto) {
        // reproducirSonidoExito(sonidoActivado);
      } else {
        reproducirSonidoError(sonidoActivado);
      }
    }
  }, [mostrarResultado, esCorrecto, sonidoActivado]);

  // Efecto para reproducir nota cuando cambia
  useEffect(() => {
    if (notaActual && sonidoActivado) {
      // Pequeño retraso para estar seguros de que el componente está listo
      const timeoutId = setTimeout(() => {
        console.log(
          `Reproduciendo nota inicial: ${notaActual.solfeo} (${notaActual.nombre}) con frecuencia: ${notaActual.frecuencia}Hz`
        );
        reproducirNota(notaActual.frecuencia, sonidoActivado, setReproduciendo);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [notaActual, sonidoActivado, setReproduciendo]);

  // Efecto para generar nota al inicio
  useEffect(() => {
    if (!notaActual) {
      generarNuevaNota();
    }
  }, [notaActual, generarNuevaNota]);

  // Manejar clic en botón de escuchar nota
  const handleEscucharNota = () => {
    if (notaActual && !reproduciendo && sonidoActivado) {
      console.log(
        `Botón escuchar: ${notaActual.solfeo} (${notaActual.nombre}) con frecuencia: ${notaActual.frecuencia}Hz`
      );
      reproducirNota(notaActual.frecuencia, sonidoActivado, setReproduciendo);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-2 p-2 bg-indigo-100 rounded-md">
        <span className="font-medium">
          Ronda: {rondaActual + 1}/{totalRondas}
        </span>
        <span className="font-medium">Puntuación: {puntuacion}</span>
      </div>

      {mostrarResultado && (
        <div
          className={`p-2 mb-2 rounded-md text-center transition-all duration-300 ${
            esCorrecto
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {esCorrecto
            ? "¡Correcto!"
            : `Incorrecto. La respuesta correcta era ${notaActual.solfeo} (${notaActual.nombre}).`}
        </div>
      )}

      <div className="mb-2">
        <h2 className="text-md font-medium mb-1 text-center text-indigo-700">
          Identifica esta nota:
        </h2>
        <Pentagrama />
      </div>

      <div className="grid grid-cols-4 gap-1 mb-2">
        {notas.map((nota) => (
          <button
            key={nota.nombre}
            onClick={() => manejarSeleccionRespuesta(nota)}
            className={`p-1 rounded-md text-center transition-all duration-300 shadow-sm ${
              respuestaSeleccionada === nota
                ? esCorrecto
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-red-500 text-white hover:bg-red-600"
                : "bg-indigo-100 hover:bg-indigo-200 text-indigo-800"
            }`}
            disabled={mostrarResultado}
          >
            <div className="font-bold text-sm">{nota.solfeo}</div>
            <div className="text-xs">{nota.nombre}</div>
          </button>
        ))}
      </div>

      {sonidoActivado && (
        <button
          onClick={handleEscucharNota}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 mb-2 shadow-md text-sm"
          disabled={reproduciendo}
        >
          Escuchar nota
        </button>
      )}
    </div>
  );
};

export default JuegoActivo;
