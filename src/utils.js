// Utilidades para audio y otras funciones

// Singleton AudioContext para todo el juego
let globalAudioContext = null;

// Obtener AudioContext (o crearlo si no existe)
const getAudioContext = () => {
  if (!globalAudioContext) {
    globalAudioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
  }
  return globalAudioContext;
};

// Reproducir sonido de una nota con un tono puro
export const reproducirNota = (
  frecuencia,
  sonidoActivado,
  setReproduciendo
) => {
  if (!sonidoActivado) return;

  try {
    console.log(`Reproduciendo nota con frecuencia exacta: ${frecuencia}Hz`);

    const audioContext = getAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Configuración precisa del oscilador
    oscillator.type = "sine"; // Tono puro sinusoidal
    oscillator.frequency.setValueAtTime(frecuencia, audioContext.currentTime); // Frecuencia exacta

    // Configurar envolvente de volumen para evitar clics
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.1); // Ataque
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.3); // Sostenido
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1.0); // Liberación

    // Conectar componentes de audio
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Iniciar reproducción
    oscillator.start(audioContext.currentTime);
    setReproduciendo(true);

    // Detener después de un tiempo
    oscillator.stop(audioContext.currentTime + 1.0);

    // Limpiar estado después de reproducir
    setTimeout(() => {
      setReproduciendo(false);
    }, 1000);
  } catch (error) {
    console.error("Error al reproducir nota:", error);
    setReproduciendo(false);
  }
};

// Reproducir sonido de éxito
export const reproducirSonidoExito = (sonidoActivado) => {
  if (!sonidoActivado) return;

  try {
    const audioContext = getAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Usar un tono más agudo y agradable
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);

    // Envolvente suave para el sonido de éxito
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    console.error("Error al reproducir sonido de éxito:", error);
  }
};

// Reproducir sonido de error
export const reproducirSonidoError = (sonidoActivado) => {
  if (!sonidoActivado) return;

  try {
    const audioContext = getAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Usar un tono más grave para el error
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);

    // Envolvente corta para el sonido de error
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    console.error("Error al reproducir sonido de error:", error);
  }
};

// Formato de fecha legible
export const formatearFecha = (fechaISO) => {
  if (!fechaISO) return "";

  const fecha = new Date(fechaISO);
  return `${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

// Calcular porcentaje de acierto
export const calcularPorcentajeAcierto = (puntuacion, totalRondas) => {
  if (totalRondas === 0) return 0;
  return Math.round((puntuacion / totalRondas) * 100);
};

// Obtener mensaje para el jugador según su puntuación
export const obtenerMensajePuntuacion = (puntuacion, totalRondas) => {
  if (puntuacion === totalRondas) {
    return "¡Puntuación perfecta! ¡Eres un maestro de la música!";
  } else if (puntuacion > totalRondas / 2) {
    return "¡Buen trabajo! ¡Sigue practicando!";
  } else {
    return "Sigue practicando, ¡mejorarás!";
  }
};
