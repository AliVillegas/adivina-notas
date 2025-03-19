import React from "react";
import useStore from "../store";
import { reproducirNota } from "../utils";

const Pentagrama = () => {
  const { notaActual, sonidoActivado, reproduciendo, setReproduciendo } =
    useStore();

  if (!notaActual) return null;

  // Definir constantes para el grid
  const GRID_ROWS = 11; // 5 líneas + 6 espacios (incluyendo espacios arriba y abajo)
  const ROW_HEIGHT = 12; // Altura de cada fila en píxeles
  const TOTAL_HEIGHT = GRID_ROWS * ROW_HEIGHT;

  // Obtener la posición en el grid basada en el nombre de la nota
  const obtenerFilaGrid = () => {
    // Si la nota es un espacio y tiene un número específico (espacioNumero), usarlo
    if (!notaActual.enLinea && notaActual.espacioNumero) {
      return notaActual.espacioNumero * 2 - 1; // 1->1, 2->3, 3->5, 4->7
    }

    // Si la nota es una línea y tiene un número específico (lineaNumero), usarlo
    if (notaActual.enLinea && notaActual.lineaNumero) {
      return notaActual.lineaNumero * 2 - 2; // 1->0, 2->2, 3->4, 4->6, 5->8
    }

    // Valor por defecto (tercera línea) si no se puede determinar
    return 4;
  };

  const filaGrid = obtenerFilaGrid();
  console.log(
    `Renderizando nota: ${notaActual.solfeo} (${notaActual.nombre}) en fila del grid: ${filaGrid}`
  );

  // Convertir fila del grid a posición en píxeles (desde abajo)
  const posicionDesdeAbajo = filaGrid * ROW_HEIGHT;

  // Convertir a posición desde arriba (ya que CSS usa top desde arriba)
  // Ajuste fino para centrar notas en líneas
  let posicionVertical = TOTAL_HEIGHT - posicionDesdeAbajo - ROW_HEIGHT / 2;

  // Si la nota está en una línea, centrarla exactamente sobre la línea
  if (notaActual.enLinea) {
    // Ajuste para que las notas en líneas queden centradas en la línea
    posicionVertical = TOTAL_HEIGHT - posicionDesdeAbajo - ROW_HEIGHT / 2 - 1;
  }

  // Manejar reproducción de nota
  const handleReproducirNota = () => {
    if (reproduciendo || !sonidoActivado) return;
    console.log(
      `Reproduciendo nota en botón: ${notaActual.solfeo} (${notaActual.nombre}) con frecuencia: ${notaActual.frecuencia}Hz`
    );
    reproducirNota(notaActual.frecuencia, sonidoActivado, setReproduciendo);
  };

  return (
    <div className="relative h-40 w-full max-w-md mx-auto mb-2">
      <div className="absolute inset-0" style={{ height: TOTAL_HEIGHT }}>
        {/* Líneas del pentagrama */}
        {[0, 2, 4, 6, 8].map((lineaIdx) => (
          <div
            key={`linea-${lineaIdx}`}
            className="absolute w-full h-0.5 bg-black"
            style={{
              top: `${TOTAL_HEIGHT - lineaIdx * ROW_HEIGHT - ROW_HEIGHT / 2}px`,
            }}
          />
        ))}

        {/* Clave de sol */}
        <div className="absolute left-2 text-3xl" style={{ top: "20px" }}>
          𝄞
        </div>

        {/* Nota - Ajustada para que se centre mejor en las líneas */}
        <div
          className="absolute w-6 h-4 bg-black rounded-full"
          style={{
            top: `${posicionVertical}px`,
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      {/* Botón para escuchar la nota */}
      {sonidoActivado && (
        <button
          className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-full shadow-md transition-colors duration-300"
          onClick={handleReproducirNota}
          disabled={reproduciendo}
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

export default Pentagrama;
