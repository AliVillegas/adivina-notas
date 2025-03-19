import { create } from "zustand";

// Notas en clave de sol (de abajo hacia arriba):
// Las 5 líneas del pentagrama en clave de sol son: Mi, Sol, Si, Re, Fa (E, G, B, D, F)
// Los 4 espacios del pentagrama en clave de sol son: Fa, La, Do, Mi (F, A, C, E)
const notas = [
  {
    nombre: "E4", // Mi - primera línea del pentagrama
    solfeo: "Mi",
    posicion: 0,
    enLinea: true,
    lineaNumero: 1, // Primera línea (de abajo hacia arriba)
    frecuencia: 329.63,
  },
  {
    nombre: "F4", // Fa - primer espacio
    solfeo: "Fa",
    posicion: 1,
    enLinea: false,
    espacioNumero: 1, // Primer espacio
    frecuencia: 349.23,
  },
  {
    nombre: "G4", // Sol - segunda línea
    solfeo: "Sol",
    posicion: 2,
    enLinea: true,
    lineaNumero: 2, // Segunda línea
    frecuencia: 392.0,
  },
  {
    nombre: "A4", // La - segundo espacio
    solfeo: "La",
    posicion: 3,
    enLinea: false,
    espacioNumero: 2, // Segundo espacio
    frecuencia: 440.0,
  },
  {
    nombre: "B4", // Si - tercera línea
    solfeo: "Si",
    posicion: 4,
    enLinea: true,
    lineaNumero: 3, // Tercera línea
    frecuencia: 493.88,
  },
  {
    nombre: "C5", // Do - tercer espacio
    solfeo: "Do",
    posicion: 5,
    enLinea: false,
    espacioNumero: 3, // Tercer espacio
    frecuencia: 523.25,
  },
  {
    nombre: "D5", // Re - cuarta línea
    solfeo: "Re",
    posicion: 6,
    enLinea: true,
    lineaNumero: 4, // Cuarta línea
    frecuencia: 587.33,
  },
];

// Cargar historial desde localStorage
const cargarHistorial = () => {
  if (typeof window === "undefined") return [];

  const historialGuardado = localStorage.getItem("historialQuizMusical");
  if (historialGuardado) {
    try {
      return JSON.parse(historialGuardado);
    } catch (e) {
      console.error("Error al cargar historial:", e);
      localStorage.removeItem("historialQuizMusical");
      return [];
    }
  }
  return [];
};

// Guardar historial en localStorage
const guardarHistorial = (historial) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("historialQuizMusical", JSON.stringify(historial));
};

// Crear store con Zustand
const useStore = create((set, get) => ({
  // Constantes
  notas,

  // Estados del juego
  totalRondas: 5,
  rondaActual: 0,
  puntuacion: 0,
  juegoActivo: false,
  juegoCompleto: false,
  notaActual: null,
  respuestaSeleccionada: null,
  mostrarResultado: false,
  esCorrecto: false,
  reproduciendo: false,
  sonidoActivado: true,
  historialRondas: cargarHistorial(),

  // Acciones
  setTotalRondas: (total) => set({ totalRondas: total }),
  setSonidoActivado: (activado) => set({ sonidoActivado: activado }),

  // Iniciar juego
  iniciarJuego: () => {
    const state = get();
    const nuevasRondas = [];

    // Guardar el juego anterior si está completo
    if (state.juegoCompleto && state.puntuacion > 0) {
      const nuevoHistorial = [
        {
          fecha: new Date().toISOString(),
          totalRondas: state.totalRondas,
          puntuacion: state.puntuacion,
          rondas: nuevasRondas,
          completado: true,
        },
        ...state.historialRondas,
      ].slice(0, 10); // Mantener solo los últimos 10 juegos

      guardarHistorial(nuevoHistorial);
      set({ historialRondas: nuevoHistorial });
    }

    set({
      rondaActual: 0,
      puntuacion: 0,
      juegoActivo: true,
      juegoCompleto: false,
      mostrarResultado: false,
      notaActual: null,
      respuestaSeleccionada: null,
    });

    // Generar primera nota
    get().generarNuevaNota();
  },

  // Generar nota aleatoria
  generarNuevaNota: () => {
    const { notas } = get();
    const indiceAleatorio = Math.floor(Math.random() * notas.length);
    const nuevaNota = notas[indiceAleatorio];
    console.log(
      `Generada nueva nota: ${nuevaNota.solfeo} (${nuevaNota.nombre}) con frecuencia: ${nuevaNota.frecuencia}Hz`
    );

    set({
      notaActual: nuevaNota,
      respuestaSeleccionada: null,
      mostrarResultado: false,
    });
  },

  // Manejar selección de respuesta
  manejarSeleccionRespuesta: (nota) => {
    const state = get();

    if (state.mostrarResultado) return;

    const correcto = nota.solfeo === state.notaActual.solfeo;

    // Guardar resultado de la ronda actual
    const nuevaRonda = {
      ronda: state.rondaActual + 1,
      notaMostrada: state.notaActual.solfeo,
      notaSeleccionada: nota.solfeo,
      correcto: correcto,
    };

    // Actualizar estado
    set({
      respuestaSeleccionada: nota,
      mostrarResultado: true,
      esCorrecto: correcto,
      puntuacion: correcto ? state.puntuacion + 1 : state.puntuacion,
    });

    // Actualizar historial temporal
    let historiaActualizado = [...state.historialRondas];

    // Si no existe un juego en curso o el último está completado, crear uno nuevo
    if (!historiaActualizado.length || historiaActualizado[0].completado) {
      historiaActualizado.unshift({
        fecha: new Date().toISOString(),
        totalRondas: state.totalRondas,
        puntuacion: correcto ? 1 : 0,
        rondas: [nuevaRonda],
        completado: false,
      });
    } else {
      // Actualizar el juego en curso
      historiaActualizado[0].rondas.push(nuevaRonda);
      historiaActualizado[0].puntuacion = correcto
        ? historiaActualizado[0].puntuacion + 1
        : historiaActualizado[0].puntuacion;
    }

    set({ historialRondas: historiaActualizado });

    // Pasar a la siguiente ronda después de un breve retraso
    setTimeout(() => {
      const state = get();
      const siguienteRonda = state.rondaActual + 1;

      if (siguienteRonda >= state.totalRondas) {
        // Juego completo
        set({ juegoCompleto: true, juegoActivo: false });

        // Marcar el juego actual como completado
        const historiaActualizado = [...state.historialRondas];
        if (historiaActualizado.length > 0) {
          historiaActualizado[0].completado = true;
          guardarHistorial(historiaActualizado);
          set({ historialRondas: historiaActualizado });
        }
      } else {
        // Siguiente ronda
        set({ rondaActual: siguienteRonda });
        get().generarNuevaNota();
      }
    }, 1500);
  },

  // Establecer estado de reproducción
  setReproduciendo: (estado) => set({ reproduciendo: estado }),
}));

export default useStore;
