"use client"

import { useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { playerAPI } from "../services/api"
import { toast } from "react-toastify"

const PlayerLobby = () => {
  const { sessionId, playerId } = useParams()
  const navigate = useNavigate()


  // Use a ref instead of state for the interval to ensure we always have the current value
  const pollingIntervalRef = useRef(null)
  const isNavigatingRef = useRef(false)

  useEffect(() => {
    // Initial check
    checkGameStatus()

    // Set up polling to check if game has started
    pollingIntervalRef.current = setInterval(checkGameStatus, 2000)

    // Cleanup function
    return () => {
      stopPolling()
    }
  }, [sessionId, playerId])

  // Function to stop polling
  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      console.log("Stopping polling interval")
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
  }

  // Navigate to game with polling cleanup
  const navigateToGame = () => {
    // Prevent multiple navigations
    if (isNavigatingRef.current) return
    isNavigatingRef.current = true

    // Stop polling before navigation
    stopPolling()

    console.log("Navigating to game screen")
    navigate(`/play/session/${sessionId}/player/${playerId}/game`)
  }

  const checkGameStatus = async () => {
    // Don't check if we're already navigating
    if (isNavigatingRef.current) return

    try {
      const response = await playerAPI.getStatus(playerId)

      if (response.data.started) {
        navigateToGame()
      }
    } catch (error) {
      console.error("Failed to check game status", error)

      // If we get a 400 error, the session might be invalid or the game has ended
      if (error.response && error.response.status === 400) {
        console.log("Session invalid or game ended, stopping polling")
        stopPolling()
        toast.error("Session has ended or is no longer valid")

        // Navigate back to join page or show appropriate message
        console.log("Navigating to results page")
        navigate(`/play/session/${sessionId}/player/${playerId}/results`)
      } else {
        // For other errors, just show a toast but continue polling
        toast.error("Failed to check game status")
      }
    }
  }

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-secondary-700 mb-4">Waiting for Quiz to Start</h1>

        <div className="animate-pulse flex flex-col items-center justify-center py-8">
          <div className="w-24 h-24 bg-secondary-200 rounded-full mb-4 flex items-center justify-center">
            <div className="w-16 h-16 bg-secondary-400 rounded-full"></div>
          </div>
          <p className="text-gray-600">The host will start the quiz soon...</p>
        </div>

        <div className="mt-6">
          <p className="text-gray-700 font-medium">You’ve successfully joined the game!</p>
          <p className="text-gray-500 mt-2">Please wait for the host to start the quiz.</p>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h2 className="font-medium text-gray-700 mb-2">While you wait:</h2>
          <ul className="text-gray-600 text-left space-y-2">
            <li>• Make sure you have a stable internet connection</li>
            <li>• Keep this tab open and active</li>
            <li>• Get ready to answer questions quickly!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default PlayerLobby
