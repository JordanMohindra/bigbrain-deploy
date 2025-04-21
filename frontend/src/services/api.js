import axios from "axios"

const API_URL = "http://localhost:5005"

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Auth API
export const authAPI = {
  register: (email, password, name) => api.post("/admin/auth/register", { email, password, name }),

  login: (email, password) => api.post("/admin/auth/login", { email, password }),

  logout: () => api.post("/admin/auth/logout"),
}

// Games API
export const gamesAPI = {
  getAllGames: () => api.get("/admin/games"),

  createGame: async (newGame) => {
    const { data: { games } } = await api.get("/admin/games");
    const updatedGames = [...games, newGame];
    await api.put("/admin/games", { games: updatedGames });
    return { data: { gameId: newGame.id } };
  },

  getGame: async (gameId) => {
    const { data: { games } } = await api.get("/admin/games");
    const game = games.find(g => String(g.id) === gameId);
    return { data: game };
  },

  updateGame: async (gameId, partialData) => {
    const { data: { games } } = await api.get("/admin/games");
    const game = games.find(g => String(g.id) === gameId);
    console.log("game", game);
    Object.assign(game, partialData);
    await api.put("/admin/games", { games });
    return { data: game };
  },

  // Delete one game by filtering it out and bulk updating
  deleteGame: async (gameId) => {
    const { data: { games } } = await api.get("/admin/games");
    const updatedGames = games.filter(g => g.id !== gameId);
    return api.put("/admin/games", { games: updatedGames });
  },

  // Mutate endpoints exist for start/advance/end
  startGame:   (gameId) => api.post(`/admin/game/${gameId}/mutate`, { mutationType: "START"   }),
  advanceGame: (gameId) => api.post(`/admin/game/${gameId}/mutate`, { mutationType: "ADVANCE" }),
  endGame:     (gameId) => api.post(`/admin/game/${gameId}/mutate`, { mutationType: "END"     }),

  // Session-specific endpoints
  getSessionStatus:  (sessionId) => api.get(`/admin/session/${sessionId}/status`),
  getSessionResults: (sessionId) => api.get(`/admin/session/${sessionId}/results`),
};


// Player API
export const playerAPI = {
  joinSession: (sessionId, name) => api.post(`/play/join/${sessionId}`, { name }),

  getStatus: (playerId) => api.get(`/play/${playerId}/status`),

  getQuestion: (playerId) => api.get(`/play/${playerId}/question`),

  submitAnswer: (playerId, answers) => api.put(`/play/${playerId}/answer`, { answers }),

  getAnswer: (playerId) => api.get(`/play/${playerId}/answer`),

  getResults: (playerId) => api.get(`/play/${playerId}/results`),
}

export default api
