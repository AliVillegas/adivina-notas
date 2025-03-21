import React from "react";
import { useGameStore } from "./stores/gameStore";
import GameConfiguration from "./components/GameConfiguration";
import ActiveGame from "./components/ActiveGame";
import GameSummary from "./components/GameSummary";

const App = () => {
  const { gameActive, gameComplete } = useGameStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-[60vw]  bg-white rounded-lg shadow-xl p-4 border border-gray-200">
        <h1 className="text-2xl font-bold text-center mb-2 text-indigo-800">
          Quiz de Notación Musical
        </h1>
        {!gameActive && !gameComplete && <GameConfiguration />}
        {gameActive && <ActiveGame />}
        {gameComplete && <GameSummary />}
        <div className="mt-2 text-center text-xs text-gray-600">
          <p>
            Usa este quiz para aprender las notas en el pentagrama en notación
            de solfeo (Do-Re-Mi), notación americana (A-B-C) y practicar tanto
            en clave de sol (mano derecha) como en clave de fa (mano izquierda).
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
