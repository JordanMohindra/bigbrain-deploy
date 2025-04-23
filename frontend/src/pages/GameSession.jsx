"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useParams } from "react-router-dom"
import { gamesAPI } from "../services/api"
import { toast } from "react-toastify"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

// Import components
import LoadingIndicator from "../components/common/loading-indicator"
import SessionNotFound from "../components/session/session-not-found"
import SessionHeader from "../components/session/session-header"
import SessionInfo from "../components/session/session-info"
import CurrentQuestion from "../components/session/current-question"
import PlayersList from "../components/session/players-list"
import SessionSummary from "../components/session/session-summary"
import TopPlayers from "../components/session/top-players"
import AllPlayers from "../components/session/all-players"
import StatisticsCharts from "../components/session/statistics-charts"
import ResultsConfirmationModal from "../components/session/view-results-modal"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const GameSession = () => {
  const { sessionId } = useParams()

  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  // Update gameId state to check localStorage first
  const [gameId, setGameId] = useState(() => {
    const savedGameId = localStorage.getItem(`session_gameId_${sessionId}`)
    return savedGameId || null
  })

  // Add this line instead:
  const pollingRef = useRef(null)

  // Update the useState for results to check localStorage first
  const [results, setResults] = useState(() => {
    const savedResults = localStorage.getItem(`session_results_${sessionId}`)
    return savedResults ? JSON.parse(savedResults) : []
  })

  // Update the useState for correctPercentages to check localStorage first
  const [correctPercentages, setCorrectPercentages] = useState(() => {
    const savedPercentages = localStorage.getItem(`session_percentages_${sessionId}`)
    return savedPercentages ? JSON.parse(savedPercentages) : []
  })

  // Update the useState for averageTimes to check localStorage first
  const [averageTimes, setAverageTimes] = useState(() => {
    const savedTimes = localStorage.getItem(`session_times_${sessionId}`)
    return savedTimes ? JSON.parse(savedTimes) : []
  })

  // Results state
  const [resultsLoading, setResultsLoading] = useState(false)

  // Add state for the results confirmation modal
  const [showResultsModal, setShowResultsModal] = useState(false)

  // Modify the setResults function to also save to localStorage
  const updateResults = (newResults) => {
    setResults(newResults)
    localStorage.setItem(`session_results_${sessionId}`, JSON.stringify(newResults))
  }

  // Modify the fetchSessionResults function to use the new updateResults function
  const fetchSessionResults = async () => {
    try {
      setResultsLoading(true)
      const response = await gamesAPI.getSessionResults(sessionId)
      // Correctly access the results array from the response
      const resultsData = response.data.results || []
      updateResults(resultsData)

      // Calculate statistics if we have results and session data
      if (resultsData.length > 0 && session && session.questions?.length > 0) {
        calculateStats(resultsData, session.questions?.length)
      }
    } catch (error) {
      console.error("Failed to fetch session results", error)
      updateResults([])
    } finally {
      setResultsLoading(false)
    }
  }

  // Update the calculateStats function to save to localStorage
  const calculateStats = (results, _numQuestions) => {
    if (!Array.isArray(results) || results.length === 0) {
      setCorrectPercentages([])
      setAverageTimes([])
      localStorage.removeItem(`session_percentages_${sessionId}`)
      localStorage.removeItem(`session_times_${sessionId}`)
      return
    }

    // Calculate percentage of correct answers for each question
    const newCorrectPercentages = []
    const newAverageTimes = []

    for (let i = 0; i < (results[0]?.answers?.length || 0); i++) {
      let correctCount = 0
      let totalResponseTime = 0
      let responseCount = 0

      results.forEach((player) => {
        if (player.answers && player.answers[i]) {
          if (player.answers[i].correct) {
            correctCount++
          }

          if (player.answers[i].answeredAt && player.answers[i].questionStartedAt) {
            const startTime = new Date(player.answers[i].questionStartedAt).getTime()
            const answerTime = new Date(player.answers[i].answeredAt).getTime()
            const responseTime = (answerTime - startTime) / 1000 // in seconds

            totalResponseTime += responseTime
            responseCount++
          }
        }
      })

      const percentage = results.length > 0 ? (correctCount / results.length) * 100 : 0
      newCorrectPercentages.push(percentage)

      const avgTime = responseCount > 0 ? totalResponseTime / responseCount : 0
      newAverageTimes.push(avgTime)
    }

    setCorrectPercentages(newCorrectPercentages)
    setAverageTimes(newAverageTimes)

    // Save to localStorage
    localStorage.setItem(`session_percentages_${sessionId}`, JSON.stringify(newCorrectPercentages))
    localStorage.setItem(`session_times_${sessionId}`, JSON.stringify(newAverageTimes))
  }

  // Update fetchSessionStatus to save session data to localStorage
  const fetchSessionStatus = useCallback(async () => {
    try {
      const response = await gamesAPI.getSessionStatus(sessionId)
      setSession(response.data.results)

      // Save session data to localStorage
      localStorage.setItem(`session_data_${sessionId}`, JSON.stringify(response.data.results))

      // Find the game ID if we don't have it yet
      if (!gameId) {
        const gamesResponse = await gamesAPI.getAllGames()
        const game = gamesResponse.data.games.find((g) => g.active === Number.parseInt(sessionId))
        if (game) {
          setGameId(game.id)
          // Save game ID to localStorage
          localStorage.setItem(`session_gameId_${sessionId}`, game.id)
        }
      }

      // If session is not active, fetch results
      if (!response.data.results.active) {
        if (pollingRef.current) {
          clearInterval(pollingRef.current)
          pollingRef.current = null
        }
        fetchSessionResults()
      }
    } catch (error) {
      console.error("Failed to fetch session status", error)
      toast.error("Failed to fetch session status")
    }
  }, [sessionId, gameId])

  // Add a useEffect to load session data from localStorage on component mount
  useEffect(() => {
    // Try to load session data from localStorage
    const savedSession = localStorage.getItem(`session_data_${sessionId}`)
    if (savedSession) {
      setSession(JSON.parse(savedSession))
    }

    // Rest of the existing useEffect code...
    fetchSessionStatus()

    // Set up polling
    const interval = setInterval(fetchSessionStatus, 10000)
    pollingRef.current = interval

    setLoading(false)

    // Clean up
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
        pollingRef.current = null
      }
    }
  }, [fetchSessionStatus])

  // Modify the handleEndSession function to show the results modal after ending the session
  const handleEndSession = async () => {
    if (!gameId) {
      toast.error("Game ID not found")
      return
    }

    if (!window.confirm("Are you sure you want to end this session? This cannot be undone.")) {
      return
    }

    try {
      await gamesAPI.endGame(gameId)
      toast.success("Session ended successfully")

      // Show the results confirmation modal
      setShowResultsModal(true)

      // Fetch the updated session status and results
      fetchSessionStatus()
    } catch (error) {
      console.error("Failed to end session", error)
      toast.error("Failed to end session")
    }
  }

  const handleAdvanceQuestion = async () => {
    if (!gameId) {
      toast.error("Game ID not found")
      return
    }

    try {
      await gamesAPI.advanceGame(gameId)
      toast.success("Advanced to next question")
      fetchSessionStatus()
    } catch (error) {
      console.error("Failed to advance question", error)
      toast.error("Failed to advance question")
    }
  }

  const copySessionLink = () => {
    const url = `${window.location.origin}/play?session=${sessionId}`
    navigator.clipboard.writeText(url)
    toast.success("Session link copied to clipboard")
  }

  // Get top players for the leaderboard
  const getTopPlayers = () => {
    if (!Array.isArray(results) || results.length === 0) return []

    const sortedPlayers = [...results].sort((a, b) => {
      const scoreA = a.answers?.reduce((sum, answer) => sum + (answer.correct ? 1 : 0), 0) || 0
      const scoreB = b.answers?.reduce((sum, answer) => sum + (answer.correct ? 1 : 0), 0) || 0
      return scoreB - scoreA
    })

    // Take top 5 players
    return sortedPlayers.slice(0, 5)
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Question Statistics",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  if (loading) {
    return <LoadingIndicator />
  }

  if (!session) {
    return <SessionNotFound />
  }

  const isSessionActive = session.active === true
  const topPlayers = getTopPlayers()

  // Add the ResultsConfirmationModal component to the JSX at the end of the return statement
  return (
    <div>
      <SessionHeader
        isSessionActive={isSessionActive}
        copySessionLink={copySessionLink}
        handleEndSession={handleEndSession}
      />

      {isSessionActive ? (
        // Active Session View
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <SessionInfo sessionId={sessionId} session={session} />
            <CurrentQuestion
              session={session}
              handleAdvanceQuestion={handleAdvanceQuestion}
              handleEndSession={handleEndSession}
            />
          </div>

          <PlayersList players={session.players} />
        </>
      ) : (
        // Session Results View
        <div>
          <SessionSummary
            sessionId={sessionId}
            session={session}
            results={results}
            correctPercentages={correctPercentages}
          />

          {resultsLoading ? (
            <LoadingIndicator message="Loading results..." />
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <TopPlayers topPlayers={topPlayers} />
                <AllPlayers results={results} />
              </div>

              <StatisticsCharts
                session={session}
                correctPercentages={correctPercentages}
                averageTimes={averageTimes}
                chartOptions={chartOptions}
              />
            </>
          )}
        </div>
      )}

      {/* Results Confirmation Modal */}
      <ResultsConfirmationModal
        isOpen={showResultsModal}
        onClose={() => setShowResultsModal(false)}
        onViewResults={() => {
          // Stay on the current page to view results
          setShowResultsModal(false)
        }}
      />
    </div>
  )
}

export default GameSession
