"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { playerAPI } from "../services/api"
import { toast } from "react-toastify"

const JoinGame = () => {
  const [sessionId, setSessionId] = useState("")
  const [playerName, setPlayerName] = useState("")
  const [joining, setJoining] = useState(false)

  const navigate = useNavigate()

  const handleJoinSession = async (e) => {
    e.preventDefault()

    if (!sessionId.trim() || !playerName.trim()) {
      toast.error("Please enter both session ID and your name")
      return
    }

    try {
      setJoining(true)
      const response = await playerAPI.joinSession(sessionId, playerName)
      const playerId = response.data.playerId

      toast.success("Successfully joined the game!")

      // Navigate to the lobby
      navigate(`/play/session/${sessionId}/player/${playerId}/lobby`)
    } catch (error) {
      console.error("Failed to join session", error)
      toast.error(error.response?.data?.error || "Failed to join session")
    } finally {
      setJoining(false)
    }
  }

  // Extract session ID from URL if present
  useState(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const sessionParam = urlParams.get("session")
    if (sessionParam) {
      setSessionId(sessionParam)
    }
  }, [])

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-secondary-700">Join a BigBrain Quiz</h1>
        <p className="text-gray-600 mt-2">Enter the session ID and your name to join</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleJoinSession}>
          <div className="mb-4">
            <label htmlFor="session-id" className="block text-sm font-medium text-gray-700 mb-1">
              Session ID
            </label>
            <input
              id="session-id"
              type="text"
              className="input"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder="Enter session ID"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="player-name" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              id="player-name"
              type="text"
              className="input"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <button
            type="submit"
            disabled={joining}
            className="btn bg-secondary-600 hover:bg-secondary-700 text-white w-full"
          >
            {joining ? "Joining..." : "Join Game"}
          </button>
        </form>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600">Need help? Ask the quiz host for the session ID.</p>
      </div>
    </div>
  )
}

export default JoinGame
