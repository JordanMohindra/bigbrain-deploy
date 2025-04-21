"use client"

import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./contexts/use-auth"

// Admin Components
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import EditGame from "./pages/EditGame"
import EditQuestion from "./pages/EditQuestion"
import GameSession from "./pages/GameSession"


// Player Components
import JoinGame from "./pages/JoinGame"
import PlayerLobby from "./pages/PlayerLobby"
import PlayGame from "./pages/PlayGame"
import PlayerResults from "./pages/PlayerResults"

// Layout Components
import AdminLayout from "./components/layouts/AdminLayout"
import PlayerLayout from "./components/layouts/PlayerLayout"
import { ThemeProvider } from "./components/common/theme-provider"

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  return (
    <ThemeProvider>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="game/:gameId" element={<EditGame />} />
          <Route path="game/:gameId/question/:questionId" element={<EditQuestion />} />
          <Route path="session/:sessionId" element={<GameSession />} />
        </Route>

        {/* Player Routes */}
        <Route path="/play" element={<PlayerLayout />}>
          <Route index element={<JoinGame />} />
          <Route path="session/:sessionId/player/:playerId/lobby" element={<PlayerLobby />} />
          <Route path="session/:sessionId/player/:playerId/game" element={<PlayGame />} />
          <Route path="session/:sessionId/player/:playerId/results" element={<PlayerResults />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
