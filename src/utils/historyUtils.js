// Utils for managing game history

// Load history from localStorage
export const loadHistory = () => {
  if (typeof window === "undefined") return [];

  const savedHistory = localStorage.getItem("historialQuizMusical");
  if (savedHistory) {
    try {
      return JSON.parse(savedHistory);
    } catch (e) {
      console.error("Error loading history:", e);
      localStorage.removeItem("historialQuizMusical");
      return [];
    }
  }
  return [];
};

// Save history to localStorage
export const saveHistory = (history) => {
  if (typeof window === "undefined") return;
  try {
    const validHistory = Array.isArray(history) ? history : [];
    localStorage.setItem("historialQuizMusical", JSON.stringify(validHistory));
  } catch (e) {
    console.error("Error saving history:", e);
  }
};

// Format date from ISO string
export const formatDate = (isoDate) => {
  if (!isoDate) return "";

  const date = new Date(isoDate);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

// Calculate accuracy percentage
export const calculateAccuracyPercentage = (score, totalRounds) => {
  if (totalRounds === 0) return 0;
  return Math.round((score / totalRounds) * 100);
};

// Format milliseconds to seconds
export const formatTimeInSeconds = (ms) => {
  return (ms / 1000).toFixed(1) + "s";
};

// Get message for the player based on their score
export const getScoreMessage = (score, totalRounds) => {
  if (score === totalRounds) {
    return "¡Puntuación perfecta! ¡Eres un maestro de la música!";
  } else if (score > totalRounds * 0.8) {
    return "¡Excelente trabajo! ¡Casi perfecto!";
  } else if (score > totalRounds / 2) {
    return "¡Buen trabajo! ¡Sigue practicando!";
  } else if (score > totalRounds * 0.3) {
    return "¡Vas por buen camino! Practica un poco más.";
  } else {
    return "No te desanimes, ¡sigue practicando y mejorarás!";
  }
};

// Get average response time for correct answers
export const getAverageResponseTime = (rounds) => {
  const correctRounds = rounds.filter((r) => r.correct && r.responseTimeMs);
  if (correctRounds.length === 0) return "N/A";

  const totalTime = correctRounds.reduce((sum, r) => sum + r.responseTimeMs, 0);
  // Return the average time in seconds
  return (Math.round(totalTime / correctRounds.length) / 1000).toFixed(1) + "s";
};
