// Utilidades para audio y otras funciones

// Reproducir sonido de una nota
export const reproducirNota = (
  frecuencia,
  sonidoActivado,
  setReproduciendo
) => {
  if (!sonidoActivado) return;

  try {
    console.log(
      `Función reproducirNota llamada con frecuencia: ${frecuencia}Hz`
    );

    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine"; // Tipo de onda sinusoidal
    oscillator.frequency.value = frecuencia; // Asignar frecuencia exacta

    // Configurar la envolvente ADSR (Attack-Decay-Sustain-Release)
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.1); // Attack
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1); // Release

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    setReproduciendo(true);

    setTimeout(() => {
      oscillator.stop();
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
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Usar un tono más agudo y agradable
    oscillator.type = "sine";
    oscillator.frequency.value = 800;

    // Envolvente suave para el sonido de éxito
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    setTimeout(() => oscillator.stop(), 500);
  } catch (error) {
    console.error("Error al reproducir sonido de éxito:", error);
  }
};

// Reproducir sonido de error
export const reproducirSonidoError = (sonidoActivado) => {
  if (!sonidoActivado) return;

  try {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Usar un tono más grave para el error
    oscillator.type = "sine";
    oscillator.frequency.value = 200;

    // Envolvente corta para el sonido de error
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    setTimeout(() => oscillator.stop(), 500);
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
