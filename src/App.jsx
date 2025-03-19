import React from "react";
import useStore from "./store";
import ConfiguracionJuego from "./components/ConfiguracionJuego";
import JuegoActivo from "./components/JuegoActivo";
import ResumenJuego from "./components/ResumenJuego";

const App = () => {
  const { juegoActivo, juegoCompleto } = useStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-xl p-4 border border-gray-200">
        <h1 className="text-2xl font-bold text-center mb-2 text-indigo-800">
          Quiz de Notación Musical
        </h1>

        {!juegoActivo && !juegoCompleto && <ConfiguracionJuego />}
        {juegoActivo && <JuegoActivo />}
        {juegoCompleto && <ResumenJuego />}

        <div className="mt-2 text-center text-xs text-gray-600">
          <p>
            Usa este quiz para aprender las notas en el pentagrama en notación
            de solfeo (Do-Re-Mi) y notación americana (A-B-C).
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
